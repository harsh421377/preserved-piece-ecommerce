import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Return & Refund Policy | Preserved Piece",
  description: "Our return and refund policy for ready-made and custom order pieces.",
}

export default function ReturnsPolicyPage() {
  return (
    <article>
      <h1>Return & Refund Policy</h1>
      <p className="text-lg text-foreground">Last updated: January 2026</p>

      <h2>Ready-Made Products</h2>
      <p>We want you to be completely satisfied with your purchase. If you're not happy with your order:</p>
      <ul>
        <li>You may return unused items within 7 days of delivery</li>
        <li>Items must be in original packaging with tags attached</li>
        <li>Return shipping costs are the responsibility of the customer</li>
        <li>Refunds will be processed within 5-7 business days of receiving the return</li>
      </ul>

      <h2>Custom Orders</h2>
      <p>
        Due to the personalized nature of custom pieces, <strong>custom orders are non-refundable</strong> once
        production has begun. However:
      </p>
      <ul>
        <li>If the piece doesn't match the approved design, we will remake it at no cost</li>
        <li>If there is a quality defect, we will repair or replace the item</li>
        <li>You may cancel within 24 hours of placing your order for a full refund</li>
      </ul>

      <h2>Damaged or Defective Items</h2>
      <p>If you receive a damaged or defective item:</p>
      <ul>
        <li>Contact us within 48 hours of delivery with photos of the damage</li>
        <li>We will arrange a free return pickup</li>
        <li>You can choose between a replacement or full refund</li>
      </ul>

      <h2>How to Initiate a Return</h2>
      <ol>
        <li>
          Email us at{" "}
          <a href="mailto:returns@preservedpiece.com" className="text-primary">
            returns@preservedpiece.com
          </a>{" "}
          with your order number
        </li>
        <li>Include photos of the item and reason for return</li>
        <li>Wait for return approval and shipping instructions</li>
        <li>Ship the item within 5 days of approval</li>
      </ol>

      <h2>Refund Methods</h2>
      <p>Refunds are processed to the original payment method:</p>
      <ul>
        <li>
          <strong>UPI/Card payments:</strong> Refunded to original account in 5-7 business days
        </li>
        <li>
          <strong>Wallet payments:</strong> Refunded to wallet in 3-5 business days
        </li>
        <li>
          <strong>COD orders:</strong> Refunded via bank transfer or store credit
        </li>
      </ul>

      <h2>Exchanges</h2>
      <p>
        We currently don't offer direct exchanges. Please return the item and place a new order for the desired product.
      </p>
    </article>
  )
}
