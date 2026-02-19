"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"

interface WalletConnectModalProps {
  open: boolean
  onClose: () => void
}

const wallets = [
  { name: "Freighter", icon: "🚀", popular: true },
  { name: "Albedo", icon: "⭐", popular: true },
  { name: "xBull", icon: "🐂", popular: false },
  { name: "Rabet", icon: "🪐", popular: false },
]

export function WalletConnectModal({ open, onClose }: WalletConnectModalProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  const { connect } = useWallet()

  const handleConnect = async (walletName: string) => {
    setSelectedWallet(walletName)
    setIsConnecting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

   
    connect({
      address: "GDKXB...KL9F3H",
      balance: 20833.42,
    })

    setIsConnecting(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-2 border-primary/30 max-w-md clip-corner-lg">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="
            text-2xl
            font-display
            text-primary
            text-glow-cyan
            uppercase
            tracking-wider
          ">
            Connect Stellar Wallet
          </DialogTitle>
        </DialogHeader>

        {/* WALLET LIST */}
        <div className="space-y-3 mt-4">

          {wallets.map((wallet) => (

            <Button
              key={wallet.name}
              onClick={() => handleConnect(wallet.name)}
              disabled={isConnecting}
              variant="outline"
              className="
                w-full
                h-16
                justify-start
                text-left
                border-2
                border-border
                hover:border-primary
                bg-background-secondary
                hover:bg-surface
                transition-all
                group
                clip-corner
                relative
                overflow-hidden
              "
            >

              {/* Scan line animation */}
              <div className="
                absolute
                inset-0
                bg-linear-to-r
                from-transparent
                via-primary/10
                to-transparent
               -translate-x-full
                group-hover:translate-x-full
                transition-transform
                duration-1000
              " />

              {/* Icon */}
              <span className="text-3xl mr-4">

                {wallet.icon}

              </span>

              {/* Wallet Info */}
              <div className="flex-1">

                <div className="flex items-center gap-2">

                  <span className="font-bold text-lg">

                    {wallet.name}

                  </span>

                  {wallet.popular && (

                    <span className="
                      text-xs
                      bg-gold/20
                      text-gold
                      px-2
                      py-0.5
                      rounded
                    ">
                      POPULAR
                    </span>

                  )}

                </div>

                {isConnecting && selectedWallet === wallet.name && (

                  <span className="text-xs text-muted-foreground">

                    Connecting...

                  </span>

                )}

              </div>

            </Button>

          ))}

        </div>

        
        <p className="text-xs text-muted-foreground text-center mt-6">

          Connect your Stellar wallet to access PredictX

        </p>

      </DialogContent>
    </Dialog>
  )
}
