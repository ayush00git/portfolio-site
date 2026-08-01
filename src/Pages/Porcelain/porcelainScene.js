import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

// PORCELAIN — a kinetic study in white.
// One hundred forty-four parametric petals choreographed through four
// scroll-driven formations — bloom, scatter, helix, mandala — inside an
// infinite white void, with a gilded core, chrome orbits and a pearl swarm.

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)) // ≈ 137.507°
const PETALS = 144
const PEARLS = 233
const STAMENS = 55
const SEGMENTS = 3 // transitions between the 4 formations

// ---------------------------------------------------------------------------
// geometry

function buildPetalGeometry(segU = 26, segV = 10) {
  // A cupped, curling petal. u runs root → tip, v runs edge → edge.
  const positions = []
  const uvs = []
  const indices = []
  const curl = 1.05 // total spine bend, radians
  const R = 1 / curl
  const cup = 0.2

  for (let i = 0; i <= segU; i++) {
    const u = i / segU
    const theta = curl * Math.pow(u, 1.18)
    const spineY = R * Math.sin(theta)
    const spineZ = R * (1 - Math.cos(theta))
    const width = Math.pow(Math.sin(Math.PI * u), 0.75) * 0.32
    for (let j = 0; j <= segV; j++) {
      const v = (j / segV) * 2 - 1
      const x = v * width
      const z =
        spineZ -
        cup * v * v * Math.sin(Math.PI * u) + // concave cradle toward the axis
        0.012 * Math.sin(v * 9.4) * u * u // faint ruffle near the tip
      positions.push(x, spineY, z)
      uvs.push(u, (v + 1) / 2)
    }
  }
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segV; j++) {
      const a = i * (segV + 1) + j
      const b = a + segV + 1
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

function makeContactShadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(44,50,68,0.40)')
  g.addColorStop(0.45, 'rgba(44,50,68,0.14)')
  g.addColorStop(1, 'rgba(44,50,68,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const smoothstep = (x) => x * x * (3 - 2 * x)
const lerp = THREE.MathUtils.lerp
const clamp = THREE.MathUtils.clamp

// ---------------------------------------------------------------------------

export function createPorcelainScene(container) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.VSMShadowMap
  // pan-y so vertical touch still scrolls the story; horizontal drags orbit
  renderer.domElement.style.touchAction = 'pan-y'
  renderer.domElement.style.display = 'block'
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  scene.fog = new THREE.Fog(0xffffff, 10, 18)

  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  pmrem.dispose()

  const camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / container.clientHeight,
    0.1,
    60
  )

  // --- lights -------------------------------------------------------------

  scene.add(new THREE.HemisphereLight(0xffffff, 0xe9e5de, 0.55))

  const key = new THREE.DirectionalLight(0xffffff, 2.0)
  key.position.set(5, 8, 3)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.camera.near = 2
  key.shadow.camera.far = 24
  key.shadow.camera.left = -5
  key.shadow.camera.right = 5
  key.shadow.camera.top = 5
  key.shadow.camera.bottom = -5
  key.shadow.radius = 14
  key.shadow.blurSamples = 18
  key.shadow.bias = -0.0004
  scene.add(key)

  const fill = new THREE.DirectionalLight(0xffffff, 0.5)
  fill.position.set(-4, 3, -4)
  scene.add(fill)

  // --- materials ----------------------------------------------------------

  const petalMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.36,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.32,
    iridescence: 0.55,
    iridescenceIOR: 1.32,
    iridescenceThicknessRange: [120, 420],
    sheen: 0.4,
    sheenColor: new THREE.Color(0xdfe6ff),
    sheenRoughness: 0.6,
    envMapIntensity: 0.9,
    side: THREE.DoubleSide,
  })

  const pearlMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    iridescence: 1,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [100, 500],
    envMapIntensity: 1.3,
  })

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf2f3f5,
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 1.4,
  })

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd9b36a,
    metalness: 1,
    roughness: 0.28,
    envMapIntensity: 1.2,
  })

  // --- ground -------------------------------------------------------------

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.ShadowMaterial({ color: 0x404a63, opacity: 0.13 })
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  const contact = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
      map: makeContactShadowTexture(),
      transparent: true,
      depthWrite: false,
    })
  )
  contact.rotation.x = -Math.PI / 2
  contact.position.y = 0.004
  scene.add(contact)

  // drafting circles — a quiet technical motif on the floor
  for (const [r, opacity] of [
    [2.3, 0.07],
    [3.05, 0.05],
  ]) {
    const circle = new THREE.Mesh(
      new THREE.RingGeometry(r, r + 0.012, 160),
      new THREE.MeshBasicMaterial({
        color: 0x262a33,
        transparent: true,
        opacity,
        depthWrite: false,
      })
    )
    circle.rotation.x = -Math.PI / 2
    circle.position.y = 0.006
    scene.add(circle)
  }

  // --- the petals and their four formations ---------------------------------

  const bloom = new THREE.Group()
  bloom.position.y = 1.18
  scene.add(bloom)

  const petalGeo = buildPetalGeometry()
  const petals = new THREE.InstancedMesh(petalGeo, petalMat, PETALS)
  petals.castShadow = true
  petals.frustumCulled = false
  bloom.add(petals)

  const eulerTmp = new THREE.Euler(0, 0, 0, 'YXZ')
  const makeQuat = (pitch, yaw, roll) =>
    new THREE.Quaternion().setFromEuler(eulerTmp.set(pitch, yaw, roll))

  const petalData = []
  for (let i = 0; i < PETALS; i++) {
    const n = i / (PETALS - 1)
    const angle = i * GOLDEN_ANGLE

    // № 02 — the scatter: a loose tumbling shell
    const sa = Math.random() * Math.PI * 2
    const sr = 1.8 + 1.6 * Math.random()
    const scatter = {
      pos: new THREE.Vector3(
        Math.cos(sa) * sr,
        -0.7 + Math.random() * 2.4,
        Math.sin(sa) * sr
      ),
      quat: new THREE.Quaternion().random(),
      scale: 0.45 + 0.3 * Math.random(),
    }

    // № 03 — the helix: the same golden angle, stacked into a column
    const helix = {
      pos: new THREE.Vector3(Math.sin(angle) * 0.85, 0.15 + 3.4 * n, Math.cos(angle) * 0.85),
      quat: makeQuat(0.95, angle, 0.06 * Math.sin(i * 2.1)),
      scale: 0.46,
    }

    // № 04 — the mandala: a flat rosette, read from above
    const mr = 0.3 + 2.3 * Math.sqrt(n)
    const mandala = {
      pos: new THREE.Vector3(Math.sin(angle) * mr, 0.02 * (i % 3), Math.cos(angle) * mr),
      quat: makeQuat(1.45, angle, 0),
      scale: 0.4 + 0.45 * n,
    }

    petalData.push({
      angle,
      basePitch: 0.12 + 1.32 * Math.pow(n, 0.9),
      radius: 0.045 + 0.34 * Math.pow(n, 0.95),
      height: 0.14 * (1 - n),
      scale: 0.34 + 0.78 * Math.pow(n, 0.7),
      twist: 0.06 * Math.sin(i * 2.1),
      seed: i * 1.7,
      stagger: (i * 0.61803) % 1,
      spinAxis: new THREE.Vector3().randomDirection(),
      spinSpeed: 0.3 + Math.random() * 0.5,
      forms: [null, scatter, helix, mandala], // [0] = live bloom, computed per frame
    })
  }

  // gilded core: one large bead and a cluster of stamens
  const stamens = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 12, 9),
    goldMat,
    STAMENS
  )
  stamens.frustumCulled = false
  {
    const m = new THREE.Object3D()
    for (let i = 0; i < STAMENS; i++) {
      if (i === 0) {
        m.position.set(0, 0.1, 0)
        m.scale.setScalar(0.085)
      } else {
        const a = Math.random() * Math.PI * 2
        const r = 0.17 * Math.sqrt(Math.random())
        m.position.set(Math.cos(a) * r, 0.05 + Math.random() * 0.13, Math.sin(a) * r)
        m.scale.setScalar(0.016 + Math.random() * 0.014)
      }
      m.updateMatrix()
      stamens.setMatrixAt(i, m.matrix)
    }
    stamens.instanceMatrix.needsUpdate = true
  }
  bloom.add(stamens)

  // --- chrome orbits ---------------------------------------------------------

  const orbits = new THREE.Group()
  orbits.position.y = 1.22
  scene.add(orbits)

  const rings = [1.75, 2.1, 2.5].map((r, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.009, 12, 220), chromeMat)
    ring.castShadow = true
    ring.userData = {
      tilt: 0.45 + i * 0.35,
      precess: 0.05 + i * 0.045,
      spin: 0.1 + i * 0.05,
      phase: i * 2.1,
    }
    orbits.add(ring)
    return ring
  })

  // per-formation ring states: height, flatness (0 = free precession,
  // 1 = horizontal hoop) and radial scale
  const RING_Y = [
    [0, 0, 0],
    [0, 0, 0],
    [0.8, 1.9, 3.0],
    [0.02, 0.05, 0.08],
  ]
  const RING_FLAT = [0, 0.35, 1, 1]
  const RING_SCALE = [
    [1, 1, 1],
    [1, 1, 1],
    [0.62, 0.62, 0.62],
    [1.2, 1.35, 1.5],
  ]

  // --- pearl swarm -------------------------------------------------------------

  const pearls = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 14, 11),
    pearlMat,
    PEARLS
  )
  pearls.frustumCulled = false
  pearls.position.y = 1.22
  scene.add(pearls)

  const pearlData = []
  const Y_AXIS = new THREE.Vector3(0, 1, 0)
  for (let i = 0; i < PEARLS; i++) {
    const normal = new THREE.Vector3(
      (Math.random() - 0.5) * 0.8,
      1,
      (Math.random() - 0.5) * 0.8
    ).normalize()
    const u = new THREE.Vector3().crossVectors(normal, Y_AXIS)
    if (u.lengthSq() < 1e-4) u.set(1, 0, 0)
    u.normalize()
    const v = new THREE.Vector3().crossVectors(normal, u)
    const radius = 1.8 + 1.6 * Math.pow(Math.random(), 0.8)
    pearlData.push({
      u,
      v,
      normal,
      radius,
      phase: Math.random() * Math.PI * 2,
      speed: ((0.14 + Math.random() * 0.22) * 1.9) / Math.pow(radius, 0.8),
      bobSpeed: 0.4 + Math.random() * 0.8,
      size:
        Math.random() < 0.08
          ? 0.04 + Math.random() * 0.025
          : 0.01 + Math.random() * 0.022,
    })
  }

  // --- bloom pulse rings (spawned on release) -----------------------------------

  const pulsePool = Array.from({ length: 4 }, () => {
    const mesh = new THREE.Mesh(
      new THREE.RingGeometry(0.985, 1, 96),
      new THREE.MeshBasicMaterial({
        color: 0xc9b27e,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      })
    )
    mesh.rotation.x = -Math.PI / 2
    mesh.position.y = 0.01
    mesh.visible = false
    scene.add(mesh)
    return { mesh, t0: -1 }
  })

  function spawnPulse(now) {
    const slot = pulsePool.find((p) => !p.mesh.visible) || pulsePool[0]
    slot.t0 = now
    slot.mesh.visible = true
  }

  // --- camera chapters -----------------------------------------------------------

  // radius, polar angle, look-at height — one per formation
  const CAMS = [
    { rad: 6.5, pol: 1.12, ty: 1.25 },
    { rad: 9.0, pol: 1.22, ty: 1.45 },
    { rad: 7.4, pol: 1.32, ty: 2.7 },
    { rad: 8.2, pol: 0.34, ty: 1.15 },
  ]
  const POL_MIN = 0.22
  const POL_MAX = 1.5

  const state = {
    az: 0.6,
    azUser: 0,
    azUserT: 0,
    polOff: 0,
    polOffT: 0,
    rad: 7.4,
    pax: 0,
    pay: 0,
    nx: 0,
    ny: 0,
    open: 0.3,
    energy: 0,
    scroll: 0,
    down: false,
    dragging: false,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
  }

  // --- input -----------------------------------------------------------------------

  const el = renderer.domElement
  el.style.cursor = 'grab'

  function onPointerDown(e) {
    state.down = true
    state.dragging = false
    state.startX = state.lastX = e.clientX
    state.startY = state.lastY = e.clientY
    el.setPointerCapture?.(e.pointerId)
  }

  function onPointerMove(e) {
    const rect = container.getBoundingClientRect()
    state.nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
    state.ny = ((e.clientY - rect.top) / rect.height) * 2 - 1

    if (!state.down) return
    const dx = e.clientX - state.lastX
    const dy = e.clientY - state.lastY
    state.lastX = e.clientX
    state.lastY = e.clientY
    if (
      Math.abs(e.clientX - state.startX) + Math.abs(e.clientY - state.startY) > 7
    ) {
      state.dragging = true
      el.style.cursor = 'grabbing'
    }
    if (state.dragging) {
      state.azUserT -= dx * 0.0045
      // vertical drag nudges the polar angle; it relaxes back to the chapter
      state.polOffT = clamp(state.polOffT - dy * 0.0028, -0.3, 0.3)
    }
  }

  function onPointerUp() {
    if (state.down && !state.dragging && state.open > 0.8) {
      spawnPulse(clock.elapsedTime)
    }
    state.down = false
    state.dragging = false
    el.style.cursor = 'grab'
  }

  el.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)

  // --- frame loop ---------------------------------------------------------------------

  const dummy = new THREE.Object3D()
  const posA = new THREE.Vector3()
  const quatA = new THREE.Quaternion()
  const quatB = new THREE.Quaternion()
  const quatSpin = new THREE.Quaternion()
  const clock = new THREE.Clock()
  const damp = (cur, tgt, lambda, dt) => cur + (tgt - cur) * (1 - Math.exp(-lambda * dt))
  const driftSpeed = reduceMotion ? 0 : 0.04
  const breathAmp = reduceMotion ? 0.03 : 0.08

  function readScroll() {
    const doc = document.scrollingElement || document.documentElement
    const max = doc.scrollHeight - window.innerHeight
    return max > 0 ? clamp(window.scrollY / max, 0, 1) : 0
  }

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05)
    const t = clock.elapsedTime

    state.scroll = damp(state.scroll, readScroll(), 5, dt)
    const s = state.scroll * SEGMENTS
    const seg = Math.min(Math.floor(s), SEGMENTS - 1)
    const f = clamp(s - seg, 0, 1)
    const fe = smoothstep(f)
    // weight of the scatter formation in the current blend, for tumble
    const scatterW = seg === 0 ? fe : seg === 1 ? 1 - fe : 0

    // openness: resting breath, full bloom while held
    const holding = state.down && !state.dragging
    const rest = 0.42 + breathAmp * Math.sin(t * 0.55)
    state.open = damp(state.open, holding ? 1 : rest, holding ? 2.2 : 1.4, dt)
    state.energy = damp(state.energy, holding ? 1 : 0, 2, dt)

    // carriage
    bloom.position.y = 1.18 + 0.06 * Math.sin(t * 0.6)
    bloom.rotation.y = t * 0.07
    bloom.rotation.z = 0.04 * Math.sin(t * 0.4) * (1 - state.scroll)

    // petals — blend between the two formations of the current segment,
    // each petal slightly out of step so transitions cascade
    const openFactor = 0.3 + 0.7 * state.open
    const STAG = 0.35
    for (let i = 0; i < PETALS; i++) {
      const p = petalData[i]
      const fi = smoothstep(clamp((f * (1 + STAG) - p.stagger * STAG) / 1, 0, 1))

      // endpoint "from"
      if (seg === 0) {
        // live bloom, breathing and reacting to the hold
        posA.set(
          Math.sin(p.angle) * p.radius,
          p.height,
          Math.cos(p.angle) * p.radius
        )
        quatA.setFromEuler(
          eulerTmp.set(
            p.basePitch * openFactor + 0.03 * Math.sin(t * 1.1 + p.seed),
            p.angle,
            p.twist
          )
        )
        var scaleFrom = p.scale * (0.97 + 0.05 * state.open)
      } else {
        const F = p.forms[seg]
        posA.copy(F.pos)
        quatA.copy(F.quat)
        scaleFrom = F.scale
      }

      // endpoint "to"
      const G = p.forms[seg + 1]
      dummy.position.lerpVectors(posA, G.pos, fi)
      quatB.copy(G.quat)
      dummy.quaternion.slerpQuaternions(quatA, quatB, fi)

      // slow individual tumble while scattered
      if (scatterW > 0.001) {
        quatSpin.setFromAxisAngle(p.spinAxis, t * p.spinSpeed * scatterW)
        dummy.quaternion.multiply(quatSpin)
      }

      dummy.scale.setScalar(lerp(scaleFrom, G.scale, fi))
      dummy.updateMatrix()
      petals.setMatrixAt(i, dummy.matrix)
    }
    petals.instanceMatrix.needsUpdate = true

    // pearls — kepler-ish tilted orbits, agitated by holds and the scatter
    const speedMult =
      (reduceMotion ? 0.4 : 1) * (1 + 0.9 * state.energy + 0.8 * scatterW)
    dummy.rotation.set(0, 0, 0)
    for (let i = 0; i < PEARLS; i++) {
      const p = pearlData[i]
      const a = p.phase + t * p.speed * speedMult
      const bob = Math.sin(t * p.bobSpeed + p.phase) * 0.08
      dummy.position
        .copy(p.u)
        .multiplyScalar(Math.cos(a) * p.radius)
        .addScaledVector(p.v, Math.sin(a) * p.radius)
        .addScaledVector(p.normal, bob)
      dummy.scale.setScalar(p.size)
      dummy.updateMatrix()
      pearls.setMatrixAt(i, dummy.matrix)
    }
    pearls.instanceMatrix.needsUpdate = true
    pearls.rotation.y = t * 0.02

    // chrome orbits — free precession that locks into horizontal hoops
    for (let i = 0; i < rings.length; i++) {
      const ring = rings[i]
      const d = ring.userData
      const sp = 1 + 0.8 * state.energy
      const flat = lerp(RING_FLAT[seg], RING_FLAT[seg + 1], fe)
      quatA.setFromEuler(
        eulerTmp.set(
          d.tilt + 0.25 * Math.sin(t * d.precess * sp + d.phase),
          t * d.spin * sp,
          0.18 * Math.sin(t * d.precess * 0.7 * sp + d.phase * 2)
        )
      )
      quatB.setFromEuler(eulerTmp.set(Math.PI / 2, 0, t * d.spin * 0.4 + d.phase))
      ring.quaternion.slerpQuaternions(quatA, quatB, flat)
      ring.position.y = lerp(RING_Y[seg][i], RING_Y[seg + 1][i], fe)
      ring.scale.setScalar(lerp(RING_SCALE[seg][i], RING_SCALE[seg + 1][i], fe))
    }

    // pulse rings
    for (const p of pulsePool) {
      if (!p.mesh.visible) continue
      const age = (t - p.t0) / 1.4
      if (age >= 1) {
        p.mesh.visible = false
        p.mesh.material.opacity = 0
        continue
      }
      const eased = 1 - Math.pow(1 - age, 2.2)
      p.mesh.scale.setScalar(0.8 + 4.6 * eased)
      p.mesh.material.opacity = 0.3 * Math.pow(1 - age, 1.8)
    }

    // camera — chapter framing + slow drift, drag and pointer parallax
    state.azUser = damp(state.azUser, state.azUserT, 4, dt)
    state.polOffT = damp(state.polOffT, 0, 0.4, dt) // drag offset relaxes home
    state.polOff = damp(state.polOff, state.polOffT, 4, dt)
    state.pax = damp(state.pax, state.nx * 0.07, 2.5, dt)
    state.pay = damp(state.pay, state.ny * 0.05, 2.5, dt)

    const camRad = lerp(CAMS[seg].rad, CAMS[seg + 1].rad, fe) - 0.7 * state.energy
    const camPol = lerp(CAMS[seg].pol, CAMS[seg + 1].pol, fe)
    const camTy = lerp(CAMS[seg].ty, CAMS[seg + 1].ty, fe)
    state.rad = damp(state.rad, camRad, 2, dt)

    const az =
      t * driftSpeed + state.scroll * 2.4 + state.azUser + state.pax + 0.6
    const pol = clamp(camPol + state.polOff + state.pay, POL_MIN, POL_MAX)
    camera.position.set(
      state.rad * Math.sin(pol) * Math.sin(az),
      camTy + state.rad * Math.cos(pol),
      state.rad * Math.sin(pol) * Math.cos(az)
    )
    camera.lookAt(0, camTy, 0)

    renderer.render(scene, camera)
  }

  renderer.setAnimationLoop(frame)

  // --- resize / dispose ------------------------------------------------------------------

  const resizeObserver = new ResizeObserver(() => {
    const w = container.clientWidth
    const h = container.clientHeight
    if (!w || !h) return
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  })
  resizeObserver.observe(container)

  function dispose() {
    renderer.setAnimationLoop(null)
    resizeObserver.disconnect()
    el.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
    scene.traverse((obj) => {
      obj.geometry?.dispose?.()
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((m) => {
          m.map?.dispose?.()
          m.dispose()
        })
      }
    })
    scene.environment?.dispose?.()
    renderer.dispose()
    el.remove()
  }

  return { dispose }
}
