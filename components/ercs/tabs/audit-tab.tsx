"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Zap,
  Shield,
  Activity,
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
}

const mockAuditLog: AuditEntry[] = [
  {
    id: "1",
    timestamp: "2024-03-20 14:32:15",
    event: "Load Reduction Initiated",
    category: "action",
    severity: "warning",
    user: "J. Van Der Berg",
    role: "Shift Supervisor",
    details: "Non-critical loads reduced by 25% in response to grid instability warning",
    riskLevel: 45,
  },
  {
    id: "2",
    timestamp: "2024-03-20 14:30:00",
    event: "Grid Instability Warning",
    category: "alert",
    severity: "warning",
    user: "System",
    role: "SCADA",
    details: "Voltage drop detected: 128kV (threshold: 130kV). Load shedding stage 2 announced.",
  },
  {
    id: "3",
    timestamp: "2024-03-20 14:28:45",
    event: "Safety Check Completed",
    category: "safety",
    severity: "info",
    user: "M. Nkosi",
    role: "Safety Officer",
    details: "Pre-action safety checklist completed. All 5 required checks verified.",
  },
  {
    id: "4",
    timestamp: "2024-03-20 12:15:00",
    event: "Normal Operations Resumed",
    category: "system",
    severity: "info",
    user: "System",
    role: "Auto",
    details: "Grid stability restored. All systems returned to normal operation mode.",
  },
  {
    id: "5",
    timestamp: "2024-03-20 10:45:30",
    event: "Controlled Shutdown Executed",
    category: "action",
    severity: "critical",
    user: "P. Mokoena",
    role: "Operations Manager",
    details: "Sishen processing plant shutdown initiated due to critical grid conditions",
    riskLevel: 85,
  },
  {
    id: "6",
    timestamp: "2024-03-20 10:42:00",
    event: "Critical Grid Alert",
    category: "alert",
    severity: "critical",
    user: "System",
    role: "SCADA",
    details: "Grid frequency dropped to 48.5Hz. Critical threshold breached.",
  },
  {
    id: "7",
    timestamp: "2024-03-20 10:40:15",
    event: "Emergency Protocol Activated",
    category: "safety",
    severity: "critical",
    user: "System",
    role: "Auto",
    details: "Automatic emergency ventilation protocol activated for underground areas",
  },
  {
    id: "8",
    timestamp: "2024-03-20 08:00:00",
    event: "Shift Handover Completed",
    category: "system",
    severity: "info",
    user: "A. Smith",
    role: "Shift Supervisor",
    details: "Day shift commenced. All systems nominal. No outstanding issues from night shift.",
  },
]

export function AuditTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null)

  const filteredLog = mockAuditLog.filter((entry) => {
    const matchesSearch =
      entry.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || entry.category === selectedCategory
    const matchesSeverity = !selectedSeverity || entry.severity === selectedSeverity
    return matchesSearch && matchesCategory && matchesSeverity
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "action":
        return <Activity className="w-4 h-4" />
      case "alert":
        return <AlertTriangle className="w-4 h-4" />
      case "system":
        return <Zap className="w-4 h-4" />
      case "safety":
        return <Shield className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400"
      case "warning":
        return "text-amber-400"
      default:
        return "text-cyan-400"
    }
  }

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 border-red-500/30"
      case "warning":
        return "bg-amber-500/10 border-amber-500/30"
      default:
        return "bg-slate-800/50 border-slate-700/50"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Audit Trail</h2>
          <p className="text-sm text-slate-500">Complete decision and event history</p>
        </div>
        <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Log
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search events, users, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0d1419] border border-slate-700/50 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <div className="flex gap-1">
            {["action", "alert", "system", "safety"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                    : "bg-slate-800 text-slate-400 border border-slate-700/50 hover:bg-slate-700"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Severity Filter */}
        <div className="flex gap-1">
          {["info", "warning", "critical"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(selectedSeverity === sev ? null : sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedSeverity === sev
                  ? sev === "critical"
                    ? "bg-red-500/20 text-red-400 border border-red-500/50"
                    : sev === "warning"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                    : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                  : "bg-slate-800 text-slate-400 border border-slate-700/50 hover:bg-slate-700"
              }`}
            >
              {sev.charAt(0).toUpperCase() + sev.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase">Total Events</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-200 mt-2">{mockAuditLog.length}</p>
          <p className="text-xs text-slate-500">Last 24 hours</p>
        </div>
        <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase">Actions Taken</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-200 mt-2">
            {mockAuditLog.filter((e) => e.category === "action").length}
          </p>
          <p className="text-xs text-emerald-400">All approved</p>
        </div>
        <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase">Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-200 mt-2">
            {mockAuditLog.filter((e) => e.category === "alert").length}
          </p>
          <p className="text-xs text-amber-400">
            {mockAuditLog.filter((e) => e.severity === "critical").length} critical
          </p>
        </div>
        <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase">Safety Checks</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-200 mt-2">
            {mockAuditLog.filter((e) => e.category === "safety").length}
          </p>
          <p className="text-xs text-emerald-400">100% compliant</p>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-300">Event Log</h3>
        </div>
        <div className="divide-y divide-slate-700/50">
          {filteredLog.map((entry, i) => (
            <motion.div
              key={entry.id}
              className={`p-4 hover:bg-slate-800/30 transition-colors ${getSeverityBg(entry.severity)}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    entry.severity === "critical"
                      ? "bg-red-500/20 text-red-400"
                      : entry.severity === "warning"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-cyan-500/20 text-cyan-400"
                  }`}
                >
                  {getCategoryIcon(entry.category)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className={`font-medium ${getSeverityColor(entry.severity)}`}>
                        {entry.event}
                      </h4>
                      <p className="text-sm text-slate-400 mt-1">{entry.details}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {entry.timestamp}
                      </div>
                      {entry.riskLevel !== undefined && (
                        <div
                          className={`mt-1 text-xs px-2 py-0.5 rounded-full ${
                            entry.riskLevel >= 70
                              ? "bg-red-500/20 text-red-400"
                              : entry.riskLevel >= 40
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          Risk: {entry.riskLevel}%
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User info */}
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1 text-slate-500">
                      <User className="w-3 h-3" />
                      <span>{entry.user}</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-500">{entry.role}</span>
                    <span className="text-slate-600">|</span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        entry.category === "action"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : entry.category === "alert"
                          ? "bg-amber-500/10 text-amber-400"
                          : entry.category === "safety"
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {entry.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
