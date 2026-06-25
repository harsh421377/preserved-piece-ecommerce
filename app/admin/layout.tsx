import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"

export const metadata = {
  title: "Admin | Preserved Piece",
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pp-admin-root">
      <AdminSidebar />
      <main className="pp-admin-main">
        {children}
      </main>
      <style>{`
        .pp-admin-root {
          min-height: 100vh;
          display: flex;
          background: linear-gradient(135deg, #0f0c1a 0%, #1a1030 60%, #0d1526 100%);
          color: #e2e8f0;
        }
        .pp-admin-main {
          flex: 1;
          margin-left: 260px;
          padding: 2rem;
          min-height: 100vh;
        }
        @media (max-width: 1024px) {
          .pp-admin-main { margin-left: 0; }
        }
      `}</style>
    </div>
  )
}
