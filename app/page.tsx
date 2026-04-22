"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Sliders, AlertTriangle } from "lucide-react"
import { StartupAnimation } from "@/components/ercs/startup-animation"
import { Navigation, TabType } from "@/components/ercs/navigation"
import { DashboardTab } from "@/components/ercs/tabs/dashboard-tab"
import { SimulatorTab } from "@/components/ercs/tabs/simulator-tab"
import { GovernanceTab } from "@/components/ercs/tabs/governance-tab"
import { AuditTab } from "@/components/ercs/tabs/audit-tab"
import { AnalyticsTab } from "@/components/ercs/tabs/analytics-tab"
import { AssistantTab } from "@/components/ercs/tabs/assistant-tab"
import { AlertsTab } from "@/components/ercs/tabs/alerts-tab"
import { SettingsTab } from "@/components/ercs/tabs/settings-tab"
import { OptimiseTab } from "@/components/ercs/tabs/optimise-tab"

export default function ERCSPage() {
  const [showStartup, setShowStartup] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [scenario, setScenario] = useState<"stable" | "warning" | "critical">("stable")

  const alertCount = scenario === "critical" ? 3 : scenario === "warning" ? 2 : 0
  const showFloatingBtn =
    (scenario === "warning" || scenario === "critical") && activeTab !== "optimise"

  const handleStartupComplete = () => setShowStartup(false)

  const handleScenarioChange = (s: "stable" | "warning" | "critical") => {
    setScenario(s)
    // NO auto-navigation — scenario runs, user decides when to optimise
  }

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardTab
            scenario={scenario}
            onScenarioChange={handleScenarioChange}
            onGoOptimise={() => setActiveTab("optimise")}
          />
        )
      case "simulator":
        return <SimulatorTab scenario={scenario} onScenarioChange={handleScenarioChange} />
      case "optimise":
        return <OptimiseTab scenario={scenario} onScenarioChange={setScenario} />
      case "governance":
        return <GovernanceTab scenario={scenario} />
      case "audit":
        return <AuditTab />
      case "analytics":
        return <AnalyticsTab />
      case "assistant":
        return <AssistantTab scenario={scenario} />
      case "alerts":
        return <AlertsTab scenario={scenario} />
      case "settings":
        return <SettingsTab />
      default:
        return (
          <DashboardTab
            scenario={scenario}
            onScenarioChange={handleScenarioChange}
            onGoOptimise={() => setActiveTab("optimise")}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#080c10]">
      <AnimatePresence>
        {showStartup && <StartupAnimation onComplete={handleStartupComplete} />}
      </AnimatePresence>

      {!showStartup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col min-h-screen"
        >
          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            alertCount={alertCount}
            scenario={scenario}
          />

          <main className="flex-1 overflow-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderTab()}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {showFloatingBtn && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: "spring", bounce: 0.3 }}
                  onClick={() => setActiveTab("optimise")}
                  className={`fixed bottom-14 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border font-semibold text-sm ${
                    scenario === "critical"
                      ? "bg-red-500/20 border-red-500/50 text-red-400"
                      : "bg-amber-500/20 border-amber-500/50 text-amber-400"
                  }`}
                >
                  <motion.div
                    animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </motion.div>
                  {scenario === "critical" ? "Critical — Optimise Now" : "Warning — View Optimisation"}
                  <Sliders className="w-4 h-4 opacity-70" />
                </motion.button>
              )}
            </AnimatePresence>
          </main>

          <footer className="bg-[#0a0f14] border-t border-slate-800 px-6 py-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      scenario === "critical"
                        ? "bg-red-500 animate-pulse"
                        : scenario === "warning"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span className="text-slate-500">
                    System Status:{" "}
                    <span
                      className={
                        scenario === "critical"
                          ? "text-red-400"
                          : scenario === "warning"
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }
                    >
                      {scenario.toUpperCase()}
                    </span>
                  </span>
                </div>
                <span className="text-slate-600">|</span>
                <span className="text-slate-500">Last Update: Just now</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-500">Connected to SCADA</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500">ERCS v2.4.1</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-500">Kumba Iron Ore - Sishen Operations</span>
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </div>
  )
}
