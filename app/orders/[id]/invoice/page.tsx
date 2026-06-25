import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import { PrintButton } from "./print-button"

export default async function InvoicePage(
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } }
    }
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex py-10 print:py-0 print:bg-white text-black font-sans">
      <div className="max-w-[850px] w-full mx-auto bg-white p-12 shadow-md print:shadow-none print:p-0">
        
        {/* Print Action Bar (Hidden when printing) */}
        <div className="flex justify-end mb-8 print:hidden">
           <PrintButton />
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-serif text-rose-700 tracking-tight font-bold mb-2">Preserved Piece</h1>
            <p className="text-neutral-500 text-sm">Resin Art & Memorials</p>
            <p className="text-neutral-500 text-sm">contact@preservedpiece.com</p>
            <p className="text-neutral-500 text-sm">+91 99999 99999</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-neutral-800 mb-1">INVOICE</h2>
            <p className="font-mono text-sm text-neutral-600">#{order.id.slice(-8).toUpperCase()}</p>
            <p className="text-sm text-neutral-600 mt-2">
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString("en-IN")}
            </p>
            <p className="text-sm text-neutral-600">
              <strong>Status:</strong> <span className="uppercase">{order.paymentStatus} via {order.paymentMethod}</span>
            </p>
          </div>
        </div>

        <hr className="border-neutral-200 mb-8" />

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Billed To</h3>
            <p className="font-medium text-neutral-800">{order.firstName} {order.lastName}</p>
            <p className="text-sm text-neutral-600 mt-1">{order.email}</p>
            <p className="text-sm text-neutral-600">{order.phone}</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Shipped To</h3>
            <p className="font-medium text-neutral-800">{order.firstName} {order.lastName}</p>
            <p className="text-sm text-neutral-600 mt-1">{order.address}</p>
            <p className="text-sm text-neutral-600">{order.city}, {order.state} {order.pincode}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-12">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-neutral-800 text-sm uppercase tracking-wider text-neutral-800">
                <th className="py-3 px-2 font-bold whitespace-nowrap">Item Description</th>
                <th className="py-3 px-2 font-bold text-center">Qty</th>
                <th className="py-3 px-2 font-bold text-right">Price</th>
                <th className="py-3 px-2 font-bold text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-neutral-200">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 relative bg-neutral-100 rounded border border-neutral-200 overflow-hidden shrink-0 print:hidden">
                        <Image src={item.product.image || "/placeholder.svg"} fill alt={item.product.name} className="object-cover" />
                      </div>
                      <span className="font-medium text-neutral-800">{item.product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center text-neutral-600">{item.quantity}</td>
                  <td className="py-4 px-2 text-right text-neutral-600">₹{item.price.toLocaleString("en-IN")}</td>
                  <td className="py-4 px-2 text-right font-medium text-neutral-800">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-72">
            <div className="flex justify-between py-2 text-sm text-neutral-600 border-b border-neutral-100">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            
            {(order.discount > 0 || order.couponCode) && (
              <div className="flex justify-between py-2 text-sm text-green-700 border-b border-neutral-100">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                <span>- ₹{order.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            
            {order.pointsRedeemed > 0 && (
              <div className="flex justify-between py-2 text-sm text-purple-700 border-b border-neutral-100">
                <span>Loyalty Points Redeemed</span>
                <span>- ₹{(order.pointsRedeemed / 10).toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between py-2 text-sm text-neutral-600 border-b border-neutral-100">
              <span>Shipping</span>
              <span>{order.shippingCost === 0 ? "Free" : `₹${order.shippingCost.toLocaleString("en-IN")}`}</span>
            </div>

            {order.codCharges > 0 && (
               <div className="flex justify-between py-2 text-sm text-neutral-600 border-b border-neutral-100">
                 <span>COD Charges</span>
                 <span>₹{order.codCharges.toLocaleString("en-IN")}</span>
               </div>
            )}
            
            {order.giftCharges > 0 && (
               <div className="flex justify-between py-2 text-sm text-neutral-600 border-b border-neutral-100">
                 <span>Gift Wrapping</span>
                 <span>₹{order.giftCharges.toLocaleString("en-IN")}</span>
               </div>
            )}

            <div className="flex justify-between py-4 text-xl font-bold text-neutral-800 border-t-2 border-neutral-800 mt-2">
              <span>Grand Total</span>
              <span>₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-sm text-neutral-500">
          <p>Thank you for choosing Preserved Piece.</p>
          <p className="mt-1">For any inquiries regarding this invoice, please contact support.</p>
        </div>

      </div>
    </div>
  )
}
