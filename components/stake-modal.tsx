"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, TrendingUp, AlertCircle } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { toast } from "sonner"

interface StakeModalProps {
  poll: any
  open: boolean
  onClose: () => void
}

export function StakeModal({ poll, open, onClose }: StakeModalProps) {
  const [side, setSide] = useState<"yes" | "no">("yes")
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { balance, isConnected, updateBalance } = useWallet()

  const stakeAmount = Number.parseFloat(amount) || 0
  const total = poll.yesPool + poll.noPool
  const selectedPool = side === "yes" ? poll.yesPool : poll.noPool
  const oppositePool = side === "yes" ? poll.noPool : poll.yesPool

  // Calculate potential winnings
  const newSelectedPool = selectedPool + stakeAmount
  const newTotal = total + stakeAmount
  const platformFee = newTotal * 0.05
  const winningsPool = newTotal - platformFee
  const yourShare = stakeAmount / newSelectedPool
  const potentialWinnings = winningsPool * yourShare
  const profit = potentialWinnings - stakeAmount
  const roi = stakeAmount > 0 ? (profit / stakeAmount) * 100 : 0

  useEffect(() => {
    if (!open) {
      setAmount("")
      setSide("yes")
    }
  }, [open])

  const handleStake = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (stakeAmount <= 0) {
      toast.error("Please enter a valid stake amount")
      return
    }

    if (stakeAmount > balance) {
      toast.error("Insufficient balance")
      return
    }

    setIsSubmitting(true)

    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    updateBalance(-stakeAmount)
    setIsSubmitting(false)
    onClose()

    toast.success(`Successfully staked $${stakeAmount} on ${side.toUpperCase()}!`, {
      description: `Potential winnings: $${potentialWinnings.toFixed(2)}`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-2 border-primary/30 max-w-2xl clip-corner-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-black uppercase text-primary text-glow-cyan">
            Place Your Stake
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">{poll.question}</p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Side Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Choose Side</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={() => setSide("yes")}
                variant={side === "yes" ? "default" : "outline"}
                className={`h-16 text-lg font-bold uppercase ${side === "yes" ? "bg-success hover:bg-success/90 text-background glow-green" : "border-2 border-success/50 text-success hover:bg-success/10"}`}
              >
                YES
              </Button>
              <Button
                type="button"
                onClick={() => setSide("no")}
                variant={side === "no" ? "default" : "outline"}
                className={`h-16 text-lg font-bold uppercase ${side === "no" ? "bg-accent hover:bg-accent/90 text-background glow-magenta" : "border-2 border-accent/50 text-accent hover:bg-accent/10"}`}
              >
                NO
              </Button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Stake Amount</label>
              <span className="text-xs text-muted-foreground font-mono">Balance: ${balance.toLocaleString()}</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-8 h-14 text-lg font-mono bg-background border-2 border-border focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              {[50, 100, 500].map((value) => (
                <Button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value.toString())}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-border hover:border-primary hover:bg-surface"
                >
                  ${value}
                </Button>
              ))}
              <Button
                type="button"
                onClick={() => setAmount(balance.toString())}
                variant="outline"
                size="sm"
                className="flex-1 border-border hover:border-primary hover:bg-surface"
              >
                Max
              </Button>
            </div>
          </div>

          {/* Potential Winnings Calculator */}
          {stakeAmount > 0 && (
            <div className="p-4 bg-background rounded clip-corner border border-primary/30 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-gold" />
                <span className="font-bold uppercase tracking-wider text-gold">Potential Outcome</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Stake:</span>
                  <span className="font-mono font-bold">${stakeAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Pool Ratio:</span>
                  <span className="font-mono">
                    {side === "yes"
                      ? `${((poll.yesPool / total) * 100).toFixed(0)}%`
                      : `${((poll.noPool / total) * 100).toFixed(0)}%`}{" "}
                    {side.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee (5%):</span>
                  <span className="font-mono text-accent">-${platformFee.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between text-base">
                  <span className="font-bold">If You Win:</span>
                  <span className="font-mono font-bold text-gold">${potentialWinnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Net Profit:</span>
                  <span className={`font-mono font-bold ${profit > 0 ? "text-success" : "text-accent"}`}>
                    {profit > 0 ? "+" : ""}${profit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ROI:</span>
                  <span className={`font-mono font-bold ${roi > 0 ? "text-success" : "text-accent"}`}>
                    {roi > 0 ? "+" : ""}
                    {roi.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="flex gap-2 p-3 bg-accent/10 border border-accent/30 rounded">
            <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Stakes cannot be withdrawn once placed. Poll locks at specified time. Winners split the pool
              proportionally after 5% platform fee.
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleStake}
            disabled={!isConnected || stakeAmount <= 0 || stakeAmount > balance || isSubmitting}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-background font-bold uppercase tracking-wider glow-cyan text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Transaction...
              </>
            ) : (
              `Confirm Stake - $${stakeAmount.toFixed(2)}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
