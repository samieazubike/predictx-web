"use client"

import { Plus } from "lucide-react"
import { Button } from "./ui/button"

interface CreatePollButtonProps {
  matchId: string
}

export function CreatePollButton({ matchId }: CreatePollButtonProps) {
  return (
    <Button
      className="bg-gold hover:bg-gold/90 text-background font-bold uppercase tracking-wider glow-gold"
      onClick={() => {
        // TODO: Open create poll modal
        alert("Create Poll feature coming soon!")
      }}
    >
      <Plus className="mr-2 h-4 w-4" />
      Create Poll
    </Button>
  )
}
