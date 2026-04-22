"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Zap,
  AlertTriangle,
  Shield,
  Activity,
  Sun,
  Battery,
  Eye,
  EyeOff,
  Factory,
  Gauge,
  Wind,
  Radio,
  Power,
  Flame,
  Waves,
  CheckCircle,
  Sliders,
  ArrowRight,
} from "lucide-react"
import { FlowMap } from "../flow-map"

interface DashboardTabProps {
  scenario: "stable" | "warning" | "critical"
  onScenarioChange: (scenario: "stable" | "warning" | "critical") => void
  onGoOptimise: () => void
}

interface Operation {
  id: string
  name: string
  icon: React.ReactNode
  baseLoad: number
  status: "safe" | "warning" | "critical"
}

interface SystemHealth {
  id: string
  name: string
  description: string
  status: "safe" | "warning" | "critical"
  icon: React.ReactNode
}

export function DashboardTab({ scenario, onScenarioChange, onGoOptimise }: DashboardTabProps) {
  const [showSafetyOverlay, setShowSafetyOverlay] = useState(false)
  const [operations, setOperations] = useState<Operation[]>([
    { id: "crushing", name: "Primary Crushing", icon: <Factory className="w-4 h-4" />, baseLoad: 85, status: "safe" },
    { id: "processing", name: "Processing Plant", icon: <Gauge className="w-4 h-4" />, baseLoad: 72, status: "safe" },
    { id: "conveyor-a", name: "Conveyor System A", icon: <Activity className="w-4 h-4" />, baseLoad: 68, status: "safe" },
    { id: "conveyor-b", name: "Conveyor System B", icon: <Activity className="w-4 h-4" />, baseLoad: 55, status: "safe" },
    { id: "water", name: "Water Pumping", icon: <Waves className="w-4 h-4" />, baseLoad: 45, status: "safe" },
    { id: "stockpile", name: "Ore Stockpile", icon: <Factory className="w-4 h-4" />, baseLoad: 30, status: "safe" },
  ])

  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([
    { id: "emergency", name: "Emergency Shutdown System", description: "Ready for activation", status: "safe", icon: <Power className="w-4 h-4" /> },
    { id: "fire", name: "Fire Suppression", description: "All zones operational", status: "safe", icon: <Flame className="w-4 h-4" /> },
    { id: "ventilation", name: "Ventilation Control", description: "Air quality normal", status: "safe", icon: <Wind className="w-4 h-4" /> },
    { id: "communication", name: "Communication Systems", description: "All channels active", status: "safe", icon: <Radio className="w-4 h-4" /> },
    { id: "backup", name: "Backup Power", description: "100% capacity available", status: "safe", icon: <Battery className="w-4 h-4" /> },
  ])

  // Fluctuate operations load and status
  useEffect(() => {
    const interval = setInterval(() => {
      setOperations(prev => prev.map(op => {
        const fluctuation = Math.random() * 10 - 5 // -5 to +5
        let newLoad = Math.max(10, Math.min(100, op.baseLoad + fluctuation))
        
        // Scenario affects load and status
        if (scenario === "critical") {
          newLoad = Math.max(10, newLoad - 15)
        } else if (scenario === "warning") {
          newLoad = Math.max(10, newLoad - 5)
        }

        let newStatus: "safe" | "warning" | "critical" = "safe"
        if (scenario === "critical" && Math.random() > 0.5) {
          newStatus = Math.random() > 0.5 ? "critical" : "warning"
        } else if (scenario === "warning" && Math.random() > 0.7) {
          newStatus = "warning"
        }

        return {
          ...op,
          baseLoad: Math.round(newLoad),
          status: newStatus,
        }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [scenario])

  // Update system health based on scenario
  useEffect(() => {
    setSystemHealth(prev => prev.map(sys => {
      let newStatus: "safe" | "warning" | "critical" = "safe"
      let newDescription = sys.description

      if (scenario === "critical") {
        if (sys.id === "emergency") {
          newStatus = "warning"
          newDescription = "Standby mode activated"
        } else if (sys.id === "ventilation") {
          newStatus = "critical"
          newDescription = "Backup power engaged"
        } else if (sys.id === "backup") {
          newStatus = "warning"
          newDescription = "85% capacity - discharging"
        }
      } else if (scenario === "warning") {
        if (sys.id === "backup") {
          newStatus = "warning"
          newDescription = "92% capacity available"
        }
      } else {
        // Reset to defaults
        if (sys.id === "emergency") newDescription = "Ready for activation"
        else if (sys.id === "fire") newDescription = "All zones operational"
        else if (sys.id === "ventilation") newDescription = "Air quality normal"
        else if (sys.id === "communication") newDescription = "All channels active"
        else if (sys.id === "backup") newDescription = "100% capacity available"
      }

      return { ...sys, status: newStatus, description: newDescription }
    }))
  }, [scenario])

  const gridStatus = {
    stable: { label: "Stable", color: "emerald", voltage: "132kV", frequency: "50.0Hz", load: "78%" },
    warning: { label: "Unstable", color: "amber", voltage: "128kV", frequency: "49.5Hz", load: "92%" },
    critical: { label: "Critical", color: "red", voltage: "118kV", frequency: "48.8Hz", load: "98%" },
  }[scenario]

  const energyMix = {
    stable: { grid: 65, solar: 25, battery: 10 },
    warning: { grid: 45, solar: 35, battery: 20 },
    critical: { grid: 20, solar: 40, battery: 40 },
  }[scenario]

  const alerts = {
    stable: [
      { type: "info", message: "Scheduled maintenance: Transformer T3 at 14:00", time: "10:30" },
    ],
    warning: [
      { type: "warning", message: "Grid voltage fluctuation detected - monitoring", time: "11:45" },
      { type: "warning", message: "Load shedding Stage 2 announced for 14:00-16:00", time: "11:30" },
    ],
    critical: [
      { type: "critical", message: "CRITICAL: Grid supply unstable - immediate action required", time: "12:15" },
      { type: "critical", message: "Sishen processing plant at risk - review operations", time: "12:14" },
      { type: "warning", message: "Battery backup engaged - 4 hours remaining", time: "12:10" },
    ],
  }[scenario]

  const getStatusColor = (status: string) => {
    if (status === "critical") return "text-red-400"
    if (status === "warning") return "text-amber-400"
    return "text-emerald-400"
  }

  const getStatusBg = (status: string) => {
    if (status === "critical") return "bg-red-500/20 border-red-500/30"
    if (status === "warning") return "bg-amber-500/20 border-amber-500/30"
    return "bg-emerald-500/20 border-emerald-500/30"
  }

  const warningActions = scenario === "warning" ? 5 : scenario === "critical" ? 6 : 0

  return (
    <div className="p-6 space-y-6">

      {/* Optimisation suggestion banner — appears when warning or critical */}
      {(scenario === "warning" || scenario === "critical") && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className={`rounded-xl border p-4 flex items-center justify-between gap-4 flex-wrap ${
            scenario === "critical"
              ? "bg-red-500/10 border-red-500/40"
              : "bg-amber-500/10 border-amber-500/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
              scenario === "critical" ? "bg-red-500/20" : "bg-amber-500/20"
            }`}>
              <Sliders className={`w-5 h-5 ${scenario === "critical" ? "text-red-400" : "text-amber-400"}`} />
            </div>
            <div>
              <p className={`text-sm font-semibold ${scenario === "critical" ? "text-red-400" : "text-amber-400"}`}>
                {scenario === "critical"
                  ? `${warningActions} critical optimisation actions available — immediate action recommended`
                  : `${warningActions} preventive optimisation actions available — act now to avoid escalation`}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {scenario === "critical"
                  ? "Ring-fence failover, load reduction, and PTW controlled shutdown ready to execute. Scenario continues running — optimise when ready."
                  : "Solar priority mode, BESS pre-charge, and load deferral available. Scenario continues running — optimise when ready."}
              </p>
            </div>
          </div>
          <button
            onClick={onGoOptimise}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border flex-shrink-0 transition-all ${
              scenario === "critical"
                ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                : "bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
            }`}
          >
            Go to Optimise
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Top row - Status cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Grid Status */}
        <motion.div
          className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Grid Status</span>
            <Zap className={`w-4 h-4 ${gridStatus.color === "emerald" ? "text-emerald-400" : gridStatus.color === "amber" ? "text-amber-400" : "text-red-400"}`} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${gridStatus.color === "emerald" ? "bg-emerald-500" : gridStatus.color === "amber" ? "bg-amber-500" : "bg-red-500"} ${scenario !== "stable" ? "animate-pulse" : ""}`} />
            <span className={`text-xl font-bold ${gridStatus.color === "emerald" ? "text-emerald-400" : gridStatus.color === "amber" ? "text-amber-400" : "text-red-400"}`}>{gridStatus.label}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-slate-500">Voltage</span>
              <p className="text-slate-300">{gridStatus.voltage}</p>
            </div>
            <div>
              <span className="text-slate-500">Freq</span>
              <p className="text-slate-300">{gridStatus.frequency}</p>
            </div>
            <div>
              <span className="text-slate-500">Load</span>
              <p className="text-slate-300">{gridStatus.load}</p>
            </div>
          </div>
        </motion.div>

        {/* Energy Supply Mix */}
        <motion.div
          className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Energy Supply Mix</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-amber-400" />
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${energyMix.grid}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <span className="text-xs text-slate-400 w-10">{energyMix.grid}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-3 h-3 text-yellow-400" />
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-yellow-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${energyMix.solar}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <span className="text-xs text-slate-400 w-10">{energyMix.solar}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="w-3 h-3 text-emerald-400" />
              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${energyMix.battery}%` }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
              </div>
              <span className="text-xs text-slate-400 w-10">{energyMix.battery}%</span>
            </div>
          </div>
        </motion.div>

        {/* Alert Summary */}
        <motion.div
          className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Active Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${scenario === "critical" ? "text-red-400" : scenario === "warning" ? "text-amber-400" : "text-slate-400"}`} />
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="text-center">
              <span className="text-2xl font-bold text-red-400">{alerts.filter(a => a.type === "critical").length}</span>
              <p className="text-[10px] text-slate-500">Critical</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-amber-400">{alerts.filter(a => a.type === "warning").length}</span>
              <p className="text-[10px] text-slate-500">Warning</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-cyan-400">{alerts.filter(a => a.type === "info").length}</span>
              <p className="text-[10px] text-slate-500">Info</p>
            </div>
          </div>
        </motion.div>

        {/* Safety Systems Overview */}
        <motion.div
          className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Safety Systems</span>
            <Shield className={`w-4 h-4 ${scenario === "critical" ? "text-red-400" : scenario === "warning" ? "text-amber-400" : "text-emerald-400"}`} />
          </div>
          <div className={`text-lg font-bold mb-2 ${scenario === "critical" ? "text-red-400" : scenario === "warning" ? "text-amber-400" : "text-emerald-400"}`}>
            {scenario === "critical" ? "At Risk" : scenario === "warning" ? "Caution" : "All Systems Safe"}
          </div>
          <div className="text-xs text-slate-500">
            {systemHealth.filter(s => s.status === "safe").length}/{systemHealth.length} systems nominal
          </div>
        </motion.div>
      </div>

      {/* Middle row - Flow map and controls */}
      <div className="grid grid-cols-12 gap-4">
        {/* Controls */}
        <motion.div
          className="col-span-2 space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Scenario Toggle */}
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-3">Scenario</span>
            <div className="space-y-2">
              {(["stable", "warning", "critical"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => onScenarioChange(s)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    scenario === s
                      ? s === "critical"
                        ? "bg-red-500/20 text-red-400 border border-red-500/50"
                        : s === "warning"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                      : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    s === "critical" ? "bg-red-500" : s === "warning" ? "bg-amber-500" : "bg-emerald-500"
                  }`} />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Safety Overlay Toggle */}
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-3">Overlays</span>
            <button
              onClick={() => setShowSafetyOverlay(!showSafetyOverlay)}
              className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                showSafetyOverlay
                  ? "bg-red-500/20 text-red-400 border border-red-500/50"
                  : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"
              }`}
            >
              {showSafetyOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Safety Impact
            </button>
          </div>
        </motion.div>

        {/* Flow Map */}
        <motion.div
          className="col-span-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <FlowMap scenario={scenario} showSafetyOverlay={showSafetyOverlay} />
        </motion.div>

        {/* Alert List */}
        <motion.div
          className="col-span-3 bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Recent Alerts</span>
            <span className="text-xs text-cyan-400 cursor-pointer hover:underline">View All</span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                className={`p-3 rounded-lg border ${
                  alert.type === "critical"
                    ? "bg-red-500/10 border-red-500/30"
                    : alert.type === "warning"
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-slate-800/50 border-slate-700/50"
                }`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                    alert.type === "critical" ? "text-red-400" : alert.type === "warning" ? "text-amber-400" : "text-cyan-400"
                  }`} />
                  <div className="flex-1">
                    <p className={`text-xs ${
                      alert.type === "critical" ? "text-red-400" : alert.type === "warning" ? "text-amber-400" : "text-slate-300"
                    }`}>
                      {alert.message}
                    </p>
                    <span className="text-[10px] text-slate-500">{alert.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row - Active Operations and System Health */}
      <div className="grid grid-cols-2 gap-4">
        {/* Active Operations */}
        <motion.div
          className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500 uppercase tracking-wide">Active Operations</span>
            <Factory className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {operations.map((op) => (
              <motion.div
                key={op.id}
                className={`p-3 rounded-lg border transition-all ${getStatusBg(op.status)}`}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={getStatusColor(op.status)}>{op.icon}</div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    op.status === "safe" ? "bg-emerald-500/30 text-emerald-400" :
                    op.status === "warning" ? "bg-amber-500/30 text-amber-400" :
                    "bg-red-500/30 text-red-400"
                  }`}>
                    {op.status.charAt(0).toUpperCase() + op.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-300 mb-1">{op.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">Load</span>
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        op.status === "safe" ? "bg-emerald-500" :
                        op.status === "warning" ? "bg-amber-500" :
                        "bg-red-500"
                      }`}
                      animate={{ width: `${op.baseLoad}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(op.status)}`}>{op.baseLoad}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-500 uppercase tracking-wide">System Health</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="space-y-2">
            {systemHealth.map((sys) => (
              <div
                key={sys.id}
                className={`p-3 rounded-lg border flex items-center justify-between ${getStatusBg(sys.status)}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    sys.status === "safe" ? "bg-emerald-500/20 text-emerald-400" :
                    sys.status === "warning" ? "bg-amber-500/20 text-amber-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {sys.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300">{sys.name}</p>
                    <p className="text-xs text-slate-500">{sys.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sys.status === "safe" ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : sys.status === "warning" ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${getStatusColor(sys.status)}`}>
                    {sys.status.charAt(0).toUpperCase() + sys.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
