"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText, Search, Filter, Download, AlertTriangle,
  CheckCircle, Clock, User, Zap, Shield, Activity, ChevronDown,
} from "lucide-react"

interface AuditEntry {
  id: string
  timestamp: string
  event: string
  category: "action" | "alert" | "system" | "safety"
  severity: "info" | "warning" | "critical"
  user: string
  role: string
  details: string
  riskLevel?: number
  mhsaRef?: string
}

const mockAuditLog: AuditEntry[] = [
  {
    id: "1", timestamp: "2024-03-20 14:32:15", event: "Load Reduction Initiated",
    category: "action", severity: "warning", user: "J. Van Der Berg", role: "Shift Supervisor",
    details: "Non-critical loads reduced by 25% in response to grid instability warning. Conveyor B and stockpile operations deferred.",
    riskLevel: 45, mhsaRef: "MHSA-S11-2024-0312",
  },
  {
    id: "2", timestamp: "2024-03-20 14:30:00", event: "Grid Instability Warning",
    category: "alert", severity: "warning", user: "System", role: "SCADA",
    details: "Voltage drop detected: 128kV (threshold: 130kV). Eskom Stage 2 load shedding announced for 14:00–16:00.",
    mhsaRef: "AUTO-SCADA-2024-0891",
  },
  {
    id: "3", timestamp: "2024-03-20 14:28:45", event: "PTW Safety Check Completed",
    category: "safety", severity: "info", user: "M. Nkosi", role: "Safety Officer",
    details: "Pre-action safety checklist completed. All 5 required checks verified. Permit-to-Work authorisation granted.",
    mhsaRef: "PTW-2024-0445",
  },
  {
    id: "4", timestamp: "2024-03-20 12:15:00", event: "Normal Operations Resumed",
    category: "system", severity: "info", user: "System", role: "Auto",
    details: "Grid stability restored. All systems returned to normal operation mode. BESS recharging initiated.",
    mhsaRef: "SYS-AUTO-2024-0210",
  },
  {
    id: "5", timestamp: "2024-03-20 10:45:30", event: "Controlled Shutdown Executed",
    category: "action", severity: "critical", user: "P. Mokoena", role: "Operations Manager",
    details: "Sishen processing plant shutdown initiated. Dual authorisation obtained from Ops Manager and SHE Officer. All 180 personnel accounted for.",
    riskLevel: 85, mhsaRef: "MHSA-S11-2024-0309",
  },
  {
    id: "6", timestamp: "2024-03-20 10:42:00", event: "Critical Grid Alert — SCADA",
    category: "alert", severity: "critical", user: "System", role: "SCADA",
    details: "Grid frequency dropped to 48.5Hz. Critical threshold of 49.0Hz breached. Ring-fence failover triggered automatically.",
    mhsaRef: "AUTO-SCADA-2024-0888",
  },
  {
    id: "7", timestamp: "2024-03-20 10:40:15", event: "Emergency Ventilation Protocol",
    category: "safety", severity: "critical", user: "System", role: "Auto",
    details: "Automatic emergency ventilation protocol activated for underground areas. BESS providing 100% of ventilation load.",
    mhsaRef: "PTW-2024-0440",
  },
  {
    id: "8", timestamp: "2024-03-20 08:00:00", event: "Day Shift Handover Completed",
    category: "system", severity: "info", user: "A. Smith", role: "Shift Supervisor",
    details: "Day shift commenced. All systems nominal. No outstanding issues from night shift. BESS at 100% capacity.",
    mhsaRef: "OPS-HAND-2024-0122",
  },
]

const catConfig = {
  action:  { label: "Action",  color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
  alert:   { label: "Alert",   color: "text-amber-400",   bg: "bg-amber-500/20",   border: "border-amber-500/30" },
  system:  { label: "System",  color: "text-cyan-400",    bg: "bg-cyan-500/20",    border: "border-cyan-500/30" },
  safety:  { label: "Safety",  color: "text-purple-400",  bg: "bg-purple-500/20",  border: "border-purple-500/30" },
}

const sevConfig = {
  critical: { label: "Critical", color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/40" },
  warning:  { label: "Warning",  color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/40" },
  info:     { label: "Info",     color: "text-slate-300",  bg: "bg-slate-800/50",  border: "border-slate-700/50" },
}

const catIcon = (cat: string) => {
  if (cat === "action") return <Activity className="w-4 h-4" />
  if (cat === "alert")  return <AlertTriangle className="w-4 h-4" />
  if (cat === "system") return <Zap className="w-4 h-4" />
  return <Shield className="w-4 h-4" />
}

export function AuditTab() {
  const [search, setSearch] = useState("")
  const [filterCat, setFilterCat] = useState<string | null>(null)
  const [filterSev, setFilterSev] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = mockAuditLog.filter(e => {
    const matchSearch = e.event.toLowerCase().includes(search.toLowerCase()) ||
      e.details.toLowerCase().includes(search.toLowerCase()) ||
      e.user.toLowerCase().includes(search.toLowerCase())
    return matchSearch &&
      (!filterCat || e.category === filterCat) &&
      (!filterSev || e.severity === filterSev)
  })

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Audit Trail</h2>
          <p className="text-sm text-slate-500">MHSA Section 11 compliant decision and event log</p>
        </div>
        <button className="px-4 py-2 bg-[#0d1419] border border-slate-700/50 rounded-xl text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export MHSA Log
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Events", value: mockAuditLog.length, sub: "Last 24 hours", icon: <FileText className="w-4 h-4 text-cyan-400" />, color: "border-cyan-500/30" },
          { label: "Critical Events", value: mockAuditLog.filter(e => e.severity === "critical").length, sub: "Require review", icon: <AlertTriangle className="w-4 h-4 text-red-400" />, color: "border-red-500/30" },
          { label: "PTW Actions", value: mockAuditLog.filter(e => e.category === "action").length, sub: "All authorised", icon: <Activity className="w-4 h-4 text-emerald-400" />, color: "border-emerald-500/30" },
          { label: "Safety Checks", value: mockAuditLog.filter(e => e.category === "safety").length, sub: "100% compliant", icon: <Shield className="w-4 h-4 text-purple-400" />, color: "border-purple-500/30" },
        ].map((s, i) => (
          <motion.div key={i} className={`bg-[#0d1419] border rounded-xl p-4 ${s.color}`}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-center justify-between mb-2">{s.icon}<span className="text-[10px] text-slate-500 uppercase tracking-wide">{s.label}</span></div>
            <div className="text-3xl font-bold text-slate-200">{s.value}</div>
            <div className="text-[11px] text-slate-500 mt-1">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search events, users, or details..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0d1419] border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50" />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          {Object.entries(catConfig).map(([key, cfg]) => (
            <button key={key} onClick={() => setFilterCat(filterCat === key ? null : key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filterCat === key ? `${cfg.bg} ${cfg.border} ${cfg.color}` : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800"}`}>
              {cfg.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {Object.entries(sevConfig).map(([key, cfg]) => (
            <button key={key} onClick={() => setFilterSev(filterSev === key ? null : key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filterSev === key ? `${cfg.bg} ${cfg.border} ${cfg.color}` : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800"}`}>
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log */}
      <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-5 py-2.5 border-b border-slate-700/50 text-[10px] text-slate-500 uppercase tracking-wide">
          <span className="col-span-1">Severity</span>
          <span className="col-span-2">Timestamp</span>
          <span className="lg:col-span-3">Event</span>
          <span className="col-span-2">User / Role</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-2">MHSA Ref</span>
        </div>

        <div className="divide-y divide-slate-700/30">
          {filtered.map((entry, i) => {
            const sev = sevConfig[entry.severity]
            const cat = catConfig[entry.category]
            const isOpen = expanded === entry.id

            return (
              <motion.div key={entry.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <button onClick={() => setExpanded(isOpen ? null : entry.id)}
                  className={`w-full grid grid-cols-1 lg:grid-cols-12 gap-4 px-5 py-3.5 text-left hover:bg-slate-800/30 transition-colors items-center ${isOpen ? "bg-slate-800/20" : ""}`}>

                  {/* Severity dot */}
                  <div className="col-span-1 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${entry.severity === "critical" ? "bg-red-500 animate-pulse" : entry.severity === "warning" ? "bg-amber-500" : "bg-slate-500"}`} />
                    <span className={`text-[10px] font-semibold uppercase ${sev.color}`}>{sev.label}</span>
                  </div>

                  {/* Timestamp */}
                  <div className="col-span-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span className="font-mono">{entry.timestamp.split(" ")[1]}</span>
                    <span className="text-slate-600 text-[10px]">{entry.timestamp.split(" ")[0]}</span>
                  </div>

                  {/* Event */}
                  <div className="lg:col-span-3">
                    <span className={`text-sm font-medium ${sev.color}`}>{entry.event}</span>
                  </div>

                  {/* User */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-300 flex-shrink-0">
                        {entry.user === "System" ? "SY" : entry.user.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-xs text-slate-300 leading-tight">{entry.user}</p>
                        <p className="text-[10px] text-slate-500">{entry.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold border ${cat.bg} ${cat.border} ${cat.color}`}>
                      {catIcon(entry.category)}{cat.label}
                    </span>
                  </div>

                  {/* MHSA Ref */}
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{entry.mhsaRef}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {/* Expanded details */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-700/30">
                      <div className="px-5 py-4 bg-slate-800/20">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cat.bg} ${cat.color}`}>
                            {catIcon(entry.category)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-300 leading-relaxed">{entry.details}</p>
                            {entry.riskLevel !== undefined && (
                              <div className="flex items-center gap-3 mt-3">
                                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Risk Level</span>
                                <div className="flex-1 max-w-[200px] h-2 bg-slate-700 rounded-full overflow-hidden">
                                  <motion.div className={`h-full ${entry.riskLevel >= 70 ? "bg-red-500" : entry.riskLevel >= 40 ? "bg-amber-500" : "bg-emerald-500"}`}
                                    initial={{ width: 0 }} animate={{ width: `${entry.riskLevel}%` }} />
                                </div>
                                <span className={`text-xs font-bold ${entry.riskLevel >= 70 ? "text-red-400" : entry.riskLevel >= 40 ? "text-amber-400" : "text-emerald-400"}`}>
                                  {entry.riskLevel}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
