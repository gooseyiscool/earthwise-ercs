"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Users,
  Clock,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Scale,
  TrendingUp,
  Activity,
} from "lucide-react"

interface GovernanceTabProps {
  scenario: "stable" | "warning" | "critical"
}

interface ChecklistItem {
  id: string
  label: string
  description: string
  required: boolean
  checked: boolean
}

interface ResponseAction {
  id: string
  label: string
  description: string
  safetyScore: number
  uptimeScore: number
  riskLevel: "low" | "medium" | "high"
  impactAnalysis: string
  personnelAffected: number
  estimatedDowntime: string
}

export function GovernanceTab({ scenario }: GovernanceTabProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "risk",
      label: "Risk Assessment Completed",
      description: "Current risk level has been assessed and documented",
      required: true,
      checked: false,
    },
    {
      id: "personnel",
      label: "Personnel Accounted For",
      description: "All personnel in affected areas have been notified",
      required: true,
      checked: false,
    },
    {
      id: "backup",
      label: "Backup Systems Verified",
      description: "Battery and solar backup systems confirmed operational",
      required: true,
      checked: false,
    },
    {
      id: "communication",
      label: "Communication Channels Active",
      description: "Radio and emergency communication systems tested",
      required: true,
      checked: false,
    },
    {
      id: "supervisor",
      label: "Shift Supervisor Approval",
      description: "Shift supervisor has reviewed and approved the action",
      required: true,
      checked: false,
    },
    {
      id: "documentation",
      label: "Pre-Action Documentation",
      description: "Action plan documented before execution",
      required: false,
      checked: false,
    },
  ])

  const [expandedProcedure, setExpandedProcedure] = useState<string | null>(null)
  const [isApproved, setIsApproved] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)

  const responseActions: ResponseAction[] = [
    {
      id: "maintain",
      label: "Maintain Operations",
      description: "Continue current operations with enhanced monitoring",
      safetyScore: scenario === "critical" ? 35 : scenario === "warning" ? 65 : 95,
      uptimeScore: 100,
      riskLevel: scenario === "critical" ? "high" : scenario === "warning" ? "medium" : "low",
      impactAnalysis: scenario === "critical" 
        ? "High risk of equipment damage and safety incidents. Ventilation systems may fail within 30 minutes."
        : scenario === "warning"
        ? "Moderate risk of escalation. Processing efficiency reduced by 15-20%."
        : "Normal operations with standard monitoring protocols.",
      personnelAffected: 0,
      estimatedDowntime: "0 hours",
    },
    {
      id: "reduce",
      label: "Reduce Load",
      description: "Scale back non-critical operations to reduce grid demand",
      safetyScore: scenario === "critical" ? 65 : 85,
      uptimeScore: 65,
      riskLevel: scenario === "critical" ? "medium" : "low",
      impactAnalysis: scenario === "critical"
        ? "Reduces immediate risk but may not prevent cascade failure. Processing output reduced by 40%."
        : "Stabilizes grid connection. Production targets may be missed by 15%.",
      personnelAffected: 45,
      estimatedDowntime: "2-4 hours partial",
    },
    {
      id: "shutdown",
      label: "Controlled Shutdown",
      description: "Initiate safe shutdown sequence for affected areas",
      safetyScore: 98,
      uptimeScore: 0,
      riskLevel: "low",
      impactAnalysis: "Maximum safety protection. All personnel evacuated from risk zones. Full production loss during shutdown period.",
      personnelAffected: 180,
      estimatedDowntime: "4-8 hours full",
    },
  ]

  const requiredComplete = checklist.filter((item) => item.required && item.checked).length
  const requiredTotal = checklist.filter((item) => item.required).length
  const canApprove = requiredComplete === requiredTotal

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const handleApprove = () => {
    if (canApprove) {
      setIsApproved(true)
    }
  }

  const procedures = [
    {
      id: "loadshed",
      title: "Load Shedding Response Procedure",
      steps: [
        "Receive load shedding notification from Eskom/control room",
        "Verify battery and solar backup capacity",
        "Notify all shift supervisors in affected areas",
        "Reduce non-critical loads per reduction schedule",
        "Monitor critical systems throughout load shedding period",
        "Resume normal operations post load shedding",
      ],
    },
    {
      id: "emergency",
      title: "Emergency Shutdown Procedure",
      steps: [
        "Initiate emergency shutdown sequence via SCADA",
        "Activate emergency ventilation protocols",
        "Account for all underground personnel",
        "Secure all mobile equipment",
        "Engage backup dewatering pumps",
        "Notify control room of shutdown status",
        "Document all actions taken",
      ],
    },
    {
      id: "restart",
      title: "System Restart Procedure",
      steps: [
        "Confirm stable grid supply (minimum 15 minutes)",
        "Verify all safety interlocks",
        "Restart critical systems in sequence",
        "Gradually restore non-critical loads",
        "Monitor system stability for 30 minutes",
        "Resume normal operations",
      ],
    },
  ]

  const getRiskColor = (risk: string) => {
    if (risk === "high") return "text-red-400"
    if (risk === "medium") return "text-amber-400"
    return "text-emerald-400"
  }

  const getRiskBg = (risk: string) => {
    if (risk === "high") return "bg-red-500/20 border-red-500/30"
    if (risk === "medium") return "bg-amber-500/20 border-amber-500/30"
    return "bg-emerald-500/20 border-emerald-500/30"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Governance & Safety</h2>
          <p className="text-sm text-slate-500">Permit-to-Work, safety protocols, and decision support</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className={`w-5 h-5 ${canApprove ? "text-emerald-400" : "text-amber-400"}`} />
          <span className={`text-sm font-medium ${canApprove ? "text-emerald-400" : "text-amber-400"}`}>
            {requiredComplete}/{requiredTotal} Required Checks Complete
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Permit to Work Checklist */}
        <div className="col-span-4 space-y-4">
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">Permit-to-Work Safety Gate</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Complete all required safety checks before approving any energy response action.
            </p>

            <div className="space-y-2">
              {checklist.map((item, i) => (
                <motion.button
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all border ${
                    item.checked
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        item.checked
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-slate-600"
                      }`}
                    >
                      {item.checked && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${item.checked ? "text-emerald-400" : "text-slate-300"}`}>
                          {item.label}
                        </span>
                        {item.required ? (
                          <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                            Required
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Approval Button */}
            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <AnimatePresence mode="wait">
                {isApproved ? (
                  <motion.div
                    key="approved"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <Unlock className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-emerald-400">Action Approved</p>
                        <p className="text-xs text-slate-500">
                          Approved at {new Date().toLocaleTimeString()} by Shift Supervisor
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="pending">
                    <button
                      onClick={handleApprove}
                      disabled={!canApprove}
                      className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        canApprove
                          ? "bg-emerald-500 text-slate-900 hover:bg-emerald-400"
                          : "bg-slate-800 text-slate-500 cursor-not-allowed"
                      }`}
                    >
                      {canApprove ? (
                        <>
                          <Unlock className="w-4 h-4" />
                          Approve Action
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Complete Required Checks
                        </>
                      )}
                    </button>
                    {!canApprove && (
                      <p className="text-xs text-center text-slate-500 mt-2">
                        {requiredTotal - requiredComplete} required checks remaining
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Safety vs Reliability Section */}
        <div className="col-span-5 space-y-4">
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">Safety vs Reliability Trade-off</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Select a response action to view safety score, uptime impact, and risk assessment.
            </p>

            <div className="space-y-3">
              {responseActions.map((action) => (
                <motion.button
                  key={action.id}
                  onClick={() => setSelectedAction(action.id)}
                  className={`w-full p-4 rounded-lg text-left transition-all border ${
                    selectedAction === action.id
                      ? "bg-cyan-500/10 border-cyan-500/50"
                      : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-medium text-slate-200">{action.label}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRiskBg(action.riskLevel)} ${getRiskColor(action.riskLevel)}`}>
                      {action.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>

                  {/* Score bars */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-500">Safety Score</span>
                        <span className={`text-xs font-bold ${
                          action.safetyScore >= 80 ? "text-emerald-400" :
                          action.safetyScore >= 50 ? "text-amber-400" : "text-red-400"
                        }`}>{action.safetyScore}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            action.safetyScore >= 80 ? "bg-emerald-500" :
                            action.safetyScore >= 50 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${action.safetyScore}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-500">Uptime Score</span>
                        <span className={`text-xs font-bold ${
                          action.uptimeScore >= 80 ? "text-emerald-400" :
                          action.uptimeScore >= 50 ? "text-amber-400" : "text-red-400"
                        }`}>{action.uptimeScore}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            action.uptimeScore >= 80 ? "bg-emerald-500" :
                            action.uptimeScore >= 50 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${action.uptimeScore}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {selectedAction === action.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-slate-700/50 space-y-3"
                      >
                        {/* Impact Analysis */}
                        <div className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-medium text-slate-300">Impact Analysis</span>
                          </div>
                          <p className="text-xs text-slate-400">{action.impactAnalysis}</p>
                        </div>

                        {/* Personnel & Downtime */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-4 h-4 text-amber-400" />
                              <span className="text-xs text-slate-500">Personnel Affected</span>
                            </div>
                            <p className="text-lg font-bold text-slate-200">{action.personnelAffected}</p>
                          </div>
                          <div className="p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-amber-400" />
                              <span className="text-xs text-slate-500">Est. Downtime</span>
                            </div>
                            <p className="text-lg font-bold text-slate-200">{action.estimatedDowntime}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Current Status Alert */}
          <div className={`rounded-xl p-4 border ${
            scenario === "critical"
              ? "bg-red-500/10 border-red-500/30"
              : scenario === "warning"
              ? "bg-amber-500/10 border-amber-500/30"
              : "bg-emerald-500/10 border-emerald-500/30"
          }`}>
            <div className="flex items-center gap-3">
              {scenario === "critical" ? (
                <XCircle className="w-6 h-6 text-red-400" />
              ) : scenario === "warning" ? (
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              ) : (
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              )}
              <div>
                <p className={`font-medium ${
                  scenario === "critical" ? "text-red-400" : scenario === "warning" ? "text-amber-400" : "text-emerald-400"
                }`}>
                  {scenario === "critical"
                    ? "Immediate Action Required"
                    : scenario === "warning"
                    ? "Precautionary Measures Advised"
                    : "Normal Operations"}
                </p>
                <p className="text-xs text-slate-500">
                  {scenario === "critical"
                    ? "Recommend: Controlled Shutdown for maximum safety"
                    : scenario === "warning"
                    ? "Recommend: Reduce Load to stabilize grid"
                    : "Recommend: Maintain Operations with monitoring"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Procedures & Compliance */}
        <div className="col-span-3 space-y-4">
          {/* SOPs */}
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">Standard Procedures</h3>
            </div>

            <div className="space-y-2">
              {procedures.map((proc) => (
                <div key={proc.id} className="border border-slate-700/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedProcedure(expandedProcedure === proc.id ? null : proc.id)}
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-xs font-medium text-slate-300">{proc.title}</span>
                    {expandedProcedure === proc.id ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedProcedure === proc.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-700/50"
                      >
                        <div className="p-3 space-y-2">
                          {proc.steps.map((step, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                                {i + 1}
                              </span>
                              <span className="text-slate-400 pt-0.5">{step}</span>
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

          {/* Authorization Matrix */}
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">Authorization Matrix</h3>
            </div>

            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Maintain Operations</span>
                  <span className="text-xs text-emerald-400">Operator</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Reduce Load</span>
                  <span className="text-xs text-amber-400">Supervisor</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Controlled Shutdown</span>
                  <span className="text-xs text-red-400">Manager</span>
                </div>
              </div>
            </div>
          </div>

          {/* Escalation Path */}
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">Escalation Path</h3>
            </div>

            <div className="space-y-2">
              {[
                { role: "Shift Supervisor", time: "Immediate" },
                { role: "Operations Manager", time: "5 min" },
                { role: "Safety Manager", time: "10 min" },
                { role: "Mine Manager", time: "15 min" },
              ].map((level, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-300">{level.role}</p>
                  </div>
                  <span className="text-[10px] text-slate-500">{level.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
