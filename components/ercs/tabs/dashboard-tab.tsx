"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Zap, AlertTriangle, Shield, Activity, Sun, Battery, Eye, EyeOff,
  Factory, Gauge, Wind, Radio, Power, Flame, Waves, CheckCircle,
  Sliders, ArrowRight, Leaf, Clock, FileText, MapPin, TrendingDown,
} from "lucide-react"
import { FlowMap } from "../flow-map"

interface DashboardTabProps {
  scenario: "stable" | "warning" | "critical"
  onScenarioChange: (scenario: "stable" | "warning" | "critical") => void
  onGoOptimise: () => void
}
interface Operation { id: string; name: string; icon: React.ReactNode; baseLoad: number; status: "safe" | "warning" | "critical" }
interface SystemHealth { id: string; name: string; description: string; status: "safe" | "warning" | "critical"; icon: React.ReactNode }
interface PtwEntry { id: string; action: string; authoriser: string; time: string; status: "authorised" | "pending" | "executed" }

export function DashboardTab({ scenario, onScenarioChange, onGoOptimise }: DashboardTabProps) {
  const [showSafetyOverlay, setShowSafetyOverlay] = useState(false)
  const [carbonOffset, setCarbonOffset] = useState(142)
  const [bessSeconds, setBessSeconds] = useState(6.4 * 3600)
  const prevScenario = useRef(scenario)

  const [operations, setOperations] = useState<Operation[]>([
    { id: "crushing",   name: "Primary Crushing",  icon: <Factory className="w-4 h-4" />,  baseLoad: 85, status: "safe" },
    { id: "processing", name: "Processing Plant",  icon: <Gauge className="w-4 h-4" />,    baseLoad: 72, status: "safe" },
    { id: "conveyor-a", name: "Conveyor System A", icon: <Activity className="w-4 h-4" />, baseLoad: 68, status: "safe" },
    { id: "conveyor-b", name: "Conveyor System B", icon: <Activity className="w-4 h-4" />, baseLoad: 55, status: "safe" },
    { id: "water",      name: "Water Pumping",     icon: <Waves className="w-4 h-4" />,    baseLoad: 45, status: "safe" },
    { id: "stockpile",  name: "Ore Stockpile",     icon: <Factory className="w-4 h-4" />,  baseLoad: 30, status: "safe" },
  ])

  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([
    { id: "emergency",     name: "Emergency Shutdown",    description: "Ready for activation",    status: "safe", icon: <Power className="w-4 h-4" /> },
    { id: "fire",          name: "Fire Suppression",      description: "All zones operational",   status: "safe", icon: <Flame className="w-4 h-4" /> },
    { id: "ventilation",   name: "Ventilation Control",   description: "Air quality normal",      status: "safe", icon: <Wind className="w-4 h-4" /> },
    { id: "communication", name: "Communication Systems", description: "All channels active",     status: "safe", icon: <Radio className="w-4 h-4" /> },
    { id: "backup",        name: "Backup Power",          description: "100% capacity available", status: "safe", icon: <Battery className="w-4 h-4" /> },
  ])

  const ptwLog: PtwEntry[] = scenario === "critical" ? [
    { id: "1", action: "Emergency Ring-Fence Failover",       authoriser: "J. Dlamini (Ops Mgr)", time: "12:15", status: "executed"   },
    { id: "2", action: "PTW Controlled Shutdown — Conveyor B", authoriser: "T. Mokoena (SHE)",    time: "12:16", status: "authorised" },
    { id: "3", action: "UHDMS Circuit Throttle — 25%",        authoriser: "Awaiting Auth",        time: "12:17", status: "pending"    },
  ] : scenario === "warning" ? [
    { id: "1", action: "Solar PV Priority Mode",              authoriser: "System Auto",          time: "11:45", status: "executed"   },
    { id: "2", action: "PTW Shutdown Standby — Staged",       authoriser: "J. Dlamini (Ops Mgr)", time: "11:50", status: "authorised" },
  ] : [
    { id: "1", action: "Scheduled Maintenance — Transformer T3", authoriser: "K. Sithole (Eng)", time: "10:00", status: "authorised" },
  ]

  useEffect(() => {
    if (prevScenario.current !== scenario) {
      setBessSeconds(scenario === "critical" ? 4 * 3600 : scenario === "warning" ? 5.5 * 3600 : 6.4 * 3600)
      prevScenario.current = scenario
    }
  }, [scenario])

  useEffect(() => {
    const iv = setInterval(() => {
      setBessSeconds(prev => {
        if (scenario === "critical") return Math.max(0, prev - 4)
        if (scenario === "warning")  return Math.max(0, prev - 1)
        return Math.min(6.4 * 3600, prev + 2)
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [scenario])

  useEffect(() => {
    const iv = setInterval(() => {
      setCarbonOffset(prev => prev + (scenario === "stable" ? 0.04 : scenario === "warning" ? 0.06 : 0.08))
    }, 2000)
    return () => clearInterval(iv)
  }, [scenario])

  useEffect(() => {
    const iv = setInterval(() => {
      setOperations(prev => prev.map(op => {
        const fluctuation = Math.random() * 10 - 5
        let newLoad = Math.max(10, Math.min(100, op.baseLoad + fluctuation))
        if (scenario === "critical") newLoad = Math.max(10, newLoad - 15)
        else if (scenario === "warning") newLoad = Math.max(10, newLoad - 5)
        let newStatus: "safe" | "warning" | "critical" = "safe"
        if (scenario === "critical" && Math.random() > 0.5) newStatus = Math.random() > 0.5 ? "critical" : "warning"
        else if (scenario === "warning" && Math.random() > 0.7) newStatus = "warning"
        return { ...op, baseLoad: Math.round(newLoad), status: newStatus }
      }))
    }, 3000)
    return () => clearInterval(iv)
  }, [scenario])

  useEffect(() => {
    setSystemHealth(prev => prev.map(sys => {
      let newStatus: "safe" | "warning" | "critical" = "safe"
      let newDescription = sys.description
      if (scenario === "critical") {
        if (sys.id === "emergency")   { newStatus = "warning";  newDescription = "Standby mode activated"    }
        if (sys.id === "ventilation") { newStatus = "critical"; newDescription = "Backup power engaged"      }
        if (sys.id === "backup")      { newStatus = "warning";  newDescription = "85% capacity discharging"  }
      } else if (scenario === "warning") {
        if (sys.id === "backup")      { newStatus = "warning";  newDescription = "92% capacity available"    }
      } else {
        if (sys.id === "emergency")     newDescription = "Ready for activation"
        if (sys.id === "fire")          newDescription = "All zones operational"
        if (sys.id === "ventilation")   newDescription = "Air quality normal"
        if (sys.id === "communication") newDescription = "All channels active"
        if (sys.id === "backup")        newDescription = "100% capacity available"
      }
      return { ...sys, status: newStatus, description: newDescription }
    }))
  }, [scenario])

  const gridStatus = {
    stable:   { label: "Stable",   color: "emerald", voltage: "132kV", frequency: "50.0Hz", load: "78%" },
    warning:  { label: "Unstable", color: "amber",   voltage: "128kV", frequency: "49.5Hz", load: "92%" },
    critical: { label: "Critical", color: "red",     voltage: "118kV", frequency: "48.8Hz", load: "98%" },
  }[scenario]

  const energyMix = {
    stable:   { grid: 65, solar: 25, battery: 10 },
    warning:  { grid: 45, solar: 35, battery: 20 },
    critical: { grid: 20, solar: 40, battery: 40 },
  }[scenario]

  const kolomela = {
    stable:   { status: "Normal",   output: "68%", buffer: "12 hrs", signal: "none",      color: "emerald" },
    warning:  { status: "Standby",  output: "74%", buffer: "9 hrs",  signal: "preparing", color: "amber"   },
    critical: { status: "Boosting", output: "89%", buffer: "6 hrs",  signal: "active",    color: "red"     },
  }[scenario]

  const alerts = {
    stable:   [{ type: "info",     message: "Scheduled maintenance: Transformer T3 at 14:00",  time: "10:30" }],
    warning:  [{ type: "warning",  message: "Grid voltage fluctuation detected — monitoring",   time: "11:45" },
               { type: "warning",  message: "Load shedding Stage 2 announced 14:00–16:00",     time: "11:30" }],
    critical: [{ type: "critical", message: "CRITICAL: Grid supply unstable — action required", time: "12:15" },
               { type: "critical", message: "Sishen processing plant at risk",                  time: "12:14" },
               { type: "warning",  message: "Battery backup engaged — 4 hours remaining",       time: "12:10" }],
  }[scenario]

  const getStatusColor = (s: string) => s === "critical" ? "text-red-400" : s === "warning" ? "text-amber-400" : "text-emerald-400"
  const getStatusBg    = (s: string) => s === "critical" ? "bg-red-500/20 border-red-500/30" : s === "warning" ? "bg-amber-500/20 border-amber-500/30" : "bg-emerald-500/20 border-emerald-500/30"

  const formatBess = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = Math.floor(secs % 60)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  const bessColor = bessSeconds < 2 * 3600 ? "text-red-400" : bessSeconds < 4 * 3600 ? "text-amber-400" : "text-emerald-400"
  const bessBg    = bessSeconds < 2 * 3600 ? "border-red-500/50 bg-red-500/10" : bessSeconds < 4 * 3600 ? "border-amber-500/50 bg-amber-500/10" : "border-emerald-500/30 bg-emerald-500/5"
  const warningActions = scenario === "warning" ? 5 : scenario === "critical" ? 6 : 0

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-5">

      {/* Optimisation banner */}
      <AnimatePresence>
        {(scenario === "warning" || scenario === "critical") && (
          <motion.div key="opt-banner" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className={`rounded-xl border p-4 flex items-center justify-between gap-4 flex-wrap ${scenario === "critical" ? "bg-red-500/10 border-red-500/40" : "bg-amber-500/10 border-amber-500/40"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${scenario === "critical" ? "bg-red-500/20" : "bg-amber-500/20"}`}>
                <Sliders className={`w-5 h-5 ${scenario === "critical" ? "text-red-400" : "text-amber-400"}`} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${scenario === "critical" ? "text-red-400" : "text-amber-400"}`}>
                  {scenario === "critical" ? `${warningActions} critical optimisation actions available — immediate action recommended` : `${warningActions} preventive optimisation actions available — act now to avoid escalation`}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {scenario === "critical" ? "Ring-fence failover, load reduction and PTW shutdown ready. Scenario continues running — optimise when ready." : "Solar priority mode, BESS pre-charge and load deferral available. Scenario continues running — optimise when ready."}
                </p>
              </div>
            </div>
            <button onClick={onGoOptimise} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border flex-shrink-0 transition-all ${scenario === "critical" ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30" : "bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"}`}>
              Go to Optimise <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
        {/* Grid status */}
        <motion.div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="flex items-center justify-between mb-2"><span className="text-[10px] text-slate-500 uppercase tracking-wide">Grid Status</span><Zap className={`w-3.5 h-3.5 ${gridStatus.color === "emerald" ? "text-emerald-400" : gridStatus.color === "amber" ? "text-amber-400" : "text-red-400"}`} /></div>
          <div className="flex items-center gap-1.5 mb-2"><div className={`w-2.5 h-2.5 rounded-full ${gridStatus.color === "emerald" ? "bg-emerald-500" : gridStatus.color === "amber" ? "bg-amber-500 animate-pulse" : "bg-red-500 animate-pulse"}`} /><span className={`text-base font-bold ${gridStatus.color === "emerald" ? "text-emerald-400" : gridStatus.color === "amber" ? "text-amber-400" : "text-red-400"}`}>{gridStatus.label}</span></div>
          <div className="grid grid-cols-3 gap-1 text-[10px]">
            <div><span className="text-slate-500">V</span><p className="text-slate-300">{gridStatus.voltage}</p></div>
            <div><span className="text-slate-500">Hz</span><p className="text-slate-300">{gridStatus.frequency}</p></div>
            <div><span className="text-slate-500">Load</span><p className="text-slate-300">{gridStatus.load}</p></div>
          </div>
        </motion.div>

        {/* BESS Countdown */}
        <motion.div className={`col-span-2 sm:col-span-2 rounded-xl border p-3 md:p-4 ${bessBg}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] text-slate-500 uppercase tracking-wide">BESS Safety-Critical Autonomy</span><Battery className={`w-3.5 h-3.5 ${bessColor}`} /></div>
          <div className={`text-3xl font-bold font-mono tracking-widest ${bessColor}`}>{formatBess(bessSeconds)}</div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div className={`h-full rounded-full ${bessSeconds < 2 * 3600 ? "bg-red-500" : bessSeconds < 4 * 3600 ? "bg-amber-500" : "bg-emerald-500"}`} animate={{ width: `${Math.min(100, (bessSeconds / (6.4 * 3600)) * 100)}%` }} transition={{ duration: 0.5 }} />
            </div>
            <span className="text-[10px] text-slate-500 flex-shrink-0">hrs remaining</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{scenario === "critical" ? "Discharging fast — ring-fence failover recommended" : scenario === "warning" ? "Pre-charging recommended before outage window" : "Fully charged — safety systems secured"}</p>
        </motion.div>

        {/* Energy mix */}
        <motion.div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center justify-between mb-2"><span className="text-[10px] text-slate-500 uppercase tracking-wide">Energy Mix</span><Activity className="w-3.5 h-3.5 text-cyan-400" /></div>
          <div className="space-y-1.5">
            {[{ icon: <Zap className="w-3 h-3 text-amber-400" />, val: energyMix.grid,    color: "bg-amber-500"  },
              { icon: <Sun className="w-3 h-3 text-yellow-400" />, val: energyMix.solar,   color: "bg-yellow-500" },
              { icon: <Battery className="w-3 h-3 text-emerald-400" />, val: energyMix.battery, color: "bg-emerald-500" },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {row.icon}
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden"><motion.div className={`h-full ${row.color}`} animate={{ width: `${row.val}%` }} transition={{ duration: 1 }} /></div>
                <span className="text-[10px] text-slate-400 w-7 text-right">{row.val}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Kolomela */}
        <motion.div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-2"><span className="text-[10px] text-slate-500 uppercase tracking-wide">Kolomela Mine</span><MapPin className={`w-3.5 h-3.5 ${kolomela.color === "emerald" ? "text-emerald-400" : kolomela.color === "amber" ? "text-amber-400" : "text-red-400"}`} /></div>
          <div className={`text-base font-bold mb-1.5 ${kolomela.color === "emerald" ? "text-emerald-400" : kolomela.color === "amber" ? "text-amber-400" : "text-red-400"}`}>{kolomela.status}</div>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between"><span className="text-slate-500">Output</span><span className="text-slate-300">{kolomela.output}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Port buffer</span><span className="text-slate-300">{kolomela.buffer}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Data feed</span><span className={kolomela.signal === "active" ? "text-red-400" : kolomela.signal === "preparing" ? "text-amber-400" : "text-emerald-400"}>{kolomela.signal === "active" ? "Emergency" : kolomela.signal === "preparing" ? "Standby" : "Normal"}</span></div>
          </div>
        </motion.div>

        {/* Carbon offset */}
        <motion.div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center justify-between mb-2"><span className="text-[10px] text-slate-500 uppercase tracking-wide">Scope 2 Offset</span><Leaf className="w-3.5 h-3.5 text-emerald-400" /></div>
          <div className="text-2xl font-bold text-emerald-400">{carbonOffset.toFixed(1)}</div>
          <div className="text-[10px] text-slate-500 mb-1.5">tCO&#8322;e avoided today</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400"><TrendingDown className="w-3 h-3" /><span>+{scenario === "critical" ? "0.08" : scenario === "warning" ? "0.06" : "0.04"}/2s</span></div>
          <p className="text-[10px] text-slate-600 mt-1">Anglo American Scope 2 gate</p>
        </motion.div>
      </div>

      {/* Middle: controls + flow map + right column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">

        {/* Controls + safety health */}
        <motion.div className="lg:col-span-2 space-y-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide block mb-3">Scenario</span>
            <div className="space-y-2">
              {(["stable", "warning", "critical"] as const).map(s => (
                <button key={s} onClick={() => onScenarioChange(s)} className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${scenario === s ? s === "critical" ? "bg-red-500/20 text-red-400 border border-red-500/50" : s === "warning" ? "bg-amber-500/20 text-amber-400 border border-amber-500/50" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"}`}>
                  <div className={`w-2 h-2 rounded-full ${s === "critical" ? "bg-red-500" : s === "warning" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide block mb-3">Overlays</span>
            <button onClick={() => setShowSafetyOverlay(!showSafetyOverlay)} className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${showSafetyOverlay ? "bg-red-500/20 text-red-400 border border-red-500/50" : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800"}`}>
              {showSafetyOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />} Safety Impact
            </button>
          </div>
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3"><span className="text-[10px] text-slate-500 uppercase tracking-wide">Safety Systems</span><Shield className={`w-3.5 h-3.5 ${scenario === "critical" ? "text-red-400" : scenario === "warning" ? "text-amber-400" : "text-emerald-400"}`} /></div>
            <div className="space-y-1.5">
              {systemHealth.map(sys => (
                <div key={sys.id} className={`flex items-center justify-between px-2 py-1.5 rounded-lg border text-[10px] ${getStatusBg(sys.status)}`}>
                  <span className="text-slate-300 truncate">{sys.name.split(" ").slice(0, 2).join(" ")}</span>
                  <span className={`font-bold ml-1 flex-shrink-0 ${getStatusColor(sys.status)}`}>{sys.status === "safe" ? "OK" : sys.status === "warning" ? "WARN" : "CRIT"}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Flow map centrepiece */}
        <motion.div className="lg:col-span-7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl overflow-hidden h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-cyan-400" /><span className="text-sm font-semibold text-slate-200">Sishen Operating System — Live Flow Map</span></div>
              <div className="flex items-center gap-4 text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Safe</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> At risk</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Disrupted</span>
              </div>
            </div>
            <FlowMap scenario={scenario} showSafetyOverlay={showSafetyOverlay} />
          </div>
        </motion.div>

        {/* Alerts + PTW log */}
        <motion.div className="lg:col-span-3 space-y-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3"><span className="text-[10px] text-slate-500 uppercase tracking-wide">Active Alerts</span><AlertTriangle className={`w-3.5 h-3.5 ${scenario === "critical" ? "text-red-400" : scenario === "warning" ? "text-amber-400" : "text-slate-400"}`} /></div>
            <div className="space-y-2">
              {alerts.map((alert, i) => (
                <motion.div key={i} className={`p-2.5 rounded-lg border ${alert.type === "critical" ? "bg-red-500/10 border-red-500/30" : alert.type === "warning" ? "bg-amber-500/10 border-amber-500/30" : "bg-slate-800/50 border-slate-700/50"}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={`w-3 h-3 mt-0.5 flex-shrink-0 ${alert.type === "critical" ? "text-red-400" : alert.type === "warning" ? "text-amber-400" : "text-cyan-400"}`} />
                    <div><p className={`text-[11px] leading-tight ${alert.type === "critical" ? "text-red-400" : alert.type === "warning" ? "text-amber-400" : "text-slate-300"}`}>{alert.message}</p><span className="text-[10px] text-slate-500">{alert.time}</span></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3"><span className="text-[10px] text-slate-500 uppercase tracking-wide">PTW Authorisation Log</span><FileText className="w-3.5 h-3.5 text-cyan-400" /></div>
            <div className="space-y-2">
              {ptwLog.map(entry => (
                <div key={entry.id} className="p-2.5 rounded-lg border border-slate-700/40 bg-slate-800/30">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] text-slate-300 leading-tight flex-1">{entry.action}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${entry.status === "executed" ? "bg-emerald-500/20 text-emerald-400" : entry.status === "authorised" ? "bg-cyan-500/20 text-cyan-400" : "bg-amber-500/20 text-amber-400"}`}>{entry.status.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500"><Clock className="w-2.5 h-2.5" />{entry.time}<span className="text-slate-600">·</span><span className="truncate">{entry.authoriser}</span></div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Operations */}
      <motion.div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-between mb-3"><span className="text-[10px] text-slate-500 uppercase tracking-wide">Active Operations — Sishen Site</span><Factory className="w-3.5 h-3.5 text-cyan-400" /></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
          {operations.map(op => (
            <motion.div key={op.id} className={`p-3 rounded-lg border transition-all ${getStatusBg(op.status)}`} animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: 2.5, repeat: Infinity }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className={getStatusColor(op.status)}>{op.icon}</div>
                <span className={`text-[9px] px-1 py-0.5 rounded font-semibold ${op.status === "safe" ? "bg-emerald-500/30 text-emerald-400" : op.status === "warning" ? "bg-amber-500/30 text-amber-400" : "bg-red-500/30 text-red-400"}`}>{op.status === "safe" ? "OK" : op.status === "warning" ? "WARN" : "CRIT"}</span>
              </div>
              <p className="text-[11px] font-medium text-slate-300 mb-1.5 leading-tight">{op.name}</p>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden"><motion.div className={`h-full ${op.status === "safe" ? "bg-emerald-500" : op.status === "warning" ? "bg-amber-500" : "bg-red-500"}`} animate={{ width: `${op.baseLoad}%` }} transition={{ duration: 0.5 }} /></div>
                <span className={`text-[10px] font-medium ${getStatusColor(op.status)}`}>{op.baseLoad}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}
