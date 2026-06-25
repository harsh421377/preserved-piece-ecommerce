"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)

    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const maxScroll = rect.height - window.innerHeight
      const scrollProgress = -rect.top / maxScroll
      setProgress(Math.max(0, Math.min(1, scrollProgress)))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return (
    <section ref={containerRef} className="relative md:h-[400vh] min-h-screen bg-background">
      <div className="md:sticky md:top-0 w-full md:h-screen min-h-screen overflow-hidden flex flex-col md:block items-center justify-center py-20 md:py-0">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 dark:opacity-30 pointer-events-none"
        >
          <source src="/bag.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-background/80 z-0 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full h-full pointer-events-none md:block flex flex-col gap-10 items-center justify-center text-center md:text-left mt-10 md:mt-0">

          <div
            className="md:absolute static top-1/2 w-[60vw] md:w-[40vw] max-w-lg z-0 animate-in slide-in-from-top-[20vh] slide-in-from-right-[20vw] fade-in duration-1000 ease-out fill-mode-forwards"
            style={isMobile ? { opacity: 1, pointerEvents: 'auto', transform: 'none' } : {
              opacity: progress < 0.7 ? 1 : 0,
              left: progress < 0.2 ? '75%' : progress > 0.35 ? '25%' : `${75 - ((progress - 0.2) / 0.15) * 50}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'opacity 0.5s ease-out'
            }}
          >
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl md:shadow-none">
              <Image
                src="/pen2 (1).png"
                alt="Preserved Memory Details"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div
            className="md:absolute static top-1/2 md:-translate-y-1/2 left-0 md:left-12 lg:left-24 max-w-2xl px-4 transition-opacity duration-500 ease-out z-10 -order-1 md:order-none"
            style={isMobile ? { opacity: 1, pointerEvents: 'auto', transform: 'none' } : {
              opacity: progress < 0.2 ? 1 - progress * 5 : 0,
              pointerEvents: progress < 0.2 ? 'auto' : 'none',
              transform: `translateY(${progress * -50}px)`
            }}
          >
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-medium mb-3 sm:mb-4">
              Handcrafted with Love
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-foreground text-balance">
              Moments,
              <br />
              <span className="font-medium italic bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent inline-block pr-4 pb-2 -mr-4 -mb-2">
                Preserved Forever
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed font-medium max-w-lg mx-auto md:mx-0">
              Scroll down to discover the intricate details of our custom preservation jewelry. Each creation tells your unique story.
            </p>
          </div>

          <div
            className="md:absolute static top-1/2 md:-translate-y-1/2 right-4 sm:right-6 lg:right-8 max-w-md text-center md:text-right transition-all duration-500 ease-out"
            style={isMobile ? { opacity: 1, pointerEvents: 'auto', transform: 'none' } : {
              opacity: progress > 0.3 && progress < 0.65 ? 1 : 0,
              pointerEvents: progress > 0.3 && progress < 0.65 ? 'auto' : 'none',
              transform: `translateY(${(0.45 - progress) * 100}px)`
            }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-4">
              Premium Details
            </h2>
            <p className="text-muted-foreground mb-6 text-lg font-medium">
              Nature's fleeting beauty, meticulously captured and eternalized in our crystal clear resin and delicate floral preservation.
            </p>
            <div className="flex gap-6 justify-center md:justify-end">
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Natural</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">5★</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Rated</p>
              </div>
            </div>
          </div>

          <div
            className="md:absolute static top-1/2 md:-translate-y-1/2 left-0 right-0 max-w-2xl mx-auto text-center transition-all duration-500 ease-out flex flex-col items-center"
            style={isMobile ? { opacity: 1, pointerEvents: 'auto', transform: 'none' } : {
              opacity: progress > 0.75 ? (progress - 0.75) * 4 : 0,
              pointerEvents: progress > 0.75 ? 'auto' : 'none',
              transform: `translateY(${(1 - progress) * 100}px)`
            }}
          >
            <h2 className="font-serif text-5xl sm:text-6xl font-light text-foreground mb-6">
              Begin Your Story
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto font-medium">
              Ready to transform your physical memories into a stunning piece of nature's art?
            </p>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 justify-center pointer-events-auto">
              <Button asChild size="lg" className="w-full sm:w-auto group transform-gpu hover:scale-105 transition-transform duration-300 shadow-xl shadow-rose-500/20 px-8 py-6 text-lg border-rose-500">
                <Link href="/shop">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto transform-gpu hover:scale-105 transition-transform duration-300 bg-background/50 backdrop-blur-sm px-8 py-6 text-lg border-rose-200">
                <Link href="/custom-order">Create Custom Piece</Link>
              </Button>
            </div>
          </div>

        </div>

        <div
          className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-opacity duration-300 pointer-events-none"
          style={isMobile ? { opacity: 0 } : { opacity: progress < 0.05 ? 1 : 0 }}
        >
          <span className="text-xs uppercase tracking-widest font-medium">Scroll to discover</span>
          <div className="w-px h-12 bg-gradient-to-b from-foreground/50 to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  )
}
