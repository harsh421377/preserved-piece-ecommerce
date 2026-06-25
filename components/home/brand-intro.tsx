import Image from "next/image"

export function BrandIntro() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] relative rounded-lg overflow-hidden">
              <Image
                src="/create.png"
                alt="Preserved floral resin art"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-lg overflow-hidden border-4 border-background shadow-lg hidden sm:block">
              <Image
                src="/or2.png"
                alt="Detailed resin pendant"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className="text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary font-medium mb-2 md:mb-4">Our Story</p>
            <h2 className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-tight text-balance">
              Where Memories Become <br className="hidden md:block" /><span className="italic font-medium">Eternal Art</span>
            </h2>
            <div className="mt-3 md:mt-8 space-y-3 md:space-y-6 text-[11px] sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                At Preserved Piece, we believe that every moment holds infinite beauty worth preserving. Our journey
                began with a simple desire: to capture life's fleeting treasures and transform them into wearable art.
              </p>
              <p className="hidden sm:block">
                Each piece is meticulously handcrafted using premium resin and carefully preserved botanical elements.
                Whether it's a rose from your wedding bouquet, a petal from your grandmother's garden, or a flower that
                marks a milestone—we help you carry these memories close to your heart.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
