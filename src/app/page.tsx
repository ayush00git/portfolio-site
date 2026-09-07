import React from 'react'
import { AboutMe } from '../components/AboutMe'
import { Contributions } from '../components/Contributions'
import { getContributions } from '../lib/contributions'

export default async function Home() {
  const contributions = await getContributions()

  return (
    <main className="min-h-screen bg-black w-full flex flex-col items-center py-20 px-6 gap-12 overflow-y-auto relative selection:bg-emerald-500/30 font-sans">
      {/* Background radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      {/* Avatar Section */}
      <div className="flex flex-col items-center">
        <img
          src="/ayush.png"
          alt="Ayush"
          className="w-36 h-36 md:w-44 md:h-44 rounded-full object-cover border border-neutral-800 hover:border-neutral-500 hover:scale-105 transition-all duration-300 shadow-2xl shadow-emerald-950/20"
        />
      </div>

      {/* Bio Section */}
      <AboutMe />

      {/* GitHub contributions */}
      <Contributions data={contributions} />

      {/* Bottom spacing for fixed dock */}
      <div className="h-20" />
    </main>
  )
}
