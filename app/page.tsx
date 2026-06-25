import { HeroSection } from "@/components/home/hero-section"
import { BrandIntro } from "@/components/home/brand-intro"
import { FeaturedCollections } from "@/components/home/featured-collections"
import { CustomOrderCTA } from "@/components/home/custom-order-cta"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { Testimonials } from "@/components/home/testimonials"
import { InstagramGallery } from "@/components/home/instagram-gallery"
import { FeedbackNewsletterRow } from "@/components/home/feedback-newsletter-row"

import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Preserved Piece | Preserve Your Memories with Handcrafted Resin Art",
  description: "Discover our premium handcrafted resin art, personalized jewelry, custom pendants, and home decor. Crystal clear resin preserving your most precious memories forever.",
  alternates: { canonical: "/" },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandIntro />
      <FeaturedCollections />
      <CustomOrderCTA />
      <WhyChooseUs />
      <Testimonials />
      <FeedbackNewsletterRow />
      <InstagramGallery />
    </>
  )
}
