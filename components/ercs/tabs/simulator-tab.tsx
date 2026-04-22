"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Factory,
  Train,
  Gauge,
} from "lucide-react"

interface SimulatorTabProps {
  scenario: "stable" | "warning" | "critical"
  onScenarioChange: (scenario: "stable" | "warning" | "critical") => void
}

interface SystemNode {
  id: string
  name: string
  icon: React.ReactNode
  baseVoltage: number
  baseLoad: number
  baseFrequency: number
}

export function SimulatorTab({ scenario, onScenarioChange }: SimulatorTabProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0) // 0-100, maps to stable-warning-critical
  const [systemNodes, setSystemNodes] = useState<SystemNode[]>([
    { id: "eskom", name: "Eskom Grid", icon: <Zap className="w-5 h-5" />, baseVoltage: 132, baseLoad: 78, baseFrequency: 50.0 },
    { id: "distribution", name: "Distribution Hub", icon: <Gauge className="w-5 h-5" />, baseVoltage: 33, baseLoad: 75, baseFrequency: 50.0 },
    { id: "sishen", name: "Sishen Mine", icon: <Factory className="w-5 h-5" />, baseVoltage: 11, baseLoad: 82, baseFrequency: 50.0 },
    { id: "kolomela", name: "Kolomela Mine", icon: <Factory className="w-5 h-5" />, baseVoltage: 11, baseLoad: 68, baseFrequency: 50.0 },
    { id: "processing", name: "Processing Plant", icon: <Factory className="w-5 h-5" />, baseVoltage: 6.6, baseLoad: 72, baseFrequency: 50.0 },
    { id: "rail", name: "Rail Corridor", icon: <Train className="w-5 h-5" />, baseVoltage: 3.3, baseLoad: 45, baseFrequency: 50.0 },
  ])

  // Calculate fluctuating values based on progress
  const getNodeValues = useCallback((node: SystemNode, progressValue: number) => {
    const severity = progressValue / 100 // 0 to 1
    const randomFactor = 1 + (Math.random() - 0.5) * 0.1 // +/- 5% random fluctuation
    
    const voltageDropFactor = 1 - (severity * 0.15) // Up to 15% drop at critical
    const loadIncreaseFactor = 1 + (severity * 0.25) // Up to 25% increase at critical
    const frequencyDropFactor = 1 - (severity * 0.025) // Up to 2.5% drop at critical (50Hz -> 48.75Hz)

    return {
      voltage: (node.baseVoltage * voltageDropFactor * randomFactor).toFixed(1),
      load: Math.min(100, Math.round(node.baseLoad * loadIncreaseFactor * randomFactor)),
      frequency: (node.baseFrequency * frequencyDropFactor * randomFactor).toFixed(1),
    }
  }, [])

  // Auto-update values when running
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSystemNodes(prev => [...prev]) // Force re-render to update fluctuating values
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  // Sync scenario with progress
  useEffect(() => {
    if (progress < 33) {
      onScenarioChange("stable")
    } else if (progress < 66) {
      onScenarioChange("warning")
    } else {
      onScenarioChange("critical")
    }
  }, [progress, onScenarioChange])

  const handleProgressChange = (value: number) => {
    setProgress(value)
  }

  const handleRunSimulation = () => {
    if (isRunning) {
      setIsRunning(false)
    } else {
      setIsRunning(true)
      // Auto-advance progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsRunning(false)
            clearInterval(interval)
            return 100
          }
          return prev + 1
        })
      }, 100)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setProgress(0)
  }

  const getStatusColor = (progressValue: number) => {
    if (progressValue < 33) return "emerald"
    if (progressValue < 66) return "amber"
    return "red"
  }

  const getStatusLabel = (progressValue: number) => {
    if (progressValue < 33) return "STABLE"
    if (progressValue < 66) return "WARNING"
    return "CRITICAL"
  }

  const getNodeStatus = (nodeIndex: number, progressValue: number) => {
    // Ripple effect: nodes further down the chain are affected later
    const effectiveProgress = Math.max(0, progressValue - (nodeIndex * 10))
    if (effectiveProgress < 33) return "stable"
    if (effectiveProgress < 66) return "warning"
    return "critical"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Energy Cascade Simulator</h2>
          <p className="text-sm text-slate-500">Simulate grid instability propagation across the system</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleRunSimulation}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              isRunning
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-cyan-500 text-slate-900 hover:bg-cyan-400"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {progress > 0 ? "Resume" : "Run Simulation"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar Section */}
      <motion.div
        className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-300">Grid Stability Index</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
            getStatusColor(progress) === "emerald" ? "bg-emerald-500/20 text-emerald-400" :
            getStatusColor(progress) === "amber" ? "bg-amber-500/20 text-amber-400" :
            "bg-red-500/20 text-red-400"
          }`}>
            {getStatusLabel(progress)}
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="relative mb-6">
          <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full transition-colors duration-300 ${
                getStatusColor(progress) === "emerald" ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                getStatusColor(progress) === "amber" ? "bg-gradient-to-r from-emerald-500 via-amber-500 to-amber-400" :
                "bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
              }`}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Markers */}
          <div className="absolute top-0 left-0 right-0 h-4 flex">
            <div className="w-1/3 border-r border-slate-600 relative">
              <span className="absolute -bottom-6 right-0 transform translate-x-1/2 text-[10px] text-emerald-400">STABLE</span>
            </div>
            <div className="w-1/3 border-r border-slate-600 relative">
              <span className="absolute -bottom-6 right-0 transform translate-x-1/2 text-[10px] text-amber-400">WARNING</span>
            </div>
            <div className="w-1/3 relative">
              <span className="absolute -bottom-6 right-0 text-[10px] text-red-400">CRITICAL</span>
            </div>
          </div>
        </div>

        {/* Slider Control */}
        <div className="mt-10">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => handleProgressChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, 
                rgb(34, 197, 94) 0%, 
                rgb(34, 197, 94) 33%, 
                rgb(245, 158, 11) 33%, 
                rgb(245, 158, 11) 66%, 
                rgb(239, 68, 68) 66%, 
                rgb(239, 68, 68) 100%)`
            }}
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>0%</span>
            <span>Grid Degradation Level</span>
            <span>100%</span>
          </div>
        </div>
      </motion.div>

      {/* System Nodes Grid */}
      <div className="grid grid-cols-6 gap-4">
        {systemNodes.map((node, index) => {
          const status = getNodeStatus(index, progress)
          const values = getNodeValues(node, Math.max(0, progress - (index * 10)))
          
          return (
            <motion.div
              key={node.id}
              className={`bg-[#0d1419] border rounded-xl p-4 transition-all ${
                status === "critical" ? "border-red-500/50 bg-red-500/5" :
                status === "warning" ? "border-amber-500/50 bg-amber-500/5" :
                "border-slate-700/50"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  status === "critical" ? "bg-red-500/20 text-red-400" :
                  status === "warning" ? "bg-amber-500/20 text-amber-400" :
                  "bg-cyan-500/20 text-cyan-400"
                }`}>
                  {node.icon}
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  status === "critical" ? "bg-red-500 animate-pulse" :
                  status === "warning" ? "bg-amber-500 animate-pulse" :
                  "bg-emerald-500"
                }`} />
              </div>
              
              <h4 className="text-sm font-medium text-slate-200 mb-3">{node.name}</h4>
              
              {/* Metrics */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">Voltage</span>
                  <motion.span
                    className={`text-xs font-mono ${
                      status === "critical" ? "text-red-400" :
                      status === "warning" ? "text-amber-400" :
                      "text-emerald-400"
                    }`}
                    key={values.voltage}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                  >
                    {values.voltage}kV
                  </motion.span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">Load</span>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          status === "critical" ? "bg-red-500" :
                          status === "warning" ? "bg-amber-500" :
                          "bg-emerald-500"
                        }`}
                        animate={{ width: `${values.load}%` }}
                      />
                    </div>
                    <motion.span
                      className={`text-xs font-mono ${
                        status === "critical" ? "text-red-400" :
                        status === "warning" ? "text-amber-400" :
                        "text-emerald-400"
                      }`}
                      key={values.load}
                    >
                      {values.load}%
                    </motion.span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">Frequency</span>
                  <motion.span
                    className={`text-xs font-mono ${
                      status === "critical" ? "text-red-400" :
                      status === "warning" ? "text-amber-400" :
                      "text-emerald-400"
                    }`}
                    key={values.frequency}
                  >
                    {values.frequency}Hz
                  </motion.span>
                </div>
              </div>

              {/* Status indicator */}
              <div className={`mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-center gap-1 ${
                status === "critical" ? "text-red-400" :
                status === "warning" ? "text-amber-400" :
                "text-emerald-400"
              }`}>
                {status === "critical" ? <XCircle className="w-3 h-3" /> :
                 status === "warning" ? <AlertTriangle className="w-3 h-3" /> :
                 <CheckCircle className="w-3 h-3" />}
                <span className="text-[10px] uppercase font-medium">{status}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Ripple Visualization */}
      <motion.div
        className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Cascade Propagation Timeline</h3>
        
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2" />
          <motion.div
            className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 ${
              getStatusColor(progress) === "emerald" ? "bg-emerald-500" :
              getStatusColor(progress) === "amber" ? "bg-gradient-to-r from-emerald-500 to-amber-500" :
              "bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
            }`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />

          {/* Nodes */}
          <div className="relative flex justify-between">
            {systemNodes.map((node, index) => {
              const status = getNodeStatus(index, progress)
              const position = (index / (systemNodes.length - 1)) * 100
              
              return (
                <div key={node.id} className="flex flex-col items-center" style={{ width: `${100 / systemNodes.length}%` }}>
                  <motion.div
                    className={`w-12 h-12 rounded-full border-4 flex items-center justify-center z-10 transition-all ${
                      status === "critical" ? "border-red-500 bg-red-500/20 text-red-400" :
                      status === "warning" ? "border-amber-500 bg-amber-500/20 text-amber-400" :
                      "border-slate-600 bg-slate-800 text-slate-400"
                    }`}
                    animate={status !== "stable" ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: status !== "stable" ? Infinity : 0, repeatDelay: 1 }}
                  >
                    {node.icon}
                  </motion.div>
                  <span className="mt-2 text-xs text-slate-400 text-center">{node.name}</span>
                  <span className={`text-[10px] font-medium ${
                    status === "critical" ? "text-red-400" :
                    status === "warning" ? "text-amber-400" :
                    "text-slate-500"
                  }`}>
                    {status === "critical" ? "AFFECTED" :
                     status === "warning" ? "AT RISK" :
                     "NORMAL"}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Impact Summary */}
        <AnimatePresence>
          {progress > 30 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-6 p-4 rounded-lg border ${
                progress >= 66 ? "bg-red-500/10 border-red-500/30" : "bg-amber-500/10 border-amber-500/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${progress >= 66 ? "text-red-400" : "text-amber-400"}`} />
                <div>
                  <p className={`text-sm font-medium ${progress >= 66 ? "text-red-400" : "text-amber-400"}`}>
                    {progress >= 66 ? "Critical Cascade Detected" : "Warning: Grid Instability Propagating"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {progress >= 66
                      ? `${systemNodes.filter((_, i) => getNodeStatus(i, progress) === "critical").length} systems critically affected. Immediate action required to prevent safety incidents.`
                      : `${systemNodes.filter((_, i) => getNodeStatus(i, progress) !== "stable").length} systems experiencing degraded performance. Consider preventive measures.`
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
