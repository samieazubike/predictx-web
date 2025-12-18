"use client"

import Link from "next/link"
import { WalletButton } from "./wallet-button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"

const navigation = [
  { name: "Discover", href: "/" },
  { name: "My Predictions", href: "/dashboard" },
  { name: "Voting", href: "/voting" },
  { name: "How It Works", href: "/how-it-works" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-primary/20 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-primary clip-corner flex items-center justify-center glow-cyan group-hover:scale-110 transition-transform">
              <span className="font-display text-background text-xl font-black">P</span>
            </div>
          </div>
          <span className="font-display text-2xl font-black text-primary text-glow-cyan tracking-wider">PREDICTX</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <WalletButton />

          {/* Mobile menu button */}
          <Button variant="ghost" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-primary/20 bg-background-secondary">
          <div className="space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-surface rounded transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
