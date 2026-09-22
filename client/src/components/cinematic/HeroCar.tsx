import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { Box3, Vector3 } from 'three'
import type { Group, Material, Mesh, Object3D } from 'three'

const modelUrls = {
  redBull: new URL('../../assets/models/model_RB.glb', import.meta.url).href,
  ferrari: new URL('../../assets/models/model_ferrari.glb', import.meta.url).href,
  mclaren: new URL('../../assets/models/model_mclaren.glb', import.meta.url).href,
  mercedes: new URL('../../assets/models/model_mercedes.glb', import.meta.url).href,
} as const

export type HeroCarAsset = keyof typeof modelUrls

export interface HeroCarProps {
  sceneProgress?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

const DEFAULT_POSITION: [number, number, number] = [0, 0.02, 0]
const DEFAULT_ROTATION: [number, number, number] = [0.05, -0.58, 0]

useGLTF.preload(modelUrls.redBull)
useGLTF.preload(modelUrls.ferrari)
useGLTF.preload(modelUrls.mclaren)
useGLTF.preload(modelUrls.mercedes)

function smoothstep(value: number, start: number, end: number) {
  const normalized = Math.min(1, Math.max(0, (value - start) / (end - start)))
  return normalized * normalized * (3 - 2 * normalized)
}

function prepareMaterials(root: Object3D) {
  const materials: Material[] = []

  root.traverse((object: Object3D) => {
    if ('isMesh' in object && object.isMesh) {
      const mesh = object as Mesh
      const meshMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]

      meshMaterials.forEach((material) => {
        material.transparent = true
        material.depthWrite = false
        const surface = material as Material & { metalness?: number; roughness?: number }
        if (surface.roughness !== undefined) surface.roughness = Math.min(surface.roughness, 0.36)
        if (surface.metalness !== undefined) surface.metalness = Math.max(surface.metalness, 0.2)
        materials.push(material)
      })
      object.castShadow = true
      object.receiveShadow = true
    }
  })

  return materials
}

function normalizeScene(source: Object3D, targetSize: number) {
  const clone = source.clone(true)
  const bounds = new Box3().setFromObject(clone)
  const center = bounds.getCenter(new Vector3())
  const size = bounds.getSize(new Vector3())
  const largestDimension = Math.max(size.x, size.y, size.z)
  clone.position.sub(center)
  clone.scale.setScalar(targetSize / largestDimension)
  return clone
}

function HeroCar({ sceneProgress = 0, position = DEFAULT_POSITION, rotation = DEFAULT_ROTATION, scale = 1 }: HeroCarProps) {
  const carRef = useRef<Group>(null)
  const redBullRef = useRef<Group>(null)
  const ferrariRef = useRef<Group>(null)
  const mclarenRef = useRef<Group>(null)
  const mercedesRef = useRef<Group>(null)
  const { pointer } = useThree()
  const { scene: redBullSource } = useGLTF(modelUrls.redBull)
  const { scene: ferrariSource } = useGLTF(modelUrls.ferrari)
  const { scene: mclarenSource } = useGLTF(modelUrls.mclaren)
  const { scene: mercedesSource } = useGLTF(modelUrls.mercedes)
  const redBullScene = useMemo(() => normalizeScene(redBullSource, 2.05), [redBullSource])
  const ferrariScene = useMemo(() => normalizeScene(ferrariSource, 3.35), [ferrariSource])
  const mclarenScene = useMemo(() => normalizeScene(mclarenSource, 3.05), [mclarenSource])
  const mercedesScene = useMemo(() => normalizeScene(mercedesSource, 3.45), [mercedesSource])
  const materials = useRef<Record<HeroCarAsset, Material[]>>({ redBull: [], ferrari: [], mclaren: [], mercedes: [] })

  useLayoutEffect(() => {
    materials.current = {
      redBull: prepareMaterials(redBullScene),
      ferrari: prepareMaterials(ferrariScene),
      mclaren: prepareMaterials(mclarenScene),
      mercedes: prepareMaterials(mercedesScene),
    }
  }, [ferrariScene, mclarenScene, mercedesScene, redBullScene])

  useFrame((_, delta) => {
    if (!carRef.current) return

    const progress = Math.min(1, Math.max(0, sceneProgress))
    const pointerRotationX = -pointer.y * 0.035
    const pointerRotationY = pointer.x * 0.06
    const transitionEnergy = Math.sin(progress * Math.PI)
    const mercedesProgress = Math.min(1, Math.max(0, (progress - 0.64) / 0.18))
    const targetRotationX = rotation[0] + pointerRotationX + transitionEnergy * 0.018
    const targetRotationY = rotation[1] + pointerRotationY + progress * 0.12
    const targetY = position[1] + Math.sin(progress * Math.PI * 1.1) * 0.11 - 0.02

    carRef.current.rotation.x += (targetRotationX - carRef.current.rotation.x) * Math.min(1, delta * 4)
    carRef.current.rotation.y += (targetRotationY - carRef.current.rotation.y) * Math.min(1, delta * 4)
    carRef.current.position.y += (targetY - carRef.current.position.y) * Math.min(1, delta * 4)
    carRef.current.scale.setScalar(scale * (0.98 + transitionEnergy * 0.08))

    const mercedesOpacity = smoothstep(progress, 0.64, 0.7) * (1 - smoothstep(progress, 0.79, 0.82))
    const redBullOpacity = smoothstep(progress, 0.28, 0.34) * (1 - smoothstep(progress, 0.4, 0.46))
    const ferrariReveal = smoothstep(progress, 0.1, 0.16)
    const ferrariExit = smoothstep(progress, 0.22, 0.28)
    const ferrariOpacity = ferrariReveal * (1 - ferrariExit)
    const mclarenOpacity = smoothstep(progress, 0.46, 0.52) * (1 - smoothstep(progress, 0.58, 0.64))
    const finalFade = smoothstep(progress, 0.82, 0.98)

    const opacities = {
      redBull: redBullOpacity * (1 - finalFade),
      ferrari: ferrariOpacity * (1 - finalFade),
      mclaren: mclarenOpacity * (1 - finalFade),
      mercedes: mercedesOpacity,
    }
    Object.entries(opacities).forEach(([asset, opacity]) => {
      materials.current[asset as HeroCarAsset].forEach((material) => {
        material.opacity = opacity
      })
    })

    const setLayer = (ref: RefObject<Group | null>, x: number, y: number, z: number, yaw: number, opacity: number, layerScale = 1) => {
      if (!ref.current) return
      ref.current.position.x += (x - ref.current.position.x) * Math.min(1, delta * 3)
      ref.current.position.y += (y - ref.current.position.y) * Math.min(1, delta * 3)
      ref.current.position.z += (z - ref.current.position.z) * Math.min(1, delta * 3)
      ref.current.rotation.y += (yaw - ref.current.rotation.y) * Math.min(1, delta * 3)
      ref.current.scale.setScalar(layerScale)
      ref.current.visible = opacity > 0.001
    }

    // Mercedes arrives into alignment rather than crossing the viewport: the motion
    // reduces progressively as the final reveal approaches.
    setLayer(
      mercedesRef,
      0.22 - mercedesProgress * 0.12,
      0.015 + Math.sin(mercedesProgress * Math.PI) * 0.016,
      0.06 + mercedesProgress * 0.14,
      -0.57 + mercedesProgress * 0.025,
      mercedesOpacity,
      1.02 + mercedesProgress * 0.045,
    )
    const redBullProgress = Math.min(1, Math.max(0, (progress - 0.28) / 0.18))
    setLayer(redBullRef, 3.6 - redBullProgress * 1.4, 0.28, 0.08 + redBullProgress * 0.18, -1.05 + redBullProgress * 0.08, opacities.redBull, 0.88 + redBullProgress * 0.04)
    const ferrariProgress = Math.min(1, Math.max(0, (progress - 0.1) / 0.18))
    setLayer(
      ferrariRef,
      -0.48 + ferrariProgress * 0.16,
      0.04 + Math.sin(ferrariProgress * Math.PI) * 0.025,
      -0.2 + ferrariProgress * 0.22,
      -0.62 + ferrariProgress * 0.045,
      opacities.ferrari,
      1.1 + ferrariProgress * 0.08,
    )
    const mclarenProgress = Math.min(1, Math.max(0, (progress - 0.46) / 0.18))
    setLayer(mclarenRef, 0.16 + mclarenProgress * 0.28, 0.02 + Math.sin(mclarenProgress * Math.PI) * 0.04, 0.03 + mclarenProgress * 0.18, -0.64 + mclarenProgress * 0.05, opacities.mclaren, 1.02 + mclarenProgress * 0.1)
  })

  return (
    <group ref={carRef} position={position} rotation={rotation}>
      <group ref={mercedesRef}>
        <primitive object={mercedesScene} />
      </group>
      <group ref={redBullRef}>
        <primitive object={redBullScene} />
      </group>
      <group ref={ferrariRef}>
        <primitive object={ferrariScene} />
      </group>
      <group ref={mclarenRef}>
        <primitive object={mclarenScene} />
      </group>
    </group>
  )
}

export default HeroCar
