import type { Metadata } from "next"
import { ContactForm } from "@/components/contact/contact-form"
import { Mail, Phone, MessageCircle, MapPin, Clock, Instagram } from "lucide-react"

const CONTACT_EMAIL = "preservedpiece@gmail.com"
const CONTACT_PHONE = "8306430256"
const LOCATION = "Bikaner, Rajasthan, India"
const INSTAGRAM_ID = "preserved_piece"
const FACEBOOK_ID = "preserved_piece"

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch",
  description:
    "Get in touch with Preserved Piece. We'd love to hear from you about custom resin art orders, memorial jewelry questions, or feedback.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Preserved Piece",
    description: "Get in touch with Preserved Piece. We'd love to hear from you about custom orders, questions, or feedback.",
    url: "https://preservedpiece.com/contact",
  }
}

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
    description: "We respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: `+91 ${CONTACT_PHONE}`,
    href: `tel:+91${CONTACT_PHONE}`,
    description: "Mon-Sat, 10am-6pm IST",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: `+91 ${CONTACT_PHONE}`,
    href: `https://wa.me/91${CONTACT_PHONE}`,
    description: "Quick responses on WhatsApp",
  },
  {
    icon: Instagram,
    title: "Instagram",
    value: `@${INSTAGRAM_ID}`,
    href: "https://instagram.com/preserved_piece/",
    description: "DM us for inquiries",
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-secondary/30 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">Get in Touch</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-foreground">Contact Us</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Have questions about our pieces or want to discuss a custom order? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-medium text-foreground mb-4">Reach Out to Us</h2>
                <p className="text-muted-foreground">
                  Whether you have a question about our products, need help with a custom order, or just want to say
                  hello, we're here for you.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : undefined}
                    rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <info.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {info.title}
                      </p>
                      <p className="text-foreground">{info.value}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="pt-8 border-t border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Our Location</p>
                    <p className="text-muted-foreground text-sm">
                      {LOCATION}
                      <br />
                      (By appointment only)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Business Hours</p>
                  <p className="text-muted-foreground text-sm">
                    Monday - Saturday
                    <br />
                    10:00 AM - 6:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-10 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground">Common Questions</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Looking for quick answers? Check out our Custom Order FAQ for detailed information about our process,
            shipping, and policies.
          </p>
          <div className="mt-8">
            <a href="/custom-order#faq" className="text-primary font-medium hover:underline">
              View FAQ →
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
