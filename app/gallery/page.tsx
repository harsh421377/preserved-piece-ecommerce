import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { InteractiveGallery } from "@/components/gallery/interactive-grid"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const revalidate = 0 // Opt out of static generation

export const metadata: Metadata = {
  title: "Gallery | Preserved Piece",
  description:
    "Browse our collection of handcrafted resin jewelry and art pieces. See the beauty of preserved memories.",
}

export default async function GalleryPage() {
  const session = await auth()
  const dbImages = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" }
  })

  // Retrieve the IDs of the images this user has liked
  let likedImageIds = new Set<string>()
  if (session?.user?.id) {
    const userLikes = await prisma.galleryImageLike.findMany({
      where: { userId: session.user.id },
      select: { galleryImageId: true }
    })
    likedImageIds = new Set(userLikes.map((like) => like.galleryImageId))
  }

  // Serialize to JSON-compatible types for the Client Component
  const images = dbImages.map((img: any) => ({
    id: img.id,
    url: img.url,
    caption: img.caption,
    category: img.category,
    likes: img.likes,
    hasLiked: likedImageIds.has(img.id)
  }))

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-secondary/30 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">Our Work</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-foreground">Gallery</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            A showcase of memories transformed into timeless pieces of art
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <InteractiveGallery initialImages={images} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground">Inspired by What You See?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Every piece in our gallery was once someone's cherished memory. Let us help you create your own timeless
            treasure.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/shop">Shop Collection</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/custom-order">Create Custom Piece</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
