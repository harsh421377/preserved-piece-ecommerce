import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shipping Policy | Preserved Piece",
  description: "Learn about our shipping methods, delivery times, and costs for domestic and international orders.",
}

export default function ShippingPolicyPage() {
  return (
    <article>
      <h1>Shipping Policy</h1>
      <p className="text-lg text-foreground">Last updated: January 2026</p>

      <h2>Domestic Shipping (India)</h2>
      <p>
        We ship to all pin codes across India through trusted courier partners including BlueDart, DTDC, and India Post.
      </p>
      <ul>
        <li>
          <strong>Standard Shipping:</strong> 5-7 business days (₹99 or FREE on orders above ₹2,500)
        </li>
        <li>
          <strong>Express Shipping:</strong> 2-3 business days (₹199)
        </li>
        <li>
          <strong>Same Day Delivery:</strong> Available in select cities (₹299)
        </li>
      </ul>

      <h2>International Shipping</h2>
      <p>We ship worldwide! International shipping rates and delivery times vary by destination:</p>
      <ul>
        <li>
          <strong>USA, UK, Canada, Australia:</strong> 7-14 business days (₹999)
        </li>
        <li>
          <strong>Europe:</strong> 10-14 business days (₹1,199)
        </li>
        <li>
          <strong>Rest of World:</strong> 14-21 business days (₹1,499)
        </li>
      </ul>
      <p>
        <strong>Note:</strong> International orders may be subject to customs duties and taxes, which are the
        responsibility of the recipient.
      </p>

      <h2>Order Processing</h2>
      <p>
        Orders are processed within 1-2 business days. During peak seasons or for custom orders, processing may take
        longer. You will receive an email confirmation with tracking information once your order ships.
      </p>

      <h2>Tracking Your Order</h2>
      <p>
        Once shipped, you will receive a tracking number via email and SMS. You can also track your order by contacting
        us on WhatsApp or email.
      </p>

      <h2>Packaging</h2>
      <p>
        All items are carefully packaged in premium gift boxes with protective padding to ensure they arrive safely.
        Gift wrapping is available for an additional ₹50.
      </p>

      <h2>Delivery Issues</h2>
      <p>
        If your package is lost, damaged, or delayed, please contact us immediately at{" "}
        <a href="mailto:hello@preservedpiece.com" className="text-primary">
          hello@preservedpiece.com
        </a>
        . We will work with the courier to resolve the issue.
      </p>
    </article>
  )
}
