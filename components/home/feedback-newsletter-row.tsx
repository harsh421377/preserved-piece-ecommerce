"use client"

import * as React from "react"
import { Star, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

function TiltCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const cardRef = React.useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -4
    const rotateY = ((x - centerX) / centerX) * 4
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
      className={`rounded-2xl shadow-xl overflow-hidden will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}

export function FeedbackNewsletterRow() {
  // Feedback State
  const [rating, setRating] = React.useState(0)
  const [hoverRating, setHoverRating] = React.useState(0)
  const [isSubmittingFeedback, setIsSubmittingFeedback] = React.useState(false)

  // Newsletter State
  const [isSubmittingNews, setIsSubmittingNews] = React.useState(false)

  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    setIsSubmittingFeedback(true)
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
    } catch {
      toast.error("An error occurred.")
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const handleNewsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmittingNews(true)
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
    } catch {
      toast.error("An error occurred.")
    } finally {
      setIsSubmittingNews(false)
    }
  }

  return (
    <section className="py-20 lg:py-28 bg-secondary/20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          
          {/* Feedback Card */}
          <TiltCard className="bg-card border border-border flex flex-col h-full">
            <div className="p-8 sm:p-10 flex flex-col h-full">
              <div className="mb-8">
                <h3 className="font-serif text-3xl font-light text-foreground mb-2">Write Feedback</h3>
                <p className="text-muted-foreground text-sm">Share your experience with our custom preservation services</p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="space-y-5 flex-grow flex flex-col justify-end">
                <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1 transition-colors hover:scale-110 -ml-1"
                    >
                      <Star
                        className={`h-6 w-6 transition-all ${
                          (hoverRating || rating) >= star
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input name="name" placeholder="Your Name" required className="bg-background/50 backdrop-blur-sm" />
                  <Input name="email" type="email" placeholder="Email (Optional)" className="bg-background/50 backdrop-blur-sm" />
                </div>

                <Textarea
                  name="message"
                  placeholder="Tell us about your experience..."
                  required
                  className="min-h-[100px] bg-background/50 backdrop-blur-sm resize-none"
                />

                <Button type="submit" className="w-full" disabled={isSubmittingFeedback}>
                  {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </div>
          </TiltCard>

          {/* Newsletter Card */}
          <TiltCard className="bg-primary text-primary-foreground flex flex-col h-full">
            <div className="p-8 sm:p-10 flex flex-col h-full justify-between relative overflow-hidden">
              {/* Decorative background circle */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
              
              <div className="relative z-10 mb-8 mt-auto pt-10">
                <h3 className="font-serif text-3xl sm:text-4xl font-light mb-4">Stay Updated</h3>
                <p className="text-primary-foreground/80 text-sm sm:text-base leading-relaxed">
                  Join our mailing list to receive updates on new custom piece capabilities, special offers, and behind-the-scenes looks into our preservation process.
                </p>
              </div>

              <form onSubmit={handleNewsSubmit} className="relative z-10 mt-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                    className="flex-grow bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 h-12 backdrop-blur-sm"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    className="h-12 px-8 font-medium sm:w-auto w-full flex-shrink-0"
                    disabled={isSubmittingNews}
                  >
                    {isSubmittingNews ? "Subscribing..." : (
                      <>
                        Subscribe <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </TiltCard>

        </div>
      </div>
    </section>
  )
}
