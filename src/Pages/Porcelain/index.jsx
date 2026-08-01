import { useEffect, useRef } from 'react'
import { createPorcelainScene } from './porcelainScene'
import './porcelain.css'

export default function Porcelain() {
  const mountRef = useRef(null)

  useEffect(() => {
    const scene = createPorcelainScene(mountRef.current)
    return () => scene.dispose()
  }, [])

  return (
    <div className="pcl-root">
      <div className="pcl-canvas" ref={mountRef} />
      <div className="pcl-grain" aria-hidden="true" />

      <div className="pcl-ui">
        <header className="pcl-top">
          <div className="pcl-wordmark pcl-rise" style={{ '--d': '0.1s' }}>
            <span className="pcl-mark">porcelain</span>
            <span className="pcl-sub">kinetic study — № 01</span>
          </div>
          <div className="pcl-hint pcl-rise" style={{ '--d': '0.3s' }}>
            <span>drag — orbit</span>
            <span>press &amp; hold — bloom</span>
          </div>
        </header>

        <footer className="pcl-bottom">
          <div className="pcl-lockup pcl-rise" style={{ '--d': '0.5s' }}>
            <span className="pcl-rule" />
            <h1 className="pcl-title">
              the <em>bloom</em>
            </h1>
            <p className="pcl-caption">
              phyllotaxis · 144 petals · 233 pearls · 55 stamens · φ ≈ 137.5°
            </p>
          </div>
          <div className="pcl-colophon pcl-rise" style={{ '--d': '0.7s' }}>
            <span>white on white</span>
            <span>mmxxvi</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
