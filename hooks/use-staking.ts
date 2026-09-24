"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_STAKES, STORAGE_KEYS, type Stake } from "@/lib/mock-data";
import {
  calculatePotentialWinnings,
  type WinningsCalculation,
} from "@/lib/calculations";
import { useMockData } from "@/hooks/use-mock-data";
import { useWallet, type TransactionReceipt } from "@/hooks/use-wallet";
import {
  stakeOnPoll,
  hasUserStaked,
  getPoolInfo,
  SIMULATION_MODE,
  type StellarNetwork,
} from "@/lib/stellar";

// ── Transaction state types ────────────────────────────────────────────────

/** Lifecycle state of a single stake submission. */
export type StakeTxStatus =
  | "idle"
  | "checking"   // checking hasUserStaked on-chain
  | "simulating" // reading pool preview (off-chain calc or contract simulation)
  | "pending"    // tx submitted, awaiting confirmation
  | "confirmed"  // tx confirmed on-chain
  | "failed";    // tx failed or contract rejected

export interface StakeTxState {
  status: StakeTxStatus;
  txHash?: string;
  ledger?: number;
  fee?: string;
  error?: string;
}

// ── Store interface ────────────────────────────────────────────────────────

interface StakingState {
  stakes: Stake[];

  // Derived filtered views
  activeStakes: () => Stake[];
  pendingStakes: () => Stake[];
  completedStakes: () => Stake[];

  /**
   * Place a stake. In SIMULATION_MODE uses the wallet's mock sendTransaction.
   * Outside simulation calls lib/stellar.stakeOnPoll() (Soroban + Freighter).
   *
   * Throws on:
   *  - double-stake (has_user_staked returns true)
   *  - wallet not connected
   *  - contract rejection / network error
   */
  placeStake: (
    pollId: string,
    matchId: string,
    matchName: string,
    question: string,
    side: "yes" | "no",
    amount: number,
  ) => Promise<{ stake: Stake; receipt: TransactionReceipt }>;

  /**
   * Check whether the current wallet has already staked on a poll.
   * In SIMULATION_MODE always resolves false.
   */
  checkHasStaked: (pollId: string) => Promise<boolean>;

  /**
   * Refresh on-chain pool info for a poll and update the mock store.
   * No-op in SIMULATION_MODE.
   */
  refreshPoolInfo: (pollId: string) => Promise<void>;

  calculateWinnings: (
    amount: number,
    side: "yes" | "no",
    yesPool: number,
    noPool: number,
  ) => WinningsCalculation;
}

// ── Store ──────────────────────────────────────────────────────────────────

export const useStaking = create<StakingState>()(
  persist(
    (set, get) => ({
      stakes: MOCK_STAKES,

      activeStakes: () => get().stakes.filter((s) => s.status === "active"),
      pendingStakes: () =>
        get().stakes.filter((s) => s.status === "pending_resolution"),
      completedStakes: () =>
        get().stakes.filter((s) => s.status === "completed"),

      // ── placeStake ─────────────────────────────────────────────────────
      placeStake: async (pollId, matchId, matchName, question, side, amount) => {
        const walletState = useWallet.getState();

        if (!walletState.isConnected || !walletState.address) {
          throw new Error("Wallet not connected");
        }

        // 1. Double-stake guard — query contract (or skip in simulation)
        const alreadyStaked = await get().checkHasStaked(pollId);
        if (alreadyStaked) {
          throw new Error(
            "You have already staked on this poll. Only one stake per wallet is allowed."
          );
        }

        let receipt: TransactionReceipt;

        if (SIMULATION_MODE) {
          // Simulation: use wallet's mock sendTransaction
          receipt = await walletState.sendTransaction(
            amount,
            `Staked $${amount} on "${question}" – ${side.toUpperCase()}`,
          );
        } else {
          // Real on-chain path via Soroban contract
          const result = await stakeOnPoll({
            pollId,
            side,
            amountUSD: amount,
            walletAddress: walletState.address,
            network: walletState.network as StellarNetwork,
          });

          receipt = {
            hash: result.txHash,
            ledger: result.ledger,
            fee: result.fee,
            from: walletState.address,
            to: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
            amount,
            amountXLM: amount / 0.12,
            timestamp: new Date().toISOString(),
          };
        }

        // 2. Optimistically update pool in mock data store
        useMockData.getState().updatePollPool(pollId, side, amount);

        // 3. Post-confirmation: try to refresh on-chain pool info
        if (!SIMULATION_MODE) {
          await get().refreshPoolInfo(pollId);
        }

        const stake: Stake = {
          id: `stake-${receipt.hash.slice(0, 8)}`,
          pollId,
          matchId,
          matchName,
          question,
          side,
          amount,
          status: "active",
        };

        set((s) => ({ stakes: [...s.stakes, stake] }));
        return { stake, receipt };
      },

      // ── checkHasStaked ─────────────────────────────────────────────────
      checkHasStaked: async (pollId: string): Promise<boolean> => {
        if (SIMULATION_MODE) return false;

        const { address, network, isConnected } = useWallet.getState();
        if (!isConnected || !address) return false;

        try {
          return await hasUserStaked(pollId, address, network as StellarNetwork);
        } catch {
          // On error, allow the stake — the contract will reject it if needed
          return false;
        }
      },

      // ── refreshPoolInfo ────────────────────────────────────────────────
      refreshPoolInfo: async (pollId: string): Promise<void> => {
        if (SIMULATION_MODE) return;

        const { network } = useWallet.getState();

        try {
          const info = await getPoolInfo(pollId, network as StellarNetwork);
          if (!info) return;

          useMockData.getState().updatePollFromChain(pollId, {
            yesPool: info.yesPool,
            noPool: info.noPool,
            participants: info.participants,
            status: info.status as any,
            outcome: info.outcome ?? undefined,
          });
        } catch {
          // Non-fatal — local state remains as optimistic update
        }
      },

      calculateWinnings: (amount, side, yesPool, noPool) =>
        calculatePotentialWinnings(amount, side, yesPool, noPool),
    }),
    { name: STORAGE_KEYS.stakes },
  ),
);
