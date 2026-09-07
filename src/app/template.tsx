'use client'

import { motion } from 'motion/react'

// A template remounts on every navigation, unlike the layout, so each page
// rises in with the same curve the work index uses for its row wipe.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 0.32, 0.23, 1] }}
    >
      {children}
    </motion.div>
  )
}
