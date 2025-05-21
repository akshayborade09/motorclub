"use client"

import { RotateCcw } from "lucide-react"
import { motion } from "framer-motion"

export function OrientationMessage() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 z-50">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 90 }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          duration: 1.5,
          ease: "easeInOut",
        }}
        className="mb-8 text-indigo-700"
      >
        <RotateCcw size={64} />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">Please rotate your device</h2>

      <p className="text-gray-600 text-center max-w-xs">Open the app in portrait mode for the best experience</p>
    </div>
  )
}
