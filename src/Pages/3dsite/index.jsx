import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Player from './Player'
import Room from './Room'
import Terminal from './Terminal'
import Hud from './Hud'
import { SPAWN } from './constants'
import './styles.css'

/* THE TERMINAL ROOM — a brutalist first-person portfolio.
   One enclosed concrete hall, one machine. No gradients, no bloom,
   no post-processing: flat tonemapping + BasicShadowMap for hard,
   pixel-edged shadows. Monochrome only. */

const KEYMAP = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'right', keys: ['KeyD', 'ArrowRight'] },
  { name: 'sprint', keys: ['ShiftLeft', 'ShiftRight'] },
]

export default function TerminalRoom3D() {
  return (
    <div className="t3d">
      <KeyboardControls map={KEYMAP}>
        <Canvas
          shadows="basic" /* BasicShadowMap → razor-hard shadow edges */
          flat /* no tone mapping → uncompromised contrast */
          dpr={[1, 1.75]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ fov: 78, near: 0.1, far: 220, position: [SPAWN[0], SPAWN[1] + 0.9, SPAWN[2]] }}
        >
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 45, 115]} />

          {/* one hard key light + a whisper of fill. nothing soft. */}
          <ambientLight intensity={0.22} />
          <directionalLight
            castShadow
            position={[18, 12.5, 10]}
            intensity={2.6}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-55}
            shadow-camera-right={55}
            shadow-camera-top={55}
            shadow-camera-bottom={-55}
            shadow-camera-near={0.5}
            shadow-camera-far={120}
            shadow-bias={-0.0003}
          />
          <directionalLight position={[-16, 9, -12]} intensity={0.35} />

          <Suspense fallback={null}>
            <Physics gravity={[0, -30, 0]}>
              <Player />
              <Room />
              <Terminal />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>

      <Hud />
    </div>
  )
}
