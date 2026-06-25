import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function CustomOrderCTA() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/create.png"
              alt="Custom order background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-foreground/70" />
          </div>

          <div className="relative z-10 py-16 lg:py-24 px-8 lg:px-16 text-center">
            <div className="inline-flex items-center gap-2 bg-background/10 backdrop-blur px-4 py-2 rounded-full text-background/90 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Bespoke Creations</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-background max-w-3xl mx-auto text-balance">
              Create Something <span className="italic font-medium">Uniquely Yours</span>
            </h2>

            <p className="mt-6 text-lg text-background/80 max-w-2xl mx-auto">
              From wedding bouquets to cherished flowers, we transform your personal treasures into bespoke jewelry
              pieces that tell your story.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
                <Link href="/custom-order">Start Your Custom Order</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
