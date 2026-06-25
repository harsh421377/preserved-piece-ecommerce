"use client"

import * as React from "react"
import { Star } from "lucide-react"

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("/api/admin/feedback")
      .then(res => res.json())
      .then(data => {
        setFeedbacks(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching feedback:", err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">User Feedback</h1>
      
      {loading ? (
        <p className="text-slate-400">Loading feedback...</p>
      ) : (
        <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-900/50 text-slate-300 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No feedback received yet.
                  </td>
                </tr>
              ) : (
                feedbacks.map(item => (
                  <tr key={item.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {item.email || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {item.rating} <Star className="h-3 w-3 fill-primary text-primary" />
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md truncate" title={item.message}>
                      {item.message}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
