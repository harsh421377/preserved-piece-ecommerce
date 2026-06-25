import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      // Sandbox Mock Mode fallback
      console.log("Razorpay credentials missing. Serving in mock sandbox mode.")
      return NextResponse.json({
        id: `mock_order_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: "INR",
        keyId: "rzp_test_mockKeyId",
        isMock: true
      })
    }

    const instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    }

    const order = await instance.orders.create(options)
    return NextResponse.json({ ...order, keyId })
  } catch (error) {
    console.error("Razorpay Error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
