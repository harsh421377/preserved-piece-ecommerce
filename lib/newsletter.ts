import { prisma } from "@/lib/prisma";

export async function autoSubscribeToNewsletter(email: string) {
  if (!email || typeof email !== "string") return false;

  const normalizedEmail = email.toLowerCase().trim();

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) return false;

  try {
    // Check if the user is already subscribed
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (!existingSubscriber) {
      // Add them to the newsletter if they don't exist
      await prisma.newsletterSubscriber.create({
        data: {
          email: normalizedEmail,
          isActive: true,
        },
      });
      console.log(`Auto-subscribed ${normalizedEmail} to newsletter.`);
      return true; // Newly subscribed
    }

    return false; // Already subscribed
  } catch (error) {
    console.error(`Error auto-subscribing email ${normalizedEmail}:`, error);
    return false;
  }
}
