"use client"

import { useState } from "react"
import { Wallet, ChevronDown, LogOut, Copy } from "lucide-react"
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
import { shortenAddress } from "@/lib/utils"
import Link from "next/link"

export function WalletButton() {

const [showConnectModal, setShowConnectModal] = useState(false)

const { isConnected, address, balance, disconnect } = useWallet()

const copy = () => {

navigator.clipboard.writeText(address)

alert("Address copied!")

}

if (!isConnected)

return (

<>

<Button onClick={() => setShowConnectModal(true)}>

<Wallet className="mr-2 h-4 w-4"/>

Connect Wallet

</Button>

<WalletConnectModal

open={showConnectModal}

onClose={() => setShowConnectModal(false)}

/>

</>

)

return (

<DropdownMenu>

<DropdownMenuTrigger asChild>

<Button variant="outline">

<div className="flex flex-col items-start">

<span>{shortenAddress(address)}</span>

<span className="text-xs text-primary">

{balance.toLocaleString()} XLM

</span>

</div>

<ChevronDown className="ml-2 h-4 w-4"/>

</Button>

</DropdownMenuTrigger>

<DropdownMenuContent align="end">

<DropdownMenuItem onClick={copy}>

<Copy className="mr-2 h-4 w-4"/>

Copy Address

</DropdownMenuItem>

<DropdownMenuSeparator/>
<DropdownMenuItem asChild>

<Link href="/dashboard">

Dashboard

</Link>

</DropdownMenuItem>

<DropdownMenuSeparator/>

<DropdownMenuItem asChild>

<Link href="/dashboard?tab=completed">

Transaction History
</Link>

</DropdownMenuItem>
<DropdownMenuSeparator/>


<DropdownMenuItem onClick={disconnect}>

<LogOut className="mr-2 h-4 w-4"/>

Disconnect		

</DropdownMenuItem>

</DropdownMenuContent>

</DropdownMenu>

)

}
