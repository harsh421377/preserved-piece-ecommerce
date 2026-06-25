import { prisma } from "@/lib/prisma"

const categories = [
  { id: "pendants", name: "Pendants", description: "Handcrafted resin pendants with preserved flowers and memories" },
  { id: "bangles", name: "Bangles", description: "Elegant resin bangles that capture nature's beauty" },
  { id: "earrings", name: "Earrings", description: "Delicate resin earrings for every occasion" },
  { id: "jhumkas", name: "Jhumkas", description: "Traditional jhumkas with a modern resin twist" },
  { id: "custom", name: "Custom Pieces", description: "Bespoke creations made just for you" },
  { id: "decor", name: "Decor Art", description: "Stunning resin art pieces for your space" },
]

const products = [
  {
    id: "pendant-rose-gold-1",
    categoryId: "pendants",
    name: "Rose Petal Pendant",
    description: "A timeless piece featuring preserved rose petals encased in crystal-clear resin.",
    price: 2499,
    originalPrice: 2999,
    image: "/elegant-rose-petal-resin-pendant-gold-chain-jewelr.jpg",
    customizable: true,
    inStock: true,
    featured: true,
    details: { create: [
      { text: "Handcrafted with real preserved rose petals" },
      { text: "Crystal-clear premium resin" },
      { text: "18K gold-plated chain (18 inches)" },
      { text: "Hypoallergenic and skin-safe" },
    ]},
    images: { create: [{ url: "/elegant-rose-petal-resin-pendant-gold-chain-jewelr.jpg" }] },
  },
  {
    id: "pendant-lavender-1",
    categoryId: "pendants",
    name: "Lavender Dreams Pendant",
    description: "Delicate lavender buds preserved in time, creating a serene and elegant pendant.",
    price: 2199,
    image: "/lavender-flower-resin-pendant-silver-chain-elegant.jpg",
    customizable: true,
    inStock: true,
    featured: true,
    details: { create: [
      { text: "Real preserved lavender flowers" },
      { text: "Premium UV-resistant resin" },
      { text: "Sterling silver chain" },
    ]},
    images: { create: [{ url: "/lavender-flower-resin-pendant-silver-chain-elegant.jpg" }] },
  },
  {
    id: "bangle-floral-1",
    categoryId: "bangles",
    name: "Garden Embrace Bangle",
    description: "A stunning bangle featuring an arrangement of preserved wildflowers.",
    price: 3499,
    image: "/floral-resin-bangle-bracelet-with-dried-flowers-el.jpg",
    customizable: true,
    inStock: true,
    featured: true,
    details: { create: [
      { text: "Multiple preserved flower varieties" },
      { text: "Scratch-resistant finish" },
      { text: "Available in multiple sizes" },
    ]},
    images: { create: [{ url: "/floral-resin-bangle-bracelet-with-dried-flowers-el.jpg" }] },
  },
  {
    id: "bangle-gold-leaf-1",
    categoryId: "bangles",
    name: "Golden Whisper Bangle",
    description: "Luxurious gold leaf fragments suspended in crystal-clear resin.",
    price: 3999,
    image: "/gold-leaf-resin-bangle-bracelet-luxury-elegant.jpg",
    customizable: false,
    inStock: true,
    details: { create: [{ text: "Real gold leaf inclusions" }, { text: "High-polish finish" }] },
    images: { create: [{ url: "/gold-leaf-resin-bangle-bracelet-luxury-elegant.jpg" }] },
  },
  {
    id: "earring-drop-1",
    categoryId: "earrings",
    name: "Petal Drop Earrings",
    description: "Graceful teardrop earrings with delicate flower petals, perfect for special occasions.",
    price: 1799,
    image: "/drop-earrings-with-resin-and-dried-petals-elegant-.jpg",
    customizable: true,
    inStock: true,
    featured: true,
    details: { create: [{ text: "Preserved flower petals" }, { text: "Gold-plated hooks" }] },
    images: { create: [{ url: "/drop-earrings-with-resin-and-dried-petals-elegant-.jpg" }] },
  },
  {
    id: "earring-stud-1",
    categoryId: "earrings",
    name: "Bloom Stud Earrings",
    description: "Minimalist stud earrings featuring tiny preserved blooms for everyday elegance.",
    price: 1299,
    image: "/small-stud-earrings-resin-flowers-minimal-elegant.jpg",
    customizable: true,
    inStock: true,
    details: { create: [{ text: "Tiny preserved flowers" }, { text: "Sterling silver posts" }] },
    images: { create: [{ url: "/small-stud-earrings-resin-flowers-minimal-elegant.jpg" }] },
  },
  {
    id: "jhumka-traditional-1",
    categoryId: "jhumkas",
    name: "Heritage Jhumkas",
    description: "Traditional jhumkas reimagined with preserved flowers and gold accents.",
    price: 2999,
    image: "/traditional-indian-jhumka-earrings-with-resin-and-.jpg",
    customizable: true,
    inStock: true,
    featured: true,
    details: { create: [{ text: "Traditional bell design" }, { text: "Gold-plated finish" }] },
    images: { create: [{ url: "/traditional-indian-jhumka-earrings-with-resin-and-.jpg" }] },
  },
  {
    id: "jhumka-modern-1",
    categoryId: "jhumkas",
    name: "Fusion Jhumkas",
    description: "A contemporary take on classic jhumkas, blending traditional craftsmanship with modern aesthetics.",
    price: 2799,
    image: "/placeholder.svg?height=400&width=400",
    customizable: true,
    inStock: true,
    details: { create: [{ text: "Contemporary design" }, { text: "Multiple color options" }] },
    images: { create: [{ url: "/placeholder.svg?height=400&width=400" }] },
  },
  {
    id: "decor-coaster-set",
    categoryId: "decor",
    name: "Botanical Coaster Set",
    description: "Set of 4 handcrafted coasters featuring pressed flowers and botanical elements.",
    price: 1999,
    image: "/placeholder.svg?height=400&width=400",
    customizable: true,
    inStock: true,
    details: { create: [{ text: "Set of 4 coasters" }, { text: "Heat resistant" }] },
    images: { create: [{ url: "/placeholder.svg?height=400&width=400" }] },
  },
  {
    id: "decor-tray-1",
    categoryId: "decor",
    name: "Floral Vanity Tray",
    description: "An elegant vanity tray with preserved flowers and gold handles.",
    price: 4499,
    image: "/placeholder.svg?height=400&width=400",
    customizable: true,
    inStock: true,
    featured: true,
    details: { create: [{ text: "Premium resin construction" }, { text: "Gold-plated handles" }] },
    images: { create: [{ url: "/placeholder.svg?height=400&width=400" }] },
  },
  {
    id: "custom-memorial-1",
    categoryId: "custom",
    name: "Memorial Keepsake Pendant",
    description: "A deeply personal piece that preserves ashes, hair, or dried flowers in beautiful resin.",
    price: 3999,
    image: "/placeholder.svg?height=400&width=400",
    customizable: true,
    inStock: true,
    details: { create: [{ text: "Fully customizable design" }, { text: "Includes consultation" }] },
    images: { create: [{ url: "/placeholder.svg?height=400&width=400" }] },
  },
  {
    id: "custom-wedding-1",
    categoryId: "custom",
    name: "Wedding Flower Preservation",
    description: "Transform your wedding bouquet into a timeless piece of art.",
    price: 5999,
    image: "/placeholder.svg?height=400&width=400",
    customizable: true,
    inStock: true,
    details: { create: [{ text: "Custom design consultation" }, { text: "Professional flower drying" }] },
    images: { create: [{ url: "/placeholder.svg?height=400&width=400" }] },
  },
]

async function main() {
  console.log("🌸 Seeding database...")

  // Upsert categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    })
  }
  console.log("✅ Categories seeded")

  // Upsert products
  for (const { details, images, ...product } of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: { ...product },
      create: {
        ...product,
        details,
        images,
      },
    })
  }
  console.log("✅ Products seeded")
  console.log("🎉 Seed complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
