"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Trophy,
  LayoutDashboard,
  Vote,
  Wallet as WalletIcon,
} from "lucide-react"
import { useState } from "react"
import { WalletConnectModal } from "../wallet-connect-modal"

export function MobileBottomNav() {
  const pathname = usePathname()
  const [showWalletModal, setShowWalletModal] = useState(false)

  const items = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Trophy, label: "Matches", href: "/#" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Vote, label: "Voting", href: "/voting" },
  ]

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full md:hidden z-50 bg-background/95 backdrop-blur-md border-t border-primary/30 flex justify-around items-center py-2">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href 

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 group"
            >
              <Icon
                className={`h-6 w-6 transition-all duration-300 ${
                  active
                    ? "text-primary glow-cyan scale-110"
                    : "text-muted-foreground group-hover:text-primary scale-100"
                }`}
              />
              <span
                className={`text-xs mt-1 transition-all duration-300 ${
                  active
                    ? "text-primary opacity-100"
                    : " group-hover:opacity-100 text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}

        <button
          onClick={() => setShowWalletModal(true)}
          className="flex flex-col items-center flex-1 group"
        >
          <WalletIcon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-all" />
          <span className="text-xs mt-1 text-muted-foreground group-hover:text-primary">
            Wallet
          </span>
        </button>
      </div>

      <WalletConnectModal open={showWalletModal} onClose={() => setShowWalletModal(false)} />
    </>
  )
}
