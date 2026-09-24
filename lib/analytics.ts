/**
 * User activation and lifecycle analytics tracking using @vercel/analytics
 * Tracks the core activation funnel: connect → first stake → first vote → claim
 */

import { track } from "@vercel/analytics";

export interface AnalyticsProperties {
  [key: string]: string | number | boolean | null | undefined;
}

export function trackEvent(name: string, properties?: AnalyticsProperties): void {
  try {
    if (typeof window !== "undefined") {
      track(name, properties as Record<string, string | number | boolean>);
    }
  } catch (error) {
    // Fail silently in development/mock environments to prevent user interruption
    console.debug(`[Analytics] Track failed for event "${name}":`, error);
  }
}

export const analytics = {
  /** Track wallet connection */
  trackWalletConnect(address: string, network: string): void {
    trackEvent("wallet_connected", {
      address,
      network,
      timestamp: new Date().toISOString(),
    });
  },

  /** Track wallet disconnection */
  trackWalletDisconnect(): void {
    trackEvent("wallet_disconnected", {
      timestamp: new Date().toISOString(),
    });
  },

  /** Track stake placement (Activation step 2) */
  trackStakePlaced(pollId: string, amountUSD: number, side: "yes" | "no", matchId?: string): void {
    trackEvent("stake_placed", {
      pollId,
      amountUSD,
      side,
      matchId: matchId ?? "",
      timestamp: new Date().toISOString(),
    });
  },

  /** Track community voting (Activation step 3) */
  trackVoteCast(pollId: string, decision: string, rewardUSD: number): void {
    trackEvent("vote_cast", {
      pollId,
      decision,
      rewardUSD,
      timestamp: new Date().toISOString(),
    });
  },

  /** Track claiming winnings/rewards (Activation step 4) */
  trackClaimWinnings(stakeId: string, amountUSD: number): void {
    trackEvent("claim_winnings", {
      stakeId,
      amountUSD,
      timestamp: new Date().toISOString(),
    });
  },
};
