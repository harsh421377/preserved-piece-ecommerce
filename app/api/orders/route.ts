import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import crypto from "crypto"
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { sendAdminWhatsAppMessage } from "@/lib/whatsapp"
import { autoSubscribeToNewsletter } from "@/lib/newsletter"
import { getPremiumEmailTemplate } from "@/lib/email-templates"

const OrderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
})

const OrderSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
  notes: z.string().optional(),
  isGift: z.boolean().default(false),
  paymentMethod: z.enum(["upi", "card", "wallet", "cod", "razorpay"]),
  subtotal: z.number().positive(),
  discount: z.number().default(0),
  shippingCost: z.number().default(0),
  codCharges: z.number().default(0),
  giftCharges: z.number().default(0),
  total: z.number().positive(),
  pointsRedeemed: z.number().default(0),
  items: z.array(OrderItemSchema).min(1),
  couponCode: z.string().optional(),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = request.nextUrl
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = parseInt(searchParams.get("limit") ?? "20")

    const where = status ? { status } : {}

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({ orders, total, page, limit })
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    
    const body = await request.json()
    const { items, pointsRedeemed, couponCode, razorpayOrderId, razorpayPaymentId, razorpaySignature, ...orderData } = OrderSchema.parse(body)

    if (orderData.paymentMethod !== "cod" && razorpayOrderId && razorpayPaymentId && razorpaySignature && process.env.RAZORPAY_KEY_SECRET) {
       const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
         .update(razorpayOrderId + "|" + razorpayPaymentId)
         .digest("hex")
         
       if (generatedSignature !== razorpaySignature) {
           return NextResponse.json({ error: "Forged payment signature detected!" }, { status: 400 })
       }
    }

    let finalTotal = orderData.total
    let pointsAwarded = Math.floor(finalTotal / 100)
    let newExpiryDate = new Date()
    newExpiryDate.setDate(newExpiryDate.getDate() + 60)

    if (userId) {
       const user = await prisma.user.findUnique({ where: { id: userId } })
       
       let activePoints = user?.loyaltyPoints || 0
       if (user?.pointsExpiryDate && new Date() > new Date(user.pointsExpiryDate)) {
           activePoints = 0
       }

       if (pointsRedeemed > 0) {
           if (activePoints < pointsRedeemed) return NextResponse.json({ error: "Insufficient loyalty points" }, { status: 400 })
           activePoints -= pointsRedeemed
       }
       
       activePoints += pointsAwarded
       
       await prisma.user.update({
           where: { id: userId },
           data: { loyaltyPoints: activePoints, pointsExpiryDate: newExpiryDate }
       })
    }

    const order = await prisma.order.create({
      data: {
        ...orderData,
        userId: userId || null,
        pointsRedeemed,
        couponCode,
        paymentStatus: razorpayPaymentId ? "PAID" : "PENDING",
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        items: {
          create: items,
        },
      },
      include: { items: true },
    })

    // Process Coupon Usage
    if (couponCode) {
      await prisma.coupon.update({
        where: { code: couponCode },
        data: { usageCount: { increment: 1 } }
      }).catch(() => {}) // Ignore if coupon doesn't exist or concurrent issue
    }

    // Deduct stock quantity safely
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } }
      }).catch(() => {}) // Ignore if tracking fails
    }

    const orderDetailsHtml = `
      <h3 style="color:#d4af37; border-bottom:1px solid rgba(212,175,55,0.3); padding-bottom:5px; margin-top:25px; font-weight:normal;">Order Summary</h3>
      <table width="100%" style="color:#e2d9f3; font-size:14px; margin-bottom:20px;">
        <tr><td style="padding:5px 0;"><strong>Subtotal:</strong></td><td align="right">₹${orderData.subtotal}</td></tr>
        <tr><td style="padding:5px 0;"><strong>Shipping:</strong></td><td align="right">₹${orderData.shippingCost}</td></tr>
        ${orderData.codCharges ? `<tr><td style="padding:5px 0;"><strong>COD Charges:</strong></td><td align="right">₹${orderData.codCharges}</td></tr>` : ''}
        ${orderData.giftCharges ? `<tr><td style="padding:5px 0;"><strong>Gift Wrapping:</strong></td><td align="right">₹${orderData.giftCharges}</td></tr>` : ''}
        ${orderData.discount ? `<tr><td style="padding:5px 0; color:#d4af37;"><strong>Discount:</strong></td><td align="right" style="color:#d4af37;">-₹${orderData.discount}</td></tr>` : ''}
        <tr><td style="padding:10px 0; border-top:1px solid rgba(255,255,255,0.1);"><strong><span style="font-size:16px;">Total:</span></strong></td><td align="right"><strong><span style="font-size:16px; color:#d4af37;">₹${orderData.total}</span></strong></td></tr>
      </table>

      <h3 style="color:#d4af37; border-bottom:1px solid rgba(212,175,55,0.3); padding-bottom:5px; font-weight:normal;">Customer Details</h3>
      <p style="margin:5px 0; font-size: 14px;"><strong>Name:</strong> ${orderData.firstName} ${orderData.lastName}</p>
      <p style="margin:5px 0; font-size: 14px;"><strong>Phone:</strong> ${orderData.phone}</p>
      <p style="margin:5px 0; font-size: 14px;"><strong>Payment Method:</strong> ${orderData.paymentMethod.toUpperCase()}</p>
      <p style="margin:5px 0; font-size: 14px;"><strong>Gift Order:</strong> ${orderData.isGift ? 'Yes 🎁' : 'No'}</p>

      <h3 style="color:#d4af37; border-bottom:1px solid rgba(212,175,55,0.3); padding-bottom:5px; margin-top:20px; font-weight:normal;">Shipping Address</h3>
      <p style="margin:5px 0; font-size: 14px;">${orderData.address}</p>
      <p style="margin:5px 0; font-size: 14px;">${orderData.city}, ${orderData.state} - ${orderData.pincode}</p>

      ${orderData.notes ? `
      <h3 style="color:#d4af37; border-bottom:1px solid rgba(212,175,55,0.3); padding-bottom:5px; margin-top:20px; font-weight:normal;">Order Notes</h3>
      <p style="margin:5px 0; font-style:italic; font-size: 14px; background:rgba(255,255,255,0.05); padding:10px; border-radius:6px;">"${orderData.notes}"</p>
      ` : ''}
    `;

    await Promise.allSettled([
      autoSubscribeToNewsletter(orderData.email),
      sendEmail({
        to: orderData.email,
        subject: `Order Confirmation - 🎉 #${order.id}`,
        html: getPremiumEmailTemplate(
          "Thank you for your order!",
          `<p>Hi ${orderData.firstName},</p>
           <p>Your beautiful piece is secured. Your order <strong>#${order.id}</strong> has been successfully placed.</p>
           ${orderDetailsHtml}
           <p style="margin-top:25px;">We'll notify you via email as soon as it ships.</p>`
        )
      }),
      sendEmail({
        to: process.env.STORE_EMAIL || "admin@example.com",
        subject: `New Order Received - 💰 #${order.id}`,
        html: getPremiumEmailTemplate(
          "New Order Received",
          `<p>A new order was placed by <strong>${orderData.firstName} ${orderData.lastName}</strong>.</p>
           <p><strong>Order ID:</strong> #${order.id}</p>
           ${orderDetailsHtml}
           <p style="margin-top:25px;">Log in to your admin panel to view the full details and items.</p>`
        )
      }),
      sendAdminWhatsAppMessage({
        message: `New Order 🛍️\nOrder ID: #${order.id}\nCustomer: ${orderData.firstName} ${orderData.lastName}\nTotal: ₹${orderData.total}`,
      }),
    ])

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
