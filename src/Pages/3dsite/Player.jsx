import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { PointerLockControls, useKeyboardControls } from '@react-three/drei'
import { RigidBody, CapsuleCollider } from '@react-three/rapier'
import { useStation } from './store'
import { SPAWN, FOCUS_ANCHOR } from './constants'

const WALK_SPEED = 6.5
const SPRINT_SPEED = 11.5
const EYE_HEIGHT = 0.9 // camera height above the capsule centre

// scratch vectors — allocated once, reused every frame
const camDir = new THREE.Vector3()
const camRight = new THREE.Vector3()
const move = new THREE.Vector3()
const UP = new THREE.Vector3(0, 1, 0)

export default function Player() {
  const body = useRef(null)
  const controls = useRef(null)
  const [, getKeys] = useKeyboardControls()
  const setMode = useStation((s) => s.setMode)

  // pointer-lock <-> mode wiring. Locking starts the walk; the browser's
  // native Esc-unlock drops back to the intro card — unless we unlocked on
  // purpose to dock at the terminal.
  useEffect(() => {
    const c = controls.current
    if (!c) return
    const onLock = () => {
      if (useStation.getState().mode !== 'focus') setMode('walk')
    }
    const onUnlock = () => {
      if (useStation.getState().mode === 'walk') setMode('intro')
    }
    c.addEventListener('lock', onLock)
    c.addEventListener('unlock', onUnlock)
    return () => {
      c.removeEventListener('lock', onLock)
      c.removeEventListener('unlock', onUnlock)
    }
  }, [setMode])

  // clicking while the crosshair is on the terminal docks the camera
  useEffect(() => {
    const onDown = () => {
      const s = useStation.getState()
      if (s.mode === 'walk' && s.hovered && document.pointerLockElement) {
        s.setMode('focus')
        controls.current?.unlock()
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // stepping back from the terminal: stand the body up where the camera is,
  // so the walk resumes from the terminal instead of teleporting backwards
  useEffect(() => {
    const unsub = useStation.subscribe((s, prev) => {
      if (prev.mode === 'focus' && s.mode !== 'focus') {
        body.current?.setTranslation(
          { x: FOCUS_ANCHOR[0], y: 1.4, z: FOCUS_ANCHOR[2] + 0.6 },
          true
        )
        body.current?.setLinvel({ x: 0, y: 0, z: 0 }, true)
      }
    })
    return unsub
  }, [])

  useFrame((state) => {
    const rb = body.current
    if (!rb) return
    const vel = rb.linvel()

    if (useStation.getState().mode === 'focus') {
      // frozen at the terminal — Terminal.jsx drives the camera
      rb.setLinvel({ x: 0, y: vel.y, z: 0 }, true)
      return
    }

    // first-person camera rides the capsule
    const pos = rb.translation()
    state.camera.position.set(pos.x, pos.y + EYE_HEIGHT, pos.z)

    // WASD relative to where the camera looks, flattened onto the floor plane
    const { forward, backward, left, right, sprint } = getKeys()
    state.camera.getWorldDirection(camDir)
    camDir.y = 0
    camDir.normalize()
    camRight.crossVectors(camDir, UP)

    move
      .set(0, 0, 0)
      .addScaledVector(camDir, Number(forward) - Number(backward))
      .addScaledVector(camRight, Number(right) - Number(left))
    if (move.lengthSq() > 0) move.normalize()

    const speed = sprint ? SPRINT_SPEED : WALK_SPEED
    rb.setLinvel({ x: move.x * speed, y: vel.y, z: move.z * speed }, true)
  })

  return (
    <>
      {/* lock is triggered by clicking the intro overlay (#t3d-enter) */}
      <PointerLockControls ref={controls} selector="#t3d-enter" />

      <RigidBody
        ref={body}
        position={SPAWN}
        colliders={false}
        mass={80}
        enabledRotations={[false, false, false]}
        canSleep={false}
        ccd
      >
        {/* args = [half-height, radius] → a 2 m tall capsule */}
        <CapsuleCollider args={[0.55, 0.45]} friction={0} />
      </RigidBody>
    </>
  )
}
