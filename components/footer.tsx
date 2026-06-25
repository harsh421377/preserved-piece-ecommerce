import Link from "next/link"
import { Instagram, Facebook, Mail, Phone, MessageCircle, MapPin } from "lucide-react"

const CONTACT_EMAIL = "preservedpiece@gmail.com"
const CONTACT_PHONE = "8306430256"
const LOCATION = "Bikaner, Rajasthan, India"
const INSTAGRAM_ID = "preserved_piece"
const FACEBOOK_ID = "preserved_piece"

const footerLinks = {
  shop: [
    { name: "All Products", href: "/shop" },
    { name: "Pendants", href: "/shop?category=Pendants" },
    { name: "Bangles", href: "/shop?category=Bangles" },
    { name: "Earrings", href: "/shop?category=Earrings" },
    { name: "Jhumkas", href: "/shop?category=Jhumkas" },
    { name: "Custom Pieces", href: "/custom-order" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
    { name: "Home", href: "/" },
  ],
  policies: [
    { name: "Shipping Policy", href: "/policies/shipping" },
    { name: "Return & Refund", href: "/policies/returns" },
    { name: "Custom Order Policy", href: "/policies/custom-orders" },
    { name: "Privacy Policy", href: "/policies/privacy" },
    { name: "Terms & Conditions", href: "/policies/terms" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-semibold text-foreground">Preserved Piece</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Handcrafted resin art and personalized jewelry that preserves your precious memories forever.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:max-w-xs">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://facebook.com/${FACEBOOK_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-[#1877F2] text-white px-3 py-2.5 rounded-full font-medium text-sm hover:bg-[#166FE5] transform-gpu hover:-translate-y-1 hover:shadow-md transition-all duration-300 shadow-sm"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </a>
                <a
                  href="https://instagram.com/preserved_piece/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white px-3 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transform-gpu hover:-translate-y-1 hover:shadow-md transition-all duration-300 shadow-sm"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              </div>
              <a
                href={`https://wa.me/91${CONTACT_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full justify-center items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-[#128C7E] transform-gpu hover:-translate-y-1 hover:shadow-md transition-all duration-300 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                Chat on WhatsApp
              </a>
            </div>
            <div className="mt-6 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{LOCATION}</span>
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-span-1">
            <h3 className="font-serif text-lg font-medium text-foreground mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="col-span-1">
            <h3 className="font-serif text-lg font-medium text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-serif text-lg font-medium text-foreground mb-4">Policies</h3>
            <ul className="space-y-3">
              {footerLinks.policies.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={`tel:+91${CONTACT_PHONE}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +91 {CONTACT_PHONE}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Preserved Piece. All rights reserved. Made with love in India.
          </p>
        </div>
      </div>
    </footer>
  )
}
