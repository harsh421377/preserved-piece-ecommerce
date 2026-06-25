"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function FeedbackSection() {
  const [rating, setRating] = React.useState(0)
  const [hoverRating, setHoverRating] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          rating,
          message: formData.get("message"),
        }),
      })

      if (res.ok) {
        toast.success("Thank you for your feedback!")
        ;(e.target as HTMLFormElement).reset()
        setRating(0)
      } else {
        toast.error("Failed to submit feedback.")
      }
    } catch (error) {
      toast.error("An error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">We value your thoughts</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-4">Write Feedback</h2>
          <p className="text-muted-foreground">Share your experience with our custom preservation services</p>
        </div>

        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <span className="text-sm font-medium mb-2">How would you rate us?</span>
              <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className="p-1 transition-colors hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 transition-all ${
                        (hoverRating || rating) >= star
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Input name="name" placeholder="Your Name" required className="bg-background" />
              </div>
              <div className="space-y-2">
                <Input name="email" type="email" placeholder="Your Email (Optional)" className="bg-background" />
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                name="message"
                placeholder="Tell us about your experience..."
                required
                className="min-h-[120px] bg-background"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
