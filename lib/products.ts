export interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  description: string
  details: string[]
  customizable: boolean
  inStock: boolean
  featured?: boolean
}

export const categories = [
  { id: "pendants", name: "Pendants", description: "Handcrafted resin pendants with preserved flowers and memories", image: "/pen2 (2).png" },
  { id: "bangles", name: "Bangles", description: "Elegant resin bangles that capture nature's beauty", image: "/bangels.png" },
  { id: "earrings", name: "Earrings", description: "Delicate resin earrings for every occasion", image: "/earrings.png" },
  { id: "jhumkas", name: "Jhumkas", description: "Traditional jhumkas with a modern resin twist", image: "/jhumka.png" },
  { id: "custom", name: "Custom Pieces", description: "Bespoke creations made just for you", image: "/placeholder.svg?height=600&width=600&query=Custom Pieces" },
  { id: "decor", name: "Decor Art", description: "Stunning resin art pieces for your space", image: "/decor.png" },
]

export const products: Product[] = [
  {
    id: "pendant-rose-gold-1",
    name: "Rose Petal Pendant",
    category: "pendants",
    price: 2499,
    originalPrice: 2999,
    image: "/elegant-rose-petal-resin-pendant-gold-chain-jewelr.jpg",
    images: ["/elegant-rose-petal-resin-pendant-gold-chain-jewelr.jpg", "/rose-petal-resin-pendant-side-view.jpg", "/rose-petal-pendant-on-neck-model.jpg"],
    description:
      "A timeless piece featuring preserved rose petals encased in crystal-clear resin, suspended from a delicate gold-plated chain.",
    details: [
      "Handcrafted with real preserved rose petals",
      "Crystal-clear premium resin",
      "18K gold-plated chain (18 inches)",
      "Hypoallergenic and skin-safe",
      "Comes in a luxury gift box",
    ],
    customizable: true,
    inStock: true,
    featured: true,
  },
  {
    id: "pendant-lavender-1",
    name: "Lavender Dreams Pendant",
    category: "pendants",
    price: 2199,
    image: "/lavender-flower-resin-pendant-silver-chain-elegant.jpg",
    images: ["/lavender-flower-resin-pendant-close-up.jpg"],
    description: "Delicate lavender buds preserved in time, creating a serene and elegant pendant.",
    details: [
      "Real preserved lavender flowers",
      "Premium UV-resistant resin",
      "Sterling silver chain",
      "Adjustable length",
    ],
    customizable: true,
    inStock: true,
    featured: true,
  },
  {
    id: "bangle-floral-1",
    name: "Garden Embrace Bangle",
    category: "bangles",
    price: 3499,
    image: "/floral-resin-bangle-bracelet-with-dried-flowers-el.jpg",
    images: ["/floral-resin-bangle-bracelet-detailed.jpg"],
    description:
      "A stunning bangle featuring an arrangement of preserved wildflowers, capturing a garden moment forever.",
    details: [
      "Multiple preserved flower varieties",
      "Scratch-resistant finish",
      "Available in multiple sizes",
      "Lightweight and comfortable",
    ],
    customizable: true,
    inStock: true,
    featured: true,
  },
  {
    id: "bangle-gold-leaf-1",
    name: "Golden Whisper Bangle",
    category: "bangles",
    price: 3999,
    image: "/gold-leaf-resin-bangle-bracelet-luxury-elegant.jpg",
    images: ["/gold-leaf-resin-bangle-detailed-luxury.jpg"],
    description: "Luxurious gold leaf fragments suspended in crystal-clear resin for an opulent statement piece.",
    details: ["Real gold leaf inclusions", "High-polish finish", "Durable and long-lasting", "Fits wrists 6-7 inches"],
    customizable: false,
    inStock: true,
  },
  {
    id: "earring-drop-1",
    name: "Petal Drop Earrings",
    category: "earrings",
    price: 1799,
    image: "/drop-earrings-with-resin-and-dried-petals-elegant-.jpg",
    images: ["/petal-drop-earrings-resin-detailed.jpg"],
    description: "Graceful teardrop earrings with delicate flower petals, perfect for special occasions.",
    details: ["Preserved flower petals", "Gold-plated hooks", "Lightweight design", "Hypoallergenic materials"],
    customizable: true,
    inStock: true,
    featured: true,
  },
  {
    id: "earring-stud-1",
    name: "Bloom Stud Earrings",
    category: "earrings",
    price: 1299,
    image: "/small-stud-earrings-resin-flowers-minimal-elegant.jpg",
    images: ["/bloom-stud-earrings-resin-detailed.jpg"],
    description: "Minimalist stud earrings featuring tiny preserved blooms for everyday elegance.",
    details: ["Tiny preserved flowers", "Sterling silver posts", "Secure butterfly backs", "Daily wear appropriate"],
    customizable: true,
    inStock: true,
  },
  {
    id: "jhumka-traditional-1",
    name: "Heritage Jhumkas",
    category: "jhumkas",
    price: 2999,
    image: "/traditional-indian-jhumka-earrings-with-resin-and-.jpg",
    images: ["/placeholder.svg?height=600&width=600"],
    description: "Traditional jhumkas reimagined with preserved flowers and gold accents for a modern ethnic look.",
    details: [
      "Traditional bell design",
      "Preserved flower elements",
      "Gold-plated finish",
      "Comfortable for extended wear",
    ],
    customizable: true,
    inStock: true,
    featured: true,
  },
  {
    id: "jhumka-modern-1",
    name: "Fusion Jhumkas",
    category: "jhumkas",
    price: 2799,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=600&width=600"],
    description: "A contemporary take on classic jhumkas, blending traditional craftsmanship with modern aesthetics.",
    details: ["Contemporary design", "Multiple color options", "Lightweight structure", "Perfect for festivities"],
    customizable: true,
    inStock: true,
  },
  {
    id: "decor-coaster-set",
    name: "Botanical Coaster Set",
    category: "decor",
    price: 1999,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=600&width=600"],
    description: "Set of 4 handcrafted coasters featuring pressed flowers and botanical elements.",
    details: ["Set of 4 coasters", "Heat resistant", "Non-scratch base", "Each piece unique"],
    customizable: true,
    inStock: true,
  },
  {
    id: "decor-tray-1",
    name: "Floral Vanity Tray",
    category: "decor",
    price: 4499,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=600&width=600"],
    description:
      "An elegant vanity tray with preserved flowers and gold handles, perfect for displaying your treasures.",
    details: ["Premium resin construction", "Gold-plated handles", "Waterproof surface", "Ideal for jewelry display"],
    customizable: true,
    inStock: true,
    featured: true,
  },
  {
    id: "custom-memorial-1",
    name: "Memorial Keepsake Pendant",
    category: "custom",
    price: 3999,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=600&width=600"],
    description:
      "A deeply personal piece that preserves ashes, hair, or dried flowers from a loved one in beautiful resin.",
    details: [
      "Fully customizable design",
      "Secure preservation method",
      "Discreet and elegant",
      "Includes consultation",
    ],
    customizable: true,
    inStock: true,
  },
  {
    id: "custom-wedding-1",
    name: "Wedding Flower Preservation",
    category: "custom",
    price: 5999,
    image: "/placeholder.svg?height=400&width=400",
    images: ["/placeholder.svg?height=600&width=600"],
    description: "Transform your wedding bouquet into a timeless piece of art that preserves your special day forever.",
    details: [
      "Custom design consultation",
      "Professional flower drying",
      "Multiple display options",
      "Certificate of authenticity",
    ],
    customizable: true,
    inStock: true,
  },
]

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.category === categoryId)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
