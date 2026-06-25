"use client"

import * as React from "react"
import Image from "next/image"
import { Star, Quote } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    image: "/placeholder-user.jpg",
    content: "I had my wedding bouquet preserved into a beautiful pendant. Every time I wear it, I'm transported back to that magical day. The craftsmanship is exceptional!",
    rating: 5,
    product: "Wedding Flower Pendant",
  },
  {
    id: 2,
    name: "Ananya Reddy",
    location: "Bangalore",
    image: "/placeholder-user.jpg",
    content: "The jhumkas I ordered exceeded all expectations. They're lightweight, beautifully crafted, and I receive compliments every time I wear them. Truly special pieces.",
    rating: 5,
    product: "Heritage Jhumkas",
  },
  {
    id: 3,
    name: "Meera Patel",
    location: "Delhi",
    image: "/placeholder-user.jpg",
    content: "I gifted a custom memorial pendant to my mother with my grandmother's dried flowers. She was moved to tears. Thank you for helping us preserve such precious memories.",
    rating: 5,
    product: "Memorial Keepsake",
  },
  {
    id: 4,
    name: "Neha Desai",
    location: "Ahmedabad",
    image: "/placeholder-user.jpg",
    content: "Absolutely breathtaking! The resin bangles I bought are flawlessly smooth and the preserved flora looks so vibrant. Such a unique and premium piece of artistry.",
    rating: 5,
    product: "Resin Flora Bangles",
  },
  {
    id: 5,
    name: "Kavya Singh",
    location: "Pune",
    image: "/placeholder-user.jpg",
    content: "The custom decor art piece they made for my new home is stunning. The attention to detail and love poured into it is evident. It's the highlight of my living room!",
    rating: 5,
    product: "Custom Decor Art",
  },
  {
    id: 6,
    name: "Aditi Rao",
    location: "Hyderabad",
    image: "/placeholder-user.jpg",
    content: "I can't express how much I love my custom earrings. The process was so seamless, and the final result is elegant and perfectly matches my style. 10/10 recommendation!",
    rating: 5,
    product: "Custom Resin Earrings",
  },
]

export function Testimonials() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">Testimonials</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">Cherished by Many</h2>
        </div>

        <div className="max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <div className="relative bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border h-full flex flex-col">
                      <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />

                      <div className="relative z-10 flex flex-col flex-grow">
                        <div className="flex gap-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>

                        <p className="font-serif text-lg text-foreground italic flex-grow text-balance">
                          "{testimonial.content}"
                        </p>

                        <div className="mt-8 flex items-center gap-3">
                          <div>
                            <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {testimonial.location} • {testimonial.product}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-center mt-8 gap-4">
              <CarouselPrevious className="relative inset-0 translate-x-0 translate-y-0 h-10 w-10 static mx-2" />
              <CarouselNext className="relative inset-0 translate-x-0 translate-y-0 h-10 w-10 static mx-2" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

