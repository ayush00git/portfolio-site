import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Lenis from 'lenis'
import HomePage from './Pages/HomePage'
import DockComp from './components/DockComp'
import ProjectPage from './Pages/ProjectPage'
import BlogPage from './Pages/BlogPage'
import Achievements from './Pages/AchievementPage'
import YapsPage from './Pages/YapsPage'

function AppContent() {
  useEffect(() => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="relative w-screen min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/blogs" element={<BlogPage />} />
        <Route path="/yaps" element={<YapsPage />} />
        <Route path="/achievements" element={<Achievements />} />
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
