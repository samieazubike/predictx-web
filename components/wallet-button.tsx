"use client";

import { useState } from "react";
import {
  Wallet,
  ChevronDown,
  LogOut,
  Copy,
  Globe,
  ArrowRightLeft,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { WalletConnectModal } from "./wallet-connect-modal";
import { useWallet } from "@/hooks/use-wallet";
import type { StellarNetwork } from "@/lib/stellar";
import { shortenAddress } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

// ── Network display config ────────────────────────────────────────────────

const NETWORK_CONFIG: Record<StellarNetwork, { label: string; color: string }> = {
  testnet: { label: "Testnet", color: "text-yellow-400" },
  mainnet: { label: "Mainnet", color: "text-green-400" },
};

// ── Component ─────────────────────────────────────────────────────────────

export function WalletButton() {
  const [showConnectModal, setShowConnectModal] = useState(false);

  const {
    isConnected,
    address,
    balance,
    disconnect,
    network,
    switchNetwork,
    networkMismatch,
    refreshBalance,
  } = useWallet();

  const copy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    toast.success("Address copied!");
  };

  // ── Not connected ─────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <>
        <Button onClick={() => setShowConnectModal(true)}>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>

        <WalletConnectModal
          open={showConnectModal}
          onClose={() => setShowConnectModal(false)}
        />
      </>
    );
  }

  const currentNet = NETWORK_CONFIG[network];

  // ── Connected ─────────────────────────────────────────────────────────
  return (
    <>
      {/* Network mismatch warning banner (renders outside the dropdown) */}
      {networkMismatch && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/20 border border-amber-500/40 rounded text-amber-400 text-xs font-semibold animate-pulse">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          Wrong network — switch Freighter to {NETWORK_CONFIG[network].label}
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={networkMismatch ? "border-amber-500/40" : undefined}
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5">
                <span>{shortenAddress(address)}</span>
                <span
                  className={`text-[10px] font-semibold uppercase ${currentNet.color}`}
                >
                  {currentNet.label}
                </span>
                {networkMismatch && (
                  <AlertTriangle className="h-3 w-3 text-amber-400" />
                )}
              </div>

              <span className="text-xs text-primary">
                {balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} XLM
              </span>
            </div>

            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64">
          {/* Full address */}
          <div className="px-3 py-2 border-b border-border">
            <div className="text-xs text-muted-foreground mb-0.5">Connected as</div>
            <div className="font-mono text-xs text-foreground truncate">{address}</div>
          </div>

          <DropdownMenuItem onClick={copy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Address
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={async () => {
              await refreshBalance();
              toast.success("Balance refreshed");
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Balance
            <span className="ml-auto text-xs text-muted-foreground font-mono">
              {balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} XLM
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Network switcher */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              <span>Network</span>
              <span className={`ml-auto text-xs font-semibold ${currentNet.color}`}>
                {currentNet.label}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {(Object.keys(NETWORK_CONFIG) as StellarNetwork[]).map((net) => (
                <DropdownMenuItem
                  key={net}
                  onClick={() => switchNetwork(net)}
                  className={network === net ? "bg-accent" : ""}
                >
                  <Globe
                    className={`mr-2 h-4 w-4 ${NETWORK_CONFIG[net].color}`}
                  />
                  {NETWORK_CONFIG[net].label}
                  {network === net && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      ●
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {networkMismatch && (
            <div className="mx-2 mb-1 px-2 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-400 flex items-start gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-px" />
              Switch your Freighter extension to {NETWORK_CONFIG[network].label} to transact.
            </div>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/dashboard?tab=completed">Transaction History</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={disconnect}
            className="text-accent focus:text-accent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
