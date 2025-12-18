"use client"

import { useState } from "react"
import { Wallet, ChevronDown, LogOut, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WalletConnectModal } from "./wallet-connect-modal"
import { useWallet } from "@/hooks/use-wallet"

export function WalletButton() {
  const [showConnectModal, setShowConnectModal] = useState(false)
  const { isConnected, address, balance, disconnect } = useWallet()

  if (!isConnected) {
    return (
      <>
        <Button
          onClick={() => setShowConnectModal(true)}
          className="bg-primary text-background font-bold tracking-wider uppercase hover:bg-primary/90 glow-cyan transition-all hover:scale-105"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
        <WalletConnectModal open={showConnectModal} onClose={() => setShowConnectModal(false)} />
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-primary/50 bg-surface/50 backdrop-blur-sm hover:border-primary hover:bg-surface font-mono"
        >
          <Wallet className="mr-2 h-4 w-4 text-primary" />
          <div className="flex flex-col items-start mr-2">
            <span className="text-xs text-muted-foreground">Balance</span>
            <span className="text-sm font-bold text-primary">${balance.toLocaleString()}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-surface border-primary/30 backdrop-blur-xl">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
          <p className="font-mono text-sm text-foreground">{address}</p>
          <p className="text-lg font-bold text-primary mt-2">${balance.toLocaleString()} ETH</p>
        </div>
        <DropdownMenuItem className="hover:bg-surface-hover cursor-pointer">
          <History className="mr-2 h-4 w-4" />
          Transaction History
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          onClick={disconnect}
          className="text-accent hover:bg-surface-hover hover:text-accent cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
