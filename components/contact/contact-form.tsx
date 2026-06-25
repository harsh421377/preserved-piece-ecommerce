"use client"

import type React from "react"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "custom", label: "Custom Order Question" },
  { value: "existing-order", label: "Existing Order Support" },
  { value: "wholesale", label: "Wholesale / Bulk Order" },
  { value: "collaboration", label: "Collaboration / Partnership" },
  { value: "feedback", label: "Feedback" },
]

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", inquiryType: "" })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject || form.inquiryType || "General Inquiry",
          message: form.message,
        }),
      })
      if (res.ok) {
        setIsSubmitted(true)
      } else {
        const d = await res.json()
        setError(d.error ?? "Failed to send. Please try again.")
      }
    } catch {
      setError("Network error. Please try again.")
    }
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 lg:p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="font-serif text-2xl font-medium text-foreground mb-2">Message Sent!</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Thank you for reaching out. We've received your message and will get back to you within 24 hours.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 lg:p-10 space-y-6">
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-3 rounded-lg">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name *</Label>
          <Input id="name" required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Enter your name" className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" type="email" required value={form.email} onChange={e => set("email", e.target.value)} placeholder="your@email.com" className="bg-background" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 99999 99999" className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inquiryType">Inquiry Type *</Label>
          <Select required value={form.inquiryType} onValueChange={v => set("inquiryType", v)}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select inquiry type" />
            </SelectTrigger>
            <SelectContent>
              {inquiryTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input id="subject" required value={form.subject} onChange={e => set("subject", e.target.value)} placeholder="What is your message about?" className="bg-background" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          required
          value={form.message}
          onChange={e => set("message", e.target.value)}
          rows={6}
          placeholder="Tell us how we can help you..."
          className="bg-background resize-none"
        />
      </div>

      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="rounded border-border mt-1" />
          <span className="text-sm text-muted-foreground">
            I would like to receive updates about new collections and special offers.
          </span>
        </label>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  )
}
