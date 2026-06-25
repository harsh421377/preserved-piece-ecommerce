"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  Tag,
  Plus,
  Loader2,
  Trash2,
  CheckCircle2,
  XCircle,
  Percent,
  IndianRupee,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function AdminCouponsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minSpend: "",
    usageLimit: "",
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login")
      return
    }
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/")
      return
    }
    if (status === "authenticated") {
      fetchCoupons()
    }
  }, [status, session, router])

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons")
      const data = await res.json()
      if (res.ok) {
        setCoupons(data.coupons || [])
      }
    } catch (e) {
      toast.error("Failed to fetch coupons")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Coupon created successfully")
        setCoupons([data, ...coupons])
        setIsDialogOpen(false)
        setFormData({ code: "", discountType: "PERCENTAGE", discountValue: "", minSpend: "", usageLimit: "" })
      } else {
        toast.error(data.error || "Failed to create coupon")
      }
    } catch (e) {
      toast.error("An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  const toggleCouponStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !currentStatus } : c))
        )
        toast.success("Status updated")
      } else {
        toast.error("Failed to update status")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  const deleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" })
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id))
        toast.success("Coupon deleted")
      } else {
        toast.error("Failed to delete coupon")
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent inline-flex items-center gap-3">
            <Tag className="h-8 w-8 text-purple-500" />
            Promo Codes
          </h1>
          <p className="text-slate-400 mt-1">Manage discounts and coupons</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white shadow-lg shadow-purple-500/20 border-0">
              <Plus className="h-4 w-4 mr-2" />
              Create Code
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl">Create New Promo Code</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Coupon Code</Label>
                <Input
                  required
                  placeholder="e.g. SUMMER10"
                  className="bg-slate-950 border-slate-800 uppercase"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(v) => setFormData({ ...formData, discountType: v })}
                  >
                    <SelectTrigger className="bg-slate-950 border-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                      <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount Value</Label>
                  <Input
                    required
                    type="number"
                    min="1"
                    className="bg-slate-950 border-slate-800"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min. Spend Limit (₹) <span className="text-xs text-slate-500">(Optional)</span></Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g. 1000"
                    className="bg-slate-950 border-slate-800"
                    value={formData.minSpend}
                    onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Usage Limit <span className="text-xs text-slate-500">(Optional)</span></Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="e.g. 50"
                    className="bg-slate-950 border-slate-800"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-slate-800">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-purple-600 hover:bg-purple-700">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Code
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden shadow-2xl">
        {coupons.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Tag className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No coupons found. Create your first promo code!</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-950/50">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium h-12">Code</TableHead>
                <TableHead className="text-slate-400 font-medium">Discount</TableHead>
                <TableHead className="text-slate-400 font-medium">Constraints</TableHead>
                <TableHead className="text-slate-400 font-medium">Usage</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id} className="border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                  <TableCell className="font-bold text-amber-500 text-lg tracking-wider">
                    {coupon.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium text-slate-200">
                      {coupon.discountType === "PERCENTAGE" ? (
                        <><Percent className="h-3.5 w-3.5 text-purple-400" /> {coupon.discountValue}% OFF</>
                      ) : (
                        <><IndianRupee className="h-3.5 w-3.5 text-purple-400" /> {coupon.discountValue} FLAT</>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">
                    {coupon.minSpend ? `Min: ₹${coupon.minSpend}` : "No min spend"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between w-[80px]">
                      <span className="text-white font-medium">{coupon.usageCount}</span>
                      <span className="text-slate-500 text-sm">/ {coupon.usageLimit || "∞"}</span>
                    </div>
                    {coupon.usageLimit && (
                      <div className="w-full bg-slate-800 h-1 mt-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-purple-500 h-full" 
                          style={{ width: `${Math.min(100, (coupon.usageCount / coupon.usageLimit) * 100)}%` }}
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={() => toggleCouponStatus(coupon.id, coupon.isActive)}
                        className="data-[state=checked]:bg-purple-600"
                      />
                      {coupon.isActive ? (
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> Paused
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteCoupon(coupon.id)}
                      className="text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
