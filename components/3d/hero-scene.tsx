"use client"

import { useRef, useMemo } from "react"
import { useFrame, Canvas } from "@react-three/fiber"
import { Environment, ContactShadows, Center } from "@react-three/drei"
import type { Points, BufferGeometry, Group } from "three"
import * as THREE from "three"

// Sparkle particle field representing floating magic/pollen
function Sparkles({ count = 400, scrollProgress }: { count?: number; scrollProgress: number }) {
  const ref = useRef<Points<BufferGeometry>>(null)
  
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.cos(phi)
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.05 + scrollProgress * Math.PI
      ref.current.rotation.x = scrollProgress * 0.5
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#fecdd3" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function RealisticRose({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<Group>(null)

  // Procedural petals generation: Layered curved planes/spheres mimicking a rose
  const petals = useMemo(() => {
    const items = []
    const layerCount = 6
    const petalsPerLayer = [3, 5, 7, 9, 11, 13]
    
    for (let layer = 0; layer < layerCount; layer++) {
      const numPetals = petalsPerLayer[layer]
      const radius = 0.2 + (layer * 0.25)
      // Base red, varying slightly by layer for depth
      const r = 0.6 + (layer * 0.05)
      const g = 0.05 + Math.random() * 0.05
      const b = 0.15 + Math.random() * 0.1
      const color = new THREE.Color(r, g, b)
      
      for (let i = 0; i < numPetals; i++) {
        const angle = (i / numPetals) * Math.PI * 2 + (layer * 0.3)
        // Adjust tilt to make outer petals open more
        const tiltX = Math.PI / 4 + (layer * 0.15)
        items.push({
          position: [
            Math.cos(angle) * radius * 0.8,
            (layer * 0.1) - 0.2, // stack up slightly
            Math.sin(angle) * radius * 0.8
          ] as [number, number, number],
          rotation: [
            tiltX,
            -angle - Math.PI / 2,
            0
          ] as [number, number, number],
          scale: [0.6 + layer * 0.2, 0.8 + layer * 0.3, 1] as [number, number, number],
          color: color
        })
      }
    }
    return items
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return

    // Target values to interpolate towards depending on scroll sequence
    let targetX = 0
    let targetY = 0
    let targetZ = 0
    let targetRotX = Math.PI / 6 // Base slight tilt to see inside the rose
    let targetRotZ = 0
    // Continuous rotation offset by scroll
    const targetRotY = state.clock.elapsedTime * 0.2 + (scrollProgress * Math.PI * 4)
    let targetScale = 1

    if (scrollProgress < 0.3) {
      // Phase 1 (0 -> 0.3): Intro, center screen, idle floating
      const p = scrollProgress / 0.3
      targetScale = 1 + p * 0.2
      targetY = Math.sin(state.clock.elapsedTime * 0.8) * 0.15 // Idle float
    } else if (scrollProgress < 0.65) {
      // Phase 2 (0.3 -> 0.65): Move to left for "Premium Materials" detail
      const p = (scrollProgress - 0.3) / 0.35
      // Smooth easing out
      const ease = 1 - Math.pow(1 - p, 3) 
      
      targetX = -1.8 * ease
      targetY = 0
      targetZ = 1.2 * ease
      targetRotX = (Math.PI / 6) + (0.5 * ease)
      targetScale = 1.2 + (0.4 * ease)
    } else {
      // Phase 3 (0.65 -> 1.0): Move to top for "Begin Your Story", scale down
      const p = (scrollProgress - 0.65) / 0.35
      const ease = 1 - Math.pow(1 - p, 3)
      
      targetX = -1.8 * (1 - ease) 
      targetY = 1.5 * ease        
      targetZ = 1.2 * (1 - ease)  
      targetRotX = (Math.PI / 6) + (0.5 * (1 - ease))
      targetScale = 1.6 - (0.8 * ease) 
    }

    const LERP_FACTOR = 0.08
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, LERP_FACTOR)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, LERP_FACTOR)
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, LERP_FACTOR)

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, LERP_FACTOR)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, LERP_FACTOR)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, LERP_FACTOR)

    const nextScale = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, LERP_FACTOR)
    groupRef.current.scale.set(nextScale, nextScale, nextScale)
  })

  return (
    <group ref={groupRef}>
      {/* Stem base (receptacle) */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[0.4, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#166534" roughness={0.8} />
      </mesh>
      
      {/* Sepals (Green leaves at the base of the flower) */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`sepal-${i}`} position={[0, -0.5, 0]} rotation={[Math.PI / 2 + 0.5, (i / 5) * Math.PI * 2, 0]}>
          <cylinderGeometry args={[0, 0.15, 1.2, 4]} />
          <meshStandardMaterial color="#15803d" roughness={0.9} />
        </mesh>
      ))}

      {/* Procedural Petals */}
      {petals.map((petal, i) => (
        <group key={`petal-${i}`} position={petal.position} rotation={petal.rotation}>
          <mesh scale={petal.scale}>
            {/* Using a sphere segment to make a curved petal shape */}
            <sphereGeometry args={[0.5, 16, 16, 0, Math.PI, 0, Math.PI / 2]} />
            <meshPhysicalMaterial 
              color={petal.color} 
              roughness={0.6} // Velvety texture
              clearcoat={0.1} // Slight waxy sheen
              clearcoatRoughness={0.8}
              side={THREE.DoubleSide} 
            />
          </mesh>
        </group>
      ))}
      
      {/* Inner tightly bound core */}
      <mesh position={[0, 0.2, 0]}>
         <sphereGeometry args={[0.3, 32, 32]} />
         <meshStandardMaterial color="#881337" roughness={0.7} />
      </mesh>
    </group>
  )
}

export function HeroScene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="w-full h-full" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, logarithmicDepthBuffer: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        {/* Soft, romantic directional light */}
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#fff1f2" castShadow />
        {/* Warm back light */}
        <pointLight position={[-3, -2, -3]} intensity={2.5} color="#fbbf24" />
        {/* Cool rim light */}
        <pointLight position={[2, 4, -3]} intensity={2} color="#e0e7ff" />
        
        <Environment files="/city.hdr" />

        <Sparkles scrollProgress={scrollProgress} />
        
        <Center>
          <RealisticRose scrollProgress={scrollProgress} />
        </Center>

        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={3} 
          far={6} 
          resolution={256} 
          color="#4c0519" 
        />
      </Canvas>
    </div>
  )
}

