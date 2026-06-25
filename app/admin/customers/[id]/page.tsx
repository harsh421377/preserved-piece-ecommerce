"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, MapPin, Package, Heart, Star, Loader2, Save, ShoppingBag } from "lucide-react"

export default function AdminCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const id = resolvedParams.id
  
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Editable fields
  const [points, setPoints] = useState(0)
  const [role, setRole] = useState("user")

  useEffect(() => {
    fetchCustomer()
  }, [id])

  async function fetchCustomer() {
    setLoading(true)
    const res = await fetch(`/api/admin/customers/${id}`)
    if (res.ok) {
      const data = await res.json()
      setCustomer(data)
      setPoints(data.loyaltyPoints || 0)
      setRole(data.role || "user")
    }
    setLoading(false)
  }

  async function handleSave() {
    if (!confirm("Save these changes?")) return
    setSaving(true)
    const res = await fetch(`/api/admin/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loyaltyPoints: Number(points), role })
    })
    if (res.ok) {
      alert("Customer updated successfully.")
      fetchCustomer()
    } else {
      alert("Failed to update customer.")
    }
    setSaving(false)
  }

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-rose-500" /></div>
  if (!customer) return <div className="p-20 text-center text-white text-xl">Customer not found</div>

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      
      <div className="flex items-center gap-4">
        <Link href="/admin/customers" className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Customer Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Profile & Editor */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-slate-800/80 border border-slate-700/50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-rose-600/20 to-purple-600/20" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
               <div className="w-24 h-24 rounded-full bg-slate-700 border-4 border-slate-800 flex items-center justify-center text-3xl font-serif text-white shadow-xl mb-4 overflow-hidden">
                 {customer.image ? <img src={customer.image} className="w-full h-full object-cover" /> : (customer.name?.[0] || customer.email?.[0] || "?").toUpperCase()}
               </div>
               <h2 className="text-2xl font-bold text-white">{customer.name || "Unnamed"}</h2>
               <p className="text-slate-400 text-sm mt-1">{customer.email}</p>
               <p className="text-slate-500 text-xs mt-2"><strong>Joined:</strong> {new Date(customer.createdAt).toLocaleDateString()}</p>
               {customer.phone && <p className="text-slate-500 text-xs mt-1"><strong>Phone:</strong> {customer.phone}</p>}
               {customer.dob && <p className="text-slate-500 text-xs mt-1"><strong>DOB:</strong> {new Date(customer.dob).toLocaleDateString()}</p>}
               {customer.gender && <p className="text-slate-500 text-xs mt-1 capitalize"><strong>Gender:</strong> {customer.gender}</p>}
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-700/50 space-y-4">
               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Role</label>
                  <select 
                    value={role} 
                    onChange={e => setRole(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2 outline-none focus:border-purple-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
               </div>
               
               <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Loyalty Points</label>
                  <input 
                    type="number" 
                    value={points} 
                    onChange={e => setPoints(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2 outline-none focus:border-rose-500 font-mono"
                  />
               </div>

               <button 
                 onClick={handleSave} 
                 disabled={saving}
                 className="w-full mt-4 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2"
               >
                 {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 Save Changes
               </button>
            </div>
          </div>
        </div>

        {/* Right Col: Complex Data */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Orders */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-purple-400" /> Order History ({customer.orders?.length || 0})
            </h3>
            
            {customer.orders?.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {customer.orders?.map((o: any) => (
                  <div key={o.id} className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-2xl flex items-center justify-between hover:border-purple-500/50 transition-colors">
                    <div>
                      <Link href={`/admin/orders/${o.id}`} className="text-purple-400 font-mono font-bold hover:underline mb-1 inline-block">#{o.id.slice(-8)}</Link>
                      <p className="text-slate-400 text-xs">{new Date(o.createdAt).toLocaleDateString()} • {o.items?.length} items</p>
                    </div>
                    <div className="text-right">
                       <span className={`px-3 py-1 text-xs font-bold rounded-full border mb-2 inline-block
                          ${o.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 
                            o.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400 border-red-500/20' : 
                            'bg-amber-500/20 text-amber-400 border-amber-500/20'}
                       `}>
                          {o.status}
                       </span>
                       <p className="text-white font-bold text-sm">₹{o.total.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Addresses */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-rose-400" /> Saved Addresses ({customer.addresses?.length || 0})
            </h3>
            
            {customer.addresses?.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No addresses saved.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {customer.addresses?.map((a: any) => (
                  <div key={a.id} className="bg-slate-900/50 border border-slate-700/50 p-5 rounded-2xl">
                    <span className="text-xs font-bold bg-slate-700 text-white px-2 py-1 rounded-md uppercase mb-2 inline-block">{a.label}</span>
                    <p className="text-white font-bold text-sm mt-1">{a.firstName} {a.lastName}</p>
                    <p className="text-slate-400 text-xs leading-relaxed mt-2">
                       {a.addressLine1} {a.addressLine2 && <><br/>{a.addressLine2}</>}<br/>
                       {a.city}, {a.state} {a.pincode}<br/>
                       Phone: {a.phone}
                    </p>
                    <div className="flex gap-2 mt-3 text-[10px] font-bold uppercase tracking-wider">
                       {a.isDefaultShipping && <span className="text-blue-400">Shipping</span>}
                       {a.isDefaultBilling && <span className="text-green-400">Billing</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-pink-400" /> Wishlist Items ({customer.wishlist?.length || 0})
            </h3>

            {customer.wishlist?.length === 0 ? (
              <p className="text-slate-500 text-sm italic">Wishlist is empty.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {customer.wishlist?.map((w: any) => (
                  <Link href={`/product/${w.product.id}`} key={w.id} className="group block">
                    <div className="aspect-square bg-slate-900 rounded-xl overflow-hidden mb-2 relative">
                      <img src={w.product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      {!w.product.inStock && <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-2"><span className="text-xs font-bold text-white bg-red-500 px-2 rounded backdrop-blur">OOS</span></div>}
                    </div>
                    <p className="text-xs text-white group-hover:text-rose-400 truncate font-medium">{w.product.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">₹{w.product.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
