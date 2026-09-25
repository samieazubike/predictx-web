export interface WinningsCalculation {
	grossWinnings: number;
	platformFee: number;
	netWinnings: number;
	profit: number;
	roi: number;
}

const FEE = 0.05;

export function calculatePotentialWinnings(
	stakeAmount: number,
	side: "yes" | "no",
	yesPool: number,
	noPool: number,
): WinningsCalculation {
	const winningSidePool = (side === "yes" ? yesPool : noPool) + stakeAmount;
	const totalPool = yesPool + noPool + stakeAmount;
	const gross = (stakeAmount / winningSidePool) * totalPool;
	const fee = gross * FEE;
	const net = gross - fee;
	const profit = net - stakeAmount;
	const roi = (profit / stakeAmount) * 100;
	return {
		grossWinnings: gross,
		platformFee: fee,
		netWinnings: net,
		profit,
		roi,
	};
}

export function calculatePoolPercentages(yesPool: number, noPool: number) {
	const total = yesPool + noPool;
	if (!total) return { yes: 50, no: 50 };
	// Clamp so the pair always sums to 100
	const yes = Math.round((yesPool / total) * 100);
	return { yes, no: 100 - yes };
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(amount);
}

export function formatCompactCurrency(amount: number): string {
	if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
	if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
	return formatCurrency(amount);
}

export function formatAddress(addr: string): string {
	return addr.length < 8 ? addr : `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export function formatXLM(amount: number): string {
	return `${new Intl.NumberFormat("en-US").format(Math.round(amount))} XLM`;
}

// ── Poll status helpers (Issue #65) ────────────────────────────────────────

/** Returns true for any poll status that has a final, immutable outcome. */
export function isPollTerminal(status: string): boolean {
	return status === "resolved" || status === "cancelled";
}

/** Returns true only for resolved polls with a recorded outcome. */
export function isPollResolved(status: string): boolean {
	return status === "resolved";
}

/** Returns true for cancelled polls (emergency refund path). */
export function isPollCancelled(status: string): boolean {
	return status === "cancelled";
}

/**
 * Returns the winning side of a resolved poll, or null when not yet resolved.
 * Accepts the poll's `outcome` field directly.
 */
export function getWinningSide(outcome?: string | null): "yes" | "no" | null {
	if (outcome === "yes" || outcome === "no") return outcome;
	return null;
}

/**
 * Returns a human-readable label for a poll status.
 * Used in status badges on poll cards.
 */
export function getPollStatusLabel(status: string, outcome?: string | null): string {
	switch (status) {
		case "active":   return "Active";
		case "locked":   return "Locked";
		case "voting":   return "Voting";
		case "admin-review":
		case "admin_review": return "Admin Review";
		case "multi-sig-review":
		case "multi_sig_review": return "Multi-Sig Review";
		case "dispute":  return "Disputed";
		case "resolved": {
			const winner = getWinningSide(outcome);
			if (winner) return `${winner.toUpperCase()} Won`;
			return "Resolved";
		}
		case "cancelled": return "Cancelled";
		default:         return status;
	}
}
