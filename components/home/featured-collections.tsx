import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

const COLLECTIONS = [
  {
    id: "pendants",
    name: "Pendants",
    description: "Handcrafted resin pendants with preserved flowers and memories",
    image: "/beautiful-resin-pendant-with-preserved-flower.png",
    href: "/shop?category=Pendants",
    tag: "Best Seller",
  },
  {
    id: "bangles",
    name: "Bangles",
    description: "Elegant resin bangles that capture nature's beauty",
    image: "/bangels.png",
    href: "/shop?category=Bangles",
    tag: "New Arrivals",
  },
  {
    id: "earrings",
    name: "Earrings",
    description: "Delicate resin earrings for every occasion",
    image: "/earrings.png",
    href: "/shop?category=Earrings",
    tag: "Trending",
  },
  {
    id: "jhumkas",
    name: "Jhumkas",
    description: "Traditional jhumkas with a modern resin twist",
    image: "/jhumka.png",
    href: "/shop?category=Jhumkas",
    tag: "Handcrafted",
  },
  {
    id: "keychain",
    name: "Key Chains",
    description: "Carry a piece of nature with you everywhere",
    image: "/keychain.png",
    href: "/shop?category=Custom+Pieces",
    tag: "Unique Gifts",
  },
  {
    id: "decor",
    name: "Decor Art",
    description: "Stunning resin art pieces for your space",
    image: "/decor.png",
    href: "/shop?category=Decor+Art",
    tag: "Home & Living",
  },
]

export function FeaturedCollections() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/30 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-3">
              Our Collections
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">
              Curated for You
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed md:text-right">
            Each piece tells its own story — handcrafted with love and preserved in crystal-clear resin.
          </p>
        </div>

        {/*
          BENTO GRID LAYOUT (desktop 4-col, 3-row):
          ┌──────────────────┬─────────┬─────────┐
          │                  │ Bangles │Earrings │  ← row 1
          │   PENDANTS       ├─────────┴─────────┤
          │   (hero, 2×2)    │      Jhumkas       │  ← row 2
          ├─────────────────-┬───────────────────-┤
          │   Key Chains     │    Decor Art        │  ← row 3
          └──────────────────┴────────────────────┘
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:[grid-template-rows:260px_260px_220px]">

          {/* ─── 1. PENDANTS — Big Hero (2×2) ─── */}
          <Link
            href={COLLECTIONS[0].href}
            className="group relative overflow-hidden rounded-3xl col-span-2 md:col-span-2 md:row-span-2"
          >
            {/* Mobile: aspect-[4/3] gives visible height; Desktop: h-full fills grid rows */}
            <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-full">
              <Image
                src={COLLECTIONS[0].image}
                alt={COLLECTIONS[0].name}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Layered gradient: bottom dark + subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/90 transition-all duration-500" />
              {/* Shimmer sweep on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />

              {/* Tag badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <Sparkles className="h-3 w-3" />
                {COLLECTIONS[0].tag}
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                  <h3 className="font-serif text-white text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
                    {COLLECTIONS[0].name}
                  </h3>
                  <p className="mt-2 text-white/70 text-sm md:text-base max-w-xs leading-relaxed">
                    {COLLECTIONS[0].description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 bg-white text-foreground text-sm font-semibold px-5 py-2.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span>Shop Now</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* ─── 2. BANGLES — Top right ─── */}
          <Link
            href={COLLECTIONS[1].href}
            className="group relative overflow-hidden rounded-3xl col-span-1 md:col-span-1"
          >
            {/* Mobile: aspect-square; Desktop: fills grid row */}
            <div className="relative w-full aspect-square md:aspect-auto md:h-full">
              <Image
                src={COLLECTIONS[1].image}
                alt={COLLECTIONS[1].name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent group-hover:from-black/85 transition-all duration-400" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/8 to-transparent" />

              {/* Mini tag */}
              <div className="absolute top-3 left-3 bg-primary/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                {COLLECTIONS[1].tag}
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                <h3 className="font-serif text-white text-lg md:text-2xl font-medium">
                  {COLLECTIONS[1].name}
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* ─── 3. EARRINGS — Middle right ─── */}
          <Link
            href={COLLECTIONS[2].href}
            className="group relative overflow-hidden rounded-3xl col-span-1 md:col-span-1"
          >
            <div className="relative w-full aspect-square md:aspect-auto md:h-full">
              <Image
                src={COLLECTIONS[2].image}
                alt={COLLECTIONS[2].name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent group-hover:from-black/85 transition-all duration-400" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/8 to-transparent" />

              <div className="absolute top-3 left-3 bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                {COLLECTIONS[2].tag}
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                <h3 className="font-serif text-white text-lg md:text-2xl font-medium">
                  {COLLECTIONS[2].name}
                </h3>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* ─── 4. JHUMKAS — Wide card, right side of row 2 (col-span-2) ─── */}
          <Link
            href={COLLECTIONS[3].href}
            className="group relative overflow-hidden rounded-3xl col-span-2 md:col-span-2"
          >
            {/* Mobile: full-width with 16/9 aspect; Desktop: fills grid row */}
            <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-full">
              <Image
                src={COLLECTIONS[3].image}
                alt={COLLECTIONS[3].name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 bg-gradient-to-br from-white/6 to-transparent" />

              <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                {COLLECTIONS[3].tag}
              </div>

              <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-5 md:p-7">
                <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                  <h3 className="font-serif text-white text-xl md:text-3xl font-medium">
                    {COLLECTIONS[3].name}
                  </h3>
                  <p className="mt-1 text-white/65 text-xs md:text-sm hidden md:block">
                    {COLLECTIONS[3].description}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* ─── 5. KEY CHAINS — Wide card, left of row 3 (col-span-2) ─── */}
          <Link
            href={COLLECTIONS[4].href}
            className="group relative overflow-hidden rounded-3xl col-span-2 md:col-span-2"
          >
            {/* Mobile: full-width with 16/9 aspect; Desktop: fills grid row */}
            <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-full">
              <Image
                src={COLLECTIONS[4].image}
                alt={COLLECTIONS[4].name}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-all duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 bg-gradient-to-tl from-white/6 to-transparent" />

              <div className="absolute top-4 left-4 bg-primary/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                {COLLECTIONS[4].tag}
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
                <div className="transform translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                  <h3 className="font-serif text-white text-xl md:text-3xl font-medium">
                    {COLLECTIONS[4].name}
                  </h3>
                  <p className="mt-1 text-white/65 text-xs md:text-sm hidden md:block">
                    {COLLECTIONS[4].description}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* ─── 6. DECOR ART — Wide card, right of row 3 (col-span-2) ─── */}
          <Link
            href={COLLECTIONS[5].href}
            className="group relative overflow-hidden rounded-3xl col-span-2 md:col-span-2"
          >
            <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-full">
              <Image
                src={COLLECTIONS[5].image}
                alt={COLLECTIONS[5].name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600 bg-gradient-to-bl from-white/6 to-transparent" />

              <div className="absolute top-4 left-4 bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                {COLLECTIONS[5].tag}
              </div>

              <div className="absolute inset-0 flex flex-col justify-end md:justify-center md:items-end p-5 md:p-8">
                <div className="md:text-right transform translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                  <h3 className="font-serif text-white text-xl md:text-3xl font-medium">
                    {COLLECTIONS[5].name}
                  </h3>
                  <p className="mt-1 text-white/65 text-xs md:text-sm hidden md:block max-w-xs md:ml-auto">
                    {COLLECTIONS[5].description}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors md:justify-end">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border border-foreground/20 text-foreground font-medium px-6 py-3 rounded-full hover:bg-foreground hover:text-background transition-all duration-300 text-sm"
          >
            View All Collections
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
