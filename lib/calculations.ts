export interface WinningsCalculation {
	grossWinnings: number;
	platformFee: number;
	netWinnings: number;
	profit: number;
	roi: number;
}

export const PLATFORM_FEE = 0.05;
const FEE = PLATFORM_FEE;

/**
 * Computes fee-adjusted payout, profit, and ROI for a completed winning stake.
 *
 * @param stakeAmount The original amount staked
 * @param grossPayout The gross payout before platform fee
 */
export function calculateCompletedPayout(
	stakeAmount: number,
	grossPayout: number,
): { gross: number; fee: number; net: number; profit: number; roi: number } {
	const fee = grossPayout * PLATFORM_FEE;
	const net = grossPayout - fee;
	const profit = Number((net - stakeAmount).toFixed(2));
	const roi = Number(((profit / stakeAmount) * 100).toFixed(2));
	return { gross: grossPayout, fee, net, profit, roi };
}

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
	return {
		yes: Math.round((yesPool / total) * 100),
		no: Math.round((noPool / total) * 100),
	};
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
