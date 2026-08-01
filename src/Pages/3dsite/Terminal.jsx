import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import { useStation } from './store'
import { TERMINAL_POS, FOCUS_ANCHOR } from './constants'
import TerminalUI from './TerminalUI'

// crosshair raycast — always fired from the exact centre of the view,
// independent of where the OS cursor happens to be parked while locked
const raycaster = new THREE.Raycaster()
raycaster.far = 8.5 // interaction range in metres
const aim = new THREE.Vector3()

const anchor = new THREE.Vector3(...FOCUS_ANCHOR)
// the screen faces +z and the anchor sits on its axis, so "look straight
// at the screen" is exactly the identity orientation (camera default: -z)
const FACE_SCREEN = new THREE.Quaternion()

export default function Terminal() {
  const hitbox = useRef(null)

  useFrame(({ camera }, delta) => {
    const s = useStation.getState()

    if (s.mode === 'walk') {
      camera.getWorldDirection(aim)
      raycaster.set(camera.position, aim)
      const hit = hitbox.current
        ? raycaster.intersectObject(hitbox.current, false).length > 0
        : false
      if (hit !== s.hovered) s.setHovered(hit)
    } else if (s.hovered) {
      s.setHovered(false)
    }

    if (s.mode === 'focus') {
      // critically-damped snap to the reading position — no springs, no bounce
      const t = 1 - Math.exp(-5.5 * delta)
      camera.position.lerp(anchor, t)
      camera.quaternion.slerp(FACE_SCREEN, t)
    }
  })

  return (
    <group position={TERMINAL_POS}>
      {/* concrete monolith + base slab (solid, walkable-into) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 3.6, 0.8]} />
          <meshStandardMaterial color="#0d0d0d" roughness={1} />
        </mesh>
        <mesh position={[0, 0.125, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.6, 0.25, 1.8]} />
          <meshStandardMaterial color="#d4d4d4" roughness={1} />
        </mesh>
      </RigidBody>

      {/* hard white bezel — a single flat frame, no glow */}
      <mesh position={[0, 2.05, 0.401]}>
        <planeGeometry args={[2.86, 1.76]} />
        <meshBasicMaterial color="#f4f4f4" />
      </mesh>

      {/* dead screen glass behind the DOM terminal */}
      <mesh position={[0, 2.05, 0.408]}>
        <planeGeometry args={[2.7, 1.6]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* live bash — 1080×640 px ≙ 2.7×1.6 world units (px × distanceFactor / 400) */}
      <Html
        transform
        position={[0, 2.05, 0.42]}
        distanceFactor={1}
        zIndexRange={[50, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <TerminalUI />
      </Html>

      {/* invisible, slightly inflated raycast target */}
      <mesh ref={hitbox} position={[0, 1.9, 0.1]} visible={false}>
        <boxGeometry args={[3.7, 4, 1.4]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  )
}
