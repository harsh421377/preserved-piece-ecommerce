"use client"

import { useRef, useMemo } from "react"
import { useFrame, Canvas } from "@react-three/fiber"
import type { Points, BufferGeometry } from "three"
import * as THREE from "three"

function Particles({ count = 800 }) {
  const pointsRef = useRef<Points<BufferGeometry>>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.elapsedTime * 0.03
      pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.01) * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#f9a8d4" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

export function FloatingParticles({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
    </div>
  )
}
