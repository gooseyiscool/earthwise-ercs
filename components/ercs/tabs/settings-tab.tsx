"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Settings, User, Bell, Shield, Monitor, Database,
  Wifi, HardDrive, RefreshCw, Save, AlertTriangle, CheckCircle,
  Lock, Clock, Activity, Zap,
} from "lucide-react"

export function SettingsTab() {
  const [notifications, setNotifications] = useState({
    criticalAlerts: true, warningAlerts: true, infoAlerts: false,
    soundEnabled: true, emailDigest: true,
  })
  const [thresholds, setThresholds] = useState({
    voltageWarning: 130, voltageCritical: 120,
    frequencyWarning: 49.5, frequencyCritical: 49.0,
    loadWarning: 85, loadCritical: 95,
    bessWarning: 40, bessCritical: 20,
  })
  const [saved, setSaved] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1200)
  }

  const systemStatus = [
    { name: "SCADA Connection", latency: "12ms",  status: "connected" },
    { name: "Database",         latency: "5ms",   status: "connected" },
    { name: "Grid Monitor",     latency: "45ms",  status: "connected" },
    { name: "Safety Systems",   latency: "8ms",   status: "connected" },
    { name: "Weather API",      latency: "120ms", status: "connected" },
    { name: "Kolomela Feed",    latency: "38ms",  status: "connected" },
  ]

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${value ? "bg-cyan-500" : "bg-slate-700"}`}>
      <motion.div className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        animate={{ left: value ? 24 : 4 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
    </button>
  )

  const ThresholdRow = ({
    label, unit, warnKey, critKey,
  }: { label: string; unit: string; warnKey: keyof typeof thresholds; critKey: keyof typeof thresholds }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{label}</span>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-amber-400 font-mono">⚠ {thresholds[warnKey]}{unit}</span>
          <span className="text-red-400 font-mono">✕ {thresholds[critKey]}{unit}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input type="number" step="0.1" value={thresholds[warnKey]}
          onChange={e => setThresholds(p => ({ ...p, [warnKey]: +e.target.value }))}
          className="w-full px-3 py-2 bg-slate-800 border border-amber-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500/60 font-mono" />
        <input type="number" step="0.1" value={thresholds[critKey]}
          onChange={e => setThresholds(p => ({ ...p, [critKey]: +e.target.value }))}
          className="w-full px-3 py-2 bg-slate-800 border border-red-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-red-500/60 font-mono" />
      </div>
    </div>
  )

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Settings</h2>
          <p className="text-sm text-slate-500">System configuration, thresholds, and user preferences</p>
        </div>
        <button onClick={handleSave}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
            saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-cyan-500 text-slate-900 hover:bg-cyan-400"
          }`}>
          {saved ? <><CheckCircle className="w-4 h-4" />Saved!</> : <><Save className="w-4 h-4" />Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left: Profile + System status */}
        <div className="lg:col-span-4 space-y-4">

          {/* User Profile */}
          <motion.div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-5"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4"><User className="w-4 h-4 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-200">User Profile</h3></div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center">
                <span className="text-xl font-bold text-cyan-400">JV</span>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Johan Van Der Berg</p>
                <p className="text-sm text-slate-400">Shift Supervisor</p>
                <p className="text-xs text-cyan-400 mt-0.5">Sishen Operations</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Employee ID",       value: "KIO-2024-0451",    color: "text-slate-300" },
                { label: "Auth Level",         value: "Level 3 — Supervisor", color: "text-amber-400" },
                { label: "Current Shift",      value: "Day (06:00–18:00)", color: "text-slate-300" },
                { label: "Session Expires",    value: "In 24 min",        color: "text-slate-400" },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                  <span className="text-xs text-slate-500">{row.label}</span>
                  <span className={`text-xs font-medium ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-5"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2"><Database className="w-4 h-4 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-200">System Connections</h3></div>
              <button onClick={handleRefresh} className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${refreshing ? "animate-spin" : ""}`} />
              </button>
            </div>
            <div className="space-y-1.5">
              {systemStatus.map(sys => (
                <div key={sys.name} className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-300">{sys.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{sys.latency}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold text-emerald-400">All Systems Online</p>
                <p className="text-[10px] text-slate-500">Last sync: 2 seconds ago</p>
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-5"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-4"><Shield className="w-4 h-4 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-200">Security</h3></div>
            <div className="space-y-2">
              {[
                { label: "Session Timeout",    value: "30 minutes",   icon: <Clock className="w-3 h-3 text-slate-500" /> },
                { label: "Two-Factor Auth",    value: "Enabled",      icon: <Lock className="w-3 h-3 text-emerald-400" />, valueColor: "text-emerald-400" },
                { label: "Last Password",      value: "15 days ago",  icon: <Shield className="w-3 h-3 text-slate-500" /> },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-lg">
                  <div className="flex items-center gap-2">{row.icon}<span className="text-xs text-slate-300">{row.label}</span></div>
                  <span className={`text-xs ${row.valueColor ?? "text-slate-400"}`}>{row.value}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition-colors">
              Change Password
            </button>
          </motion.div>
        </div>

        {/* Middle: Notifications + Display */}
        <div className="lg:col-span-4 space-y-4">

          {/* Notifications */}
          <motion.div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-5"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-4"><Bell className="w-4 h-4 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-200">Notifications</h3></div>
            <div className="space-y-3">
              {([
                ["criticalAlerts", "Critical Alerts", "text-red-400"],
                ["warningAlerts",  "Warning Alerts",  "text-amber-400"],
                ["infoAlerts",     "Info Alerts",     "text-cyan-400"],
                ["soundEnabled",   "Sound Notifications", "text-slate-400"],
                ["emailDigest",    "Email Digest (Daily)", "text-slate-400"],
              ] as const).map(([key, label, color]) => (
                <div key={key} className="flex items-center justify-between py-2.5 border-b border-slate-700/30 last:border-0">
                  <span className={`text-sm ${color}`}>{label}</span>
                  <Toggle value={notifications[key as keyof typeof notifications]}
                    onChange={() => setNotifications(p => ({ ...p, [key]: !p[key as keyof typeof p] }))} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Display */}
          <motion.div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-5"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center gap-2 mb-4"><Monitor className="w-4 h-4 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-200">Display Preferences</h3></div>
            <div className="space-y-4">
              {[
                { label: "Data Refresh Rate", options: ["5 seconds", "10 seconds", "30 seconds", "1 minute"] },
                { label: "Dashboard Layout",  options: ["Standard", "Compact", "Expanded"] },
                { label: "Flow Map Detail",   options: ["Full detail", "Simplified", "Minimal"] },
              ].map(row => (
                <div key={row.label}>
                  <label className="text-xs text-slate-500 mb-1.5 block">{row.label}</label>
                  <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50">
                    {row.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Animation Speed</label>
                <input type="range" min="1" max="5" defaultValue="3" className="w-full accent-cyan-500" />
                <div className="flex justify-between text-[10px] text-slate-600 mt-0.5"><span>Slow</span><span>Fast</span></div>
              </div>
            </div>
          </motion.div>

          {/* System info */}
          <motion.div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-2 mb-3"><HardDrive className="w-3.5 h-3.5 text-slate-500" /><span className="text-xs text-slate-500 font-semibold">System Information</span></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
              {[["ERCS Version", "2.4.1"], ["Build Date", "2024.03.20"], ["Environment", "Production"]].map(([k, v]) => (
                <div key={k} className="bg-slate-800/40 rounded-lg p-2.5">
                  <p className="text-[10px] text-slate-500 mb-1">{k}</p>
                  <p className="text-xs font-mono font-semibold text-slate-300">{v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Thresholds */}
        <div className="lg:col-span-4">
          <motion.div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-5 h-full"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-cyan-400" /><h3 className="text-sm font-semibold text-slate-200">Alert Thresholds</h3></div>
            <p className="text-xs text-slate-500 mb-5">Set warning and critical trigger levels for each monitored parameter. Changes take effect after saving.</p>

            <div className="grid grid-cols-2 gap-2 mb-4 text-[10px]">
              <div className="flex items-center gap-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="text-amber-400 font-semibold">Warning threshold</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-red-400 font-semibold">Critical threshold</span>
              </div>
            </div>

            <div className="space-y-5">
              <ThresholdRow label="Grid Voltage (kV)"    unit="kV" warnKey="voltageWarning"   critKey="voltageCritical" />
              <ThresholdRow label="Grid Frequency (Hz)"  unit="Hz" warnKey="frequencyWarning"  critKey="frequencyCritical" />
              <ThresholdRow label="Load Factor (%)"      unit="%" warnKey="loadWarning"        critKey="loadCritical" />
              <ThresholdRow label="BESS Autonomy (hrs)"  unit="%" warnKey="bessWarning"        critKey="bessCritical" />
            </div>

            <div className="mt-5 pt-4 border-t border-slate-700/40 space-y-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-3">Current readings vs thresholds</p>
              {[
                { label: "Voltage",   current: "132kV",  warn: `${thresholds.voltageWarning}kV`,   status: "safe" },
                { label: "Frequency", current: "50.0Hz", warn: `${thresholds.frequencyWarning}Hz`, status: "safe" },
                { label: "Load",      current: "78%",    warn: `${thresholds.loadWarning}%`,       status: "safe" },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <span className="text-xs text-slate-400">{row.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-300">{row.current}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">Within range</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
