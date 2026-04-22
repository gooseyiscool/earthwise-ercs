"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield, CheckCircle, XCircle, AlertTriangle, FileText,
  Users, Clock, Lock, Unlock, ChevronDown, ChevronUp,
  Scale, TrendingUp, Activity, ChevronRight, ArrowRight,
} from "lucide-react"

interface GovernanceTabProps {
  scenario: "stable" | "warning" | "critical"
}

interface ChecklistItem {
  id: string; label: string; description: string; required: boolean; checked: boolean
}

interface ResponseAction {
  id: string; label: string; description: string
  safetyScore: number; uptimeScore: number
  riskLevel: "low" | "medium" | "high"
  impactAnalysis: string; personnelAffected: number; estimatedDowntime: string
  authorisation: string
}

export function GovernanceTab({ scenario }: GovernanceTabProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "risk",          label: "Risk Assessment",        description: "Current risk level assessed and documented",             required: true,  checked: false },
    { id: "personnel",     label: "Personnel Accounted",    description: "All personnel in affected areas notified",               required: true,  checked: false },
    { id: "backup",        label: "Backup Systems Verified",description: "BESS and solar backup confirmed operational",            required: true,  checked: false },
    { id: "communication", label: "Comms Channels Active",  description: "Radio and emergency comms tested",                      required: true,  checked: false },
    { id: "supervisor",    label: "Supervisor Approval",    description: "Shift supervisor reviewed and approved",                 required: true,  checked: false },
    { id: "documentation", label: "Pre-Action Documentation",description: "Action plan documented before execution",              required: false, checked: false },
  ])

  const [expandedProc, setExpandedProc] = useState<string | null>(null)
  const [isApproved, setIsApproved]     = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const responseActions: ResponseAction[] = [
    {
      id: "maintain", label: "Maintain Operations", authorisation: "Operator",
      description: "Continue current operations with enhanced monitoring",
      safetyScore:  scenario === "critical" ? 35 : scenario === "warning" ? 65 : 95,
      uptimeScore:  100,
      riskLevel:    scenario === "critical" ? "high" : scenario === "warning" ? "medium" : "low",
      impactAnalysis: scenario === "critical"
        ? "High risk of equipment damage and safety incidents. Ventilation systems may fail within 30 minutes."
        : scenario === "warning"
        ? "Moderate risk of escalation. Processing efficiency reduced by 15–20%."
        : "Normal operations with standard monitoring protocols.",
      personnelAffected: 0, estimatedDowntime: "0 hours",
    },
    {
      id: "reduce", label: "Reduce Load", authorisation: "Shift Supervisor",
      description: "Scale back non-critical operations to reduce grid demand",
      safetyScore:  scenario === "critical" ? 65 : 85,
      uptimeScore:  65,
      riskLevel:    scenario === "critical" ? "medium" : "low",
      impactAnalysis: scenario === "critical"
        ? "Reduces immediate risk but may not prevent cascade failure. Processing output reduced by 40%."
        : "Stabilizes grid connection. Production targets may be missed by 15%.",
      personnelAffected: 45, estimatedDowntime: "2–4 hours partial",
    },
    {
      id: "shutdown", label: "Controlled Shutdown", authorisation: "Operations Manager + SHE Officer",
      description: "Initiate safe PTW shutdown sequence for affected areas",
      safetyScore:  98, uptimeScore: 0, riskLevel: "low",
      impactAnalysis: "Maximum safety protection. All personnel evacuated from risk zones. Full production loss during shutdown period.",
      personnelAffected: 180, estimatedDowntime: "4–8 hours full",
    },
  ]

  const procedures = [
    {
      id: "loadshed", title: "Load Shedding Response", steps: [
        "Receive load shedding notification from Eskom/control room",
        "Verify BESS and solar backup capacity",
        "Notify all shift supervisors in affected areas",
        "Reduce non-critical loads per PTW reduction schedule",
        "Monitor critical systems throughout load shedding period",
        "Resume normal operations post load shedding",
      ],
    },
    {
      id: "emergency", title: "Emergency Shutdown Procedure", steps: [
        "Initiate emergency shutdown via SCADA",
        "Activate emergency ventilation protocols",
        "Account for all underground personnel",
        "Secure all mobile equipment",
        "Engage backup dewatering pumps",
        "Notify control room of shutdown status",
        "Document all actions under MHSA Section 11",
      ],
    },
    {
      id: "restart", title: "System Restart Procedure", steps: [
        "Confirm stable grid supply (minimum 15 minutes)",
        "Verify all safety interlocks",
        "Restart critical systems in sequence",
        "Gradually restore non-critical loads",
        "Monitor system stability for 30 minutes",
        "Resume normal operations and complete PTW close-out",
      ],
    },
  ]

  const requiredComplete = checklist.filter(i => i.required && i.checked).length
  const requiredTotal    = checklist.filter(i => i.required).length
  const canApprove       = requiredComplete === requiredTotal
  const progress         = Math.round((requiredComplete / requiredTotal) * 100)

  const riskColor = (r: string) => r === "high" ? "text-red-400" : r === "medium" ? "text-amber-400" : "text-emerald-400"
  const riskBg    = (r: string) => r === "high" ? "bg-red-500/10 border-red-500/30" : r === "medium" ? "bg-amber-500/10 border-amber-500/30" : "bg-emerald-500/10 border-emerald-500/30"

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Governance &amp; Safety</h2>
          <p className="text-sm text-slate-500">Permit-to-Work compliance, response protocols, and authorisation</p>
        </div>
        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border ${canApprove ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30"}`}>
          <Shield className={`w-4 h-4 ${canApprove ? "text-emerald-400" : "text-amber-400"}`} />
          <span className={`text-sm font-semibold ${canApprove ? "text-emerald-400" : "text-amber-400"}`}>
            {requiredComplete}/{requiredTotal} PTW Checks Complete
          </span>
        </div>
      </div>

      {/* Current situation banner */}
      <motion.div className={`rounded-xl border p-4 flex items-center gap-4 ${
        scenario === "critical" ? "bg-red-500/10 border-red-500/40" : scenario === "warning" ? "bg-amber-500/10 border-amber-500/40" : "bg-emerald-500/10 border-emerald-500/30"
      }`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        {scenario === "critical" ? <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" /> : scenario === "warning" ? <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" /> : <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />}
        <div>
          <p className={`font-semibold ${scenario === "critical" ? "text-red-400" : scenario === "warning" ? "text-amber-400" : "text-emerald-400"}`}>
            {scenario === "critical" ? "Immediate Action Required — Complete PTW checklist before executing any response" : scenario === "warning" ? "Precautionary Measures Advised — Review options below" : "Normal Operations — Standard monitoring active"}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {scenario === "critical" ? "Recommended: Controlled Shutdown for maximum safety protection" : scenario === "warning" ? "Recommended: Reduce Load to stabilise grid before escalation" : "Recommended: Maintain Operations with enhanced monitoring"}
          </p>
        </div>
        <ArrowRight className={`w-4 h-4 ml-auto flex-shrink-0 ${scenario === "critical" ? "text-red-400" : scenario === "warning" ? "text-amber-400" : "text-emerald-400"}`} />
      </motion.div>

      <div className="grid grid-cols-12 gap-5">

        {/* PTW Checklist */}
        <div className="col-span-4">
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-5 h-full">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-200">Permit-to-Work Safety Gate</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Complete all required checks before any energy response action can be authorised.</p>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Completion</span>
                <span className={canApprove ? "text-emerald-400 font-semibold" : "text-amber-400"}>{progress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div className={`h-full rounded-full ${canApprove ? "bg-emerald-500" : "bg-amber-500"}`}
                  animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
              </div>
            </div>

            <div className="space-y-2">
              {checklist.map((item, i) => (
                <motion.button key={item.id} onClick={() => setChecklist(prev => prev.map(c => c.id === item.id ? { ...c, checked: !c.checked } : c))}
                  className={`w-full p-3 rounded-xl text-left transition-all border ${item.checked ? "bg-emerald-500/10 border-emerald-500/30" : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70"}`}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${item.checked ? "bg-emerald-500 border-emerald-500" : "border-slate-600"}`}>
                      {item.checked && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-medium ${item.checked ? "text-emerald-400" : "text-slate-300"}`}>{item.label}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${item.required ? "bg-amber-500/20 text-amber-400" : "bg-slate-700 text-slate-400"}`}>
                          {item.required ? "Required" : "Optional"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{item.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Approve button */}
            <div className="mt-5 pt-4 border-t border-slate-700/50">
              <AnimatePresence mode="wait">
                {isApproved ? (
                  <motion.div key="approved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center"><Unlock className="w-5 h-5 text-emerald-400" /></div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-400">Action Approved</p>
                        <p className="text-xs text-slate-500">Approved at {new Date().toLocaleTimeString()} by Shift Supervisor</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="pending">
                    <button onClick={() => canApprove && setIsApproved(true)} disabled={!canApprove}
                      className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                        canApprove ? "bg-emerald-500 text-slate-900 hover:bg-emerald-400" : "bg-slate-800 text-slate-500 cursor-not-allowed"
                      }`}>
                      {canApprove ? <><Unlock className="w-4 h-4" />Approve Action</> : <><Lock className="w-4 h-4" />Complete Required Checks</>}
                    </button>
                    {!canApprove && <p className="text-xs text-center text-slate-500 mt-2">{requiredTotal - requiredComplete} checks remaining</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Safety vs Reliability */}
        <div className="col-span-5 space-y-4">
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <Scale className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-200">Safety vs Reliability Trade-off</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Select a response option to view its impact analysis, risk level, and authorisation requirement.</p>

            <div className="space-y-3">
              {responseActions.map(action => (
                <motion.button key={action.id} onClick={() => setSelectedAction(selectedAction === action.id ? null : action.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${selectedAction === action.id ? "bg-cyan-500/5 border-cyan-500/40" : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70"}`}
                  whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.998 }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-slate-200 text-sm">{action.label}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${riskBg(action.riskLevel)} ${riskColor(action.riskLevel)}`}>
                          {action.riskLevel.toUpperCase()} RISK
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{action.description}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 ml-2 transition-transform ${selectedAction === action.id ? "rotate-180" : ""}`} />
                  </div>

                  {/* Score bars */}
                  <div className="grid grid-cols-2 gap-4">
                    {[{ label: "Safety Score", val: action.safetyScore }, { label: "Uptime Score", val: action.uptimeScore }].map(bar => (
                      <div key={bar.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-slate-500">{bar.label}</span>
                          <span className={`text-xs font-bold ${bar.val >= 80 ? "text-emerald-400" : bar.val >= 50 ? "text-amber-400" : "text-red-400"}`}>{bar.val}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div className={`h-full ${bar.val >= 80 ? "bg-emerald-500" : bar.val >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                            initial={{ width: 0 }} animate={{ width: `${bar.val}%` }} transition={{ duration: 0.5, delay: 0.1 }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {selectedAction === action.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-slate-700/40 space-y-3">
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2"><Activity className="w-3.5 h-3.5 text-cyan-400" /><span className="text-xs font-semibold text-slate-300">Impact Analysis</span></div>
                          <p className="text-xs text-slate-400 leading-relaxed">{action.impactAnalysis}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                            <p className="text-[10px] text-slate-500 mb-1">Personnel</p>
                            <p className="text-lg font-bold text-slate-200">{action.personnelAffected}</p>
                          </div>
                          <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                            <p className="text-[10px] text-slate-500 mb-1">Downtime</p>
                            <p className="text-sm font-bold text-slate-200">{action.estimatedDowntime}</p>
                          </div>
                          <div className="p-3 bg-slate-800/50 rounded-lg text-center">
                            <p className="text-[10px] text-slate-500 mb-1">Auth Level</p>
                            <p className="text-[11px] font-bold text-amber-400 leading-tight">{action.authorisation}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: SOPs + Escalation */}
        <div className="col-span-3 space-y-4">

          {/* SOPs */}
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4"><FileText className="w-4 h-4 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-200">Standard Procedures</h3></div>
            <div className="space-y-2">
              {procedures.map(proc => (
                <div key={proc.id} className="border border-slate-700/40 rounded-xl overflow-hidden">
                  <button onClick={() => setExpandedProc(expandedProc === proc.id ? null : proc.id)}
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors">
                    <span className="text-xs font-semibold text-slate-300">{proc.title}</span>
                    {expandedProc === proc.id ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                  </button>
                  <AnimatePresence>
                    {expandedProc === proc.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-700/40">
                        <div className="p-3 space-y-2">
                          {proc.steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                              <span className="text-slate-400 pt-0.5 leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Authorisation Matrix */}
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4"><Users className="w-4 h-4 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-200">Authorisation Matrix</h3></div>
            <div className="space-y-2">
              {[
                { action: "Maintain Operations", level: "Operator", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                { action: "Reduce Load", level: "Supervisor", color: "text-amber-400", bg: "bg-amber-500/10" },
                { action: "Controlled Shutdown", level: "Manager + SHE", color: "text-red-400", bg: "bg-red-500/10" },
              ].map((row, i) => (
                <div key={i} className={`p-2.5 rounded-lg ${row.bg} flex items-center justify-between`}>
                  <span className="text-xs text-slate-300">{row.action}</span>
                  <span className={`text-[10px] font-bold ${row.color}`}>{row.level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Escalation path */}
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-4 h-4 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-200">Escalation Path</h3></div>
            <div className="space-y-2">
              {[
                { role: "Shift Supervisor", time: "Immediate", color: "bg-emerald-500/20 text-emerald-400" },
                { role: "Operations Manager", time: "5 min",     color: "bg-amber-500/20 text-amber-400" },
                { role: "Safety Manager",    time: "10 min",    color: "bg-orange-500/20 text-orange-400" },
                { role: "Mine Manager",      time: "15 min",    color: "bg-red-500/20 text-red-400" },
              ].map((level, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${level.color}`}>{i + 1}</div>
                  <div className="flex-1"><p className="text-xs text-slate-300">{level.role}</p></div>
                  <span className="text-[10px] text-slate-500 font-mono">{level.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
