import { Gem, Heart, Leaf, Award } from "lucide-react"

const features = [
  {
    icon: Gem,
    title: "Premium Quality",
    description: "We use only the finest resin and materials, ensuring each piece is crystal clear and long-lasting.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every piece is handcrafted with meticulous attention to detail and genuine care for your memories.",
  },
  {
    icon: Leaf,
    title: "Eco-Conscious",
    description: "We preserve real flowers and botanical elements, giving them a new life as beautiful jewelry.",
  },
  {
    icon: Award,
    title: "100% Customizable",
    description: "Your vision, your memories, your piece. We bring your unique story to life in resin.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">Why Choose Us</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-foreground">
            The Preserved Piece Promise
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 text-primary mb-3 md:mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-5 w-5 md:h-7 md:w-7" />
              </div>
              <h3 className="font-serif text-sm md:text-xl font-medium text-foreground mb-1 md:mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-[10px] md:text-sm leading-relaxed max-w-[150px] md:max-w-none mx-auto">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
