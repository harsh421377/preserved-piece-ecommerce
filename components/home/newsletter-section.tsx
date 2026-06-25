"use client"

import * as React from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function NewsletterSection() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.get("email") }),
      })

      const data = await res.json()

      if (res.ok) {
        if (data.message === "Already subscribed!") {
          toast.info(data.message)
        } else {
          toast.success("Subscribed successfully!")
          ;(e.target as HTMLFormElement).reset()
        }
      } else {
        toast.error("Failed to subscribe.")
      }
    } catch (error) {
      toast.error("An error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light mb-4">Stay Updated</h2>
        <p className="text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
          Join our mailing list to receive updates on new custom piece capabilities, special offers, and behind-the-scenes looks into our preservation process.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            name="email"
            type="email"
            placeholder="Enter your email address"
            required
            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 h-12"
          />
          <Button
            type="submit"
            variant="secondary"
            className="h-12 px-8 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Subscribing..." : (
              <>
                Subscribe <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  )
}
