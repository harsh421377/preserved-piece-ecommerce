"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard, Package, ShoppingCart, Tag, MessageSquare,
  LogOut, Menu, X, ChevronRight, Diamond, Camera, Palette, Star, Mail, Users, Gift
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/custom-orders", label: "Custom Orders", icon: Palette },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/coupons", label: "Coupons", icon: Gift },
  { href: "/admin/feedback", label: "Feedback", icon: Star },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/gallery", label: "Gallery", icon: Camera },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const nav = (
    <nav style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "system-ui, sans-serif" }}>
      {/* Brand */}
      <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(180,83,9,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #7c3aed, #b45309)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}>
            <Diamond size={18} color="white" />
          </div>
          <div>
            <p style={{ color: "white", fontWeight: 700, fontSize: 15, margin: 0, letterSpacing: "0.03em" }}>Preserved Piece</p>
            <p style={{ color: "#b45309", fontSize: 11, margin: 0, letterSpacing: "0.05em" }}>ADMIN CONSOLE</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <ul style={{ flex: 1, padding: "1rem 0.75rem", listStyle: "none", margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href))
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 500,
                  transition: "all 0.18s ease",
                  background: active ? "linear-gradient(90deg, rgba(124,58,237,0.25), rgba(180,83,9,0.15))" : "transparent",
                  color: active ? "#c4b5fd" : "#94a3b8",
                  border: active ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
                }}
              >
                <Icon size={16} style={{ flexShrink: 0 }} />
                {label}
                {active && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* Bottom */}
      <div style={{ padding: "1rem 0.75rem", borderTop: "1px solid rgba(180,83,9,0.15)" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          style={{
            display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px",
            background: "none", border: "1px solid transparent", borderRadius: 10, color: "#64748b",
            fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.18s ease",
          }}
          onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)"; (e.target as HTMLButtonElement).style.color = "#f87171" }}
          onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "none"; (e.target as HTMLButtonElement).style.color = "#64748b" }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "none", position: "fixed", top: 16, left: 16, zIndex: 50,
          padding: 8, borderRadius: 8, background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.4)",
          color: "white", cursor: "pointer",
        }}
        className="pp-admin-toggle"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 40, backdropFilter: "blur(4px)" }}
        />
      )}

      <aside style={{
        position: "fixed", top: 0, left: 0, height: "100vh", width: 260,
        background: "linear-gradient(180deg, #150e28 0%, #1a1030 100%)",
        borderRight: "1px solid rgba(180,83,9,0.2)",
        zIndex: 40, transform: open ? "translateX(0)" : undefined,
        transition: "transform 0.3s ease",
        boxShadow: "4px 0 30px rgba(0,0,0,0.4)",
      }}>
        {nav}
      </aside>

      <style>{`
        @media (max-width: 1024px) {
          .pp-admin-toggle { display: flex !important; }
          aside { transform: ${open ? "translateX(0)" : "translateX(-100%)"} !important; }
        }
      `}</style>
    </>
  )
}
