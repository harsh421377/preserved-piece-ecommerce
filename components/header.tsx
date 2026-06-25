"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { ShoppingBag, Menu, User, Home, LogOut, Settings, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/cart-context"
import { CartSheet } from "@/components/cart-sheet"

const navigation = [
  { name: "𝒮𝒽𝑜𝓅", href: "/shop" },
  { name: "𝒞𝓊𝓈𝓉𝑜𝓂 𝒪𝓇𝒹𝑒𝓇", href: "/custom-order" },
  { name: "𝒜𝒷𝑜𝓊𝓉", href: "/about" },
  { name: "𝒢𝒶𝓁𝓁𝑒𝓇𝓎", href: "/gallery" },
  { name: "𝒞𝑜𝓃𝓉𝒶𝒸𝓉", href: "/contact" },
]

function UserAvatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name ?? "User"} className="w-7 h-7 rounded-full object-cover ring-2 ring-violet-300" />
  }
  const initials = (name ?? "U").slice(0, 2).toUpperCase()
  return (
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-violet-300">
      {initials}
    </div>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems, setIsCartOpen } = useCart()
  const { data: session } = useSession()
  // Admin sessions must NOT appear on the main website UI
  const rawUser = session?.user
  const user = rawUser?.role === "admin" ? null : rawUser
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // Fetch the real avatar from the database so it stays in sync after profile updates
  useEffect(() => {
    if (!user) { setProfileImage(null); return }
    fetch("/api/user/profile")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.image) setProfileImage(data.image)
      })
      .catch(() => {})
  }, [user])

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-background">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Browse site navigation and account options</SheetDescription>
              <div className="mt-8 flow-root">
                <div className="space-y-1">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-4 text-2xl font-medium text-foreground hover:text-primary transition-colors border-b border-border/50">
                    <Home className="h-5 w-5" /> ℋ𝑜𝓂𝑒
                  </Link>
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-4 text-2xl font-medium text-foreground hover:text-primary transition-colors border-b border-border/50">
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 mt-4 border-t border-border">
                    <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Account</p>
                    {user ? (
                      <>
                        <Link href="/account" onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-3 text-base font-medium text-foreground hover:text-primary transition-colors">My Account</Link>
                        <button onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }) }}
                          className="w-full text-left px-3 py-3 text-base font-medium text-red-500 hover:text-red-600 transition-colors">
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-3 text-base font-medium text-foreground hover:text-primary transition-colors">Sign In</Link>
                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-3 text-base font-medium text-foreground hover:text-primary transition-colors">Create Account</Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="font-hidayatullah text-xl font-semibold tracking-wide text-foreground lg:hidden">
                Preserved Piece
              </span>
              <span className="font-serif text-xl sm:text-2xl font-semibold tracking-wide text-foreground hidden lg:inline">
                𝒫𝓇𝑒𝓈𝑒𝓇𝓋𝑒𝒹 𝒫𝒾𝑒𝒸𝑒
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex lg:gap-x-8">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all">ℋ𝑜𝓂𝑒</Link>
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            {/* Account Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground relative rounded-full hover:bg-muted transition-colors">
                  {user ? <UserAvatar name={user.name} image={profileImage || user.image} /> : <User className="h-5 w-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-md border-border shadow-2xl rounded-2xl p-1.5">
                {user ? (
                  <>
                    <div className="px-2.5 py-2 mb-1">
                      <p className="text-sm font-bold text-foreground truncate">{user.name || "User"}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link href="/account" className="flex items-center gap-2 cursor-pointer py-2 text-sm">
                        <User className="h-4 w-4" /> My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link href="/account" className="flex items-center gap-2 cursor-pointer py-2 text-sm">
                        <Package className="h-4 w-4" /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50 mx-1" />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="rounded-xl text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer py-2 text-sm flex items-center gap-2">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link href="/login" className="flex items-center gap-2 cursor-pointer py-2.5 font-bold text-violet-500 focus:text-violet-600 focus:bg-violet-500/5">
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl">
                      <Link href="/signup" className="flex items-center gap-2 cursor-pointer py-2 text-sm">
                        Create Account
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative text-foreground hover:bg-muted rounded-full" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold shadow-lg shadow-violet-500/30">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </nav>
      <CartSheet />
    </header>
  )
}
