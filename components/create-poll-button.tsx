"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { GamingButton } from "@/components/shared"
import { CreatePollModal } from "@/components/poll"

interface CreatePollButtonProps {
  matchId?: string
  label?: string
}

export function CreatePollButton({ matchId, label = "Create a Prediction" }: CreatePollButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <GamingButton
        variant="gold"
        size="md"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        {label}
      </GamingButton>

      <CreatePollModal
        open={open}
        onClose={() => setOpen(false)}
        preselectedMatchId={matchId}
      />
    </>
  )
}

