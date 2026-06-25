import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms & Conditions | Preserved Piece",
  description: "Terms and conditions for using the Preserved Piece website and purchasing our products.",
}

export default function TermsPolicyPage() {
  return (
    <article>
      <h1>Terms & Conditions</h1>
      <p className="text-lg text-foreground">Last updated: January 2026</p>

      <h2>Acceptance of Terms</h2>
      <p>
        By accessing and using the Preserved Piece website and purchasing our products, you agree to be bound by these
        Terms & Conditions. If you do not agree, please do not use our services.
      </p>

      <h2>Products</h2>
      <ul>
        <li>All products are handcrafted and may have slight variations from images shown</li>
        <li>Colors may appear differently on different screens</li>
        <li>Product availability is subject to change without notice</li>
        <li>We reserve the right to limit quantities purchased</li>
      </ul>

      <h2>Pricing</h2>
      <ul>
        <li>All prices are in Indian Rupees (₹) unless otherwise stated</li>
        <li>Prices are subject to change without notice</li>
        <li>We are not responsible for typographical errors in pricing</li>
        <li>Promotions and discounts cannot be combined unless specified</li>
      </ul>

      <h2>Orders</h2>
      <ul>
        <li>Order confirmation does not guarantee product availability</li>
        <li>We reserve the right to cancel orders for any reason</li>
        <li>Cancelled orders will be fully refunded</li>
        <li>You are responsible for providing accurate shipping information</li>
      </ul>

      <h2>Intellectual Property</h2>
      <p>
        All content on this website, including images, text, designs, and logos, is the property of Preserved Piece and
        is protected by copyright laws. You may not reproduce, distribute, or use any content without our written
        permission.
      </p>

      <h2>User Content</h2>
      <p>
        By submitting photos, reviews, or other content to us, you grant Preserved Piece a non-exclusive, royalty-free
        license to use, display, and share this content for marketing purposes.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        Preserved Piece is not liable for any indirect, incidental, or consequential damages arising from the use of our
        products or services. Our liability is limited to the purchase price of the product.
      </p>

      <h2>Governing Law</h2>
      <p>
        These terms are governed by the laws of India. Any disputes will be resolved in the courts of Mumbai,
        Maharashtra.
      </p>

      <h2>Changes to Terms</h2>
      <p>
        We may update these terms at any time. Continued use of our website after changes constitutes acceptance of the
        new terms.
      </p>

      <h2>Contact</h2>
      <p>
        For questions about these terms, contact us at{" "}
        <a href="mailto:legal@preservedpiece.com" className="text-primary">
          legal@preservedpiece.com
        </a>
      </p>
    </article>
  )
}
