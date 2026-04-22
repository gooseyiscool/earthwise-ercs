"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  User,
  Bell,
  Shield,
  Monitor,
  Database,
  Wifi,
  HardDrive,
  RefreshCw,
  Save,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export function SettingsTab() {
  const [notifications, setNotifications] = useState({
    criticalAlerts: true,
    warningAlerts: true,
    infoAlerts: false,
    soundEnabled: true,
    emailDigest: true,
  })

  const [thresholds, setThresholds] = useState({
    voltageWarning: 130,
    voltageCritical: 120,
    frequencyWarning: 49.5,
    frequencyCritical: 49.0,
    loadWarning: 85,
    loadCritical: 95,
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const systemStatus = [
    { name: "SCADA Connection", status: "connected", latency: "12ms" },
    { name: "Database", status: "connected", latency: "5ms" },
    { name: "Grid Monitor", status: "connected", latency: "45ms" },
    { name: "Safety Systems", status: "connected", latency: "8ms" },
    { name: "Weather API", status: "connected", latency: "120ms" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Settings</h2>
          <p className="text-sm text-slate-500">System configuration and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
            saved
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
              : "bg-cyan-500 text-slate-900 hover:bg-cyan-400"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-4 space-y-6">
          {/* User Profile */}
          <motion.div
            className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">User Profile</h3>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                <span className="text-xl font-bold text-slate-300">JV</span>
              </div>
              <div>
                <p className="font-medium text-slate-200">Johan Van Der Berg</p>
                <p className="text-sm text-slate-500">Shift Supervisor</p>
                <p className="text-xs text-cyan-400">Sishen Operations</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Employee ID</span>
                <span className="text-slate-300">KIO-2024-0451</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Authorization Level</span>
                <span className="text-amber-400">Level 3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Shift</span>
                <span className="text-slate-300">Day (06:00-18:00)</span>
              </div>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div
            className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-semibold text-slate-300">System Status</h3>
              </div>
              <button className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-2">
              {systemStatus.map((system, i) => (
                <div
                  key={system.name}
                  className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-300">{system.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">{system.latency}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-400">
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">All Systems Online</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Last sync: 2 seconds ago</p>
            </div>
          </motion.div>
        </div>

        {/* Middle Column */}
        <div className="col-span-4 space-y-6">
          {/* Notification Settings */}
          <motion.div
            className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">Notifications</h3>
            </div>

            <div className="space-y-3">
              {Object.entries({
                criticalAlerts: "Critical Alerts",
                warningAlerts: "Warning Alerts",
                infoAlerts: "Info Alerts",
                soundEnabled: "Sound Notifications",
                emailDigest: "Email Digest",
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{label}</span>
                  <button
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [key]: !prev[key as keyof typeof prev],
                      }))
                    }
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      notifications[key as keyof typeof notifications]
                        ? "bg-cyan-500"
                        : "bg-slate-700"
                    }`}
                  >
                    <motion.div
                      className="absolute top-1 w-4 h-4 bg-white rounded-full"
                      animate={{
                        left: notifications[key as keyof typeof notifications] ? 20 : 4,
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Display Settings */}
          <motion.div
            className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Monitor className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">Display</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 mb-2 block">Refresh Rate</label>
                <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50">
                  <option>5 seconds</option>
                  <option>10 seconds</option>
                  <option>30 seconds</option>
                  <option>1 minute</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-2 block">Dashboard Layout</label>
                <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50">
                  <option>Standard</option>
                  <option>Compact</option>
                  <option>Expanded</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-2 block">Map Animation Speed</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  defaultValue="3"
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-6">
          {/* Threshold Settings */}
          <motion.div
            className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">Alert Thresholds</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">Voltage (kV)</span>
                  <div className="flex gap-2 text-xs">
                    <span className="text-amber-400">W: {thresholds.voltageWarning}</span>
                    <span className="text-red-400">C: {thresholds.voltageCritical}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={thresholds.voltageWarning}
                    onChange={(e) =>
                      setThresholds((prev) => ({ ...prev, voltageWarning: +e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-amber-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500/50"
                    placeholder="Warning"
                  />
                  <input
                    type="number"
                    value={thresholds.voltageCritical}
                    onChange={(e) =>
                      setThresholds((prev) => ({ ...prev, voltageCritical: +e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-red-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-red-500/50"
                    placeholder="Critical"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">Frequency (Hz)</span>
                  <div className="flex gap-2 text-xs">
                    <span className="text-amber-400">W: {thresholds.frequencyWarning}</span>
                    <span className="text-red-400">C: {thresholds.frequencyCritical}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={thresholds.frequencyWarning}
                    onChange={(e) =>
                      setThresholds((prev) => ({ ...prev, frequencyWarning: +e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-amber-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500/50"
                    placeholder="Warning"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={thresholds.frequencyCritical}
                    onChange={(e) =>
                      setThresholds((prev) => ({ ...prev, frequencyCritical: +e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-red-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-red-500/50"
                    placeholder="Critical"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500">Load Factor (%)</span>
                  <div className="flex gap-2 text-xs">
                    <span className="text-amber-400">W: {thresholds.loadWarning}%</span>
                    <span className="text-red-400">C: {thresholds.loadCritical}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={thresholds.loadWarning}
                    onChange={(e) =>
                      setThresholds((prev) => ({ ...prev, loadWarning: +e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-amber-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500/50"
                    placeholder="Warning"
                  />
                  <input
                    type="number"
                    value={thresholds.loadCritical}
                    onChange={(e) =>
                      setThresholds((prev) => ({ ...prev, loadCritical: +e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-800 border border-red-500/30 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-red-500/50"
                    placeholder="Critical"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-300">Security</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Session Timeout</span>
                  <span className="text-xs text-slate-500">30 minutes</span>
                </div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Two-Factor Auth</span>
                  <span className="text-xs text-emerald-400">Enabled</span>
                </div>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Last Password Change</span>
                  <span className="text-xs text-slate-500">15 days ago</span>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors">
              Change Password
            </button>
          </motion.div>

          {/* System Info */}
          <motion.div
            className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <HardDrive className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-500">System Information</span>
            </div>
            <div className="space-y-1 text-xs text-slate-500">
              <p>ERCS Version: 2.4.1</p>
              <p>Build: 2024.03.20</p>
              <p>Environment: Production</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
