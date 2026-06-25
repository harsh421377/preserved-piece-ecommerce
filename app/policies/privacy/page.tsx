import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Preserved Piece",
  description: "Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <article>
      <h1>Privacy Policy</h1>
      <p className="text-lg text-foreground">Last updated: January 2026</p>

      <h2>Information We Collect</h2>
      <p>We collect information you provide directly to us, including:</p>
      <ul>
        <li>Name, email address, phone number</li>
        <li>Shipping and billing addresses</li>
        <li>Payment information (processed securely through payment gateways)</li>
        <li>Order history and preferences</li>
        <li>Communications with our team</li>
        <li>Photos and materials for custom orders</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>Process and fulfill your orders</li>
        <li>Communicate about your orders and inquiries</li>
        <li>Send promotional emails (with your consent)</li>
        <li>Improve our products and services</li>
        <li>Prevent fraud and ensure security</li>
      </ul>

      <h2>Information Sharing</h2>
      <p>We do not sell or rent your personal information. We may share information with:</p>
      <ul>
        <li>Shipping partners to deliver your orders</li>
        <li>Payment processors to complete transactions</li>
        <li>Service providers who assist our operations</li>
        <li>Law enforcement when required by law</li>
      </ul>

      <h2>Data Security</h2>
      <p>
        We implement industry-standard security measures to protect your information. All payment transactions are
        encrypted using SSL technology.
      </p>

      <h2>Cookies</h2>
      <p>
        We use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can
        disable cookies in your browser settings.
      </p>

      <h2>Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Opt out of marketing communications</li>
      </ul>

      <h2>Contact Us</h2>
      <p>
        For privacy-related questions, contact us at{" "}
        <a href="mailto:privacy@preservedpiece.com" className="text-primary">
          privacy@preservedpiece.com
        </a>
      </p>
    </article>
  )
}
