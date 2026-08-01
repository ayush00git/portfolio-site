import { Html, Grid } from '@react-three/drei'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { ROOM } from './constants'

const S = ROOM.size // 80
const H = ROOM.height // 14
const HALF = S / 2

// pillar grid — a strict lattice with the central axis kept clear
// so the sightline from spawn to the terminal is never broken
const PILLAR_XS = [-26, -13, 13, 26]
const PILLAR_ZS = [-28, -14, 0, 14, 28]
const PILLARS = PILLAR_XS.flatMap((x) => PILLAR_ZS.map((z) => [x, z]))

export default function Room() {
  return (
    <group>
      {/* ---------------- floor ---------------- */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[HALF, 0.5, HALF]} position={[0, -0.5, 0]} friction={0.9} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[S, S]} />
          <meshStandardMaterial color="#101010" roughness={1} metalness={0} />
        </mesh>
      </RigidBody>

      {/* engineered grid lines — the floor is a drawing board */}
      <Grid
        position={[0, 0.02, 0]}
        args={[S, S]}
        cellSize={2}
        cellThickness={0.6}
        cellColor="#272727"
        sectionSize={10}
        sectionThickness={1.2}
        sectionColor="#4d4d4d"
        fadeDistance={75}
        fadeStrength={1}
        followCamera={false}
      />

      {/* ---------------- perimeter walls ---------------- */}
      <RigidBody type="fixed" colliders="cuboid">
        {/* north — the terminal wall */}
        <mesh position={[0, H / 2, -HALF - 0.4]} castShadow receiveShadow>
          <boxGeometry args={[S + 1.6, H, 0.8]} />
          <meshStandardMaterial color="#9d9d9d" roughness={1} />
        </mesh>
        {/* south */}
        <mesh position={[0, H / 2, HALF + 0.4]} castShadow receiveShadow>
          <boxGeometry args={[S + 1.6, H, 0.8]} />
          <meshStandardMaterial color="#8a8a8a" roughness={1} />
        </mesh>
        {/* west */}
        <mesh position={[-HALF - 0.4, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, H, S + 1.6]} />
          <meshStandardMaterial color="#909090" roughness={1} />
        </mesh>
        {/* east */}
        <mesh position={[HALF + 0.4, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, H, S + 1.6]} />
          <meshStandardMaterial color="#909090" roughness={1} />
        </mesh>
      </RigidBody>

      {/* ---------------- ceiling slab ---------------- */}
      <mesh position={[0, H + 0.3, 0]} receiveShadow>
        <boxGeometry args={[S + 1.6, 0.6, S + 1.6]} />
        <meshStandardMaterial color="#1c1c1c" roughness={1} />
      </mesh>

      {/* coffer beams — they slice the key light into a hard grid on the floor */}
      {PILLAR_ZS.map((z) => (
        <mesh key={`bx${z}`} position={[0, H - 0.5, z]} castShadow>
          <boxGeometry args={[S, 1, 0.8]} />
          <meshStandardMaterial color="#262626" roughness={1} />
        </mesh>
      ))}
      {PILLAR_XS.map((x) => (
        <mesh key={`bz${x}`} position={[x, H - 0.5, 0]} castShadow>
          <boxGeometry args={[0.8, 1, S]} />
          <meshStandardMaterial color="#262626" roughness={1} />
        </mesh>
      ))}

      {/* light fixtures — flat white slats, deliberately unshaded */}
      {[-13, 13].map((x) => (
        <mesh key={`strip${x}`} position={[x, H - 0.65, 0]}>
          <boxGeometry args={[0.35, 0.08, S - 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* ---------------- pillar lattice ---------------- */}
      <RigidBody type="fixed" colliders="cuboid">
        {PILLARS.map(([x, z]) => (
          <mesh key={`${x}:${z}`} position={[x, H / 2, z]} castShadow receiveShadow>
            <boxGeometry args={[2.4, H, 2.4]} />
            <meshStandardMaterial color="#b6b6b6" roughness={1} />
          </mesh>
        ))}
      </RigidBody>

      {/* ---------------- wall typography ---------------- */}
      {/* south wall, read when the visitor turns around */}
      <Html
        transform
        occlude
        position={[0, 7.4, HALF - 0.5]}
        rotation={[0, Math.PI, 0]}
        distanceFactor={9}
        zIndexRange={[40, 0]}
      >
        <div className="t3d-wall t3d-wall--name">AYUSH KUMAR</div>
      </Html>

      {/* west wall */}
      <Html
        transform
        occlude
        position={[-HALF + 0.5, 7, 0]}
        rotation={[0, Math.PI / 2, 0]}
        distanceFactor={5}
        zIndexRange={[40, 0]}
      >
        <div className="t3d-wall">BACKEND — SYSTEMS — OPEN SOURCE</div>
      </Html>

      {/* east wall */}
      <Html
        transform
        occlude
        position={[HALF - 0.5, 7, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        distanceFactor={5}
        zIndexRange={[40, 0]}
      >
        <div className="t3d-wall">NIT HAMIRPUR — CSE — 2028</div>
      </Html>

      {/* over the terminal */}
      <Html
        transform
        occlude
        position={[0, 6, -HALF + 0.5]}
        distanceFactor={3}
        zIndexRange={[40, 0]}
      >
        <div className="t3d-wall t3d-wall--label">TERMINAL // 01</div>
      </Html>

      {/* floor wayfinding, stencilled like paint on concrete */}
      <Html
        transform
        occlude
        position={[0, 0.05, -26]}
        rotation={[-Math.PI / 2, 0, 0]}
        distanceFactor={2.2}
        zIndexRange={[40, 0]}
      >
        <div className="t3d-wall t3d-wall--floor">↑ TERMINAL ACCESS — SECTOR 01</div>
      </Html>
    </group>
  )
}
