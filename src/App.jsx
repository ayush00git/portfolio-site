import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HomePage from './Pages/HomePage'
import DockComp from './components/DockComp'
import ProjectPage from './Pages/ProjectPage'
import BlogPage from './Pages/BlogPage'
import Achievements from './Pages/AchievementPage'
import Immersive3D from './Pages/Immersive3D'

// heavy three.js bundles — only loaded when the route is visited
const TerminalRoom3D = lazy(() => import('./Pages/3dsite'))
const Porcelain = lazy(() => import('./Pages/Porcelain'))

function AppContent() {
  useEffect(() => {
    const lenis = new Lenis()

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return (
    <div className="relative w-screen min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/3d" element={<Immersive3D />} />
        <Route
          path="/3dsite"
          element={
            <Suspense fallback={null}>
              <TerminalRoom3D />
            </Suspense>
          }
        />
        <Route
          path="/porcelain"
          element={
            <Suspense fallback={null}>
              <Porcelain />
            </Suspense>
          }
        />
      </Routes>

      {/* Dock - persists across all pages */}
      <DockComp />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
