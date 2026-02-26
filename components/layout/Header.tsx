"use client"

import Link from "next/link"
import { WalletButton } from "../wallet-button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Voting", href: "/voting", badge: 3 },
  { name: "How It Works", href: "/how-it-works" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/20">

        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">

          {/* Logo */}
          <Link href="/" className="font-display text-2xl text-primary text-glow-cyan font-bold">
            PredictX
          </Link>


          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8">

            {navigation.map((item) => {

              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative text-sm font-bold"
                >

                  {item.name}

                  {item.badge && (
                    <span className="ml-2 text-xs bg-primary text-black px-1 rounded">
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-primary glow-cyan"/>
                  )}

                </Link>
              )
            })}

          </div>

          <div className="flex gap-4 items-center">

            <div className="hidden md:block">
              <WalletButton />
            </div>

            <Button
              className="md:hidden min-h-[44px] min-w-[44px]"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu />
            </Button>

          </div>

        </nav>

      </header>
      {mobileMenuOpen && (

        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">

          <Button
            className="absolute top-6 right-6 min-h-[44px] min-w-[44px]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X />
          </Button>


          {navigation.map((item) => (

            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl py-4 px-8 min-h-[44px] touch-ripple"
            >
              {item.name}
            </Link>

          ))}


          <WalletButton />

        </div>

      )}

    </>
  )
}
