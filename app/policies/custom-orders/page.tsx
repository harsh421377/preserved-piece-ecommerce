import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Custom Order Policy | Preserved Piece",
  description: "Everything you need to know about ordering custom resin jewelry and art pieces.",
}

export default function CustomOrderPolicyPage() {
  return (
    <article>
      <h1>Custom Order Policy</h1>
      <p className="text-lg text-foreground">Last updated: January 2026</p>

      <h2>How Custom Orders Work</h2>
      <p>
        Custom orders allow you to create a one-of-a-kind piece using your own flowers, petals, or keepsakes. Here's
        what to expect:
      </p>
      <ol>
        <li>Submit your custom order request through our form</li>
        <li>We'll contact you within 24 hours to discuss your vision</li>
        <li>Receive a quote and design mockup for approval</li>
        <li>Send us your materials (we provide shipping guidance)</li>
        <li>Production begins once materials are received</li>
        <li>Your finished piece is delivered in 3-4 weeks</li>
      </ol>

      <h2>Materials We Can Work With</h2>
      <ul>
        <li>Fresh or dried flowers and petals</li>
        <li>Leaves and botanical elements</li>
        <li>Small fabric pieces or lace</li>
        <li>Glitter, gold leaf, and decorative elements</li>
        <li>Ashes (for memorial pieces)</li>
        <li>Hair strands (for memorial pieces)</li>
      </ul>

      <h2>Sending Your Materials</h2>
      <p>
        <strong>For fresh flowers:</strong> Press them between heavy books for 1-2 weeks before shipping. Send in a flat
        envelope with cardboard protection.
      </p>
      <p>
        <strong>For dried materials:</strong> Wrap carefully in tissue paper and use a padded envelope or small box.
      </p>
      <p>
        <strong>For memorial items:</strong> We recommend insured, tracked shipping for precious materials.
      </p>

      <h2>Pricing</h2>
      <p>Custom piece pricing depends on:</p>
      <ul>
        <li>Type of jewelry or art piece</li>
        <li>Complexity of design</li>
        <li>Materials and finishes selected</li>
        <li>Timeline (rush orders cost extra)</li>
      </ul>
      <p>
        Base prices start at ₹1,999 for simple pendants and go up from there. You'll receive an exact quote after
        consultation.
      </p>

      <h2>Payment Terms</h2>
      <ul>
        <li>50% deposit required to begin production</li>
        <li>Remaining 50% due before shipping</li>
        <li>Deposits are non-refundable once production begins</li>
      </ul>

      <h2>Timeline</h2>
      <ul>
        <li>
          <strong>Standard:</strong> 3-4 weeks from receiving materials
        </li>
        <li>
          <strong>Rush:</strong> 1-2 weeks (+₹500 rush fee)
        </li>
        <li>
          <strong>Complex pieces:</strong> May require additional time
        </li>
      </ul>

      <h2>Cancellation Policy</h2>
      <ul>
        <li>Free cancellation within 24 hours of order placement</li>
        <li>50% refund if cancelled before production begins</li>
        <li>No refund once production has begun</li>
      </ul>

      <h2>Quality Guarantee</h2>
      <p>
        If your finished piece doesn't match the approved design or has quality issues, we will remake it at no
        additional cost. Your satisfaction is our priority.
      </p>
    </article>
  )
}
