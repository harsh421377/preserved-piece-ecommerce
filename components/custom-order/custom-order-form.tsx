"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const productTypes = [
  { value: "pendant", label: "Pendant" },
  { value: "bangle", label: "Bangle" },
  { value: "earrings", label: "Earrings" },
  { value: "jhumkas", label: "Jhumkas" },
  { value: "ring", label: "Ring" },
  { value: "keychain", label: "Keychain" },
  { value: "coasters", label: "Coasters" },
  { value: "tray", label: "Decorative Tray" },
  { value: "frame", label: "Photo Frame" },
  { value: "other", label: "Other" },
]

const colorOptions = [
  { value: "clear", label: "Crystal Clear" },
  { value: "white", label: "Milky White" },
  { value: "gold", label: "Gold Flakes" },
  { value: "rose-gold", label: "Rose Gold Flakes" },
  { value: "silver", label: "Silver Flakes" },
  { value: "pink", label: "Blush Pink Tint" },
  { value: "blue", label: "Soft Blue Tint" },
  { value: "custom", label: "Custom Color (specify below)" },
]

const decorativeElements = [
  { value: "dried-flowers", label: "Dried Flowers" },
  { value: "gold-leaf", label: "Gold Leaf" },
  { value: "glitter", label: "Fine Glitter" },
  { value: "pearls", label: "Mini Pearls" },
  { value: "birthstone", label: "Birthstone" },
  { value: "none", label: "None - Just My Material" },
]

export function CustomOrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [actualFiles, setActualFiles] = useState<File[]>([])
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', pincode: '',
    productType: '', colorPreference: '', decorativeElements: '',
    personalization: '', story: '', timeline: '', budget: ''
  })
  
  const [errorMsg, setErrorMsg] = useState('')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArr = Array.from(files)
      setActualFiles((prev) => [...prev, ...fileArr])
      setUploadedFiles((prev) => [...prev, ...fileArr.map((f) => f.name)])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value)
      })
      actualFiles.forEach(file => {
        submitData.append('images', file)
      })

      const res = await fetch("/api/custom-order", {
        method: "POST",
        body: submitData
      });
      
      const payload = await res.json();
      
      if (!res.ok) {
        if (payload.details) {
          throw new Error(payload.details.map((d: any) => d.message).join(", "));
        }
        throw new Error(payload.error || "Failed to submit custom order");
      }
      
      setIsSubmitted(true);
      setFormData({
        firstName: '', lastName: '', email: '', phone: '',
        address: '', city: '', state: '', pincode: '',
        productType: '', colorPreference: '', decorativeElements: '',
        personalization: '', story: '', timeline: '', budget: ''
      });
      setActualFiles([]);
      setUploadedFiles([]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-16 bg-card rounded-2xl border border-border">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="font-serif text-2xl font-medium text-foreground mb-2">Thank You!</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          We've received your custom order request. Our team will review your requirements and get back to you within 24
          hours.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Submit Another Request
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-6 lg:p-10 space-y-8">
      {/* Personal Information */}
      <div className="space-y-6">
        <h3 className="font-serif text-lg font-medium text-foreground border-b border-border pb-2">Your Information</h3>
        {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">{errorMsg}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="Enter your first name" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Enter your last name" className="bg-background" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="your@email.com" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 99999 99999" className="bg-background" />
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="space-y-6">
        <h3 className="font-serif text-lg font-medium text-foreground border-b border-border pb-2">Delivery Address</h3>

        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input id="address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="House no., Building, Street, Area" className="bg-background" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="City" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} placeholder="State" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input id="pincode" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} placeholder="110001" className="bg-background" />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">This is where we'll ship your finished custom piece.</p>
      </div>

      {/* Product Details */}
      <div className="space-y-6">
        <h3 className="font-serif text-lg font-medium text-foreground border-b border-border pb-2">Product Details</h3>

        <div className="space-y-2">
          <Label htmlFor="productType">Product Type *</Label>
          <Select required value={formData.productType} onValueChange={(val) => setFormData({...formData, productType: val})}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select product type" />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="colorPreference">Color Preference *</Label>
          <Select required value={formData.colorPreference} onValueChange={(val) => setFormData({...formData, colorPreference: val})}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select color preference" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  {color.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="decorativeElements">Decorative Elements</Label>
          <Select value={formData.decorativeElements} onValueChange={(val) => setFormData({...formData, decorativeElements: val})}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select decorative elements" />
            </SelectTrigger>
            <SelectContent>
              {decorativeElements.map((element) => (
                <SelectItem key={element.value} value={element.value}>
                  {element.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="personalization">Personalization Text</Label>
          <Input
            id="personalization"
            value={formData.personalization}
            onChange={e => setFormData({...formData, personalization: e.target.value})}
            placeholder="Name, initials, date, or special text to include"
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">If you'd like text engraved or included in your piece</p>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-6">
        <h3 className="font-serif text-lg font-medium text-foreground border-b border-border pb-2">Reference Images</h3>

        <div className="space-y-2">
          <Label>Upload Images (Optional)</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <input type="file" id="images" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
            <label htmlFor="images" className="cursor-pointer">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-foreground font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 10MB each. Share photos of your flowers or design inspiration.
              </p>
            </label>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {uploadedFiles.map((file, index) => (
                <span key={index} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                  {file}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Special Instructions */}
      <div className="space-y-6">
        <h3 className="font-serif text-lg font-medium text-foreground border-b border-border pb-2">
          Special Instructions
        </h3>

        <div className="space-y-2">
          <Label htmlFor="story">Your Story / Vision *</Label>
          <Textarea
            id="story"
            required
            rows={4}
            value={formData.story}
            onChange={e => setFormData({...formData, story: e.target.value})}
            placeholder="Tell us about the memories you want to preserve. What flowers or materials will you be sending? What does this piece mean to you?"
            className="bg-background resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline">Preferred Timeline</Label>
          <Select value={formData.timeline} onValueChange={(val) => setFormData({...formData, timeline: val})}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (3-4 weeks)</SelectItem>
              <SelectItem value="rush">Rush Order (1-2 weeks, +₹500)</SelectItem>
              <SelectItem value="flexible">Flexible - No Rush</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget Range</Label>
          <Select value={formData.budget} onValueChange={(val) => setFormData({...formData, budget: val})}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-2000">Under ₹2,000</SelectItem>
              <SelectItem value="2000-3500">₹2,000 - ₹3,500</SelectItem>
              <SelectItem value="3500-5000">₹3,500 - ₹5,000</SelectItem>
              <SelectItem value="above-5000">Above ₹5,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Terms */}
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required className="rounded border-border mt-1" />
          <span className="text-sm text-muted-foreground">
            I understand that custom orders are non-refundable and I agree to the{" "}
            <a href="/policies/custom-orders" className="text-primary hover:underline">
              Custom Order Policy
            </a>
            .
          </span>
        </label>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Custom Order Request"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        After submission, we'll contact you within 24 hours to discuss your order and provide a quote.
      </p>
    </form>
  )
}
