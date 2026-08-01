import { useEffect } from 'react'
import { useStation } from './store'

/* 2D layer: crosshair, intro/pause card, focus hint.
   The intro card stays mounted — PointerLockControls binds its click
   handler to #t3d-enter once, so the node must never be recreated. */

export default function Hud() {
  const mode = useStation((s) => s.mode)
  const hovered = useStation((s) => s.hovered)

  // Esc steps back from the terminal (pointer is already unlocked there,
  // so the browser lets the key through)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && useStation.getState().mode === 'focus') {
        useStation.getState().setMode('intro')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* crosshair — a plus that snaps into brackets over the terminal */}
      <div className={`t3d-cross ${mode === 'walk' ? 'on' : ''} ${hovered ? 'hot' : ''}`}>
        <i className="h" />
        <i className="v" />
        <b className="c tl" />
        <b className="c tr" />
        <b className="c bl" />
        <b className="c br" />
        <span className="tag">[ OPEN TERMINAL ]</span>
      </div>

      {/* walking hint strip */}
      <div className={`t3d-strip ${mode === 'walk' ? 'on' : ''}`}>
        <span>WASD MOVE</span>
        <span>SHIFT SPRINT</span>
        <span>ESC RELEASE</span>
      </div>

      {/* focus hint */}
      <div className={`t3d-escape ${mode === 'focus' ? 'on' : ''}`}>
        ESC or `exit` — STEP BACK
      </div>

      {/* intro / pause card */}
      <div id="t3d-enter" className={`t3d-enter ${mode === 'intro' ? 'on' : ''}`}>
        <header>
          <span>AYUSH KUMAR</span>
          <span>FIRST-PERSON PORTFOLIO — BUILD 1.0.0</span>
        </header>

        <div className="mid">
          <h1>
            THE TERMINAL
            <br />
            ROOM
          </h1>
          <p>ONE ROOM. ONE MACHINE. WALK UP AND READ IT.</p>
          <div className="cta">CLICK TO ENTER</div>
        </div>

        <footer>
          <div>
            <b>W A S D</b>
            <span>MOVE</span>
          </div>
          <div>
            <b>MOUSE</b>
            <span>LOOK</span>
          </div>
          <div>
            <b>SHIFT</b>
            <span>SPRINT</span>
          </div>
          <div>
            <b>CLICK</b>
            <span>INTERACT</span>
          </div>
          <div>
            <b>ESC</b>
            <span>RELEASE</span>
          </div>
        </footer>
      </div>
    </>
  )
}
