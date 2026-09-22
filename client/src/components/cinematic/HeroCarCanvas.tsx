import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useLayoutEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { AmbientLight, Color, DirectionalLight, Fog, HemisphereLight, PointLight } from 'three'
import type { HeroCarProps } from './HeroCar'
import HeroCar from './HeroCar'

interface HeroCarCanvasProps extends Pick<HeroCarProps, 'sceneProgress'> {
	className?: string
}

function smoothstep(value: number, start: number, end: number) {
	const normalized = Math.min(1, Math.max(0, (value - start) / (end - start)))
	return normalized * normalized * (3 - 2 * normalized)
}

function HeroCarCamera({ sceneProgress }: Pick<HeroCarProps, 'sceneProgress'>) {
	const { camera } = useThree()

	useLayoutEffect(() => {
		camera.position.set(2.55, 0.98, 4.15)
	}, [camera])

	useFrame((_, delta) => {
		const progress = sceneProgress ?? 0
		const midpoint = Math.sin(progress * Math.PI)
		const redBullProgress = Math.min(1, Math.max(0, (progress - 0.28) / 0.18))
		const redBullPresence = smoothstep(progress, 0.28, 0.34) * (1 - smoothstep(progress, 0.4, 0.46))
		const redBullPathX = 3.6 - redBullProgress * 1.4
		const mclarenProgress = Math.min(1, Math.max(0, (progress - 0.46) / 0.18))
		const mclarenPresence = smoothstep(progress, 0.46, 0.52) * (1 - smoothstep(progress, 0.58, 0.64))
		const ferrariProgress = Math.min(1, Math.max(0, (progress - 0.1) / 0.18))
		const ferrariPresence = smoothstep(progress, 0.1, 0.16) * (1 - smoothstep(progress, 0.22, 0.28))
		const mercedesPresence = smoothstep(progress, 0.64, 0.7) * (1 - smoothstep(progress, 0.79, 0.82))
		const mercedesProgress = Math.min(1, Math.max(0, (progress - 0.64) / 0.18))
		const targetX = 2.55 + progress * 0.22 - midpoint * 0.5 - ferrariPresence * 0.16 + ferrariProgress * 0.08 + redBullPresence * 0.2 - redBullProgress * 0.18 - mclarenPresence * 0.08 + mclarenProgress * 0.12 - mercedesPresence * 0.08 + mercedesProgress * 0.07
		const targetY = 0.98 + Math.sin(progress * Math.PI) * 0.1 + ferrariPresence * 0.025 + redBullPresence * 0.02 + mclarenPresence * 0.04 - mercedesPresence * 0.025
		const targetZ = 4.15 - midpoint * 0.5 - ferrariPresence * 0.42 - redBullPresence * (0.12 + redBullProgress * 0.06) - mclarenPresence * (0.18 + mclarenProgress * 0.18) - mercedesPresence * (0.1 + mercedesProgress * 0.12)

		camera.position.x += (targetX - camera.position.x) * Math.min(1, delta * 2.5)
		camera.position.y += (targetY - camera.position.y) * Math.min(1, delta * 2.5)
		camera.position.z += (targetZ - camera.position.z) * Math.min(1, delta * 2.5)
		camera.lookAt(-ferrariPresence * 0.12 + ferrariProgress * 0.04 + redBullPresence * (redBullPathX - 2.8) - mclarenPresence * 0.02 + mclarenProgress * 0.05 + mercedesPresence * 0.04, -0.16 + progress * 0.02 + mclarenPresence * 0.04 - mercedesPresence * 0.015, midpoint * 0.16 + ferrariPresence * 0.05 + redBullPresence * 0.16 + mclarenPresence * 0.08 + mercedesPresence * 0.06)
	})

	return null
}

function HeroCarLighting({ sceneProgress }: Pick<HeroCarProps, 'sceneProgress'>) {
	const ambientRef = useRef<AmbientLight>(null)
	const keyRef = useRef<DirectionalLight>(null)
	const silverFillRef = useRef<DirectionalLight>(null)
	const hemisphereRef = useRef<HemisphereLight>(null)
	const redRimRef = useRef<PointLight>(null)
	const coolRimRef = useRef<PointLight>(null)
	const { scene } = useThree()
	const graphite = new Color('#111820')
	const blue = new Color('#07152b')
	const red = new Color('#240609')
	const orange = new Color('#251207')
	const coolColor = new Color('#9daeff')

	useFrame(() => {
		const progress = sceneProgress ?? 0
		const redBullMix = smoothstep(progress, 0.28, 0.46)
		const ferrariMix = smoothstep(progress, 0.1, 0.28)
		const mclarenMix = smoothstep(progress, 0.46, 0.64)
		const mercedesMix = smoothstep(progress, 0.62, 0.72)
		const finalQuiet = smoothstep(progress, 0.78, 0.82)
		const atmosphere = graphite.clone().lerp(blue, redBullMix).lerp(red, ferrariMix).lerp(orange, mclarenMix).lerp(new Color('#11161b'), mercedesMix)
		if (ambientRef.current) {
			ambientRef.current.intensity = 0.58 + Math.sin(progress * Math.PI) * 0.14 + ferrariMix * 0.1 + redBullMix * 0.08 + mercedesMix * 0.12 - finalQuiet * 0.14
		}
		if (keyRef.current) {
			keyRef.current.intensity = 2.6 + Math.sin(progress * Math.PI) * 0.3 + ferrariMix * 0.65 + redBullMix * 0.3 + mercedesMix * 0.28 - finalQuiet * 0.24
		}
		if (silverFillRef.current) {
			silverFillRef.current.intensity = 0.18 + mercedesMix * 1.05 - finalQuiet * 0.14
			silverFillRef.current.color.set('#c6d4dd')
		}
		if (hemisphereRef.current) {
			hemisphereRef.current.intensity = 0.44 + Math.sin(progress * Math.PI) * 0.12
		}
		if (redRimRef.current) {
			redRimRef.current.intensity = 1.5 + Math.sin(progress * Math.PI) * 0.5 + ferrariMix * 1.1 + redBullMix * 0.35
			redRimRef.current.color.copy(red).lerp(coolColor, redBullMix * 0.7).lerp(new Color('#ff8a36'), mclarenMix * 0.35)
		}
		if (coolRimRef.current) {
			coolRimRef.current.intensity = 1.2 + Math.sin(progress * Math.PI) * 0.45 + ferrariMix * 0.3 + mclarenMix * 0.55 + mercedesMix * 0.65 - finalQuiet * 0.5
			coolRimRef.current.color.copy(coolColor).lerp(new Color('#ff9a3d'), mclarenMix * 0.4).lerp(new Color('#c6d4dd'), mercedesMix)
		}
		if (keyRef.current) {
			keyRef.current.color.set('#f7f7f5').lerp(new Color('#fff4e5'), mclarenMix).lerp(new Color('#dce6eb'), mercedesMix)
			keyRef.current.intensity = 2.6 + Math.sin(progress * Math.PI) * 0.3 + ferrariMix * 0.65 + redBullMix * 0.3 + mclarenMix * 0.55 + mercedesMix * 0.25 - finalQuiet * 0.24
		}
		if (scene.fog instanceof Fog) {
			scene.fog.color.copy(atmosphere)
		}
	})

	return (
		<>
			<ambientLight ref={ambientRef} intensity={0.62} />
			<hemisphereLight ref={hemisphereRef} groundColor="#050505" color="#f7f7f5" intensity={0.5} />
			<directionalLight ref={keyRef} position={[2.5, 3, 4]} intensity={2.85} color="#f7f7f5" castShadow />
			<directionalLight ref={silverFillRef} position={[-2.5, 2.2, 3.5]} intensity={0.18} color="#c6d4dd" />
			<directionalLight position={[-3, 0.5, -2]} intensity={0.42} color="#e10600" />
			<pointLight ref={redRimRef} position={[-3.5, 1.5, -3]} intensity={2.1} distance={7} color="#e10600" />
			<pointLight ref={coolRimRef} position={[3.5, 2.5, -1]} intensity={1.6} distance={8} color="#9daeff" />
		</>
	)
}

function HeroCarCanvas({ className, sceneProgress = 0 }: HeroCarCanvasProps) {
	const ferrariPresence = smoothstep(sceneProgress, 0.1, 0.16) * (1 - smoothstep(sceneProgress, 0.22, 0.28))
	const redBullPresence = smoothstep(sceneProgress, 0.28, 0.34) * (1 - smoothstep(sceneProgress, 0.4, 0.46))
	const redBullProgress = Math.min(1, Math.max(0, (sceneProgress - 0.28) / 0.18))
	const mclarenPresence = smoothstep(sceneProgress, 0.46, 0.52) * (1 - smoothstep(sceneProgress, 0.58, 0.64))
	const mclarenProgress = Math.min(1, Math.max(0, (sceneProgress - 0.46) / 0.18))
	const mercedesPresence = smoothstep(sceneProgress, 0.64, 0.7) * (1 - smoothstep(sceneProgress, 0.79, 0.82))
	const atmosphereStrength = (0.08 + ferrariPresence * 0.42 + redBullPresence * 0.16).toFixed(3)
	const canvasStyle = {
		backgroundImage: `radial-gradient(circle at ${mercedesPresence ? '62%' : mclarenPresence ? '64%' : redBullPresence > ferrariPresence ? '72%' : '68%'} 46%, rgba(${mercedesPresence ? '146, 165, 177' : mclarenPresence ? '196, 83, 25' : redBullPresence > ferrariPresence ? '20, 52, 112' : '135, 12, 23'}, ${mercedesPresence ? (0.06 + mercedesPresence * 0.11).toFixed(3) : mclarenPresence ? (0.12 + mclarenPresence * 0.28).toFixed(3) : atmosphereStrength}) 0%, rgba(${mercedesPresence ? '18, 23, 28' : mclarenPresence ? '42, 22, 15' : redBullPresence > ferrariPresence ? '7, 18, 45' : '54, 7, 13'}, ${(Number(atmosphereStrength) * 0.72).toFixed(3)}) 32%, rgba(5, 5, 5, 0) 72%), linear-gradient(112deg, #07080d 0%, ${mercedesPresence ? '#101419' : mclarenPresence ? '#21130f' : redBullPresence > ferrariPresence ? '#09142a' : '#19090d'} 48%, #050505 100%)`,
		backgroundPosition: `${50 + redBullProgress * 12 - mclarenProgress * 9}% 50%, ${50 - redBullProgress * 7 + mclarenProgress * 5}% 50%`,
	}

	return (
		<div className={`hero-car-canvas absolute inset-0 ${className ?? ''}`} style={canvasStyle} aria-label="APEX 3D machine foundation" role="img">
			<Canvas
				camera={{ fov: 34, position: [0, 0.35, 4.8] }}
				dpr={[1, 1.5]}
				gl={{ antialias: true, alpha: true }}
				frameloop="always"
				onCreated={({ gl }) => {
					gl.domElement.style.height = '100%'
					gl.domElement.style.width = '100%'
				}}
				shadows="percentage"
			>
				<HeroCarCamera sceneProgress={sceneProgress} />
				<HeroCarLighting sceneProgress={sceneProgress} />
				<fog attach="fog" args={['#111820', 6.5, 14]} />
				<ContactShadows position={[0, -0.46, 0]} opacity={0.28} scale={7} blur={2.4} far={4} />
				<HeroCar sceneProgress={sceneProgress} />
			</Canvas>
		</div>
	)
}

export default HeroCarCanvas
