import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import DockComp from './components/DockComp'

function AppContent() {
  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<div className="flex items-center justify-center h-screen bg-[#0D1117] text-white text-4xl">Projects Page</div>} />
        <Route path="/spotify" element={<div className="flex items-center justify-center h-screen bg-[#0D1117] text-white text-4xl">Spotify Page</div>} />
        <Route path="/yaps" element={<div className="flex items-center justify-center h-screen bg-[#0D1117] text-white text-4xl">Yaps Page</div>} />
        <Route path="/random" element={<div className="flex items-center justify-center h-screen bg-[#0D1117] text-white text-4xl">Random Page</div>} />
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
