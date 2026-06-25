import { MessageSquare, Flower2, Paintbrush, Package } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    title: "Consultation",
    description:
      "Share your vision with us. Tell us about the memories you want to preserve and the piece you envision.",
  },
  {
    icon: Flower2,
    title: "Send Your Treasures",
    description:
      "Safely send us your flowers, petals, or keepsakes. We provide detailed guidance for preserving and shipping.",
  },
  {
    icon: Paintbrush,
    title: "Crafting Magic",
    description:
      "Our artisans carefully preserve and encase your treasures in premium resin, creating your unique piece.",
  },
  {
    icon: Package,
    title: "Delivery",
    description: "Your bespoke creation is carefully packaged and delivered to your doorstep in a luxury gift box.",
  },
]

export function CustomOrderProcess() {
  return (
    <section className="py-10 border-b border-border hidden lg:block">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground">How It Works</h2>
          <p className="mt-2 text-muted-foreground">Our simple four-step process to create your custom piece</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <step.icon className="h-7 w-7" />
              </div>
              <div className="absolute top-8 left-1/2 w-full h-px bg-border -z-10 hidden lg:block last:hidden" />
              <span className="absolute top-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center lg:relative lg:top-auto lg:right-auto lg:mx-auto lg:-mt-12 lg:mb-4">
                {index + 1}
              </span>
              <h3 className="font-serif text-lg font-medium text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
