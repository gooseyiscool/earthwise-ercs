"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Volume2,
  VolumeX,
  Zap,
  Shield,
  Factory,
} from "lucide-react"

interface Alert {
  id: string
  title: string
  description: string
  severity: "critical" | "warning" | "info"
  category: "grid" | "safety" | "equipment" | "system"
  timestamp: Date
  acknowledged: boolean
  source: string
}

interface AlertsTabProps {
  scenario: "stable" | "warning" | "critical"
}

export function AlertsTab({ scenario }: AlertsTabProps) {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      title: "Critical Grid Instability",
      description: "Grid frequency dropped below 49Hz threshold. Immediate action required to prevent cascading failures.",
      severity: "critical",
      category: "grid",
      timestamp: new Date(Date.now() - 5 * 60000),
      acknowledged: false,
      source: "SCADA System",
    },
    {
      id: "2",
      title: "Sishen Processing Affected",
      description: "Power supply to processing plant unstable. Conveyor systems showing intermittent faults.",
      severity: "critical",
      category: "equipment",
      timestamp: new Date(Date.now() - 8 * 60000),
      acknowledged: false,
      source: "Process Control",
    },
    {
      id: "3",
      title: "Load Shedding Stage 4 Active",
      description: "Eskom has implemented Stage 4 load shedding. Estimated duration: 4 hours.",
      severity: "warning",
      category: "grid",
      timestamp: new Date(Date.now() - 15 * 60000),
      acknowledged: true,
      source: "Eskom Notification",
    },
    {
      id: "4",
      title: "Battery Backup Engaged",
      description: "Battery storage system now providing 40% of load. Estimated reserve: 4 hours at current draw.",
      severity: "warning",
      category: "system",
      timestamp: new Date(Date.now() - 20 * 60000),
      acknowledged: true,
      source: "BMS",
    },
    {
      id: "5",
      title: "Ventilation System Alert",
      description: "Underground ventilation operating on backup power. Monitoring air quality closely.",
      severity: "warning",
      category: "safety",
      timestamp: new Date(Date.now() - 25 * 60000),
      acknowledged: true,
      source: "Safety System",
    },
    {
      id: "6",
      title: "Solar Output Optimal",
      description: "Solar PV system generating at 95% capacity. Contributing 35MW to grid.",
      severity: "info",
      category: "system",
      timestamp: new Date(Date.now() - 60 * 60000),
      acknowledged: true,
      source: "Solar Controller",
    },
    {
      id: "7",
      title: "Shift Handover Complete",
      description: "Day shift has assumed control. All critical systems handed over.",
      severity: "info",
      category: "system",
      timestamp: new Date(Date.now() - 120 * 60000),
      acknowledged: true,
      source: "Operations",
    },
  ])

  const [soundEnabled, setSoundEnabled] = useState(true)
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert))
    )
  }

  const acknowledgeAll = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, acknowledged: true })))
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity = !filterSeverity || alert.severity === filterSeverity
    const matchesCategory = !filterCategory || alert.category === filterCategory
    return matchesSeverity && matchesCategory
  })

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length
  const criticalCount = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "grid":
        return <Zap className="w-4 h-4" />
      case "safety":
        return <Shield className="w-4 h-4" />
      case "equipment":
        return <Factory className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getSeverityStyles = (severity: string, acknowledged: boolean) => {
    if (acknowledged) {
      return "bg-slate-800/30 border-slate-700/30"
    }
    switch (severity) {
      case "critical":
        return "bg-red-500/10 border-red-500/50"
      case "warning":
        return "bg-amber-500/10 border-amber-500/50"
      default:
        return "bg-cyan-500/10 border-cyan-500/50"
    }
  }

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-200">Alerts</h2>
            <p className="text-sm text-slate-500">System notifications and warnings</p>
          </div>
          {criticalCount > 0 && (
            <motion.div
              className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full flex items-center gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">
                {criticalCount} Critical Alert{criticalCount > 1 ? "s" : ""}
              </span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                : "bg-slate-800 border-slate-700 text-slate-400"
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          {unacknowledgedCount > 0 && (
            <button
              onClick={acknowledgeAll}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Acknowledge All ({unacknowledgedCount})
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-500">Filter:</span>
        </div>

        <div className="flex gap-1">
          {["critical", "warning", "info"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(filterSeverity === sev ? null : sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterSeverity === sev
                  ? sev === "critical"
                    ? "bg-red-500/20 text-red-400 border border-red-500/50"
                    : sev === "warning"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                    : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
              }`}
            >
              {sev.charAt(0).toUpperCase() + sev.slice(1)}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-slate-700" />

        <div className="flex gap-1">
          {["grid", "safety", "equipment", "system"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterCategory === cat
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                  : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 uppercase">Total Active</span>
            <Bell className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-slate-200 mt-2">{alerts.length}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-red-400 uppercase">Critical</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400 mt-2">
            {alerts.filter((a) => a.severity === "critical").length}
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 uppercase">Warnings</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            {alerts.filter((a) => a.severity === "warning").length}
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 uppercase">Acknowledged</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {alerts.filter((a) => a.acknowledged).length}
          </p>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: i * 0.05 }}
              className={`p-4 rounded-xl border transition-all ${getSeverityStyles(alert.severity, alert.acknowledged)}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    alert.acknowledged
                      ? "bg-slate-800 text-slate-500"
                      : alert.severity === "critical"
                      ? "bg-red-500/20 text-red-400"
                      : alert.severity === "warning"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-cyan-500/20 text-cyan-400"
                  }`}
                >
                  {getCategoryIcon(alert.category)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-medium ${
                            alert.acknowledged
                              ? "text-slate-400"
                              : alert.severity === "critical"
                              ? "text-red-400"
                              : alert.severity === "warning"
                              ? "text-amber-400"
                              : "text-cyan-400"
                          }`}
                        >
                          {alert.title}
                        </h3>
                        {!alert.acknowledged && alert.severity === "critical" && (
                          <motion.span
                            className="w-2 h-2 bg-red-500 rounded-full"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${alert.acknowledged ? "text-slate-500" : "text-slate-400"}`}>
                        {alert.description}
                      </p>
                    </div>

                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-xs text-slate-300 transition-colors flex-shrink-0"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(alert.timestamp)}</span>
                    </div>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-500">{alert.source}</span>
                    <span className="text-slate-600">|</span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        alert.category === "grid"
                          ? "bg-amber-500/10 text-amber-400"
                          : alert.category === "safety"
                          ? "bg-red-500/10 text-red-400"
                          : alert.category === "equipment"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {alert.category}
                    </span>
                    {alert.acknowledged && (
                      <>
                        <span className="text-slate-600">|</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Acknowledged
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
