import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Sparkles, Award, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | Our Story",
  description:
    "Discover the story behind Preserved Piece. We transform precious memories, wedding bouquets, and memorial flowers into timeless handcrafted resin art and jewelry.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Preserved Piece",
    description: "Discover the story behind Preserved Piece. We transform precious memories into timeless resin art and jewelry.",
    url: "https://preservedpiece.com/about",
  }
}

const values = [
  {
    icon: Heart,
    title: "Crafted with Love",
    description:
      "Every piece is made with genuine care, attention to detail, and a deep respect for the memories they hold.",
  },
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "We use only the finest UV-resistant resin and premium materials to ensure lasting beauty.",
  },
  {
    icon: Award,
    title: "Artisan Excellence",
    description: "Our skilled artisans bring years of experience and passion to every creation.",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Your vision and satisfaction are at the heart of everything we do.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-secondary/30 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">Our Story</p>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-foreground text-balance">
            Moments, <span className="italic">Preserved Forever</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Where artistry meets emotion, and memories become eternal
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] relative rounded-lg overflow-hidden">
                <Image
                  src="/artisan-crafting-resin-jewelry-in-workshop-warm-li.png"
                  alt="Our founder crafting resin jewelry"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-lg overflow-hidden border-4 border-background shadow-lg hidden sm:block">
                <Image src="/beautiful-resin-pendant-with-preserved-flower.png" alt="Finished resin piece" fill className="object-cover" />
              </div>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground mb-4 sm:mb-6">
                The Heart Behind <span className="italic">Preserved Piece</span>
              </h2>
              <div className="space-y-4 lg:space-y-6 text-sm lg:text-base text-muted-foreground leading-relaxed">
                <p>
                  Preserved Piece was born from a deeply personal moment. When I received my grandmother's dried rose
                  petals after her passing, I wanted to keep her memory close—not in a box, but as something I could
                  wear and cherish every day.
                </p>
                <p>
                  That first pendant, made from her garden roses, sparked a passion that has now become my purpose. I
                  realized that so many of us have precious flowers, petals, and keepsakes that deserve to be more than
                  memories fading in albums or drawers.
                </p>
                <p>
                  Today, Preserved Piece transforms these treasures into wearable art. From wedding bouquets to memorial
                  flowers, from milestone celebrations to everyday moments—we help you carry your most precious memories
                  in crystal-clear resin, preserved for generations.
                </p>
                <p>
                  Each piece that leaves our studio carries a piece of someone's heart. That's the honor and
                  responsibility we hold dear.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-border">
                <p className="font-serif text-lg text-foreground italic">
                  "Every flower tells a story. We're here to make sure that story is never forgotten."
                </p>
                <p className="mt-2 text-sm text-muted-foreground">— Founder, Preserved Piece</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground">Our Values</h2>
            <p className="mt-2 text-muted-foreground">The principles that guide every piece we create</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8 mt-8">
            {values.map((value) => (
              <div key={value.title} className="text-center bg-background rounded-2xl p-4 sm:p-6 shadow-sm border border-border/40 hover:shadow-md transition-shadow">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary/10 text-primary mb-3 sm:mb-4">
                  <value.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="font-serif text-sm sm:text-lg font-medium text-foreground mb-1.5 sm:mb-2">{value.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-serif text-2xl sm:text-4xl font-light text-foreground mb-4 sm:mb-6">Our Craft</h2>
              <div className="space-y-4 lg:space-y-6 text-sm lg:text-base text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Preservation:</strong> We carefully dry and prepare your flowers
                  using professional techniques that maintain their natural beauty and color vibrancy.
                </p>
                <p>
                  <strong className="text-foreground">Selection:</strong> Each petal is hand-selected and arranged to
                  create a composition that captures the essence of your memory.
                </p>
                <p>
                  <strong className="text-foreground">Encapsulation:</strong> Using premium UV-resistant resin, we
                  encase your treasures in crystal-clear perfection, protecting them from time and elements.
                </p>
                <p>
                  <strong className="text-foreground">Finishing:</strong> Every piece is polished by hand, fitted with
                  quality findings, and inspected to ensure it meets our exacting standards.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/custom-order">Start Your Custom Order</Link>
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2 grid grid-cols-2 gap-2 sm:gap-4">
              <div className="space-y-2 sm:space-y-4">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src="/craft.png"
                    alt="Flower arrangement process"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-[4/5] relative rounded-lg overflow-hidden">
                  <Image src="/resin-pouring-into-mold-artisan-hands.jpg" alt="Resin pouring process" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-2 sm:space-y-4 pt-6 sm:pt-8">
                <div className="aspect-[4/5] relative rounded-lg overflow-hidden">
                  <Image src="/polishing-resin-jewelry-piece-close-up.jpg" alt="Polishing process" fill className="object-cover" />
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image src="/heart.png" alt="Finished pieces" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-4xl font-light text-balance">Ready to Preserve Your Memories?</h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-background/80 max-w-2xl mx-auto">
            Whether you have a special bouquet, cherished petals, or a vision for something unique, we're here to bring
            it to life.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/shop">Explore Collection</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background text-background hover:bg-background/10 bg-transparent"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
