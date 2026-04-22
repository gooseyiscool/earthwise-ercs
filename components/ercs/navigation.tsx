"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard, Activity, Shield, FileText, BarChart3,
  Bot, Bell, Settings, Zap, Sliders,
} from "lucide-react"

export type TabType =
  | "dashboard" | "simulator" | "governance" | "audit"
  | "analytics" | "assistant" | "alerts" | "settings" | "optimise"

interface NavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  alertCount?: number
  scenario?: "stable" | "warning" | "critical"
}

const tabs = [
  { id: "dashboard" as const, label: "Dashboard",   icon: LayoutDashboard },
  { id: "simulator" as const, label: "Simulator",   icon: Activity },
  { id: "optimise"  as const, label: "Optimise",    icon: Sliders },
  { id: "governance"as const, label: "Governance",  icon: Shield },
  { id: "audit"     as const, label: "Audit Trail", icon: FileText },
  { id: "analytics" as const, label: "Analytics",   icon: BarChart3 },
  { id: "assistant" as const, label: "AI Assistant",icon: Bot },
  { id: "alerts"    as const, label: "Alerts",      icon: Bell },
  { id: "settings"  as const, label: "Settings",    icon: Settings },
]

export function Navigation({
  activeTab, onTabChange, alertCount = 0, scenario = "stable",
}: NavigationProps) {
  const needsAction = scenario === "warning" || scenario === "critical"

  return (
    <nav className="bg-[#0d1419] border-b border-slate-700/50">
      <div className="flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-lg" />
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-cyan-400 tracking-wide">ERCS</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Energy Resilience Control</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const isOptimise = tab.id === "optimise"
            const isAlerts = tab.id === "alerts"

            const optimiseColor =
              scenario === "critical" ? "text-red-400" : "text-amber-400"
            const optimiseBg =
              scenario === "critical"
                ? "bg-red-500/10 border-red-500/30"
                : "bg-amber-500/10 border-amber-500/30"

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? isOptimise && needsAction
                      ? optimiseColor
                      : "text-cyan-400"
                    : isOptimise && needsAction
                    ? `${optimiseColor} opacity-70 hover:opacity-100`
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-lg border ${
                      isOptimise && needsAction
                        ? optimiseBg
                        : "bg-cyan-500/10 border-cyan-500/30"
                    }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10 hidden lg:inline">{tab.label}</span>
                {isAlerts && alertCount > 0 && (
                  <span className="relative z-10 flex items-center justify-center w-5 h-5 text-xs bg-red-500 text-white rounded-full">
                    {alertCount}
                  </span>
                )}
                {isOptimise && needsAction && !isActive && (
                  <span
                    className={`relative z-10 w-2 h-2 rounded-full animate-pulse ${
                      scenario === "critical" ? "bg-red-500" : "bg-amber-500"
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-400">System Online</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-300">Sishen Operations</p>
            <p className="text-xs text-slate-500">Shift Supervisor</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-sm font-medium text-slate-300">KO</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
