"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Plus, Edit2, Trash2, MapPin, CheckCircle } from "lucide-react"

const addressSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Required"),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().min(1, "Required"),
  addressLine1: z.string().min(1, "Required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  pincode: z.string().min(1, "Required"),
  isDefaultShipping: z.boolean().default(false),
  isDefaultBilling: z.boolean().default(false),
})

type AddressFormValues = z.infer<typeof addressSchema>

export function AddressBook() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  const { register, handleSubmit, reset, setValue } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { isDefaultShipping: false, isDefaultBilling: false, label: "Home" }
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  async function fetchAddresses() {
    setLoading(true)
    const res = await fetch("/api/user/address")
    if (res.ok) setAddresses(await res.json())
    setLoading(false)
  }

  async function onSave(values: AddressFormValues) {
    setSaveLoading(true)
    const isUpdate = !!values.id
    const res = await fetch("/api/user/address", {
      method: isUpdate ? "PATCH" : "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    })
    
    if (res.ok) {
      setIsEditing(false)
      fetchAddresses()
    }
    setSaveLoading(false)
  }

  async function deleteAddress(id: string) {
    if (!confirm("Delete this address?")) return
    await fetch(`/api/user/address?id=${id}`, { method: "DELETE" })
    fetchAddresses()
  }

  function handleEdit(address: any) {
    reset(address)
    setIsEditing(true)
  }

  const inputCls = "w-full bg-background/50 border border-border/50 text-foreground rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all text-sm backdrop-blur-sm shadow-sm"
  const labelCls = "block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1"

  if (loading) return <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>

  if (isEditing) {
    return (
      <div className="max-w-2xl bg-card border border-border/50 p-6 md:p-8 rounded-3xl shadow-xl">
        <h2 className="text-xl font-serif text-foreground mb-6">Address Details</h2>
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Label (e.g., Home, Office)</label>
              <input {...register("label")} className={inputCls} placeholder="Home" />
            </div>
            <div>
              <label className={labelCls}>Phone Number</label>
              <input {...register("phone")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>First Name</label>
              <input {...register("firstName")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Last Name</label>
              <input {...register("lastName")} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Address Line 1</label>
              <input {...register("addressLine1")} className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Address Line 2 (Optional)</label>
              <input {...register("addressLine2")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input {...register("city")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>State/Province</label>
              <input {...register("state")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Pincode / ZIP</label>
              <input {...register("pincode")} className={inputCls} />
            </div>
          </div>
          
          <div className="flex flex-col gap-3 py-4 border-t border-border/50">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" {...register("isDefaultShipping")} className="w-5 h-5 rounded border-rose-300 text-rose-600 focus:ring-rose-600 bg-background/50 cursor-pointer" />
              <span className="text-sm font-medium text-foreground group-hover:text-rose-600 transition-colors">Set as Default Shipping Address</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" {...register("isDefaultBilling")} className="w-5 h-5 rounded border-rose-300 text-rose-600 focus:ring-rose-600 bg-background/50 cursor-pointer" />
              <span className="text-sm font-medium text-foreground group-hover:text-rose-600 transition-colors">Set as Default Billing Address</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saveLoading}
              className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/25 flex-1"
            >
              {saveLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save Address"}
            </button>
            <button
              type="button"
              onClick={() => { setIsEditing(false); reset(); }}
              className="px-8 py-3 rounded-xl font-bold border border-border hover:bg-muted transition-colors flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-serif text-foreground">Saved Addresses</h2>
        <button
          onClick={() => { reset({ isDefaultShipping: addresses.length === 0, isDefaultBilling: addresses.length === 0, label: "Home" }); setIsEditing(true); }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600/10 to-purple-600/10 hover:from-rose-600/20 hover:to-purple-600/20 text-rose-600 px-5 py-2.5 rounded-xl font-bold transition-all"
        >
          <Plus className="w-5 h-5" /> Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/60 rounded-3xl bg-card/30">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground font-medium">No addresses saved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addresses.map(addr => (
            <div key={addr.id} className="group relative bg-card border border-border/50 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2 items-center">
                  <span className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{addr.label}</span>
                  {addr.isDefaultShipping && <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Shipping</span>}
                  {addr.isDefaultBilling && <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Billing</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(addr)} className="p-2 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteAddress(addr.id)} className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">{addr.firstName} {addr.lastName}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {addr.addressLine1} {addr.addressLine2 && <><br />{addr.addressLine2}</>}
                <br />{addr.city}, {addr.state} {addr.pincode}
                <br />Phone: {addr.phone}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
