import React from 'react'
import type { Metadata } from 'next'
import { WorkIndex } from '../../components/WorkIndex'
import { PageView } from '../../components/PageView'

export const metadata: Metadata = {
  title: 'Ayush Kumar | Projects',
  description: 'Things Ayush Kumar has built: open source, campus services, and weekend hobby projects.',
}

export default function ProjectsPage() {
  return (
    <main className="relative min-h-screen w-full bg-black font-sans">
      <PageView event="projects" />
      <WorkIndex />
    </main>
  )
}
