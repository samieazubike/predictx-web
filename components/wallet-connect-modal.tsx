"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import type { WalletProvider } from "@/lib/mock-data";

interface WalletConnectModalProps {
	open: boolean;
	onClose: () => void;
}

const wallets: { name: WalletProvider; icon: string; popular: boolean }[] = [
	{ name: "Freighter", icon: "🚀", popular: true },
	{ name: "Lobstr", icon: "🦞", popular: true },
	{ name: "xBull", icon: "⚡", popular: false },
];

export function WalletConnectModal({ open, onClose }: WalletConnectModalProps) {
	const [selectedWallet, setSelectedWallet] = useState<WalletProvider | null>(
		null,
	);
	const { connect, isConnecting } = useWallet();

	const handleConnect = async (provider: WalletProvider) => {
		setSelectedWallet(provider);
		try {
			await connect(provider);
			onClose();
		} catch {
			// connection failed — hook already handles the 5% failure case
		} finally {
			setSelectedWallet(null);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onClose}>
			<DialogContent className='bg-surface border-2 border-primary/30 max-w-md clip-corner-lg'>
				<DialogHeader>
					<DialogTitle className='text-2xl font-display text-primary text-glow-cyan uppercase tracking-wider'>
						Connect Wallet
					</DialogTitle>
				</DialogHeader>

				<div className='space-y-3 mt-4'>
					{wallets.map((wallet) => (
						<Button
							key={wallet.name}
							onClick={() => handleConnect(wallet.name)}
							disabled={isConnecting}
							variant='outline'
							className='w-full h-16 justify-start text-left border-2 border-border hover:border-primary bg-background-secondary hover:bg-surface transition-all group clip-corner relative overflow-hidden'>
							{/* Scan line effect */}
							<div className='absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000' />
							<span className='text-3xl mr-4'>{wallet.icon}</span>
							<div className='flex-1'>
								<div className='flex items-center gap-2'>
									<span className='font-bold text-lg'>
										{wallet.name}
									</span>
									{wallet.popular && (
										<span className='text-xs bg-gold/20 text-gold px-2 py-0.5 rounded'>
											POPULAR
										</span>
									)}
								</div>
								{isConnecting && selectedWallet === wallet.name && (
									<span className='text-xs text-muted-foreground'>
										Connecting...
									</span>
								)}
							</div>
						</Button>
					))}
				</div>

				<p className='text-xs text-muted-foreground text-center mt-6'>
					By connecting your Stellar wallet, you agree to our Terms of
					Service
				</p>
			</DialogContent>
		</Dialog>
	);
}
