"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <Button 
      onClick={() => window.print()}
      className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-md shadow-sm border border-neutral-700 font-medium px-4 py-2 flex items-center gap-2 transition"
    >
      <Printer className="h-4 w-4" />
      Print / Save PDF
    </Button>
  )
}
