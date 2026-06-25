import Image from "next/image"
import Link from "next/link"
import { Instagram, Heart } from "lucide-react"
import { prisma } from "@/lib/prisma"

const staticGalleryData = [
  { image: "/instagram/post1.jpg", link: "https://instagram.com/preserved_piece/", likes: 0 },
  { image: "/instagram/post2.jpg", link: "https://instagram.com/preserved_piece/", likes: 0 },
  { image: "/instagram/post3.jpg", link: "https://instagram.com/preserved_piece/", likes: 0 },
  { image: "/instagram/post4.jpg", link: "https://instagram.com/preserved_piece/", likes: 0 },
  { image: "/instagram/post5.jpg", link: "https://instagram.com/preserved_piece/", likes: 0 },
  { image: "/instagram/post6.jpg", link: "https://instagram.com/preserved_piece/", likes: 0 },
]

export async function InstagramGallery() {
  const dbImages = await prisma.galleryImage.findMany({
    take: 6,
    orderBy: { createdAt: "desc" }
  })

  // Map DB items to the expected structure, fallback to static if DB is empty
  const items = dbImages.length > 0 
    ? dbImages.map((img: any) => ({ image: img.url, link: "https://instagram.com/preserved_piece/", likes: img.likes }))
    : staticGalleryData;

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">Follow Us</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">@preservedpiece</h2>
          <p className="mt-4 text-muted-foreground">Join our community and get inspired by our latest creations</p>
        </div>

        <div className="relative flex overflow-hidden w-full group py-4 pointer-events-auto">
          <div className="flex w-fit animate-scroll hover:[animation-play-state:paused] gap-4 pr-4">
            {[...items, ...items, ...items].map((item, index) => (
              <Link
                key={index}
                href={item.link}
                target={item.link.startsWith("http") ? "_blank" : undefined}
                rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                className="relative w-40 sm:w-52 md:w-64 aspect-square flex-shrink-0 overflow-hidden rounded-xl bg-secondary/50 block"
              >
                <Image
                  src={item.image}
                  alt={`Gallery post ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-foreground/0 hover:bg-foreground/40 transition-colors flex flex-col items-center justify-center opacity-0 hover:opacity-100 gap-2">
                  <Instagram className="h-8 w-8 text-background transition-opacity" />
                  {item.likes > 0 && (
                    <div className="flex items-center gap-1.5 text-background font-medium">
                      <Heart className="h-5 w-5 fill-background" />
                      <span>{item.likes}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://instagram.com/preserved_piece/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
          >
            <Instagram className="h-5 w-5" />
            Follow on Instagram
          </a>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.333%)); }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}} />
    </section>
  )
}

