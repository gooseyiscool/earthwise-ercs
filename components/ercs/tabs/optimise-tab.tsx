"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sliders,
  CheckCircle,
  AlertTriangle,
  Zap,
  Sun,
  Battery,
  Factory,
  Wind,
  Waves,
  Activity,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Clock,
  TrendingDown,
  PlayCircle,
  Loader2,
  ChevronRight,
} from "lucide-react"

interface OptimiseTabProps {
  scenario: "stable" | "warning" | "critical"
  onScenarioChange: (scenario: "stable" | "warning" | "critical") => void
}

type ActionStatus = "pending" | "running" | "done"

interface OptAction {
  id: string
  title: string
  description: string
  impact: string
  impactLevel: "high" | "medium" | "low"
  category: "load" | "energy" | "safety" | "grid"
  timeEstimate: string
  status: ActionStatus
  requiresAuth: boolean
}

const warningActions: OptAction[] = [
  {
    id: "w1",
    title: "Activate Solar PV Priority Mode",
    description: "Shift primary supply from Eskom grid to solar PV and BESS to reduce grid dependency during instability window.",
    impact: "Grid draw reduced from 45% → 20%",
    impactLevel: "high",
    category: "energy",
    timeEstimate: "~2 min",
    status: "pending",
    requiresAuth: false,
  },
  {
    id: "w2",
    title: "Defer Non-Critical Conveyor Load",
    description: "Temporarily reduce Conveyor System B load by 30% and defer ore stockpile operations for 2 hours.",
    impact: "Demand reduced by ~18 MW",
    impactLevel: "high",
    category: "load",
    timeEstimate: "~5 min",
    status: "pending",
    requiresAuth: true,
  },
  {
    id: "w3",
    title: "Pre-charge BESS to 95%",
    description: "Charge battery storage to maximum capacity while grid is still available, before predicted Stage 3 window.",
    impact: "BESS autonomy extended to 6.5 hrs",
    impactLevel: "medium",
    category: "energy",
    timeEstimate: "~45 min",
    status: "pending",
    requiresAuth: false,
  },
  {
    id: "w4",
    title: "Alert Kolomela Operations",
    description: "Send automated coordination signal to Kolomela to prepare production balancing in case Sishen output drops.",
    impact: "OS response lag reduced by ~40 min",
    impactLevel: "medium",
    category: "grid",
    timeEstimate: "Immediate",
    status: "pending",
    requiresAuth: false,
  },
  {
    id: "w5",
    title: "Activate PTW Controlled-Shutdown Standby",
    description: "Pre-stage the Permit-to-Work controlled-shutdown sequence for non-ring-fenced loads, ready for one-click execution if needed.",
    impact: "Shutdown time reduced from 12 min → 3 min",
    impactLevel: "medium",
    category: "safety",
    timeEstimate: "~3 min",
    status: "pending",
    requiresAuth: true,
  },
]

const criticalActions: OptAction[] = [
  {
    id: "c1",
    title: "Execute Emergency Ring-Fence Failover",
    description: "Immediately switch all safety-critical loads (emergency shutdown, ventilation, UHDMS circuits, safety sensors) to BESS. Grid dependency for these systems becomes zero.",
    impact: "Safety-critical loads: 100% BESS-protected",
    impactLevel: "high",
    category: "safety",
    timeEstimate: "<200ms (automated)",
    status: "pending",
    requiresAuth: true,
  },
  {
    id: "c2",
    title: "Execute PTW Controlled Shutdown — Non-Critical Loads",
    description: "Run the pre-staged controlled-shutdown sequence for Conveyor B, Ore Stockpile, and Water Pumping in the approved PTW order. Reduces total demand by ~35 MW.",
    impact: "Demand: ~98 MW → ~63 MW",
    impactLevel: "high",
    category: "load",
    timeEstimate: "~3 min (PTW authorised)",
    status: "pending",
    requiresAuth: true,
  },
  {
    id: "c3",
    title: "Maximise Solar PV Output",
    description: "Override standard solar dispatch curve and run solar PV at maximum available output. Suspend scheduled maintenance on inverter bank 2.",
    impact: "Solar contribution: 40% → 55%",
    impactLevel: "high",
    category: "energy",
    timeEstimate: "~1 min",
    status: "pending",
    requiresAuth: false,
  },
  {
    id: "c4",
    title: "Throttle UHDMS Dense Media Circuits",
    description: "Reduce UHDMS processing throughput by 25% to conserve power while maintaining safe operating conditions on active circuits.",
    impact: "Processing load: -14 MW, UHDMS safe",
    impactLevel: "high",
    category: "load",
    timeEstimate: "~8 min",
    status: "pending",
    requiresAuth: true,
  },
  {
    id: "c5",
    title: "Dispatch Kolomela Emergency Balancing Signal",
    description: "Send priority coordination signal to Kolomela to immediately increase production and pre-position ore at port, offsetting Sishen throughput reduction.",
    impact: "Corridor stock buffer: +4 hrs",
    impactLevel: "medium",
    category: "grid",
    timeEstimate: "Immediate",
    status: "pending",
    requiresAuth: false,
  },
  {
    id: "c6",
    title: "Notify Anglo American Governance — Section 11 Event Log",
    description: "Automatically generate and transmit a Section 11 MHSA incident log for this grid instability event to Anglo American's engineering authority.",
    impact: "Compliance: audit trail created",
    impactLevel: "medium",
    category: "safety",
    timeEstimate: "Immediate",
    status: "pending",
    requiresAuth: false,
  },
]

const categoryColour = (cat: OptAction["category"]) => {
  switch (cat) {
    case "safety": return { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", label: "Safety" }
    case "energy": return { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", label: "Energy" }
    case "load":   return { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", label: "Load Mgmt" }
    case "grid":   return { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", label: "Grid / OS" }
  }
}

const impactColour = (level: OptAction["impactLevel"]) => {
  switch (level) {
    case "high":   return "text-red-400 bg-red-500/10 border-red-500/30"
    case "medium": return "text-amber-400 bg-amber-500/10 border-amber-500/30"
    case "low":    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  }
}

export function OptimiseTab({ scenario, onScenarioChange }: OptimiseTabProps) {
  const isWarning  = scenario === "warning"
  const isCritical = scenario === "critical"
  const isStable   = scenario === "stable"

  const baseActions = isCritical ? criticalActions : isWarning ? warningActions : []

  const [actions, setActions] = useState<OptAction[]>(baseActions.map(a => ({ ...a })))
  const [runningId, setRunningId] = useState<string | null>(null)
  const [optimising, setOptimising] = useState(false)
  const [optimiseDone, setOptimiseDone] = useState(false)
  const [authPending, setAuthPending] = useState<string | null>(null)
  const [selectedAction, setSelectedAction] = useState<OptAction | null>(null)

  // Reset when scenario changes
  const fresh = (s: "stable" | "warning" | "critical") => {
    const base = s === "critical" ? criticalActions : s === "warning" ? warningActions : []
    setActions(base.map(a => ({ ...a })))
    setOptimiseDone(false)
    setOptimising(false)
    setRunningId(null)
    setAuthPending(null)
    setSelectedAction(null)
    onScenarioChange(s)
  }

  const runAction = async (id: string) => {
    const action = actions.find(a => a.id === id)
    if (!action) return
    if (action.requiresAuth && authPending !== id) {
      setAuthPending(id)
      return
    }
    setAuthPending(null)
    setRunningId(id)
    await new Promise(r => setTimeout(r, 1800))
    setRunningId(null)
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: "done" } : a))
  }

  const runAll = async () => {
    setOptimising(true)
    for (const action of actions) {
      if (action.status === "done") continue
      setRunningId(action.id)
      await new Promise(r => setTimeout(r, 1200))
      setActions(prev => prev.map(a => a.id === action.id ? { ...a, status: "done" } : a))
    }
    setRunningId(null)
    setOptimising(false)
    setOptimiseDone(true)
    // After full optimise, return to stable after brief delay
    setTimeout(() => fresh("stable"), 2200)
  }

  const doneCount   = actions.filter(a => a.status === "done").length
  const totalCount  = actions.length
  const progress    = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

  // ── Stable state ──────────────────────────────────────────────────────────
  if (isStable) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
        >
          <ShieldCheck className="w-10 h-10 text-emerald-400" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">System Operating Normally</h2>
          <p className="text-slate-400 max-w-md">
            All safety-critical loads are ring-fenced and secure. No optimisation actions are required at this time. This tab activates when the system enters Warning or Critical status.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-4 w-full max-w-lg">
          {[
            { label: "BESS Autonomy", value: "6.4 hrs", icon: <Battery className="w-4 h-4 text-emerald-400" /> },
            { label: "Grid Independence", value: "85%", icon: <Zap className="w-4 h-4 text-emerald-400" /> },
            { label: "Safety Systems", value: "5/5 OK", icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
          ].map(m => (
            <div key={m.label} className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">{m.icon}</div>
              <div className="text-lg font-bold text-slate-200">{m.value}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide mt-1">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 text-xs text-slate-600 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          To test optimisation: switch to Warning or Critical mode in the Dashboard scenario controls.
        </div>
      </div>
    )
  }

  // ── Warning / Critical state ──────────────────────────────────────────────
  const headerColor = isCritical ? "text-red-400" : "text-amber-400"
  const headerBorder = isCritical ? "border-red-500/50" : "border-amber-500/50"
  const headerBg = isCritical ? "bg-red-500/10" : "bg-amber-500/10"

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">

      {/* Header banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border p-5 ${headerBg} ${headerBorder} flex items-start justify-between gap-4 flex-wrap`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${headerBg} border ${headerBorder}`}>
            {isCritical
              ? <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
              : <AlertTriangle className="w-6 h-6 text-amber-400" />
            }
          </div>
          <div>
            <h2 className={`text-xl font-bold ${headerColor}`}>
              {isCritical ? "Critical — Immediate Optimisation Required" : "Warning — Preventive Optimisation Available"}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {isCritical
                ? "Grid instability is at critical threshold. Execute ring-fence failover and load reduction immediately to protect safety systems."
                : "Grid instability detected. Run preventive optimisation now to prevent escalation to critical status."}
            </p>
          </div>
        </div>
        {/* Progress pill */}
        {totalCount > 0 && (
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <div className={`text-2xl font-bold ${doneCount === totalCount ? "text-emerald-400" : headerColor}`}>
                {doneCount}/{totalCount}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wide">Actions Complete</div>
            </div>
            <div className="w-16 h-16 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={doneCount === totalCount ? "#10b981" : isCritical ? "#ef4444" : "#f59e0b"}
                  strokeWidth="3" strokeLinecap="round"
                  strokeDasharray="100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - progress }}
                  transition={{ duration: 0.6 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-300">{progress}%</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Optimise All button */}
      {!optimiseDone && (
        <div className="flex items-center gap-3">
          <motion.button
            onClick={runAll}
            disabled={optimising || doneCount === totalCount}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${optimising || doneCount === totalCount
                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                : isCritical
                  ? "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30"
                  : "bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
              }`}
          >
            {optimising
              ? <><Loader2 className="w-4 h-4 animate-spin" />Running All Actions...</>
              : <><PlayCircle className="w-4 h-4" />Run All Optimisation Actions</>
            }
          </motion.button>
          <span className="text-xs text-slate-500">
            {optimising ? "Executing sequence — do not interrupt" : "Executes all actions in priority order. PTW-authorised actions will prompt confirmation."}
          </span>
        </div>
      )}

      {/* Success state */}
      <AnimatePresence>
        {optimiseDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 flex items-center gap-4"
          >
            <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-emerald-400 font-semibold">All optimisation actions complete — system returning to normal</div>
              <div className="text-sm text-slate-400 mt-1">Safety-critical loads secured. Load reduced. Kolomela notified. Reverting to Stable scenario now.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      {doneCount > 0 && !optimiseDone && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Optimisation progress</span>
            <span>{progress}% complete</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${isCritical ? "bg-red-400" : "bg-amber-400"}`}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      {/* Action cards grid */}
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, i) => {
          const cat  = categoryColour(action.category)
          const isDone    = action.status === "done"
          const isRunning = runningId === action.id
          const isAuth    = authPending === action.id

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl border p-4 transition-all ${
                isDone
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : isAuth
                  ? "bg-amber-500/10 border-amber-500/50"
                  : "bg-[#0d1419] border-slate-700/50"
              }`}
            >
              <div className="flex items-start gap-4">

                {/* Status icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDone    ? "bg-emerald-500/20" :
                  isRunning ? "bg-slate-700" :
                  cat.bg
                } border ${isDone ? "border-emerald-500/30" : isRunning ? "border-slate-600" : cat.border}`}>
                  {isDone    ? <CheckCircle className="w-5 h-5 text-emerald-400" /> :
                   isRunning ? <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" /> :
                   action.category === "safety"  ? <ShieldCheck className={`w-5 h-5 ${cat.text}`} /> :
                   action.category === "energy"  ? <Sun className={`w-5 h-5 ${cat.text}`} /> :
                   action.category === "load"    ? <Activity className={`w-5 h-5 ${cat.text}`} /> :
                                                   <Zap className={`w-5 h-5 ${cat.text}`} />
                  }
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className={`font-semibold text-sm ${isDone ? "text-emerald-400" : "text-slate-200"}`}>
                          {action.title}
                        </h3>
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${cat.bg} ${cat.border} ${cat.text}`}>
                          {cat.label}
                        </span>
                        {action.requiresAuth && !isDone && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border bg-amber-500/10 border-amber-500/30 text-amber-400">
                            PTW Auth Required
                          </span>
                        )}
                        {isDone && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                            Complete
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{action.description}</p>
                    </div>

                    {/* Action button */}
                    {!isDone && (
                      <div className="flex-shrink-0">
                        {isAuth ? (
                          <div className="flex flex-col gap-1.5 items-end">
                            <p className="text-xs text-amber-400 font-medium">Confirm PTW authorisation?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setAuthPending(null)}
                                className="px-3 py-1.5 rounded-lg text-xs border border-slate-600 text-slate-400 hover:bg-slate-800"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => runAction(action.id)}
                                className="px-3 py-1.5 rounded-lg text-xs bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:bg-amber-500/30 font-semibold"
                              >
                                Confirm & Execute
                              </button>
                            </div>
                          </div>
                        ) : isRunning ? (
                          <div className="flex items-center gap-2 text-xs text-cyan-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Executing...
                          </div>
                        ) : (
                          <button
                            onClick={() => runAction(action.id)}
                            disabled={!!runningId}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                              ${runningId ? "opacity-40 cursor-not-allowed" : ""}
                              ${isCritical
                                ? "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30"
                                : "bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30"
                              }`}
                          >
                            Execute <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-1 text-slate-500">
                      <TrendingDown className="w-3 h-3" />
                      <span className={`font-medium ${
                        action.impactLevel === "high"   ? "text-red-400" :
                        action.impactLevel === "medium" ? "text-amber-400" : "text-emerald-400"
                      }`}>{action.impact}</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{action.timeEstimate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Reset link */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => fresh(scenario)}
          className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset actions
        </button>
      </div>
    </div>
  )
}
