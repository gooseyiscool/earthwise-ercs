"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface StartupAnimationProps {
  onComplete: () => void
}

export function StartupAnimation({ onComplete }: StartupAnimationProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 2800),
      setTimeout(() => onComplete(), 3500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0f14]"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Grid lines background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Central logo/icon */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative w-32 h-32">
            {/* Outer ring */}
            <motion.svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </motion.svg>
            
            {/* Inner hexagon */}
            <motion.div
              className="absolute inset-4 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <motion.polygon
                  points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                {/* Lightning bolt */}
                <motion.path
                  d="M55,25 L40,50 L52,50 L45,75 L65,45 L50,45 L55,25"
                  fill="#22d3ee"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.3 }}
                />
              </svg>
            </motion.div>

            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-wider text-cyan-400 mb-2">
            E.R.C.S.
          </h1>
          <p className="text-lg text-slate-400 tracking-widest uppercase">
            Energy Resilience Control System
          </p>
        </motion.div>

        {/* Loading status */}
        <motion.div
          className="w-80 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 2 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <SystemCheck label="Initializing Grid Monitor" active={phase >= 2} complete={phase >= 3} />
          <SystemCheck label="Loading Safety Protocols" active={phase >= 2} complete={phase >= 3} />
          <SystemCheck label="Connecting to Mine Systems" active={phase >= 3} complete={phase >= 4} />
          <SystemCheck label="Calibrating Energy Flow Sensors" active={phase >= 3} complete={phase >= 4} />
        </motion.div>

        {/* Bottom text */}
        <motion.p
          className="absolute bottom-8 text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
        >
          Kumba Iron Ore | Sishen Operations
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}

function SystemCheck({ label, active, complete }: { label: string; active: boolean; complete: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-4 h-4 relative">
        {complete ? (
          <motion.svg
            className="w-4 h-4 text-emerald-400"
            viewBox="0 0 16 16"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 8l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </motion.svg>
        ) : active ? (
          <motion.div
            className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <div className="w-4 h-4 border border-slate-600 rounded-full" />
        )}
      </div>
      <span className={complete ? "text-emerald-400" : active ? "text-cyan-400" : "text-slate-500"}>
        {label}
      </span>
    </div>
  )
}
