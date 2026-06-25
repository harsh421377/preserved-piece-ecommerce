"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What materials can I send for preservation?",
    answer:
      "We can preserve a wide variety of materials including fresh flowers, dried flowers, flower petals, leaves, small fabric pieces, glitter, and more. For memorial pieces, we also accept ashes, hair, or small fabric swatches. Contact us if you're unsure about a specific material.",
  },
  {
    question: "How should I send my flowers or materials?",
    answer:
      "For fresh flowers, we recommend pressing them between heavy books for 1-2 weeks before shipping. Send them in a flat envelope with cardboard protection. For dried materials, wrap them carefully in tissue paper. We'll provide detailed instructions after you submit your order.",
  },
  {
    question: "How long does a custom order take?",
    answer:
      "Standard custom orders take 3-4 weeks from the time we receive your materials. Rush orders (1-2 weeks) are available for an additional fee. Complex pieces or large orders may require more time, which we'll discuss during consultation.",
  },
  {
    question: "Can I see a design preview before production?",
    answer:
      "Yes! For orders above ₹3,000, we provide a digital mockup of your piece before we begin. You can request revisions at this stage. For simpler pieces, we'll discuss the design in detail during your consultation call.",
  },
  {
    question: "What if my flowers don't survive shipping?",
    answer:
      "We understand that flowers are delicate. If your materials arrive damaged, we'll work with you to find alternatives or you can send new materials. We recommend using tracked shipping and informing us when you've sent your package.",
  },
  {
    question: "Are custom orders refundable?",
    answer:
      "Due to the personalized nature of custom pieces, we cannot offer refunds once production has begun. However, if there's a quality issue or your piece doesn't match the approved design, we'll remake it at no additional cost.",
  },
  {
    question: "Can I order matching pieces for bridesmaids or gifts?",
    answer:
      "We specialize in creating matching sets for weddings, family members, or gift collections. Bulk orders (5+ pieces) receive a 15% discount. Contact us to discuss your requirements.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship worldwide! International orders typically take 7-14 business days for delivery. Additional customs duties may apply depending on your country. We'll provide tracking information for all shipments.",
  },
]

export function CustomOrderFAQ() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground">Frequently Asked Questions</h2>
          <p className="mt-2 text-muted-foreground">Everything you need to know about custom orders</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-lg border border-border px-6"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
