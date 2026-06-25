"use client"

export function AuthScene3D() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f5f1e6]">
      {/* Video Background Layer */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-50"
      >
        <source src="/Luxury_Abstract_Animation_Generation.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay for extra luxury and depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5f1e6]/30 via-transparent to-[#e2d8c3]/30" />
    </div>
  )
}
