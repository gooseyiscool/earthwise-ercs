"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, Factory, Battery, Sun, AlertTriangle, Activity } from "lucide-react"

interface FlowMapProps {
  scenario: "stable" | "warning" | "critical"
  showSafetyOverlay: boolean
}

interface NodeData {
  id: string
  label: string
  icon: React.ReactNode
  x: number
  y: number
  description: string
  dependency: string
  safetyImpact: string
  operations: string[]
  riskLevel: "low" | "medium" | "high"
}

const nodes: NodeData[] = [
  {
    id: "grid",
    label: "Eskom Grid",
    icon: <Zap className="w-6 h-6" />,
    x: 100,
    y: 200,
    description: "Primary power supply from national grid",
    dependency: "External dependency - no direct control",
    safetyImpact: "Grid instability directly affects all mining operations",
    operations: ["132kV Supply", "66kV Distribution", "Load Management"],
    riskLevel: "high",
  },
  {
    id: "solar",
    label: "Solar PV",
    icon: <Sun className="w-6 h-6" />,
    x: 100,
    y: 80,
    description: "40MW Solar photovoltaic installation",
    dependency: "Weather dependent, daylight hours only",
    safetyImpact: "Provides backup power, reduces grid dependency",
    operations: ["Panel Arrays", "Inverters", "DC/AC Conversion"],
    riskLevel: "low",
  },
  {
    id: "hub",
    label: "Distribution Hub",
    icon: <Activity className="w-6 h-6" />,
    x: 350,
    y: 200,
    description: "Central power distribution and switching station",
    dependency: "Requires continuous power from multiple sources",
    safetyImpact: "Critical switching point - affects all downstream operations",
    operations: ["Load Balancing", "Fault Detection", "Auto Transfer"],
    riskLevel: "medium",
  },
  {
    id: "battery",
    label: "Battery Storage",
    icon: <Battery className="w-6 h-6" />,
    x: 350,
    y: 80,
    description: "20MWh Battery energy storage system",
    dependency: "Charge state dependent on solar/grid input",
    safetyImpact: "Emergency backup for critical safety systems",
    operations: ["UPS Systems", "Peak Shaving", "Frequency Support"],
    riskLevel: "low",
  },
  {
    id: "sishen",
    label: "Sishen Mine",
    icon: <Factory className="w-6 h-6" />,
    x: 600,
    y: 140,
    description: "Primary iron ore mining operation",
    dependency: "Requires 85MW continuous supply for safe operation",
    safetyImpact: "Power loss affects ventilation, hoisting, and dewatering",
    operations: ["Crushing Plant", "Conveyors", "Processing", "Ventilation", "Dewatering"],
    riskLevel: "high",
  },
  {
    id: "kolomela",
    label: "Kolomela Mine",
    icon: <Factory className="w-6 h-6" />,
    x: 600,
    y: 260,
    description: "Secondary iron ore mining operation",
    dependency: "Requires 45MW continuous supply",
    safetyImpact: "Can provide load flexibility during grid constraints",
    operations: ["Crushing", "Screening", "Stockpiling", "Rail Loading"],
    riskLevel: "medium",
  },
]

const connections = [
  { from: "grid", to: "hub", primary: true },
  { from: "solar", to: "hub", primary: false },
  { from: "battery", to: "hub", primary: false },
  { from: "hub", to: "sishen", primary: true },
  { from: "hub", to: "kolomela", primary: true },
]

export function FlowMap({ scenario, showSafetyOverlay }: FlowMapProps) {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null)

  const getNodeColor = (node: NodeData) => {
    if (scenario === "critical") {
      if (node.id === "grid" || node.id === "hub" || node.id === "sishen") return "#ef4444"
      if (node.id === "kolomela") return "#f59e0b"
      return "#22c55e"
    }
    if (scenario === "warning") {
      if (node.id === "grid" || node.id === "hub") return "#f59e0b"
      return "#22c55e"
    }
    return "#22c55e"
  }

  const getFlowSpeed = () => {
    if (scenario === "critical") return 3
    if (scenario === "warning") return 2
    return 1.5
  }

  const getFlowOpacity = (isPrimary: boolean) => {
    if (scenario === "critical" && isPrimary) return 0.3
    return 1
  }

  return (
    <div className="relative bg-[#0a0f14] rounded-xl border border-slate-700/50 p-6 h-[400px] overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <defs>
            <pattern id="flowGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#flowGrid)" />
        </svg>
      </div>

      {/* Title */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-sm font-semibold text-slate-300">Energy Flow Map</h3>
        <p className="text-xs text-slate-500">Real-time power distribution</p>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-slate-400">Stable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-slate-400">Warning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-slate-400">Critical</span>
        </div>
      </div>

      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          {/* Animated gradient for flow */}
          {connections.map((conn, i) => {
            const fromNode = nodes.find((n) => n.id === conn.from)!
            const toNode = nodes.find((n) => n.id === conn.to)!
            const color = scenario === "critical" && conn.primary ? "#ef4444" : scenario === "warning" && conn.primary ? "#f59e0b" : "#22c55e"
            
            return (
              <linearGradient key={`grad-${i}`} id={`flow-${i}`} gradientUnits="userSpaceOnUse" x1={fromNode.x + 60} y1={fromNode.y + 30} x2={toNode.x + 60} y2={toNode.y + 30}>
                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                <stop offset="50%" stopColor={color} stopOpacity="1">
                  <animate attributeName="offset" values="0;1;0" dur={`${getFlowSpeed()}s`} repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor={color} stopOpacity="0.2" />
              </linearGradient>
            )
          })}
        </defs>

        {/* Connection lines */}
        {connections.map((conn, i) => {
          const fromNode = nodes.find((n) => n.id === conn.from)!
          const toNode = nodes.find((n) => n.id === conn.to)!
          const x1 = fromNode.x + 60
          const y1 = fromNode.y + 30
          const x2 = toNode.x + 60
          const y2 = toNode.y + 30
          
          // Calculate control points for curved lines
          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2
          const offset = conn.primary ? 0 : -30

          return (
            <g key={i} style={{ opacity: getFlowOpacity(conn.primary) }}>
              {/* Base line */}
              <path
                d={`M ${x1} ${y1} Q ${midX} ${midY + offset} ${x2} ${y2}`}
                fill="none"
                stroke="#1e293b"
                strokeWidth="4"
              />
              {/* Animated flow line */}
              <path
                d={`M ${x1} ${y1} Q ${midX} ${midY + offset} ${x2} ${y2}`}
                fill="none"
                stroke={`url(#flow-${i})`}
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Flow particles */}
              <circle r="4" fill={scenario === "critical" && conn.primary ? "#ef4444" : scenario === "warning" && conn.primary ? "#f59e0b" : "#22c55e"}>
                <animateMotion dur={`${getFlowSpeed()}s`} repeatCount="indefinite" path={`M ${x1} ${y1} Q ${midX} ${midY + offset} ${x2} ${y2}`} />
              </circle>
            </g>
          )
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute cursor-pointer"
          style={{ left: node.x, top: node.y, zIndex: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedNode(node)}
        >
          <div
            className="relative w-[120px] h-[60px] rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all duration-300"
            style={{
              backgroundColor: `${getNodeColor(node)}15`,
              borderColor: getNodeColor(node),
              boxShadow: `0 0 20px ${getNodeColor(node)}40`,
            }}
          >
            {/* Pulse effect for critical/warning */}
            {(scenario === "critical" || scenario === "warning") && (node.id === "grid" || node.id === "hub" || (scenario === "critical" && node.id === "sishen")) && (
              <motion.div
                className="absolute inset-0 rounded-lg border-2"
                style={{ borderColor: getNodeColor(node) }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <div style={{ color: getNodeColor(node) }}>{node.icon}</div>
            <span className="text-xs font-medium text-slate-200">{node.label}</span>
          </div>

          {/* Safety overlay warning */}
          {showSafetyOverlay && node.riskLevel === "high" && (
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* Safety overlay - risk propagation path */}
      {showSafetyOverlay && (
        <motion.div
          className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Safety Impact Path:</span>
          </div>
          <p className="mt-1 text-xs text-red-400/80">
            Grid Instability → Distribution Hub → Sishen Processing → Ventilation Risk → Personnel Safety
          </p>
        </motion.div>
      )}

      {/* Node detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="absolute top-16 right-4 w-72 bg-[#0d1419] border border-slate-700 rounded-lg p-4 z-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${getNodeColor(selectedNode)}20`, color: getNodeColor(selectedNode) }}
                >
                  {selectedNode.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">{selectedNode.label}</h4>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${getNodeColor(selectedNode)}20`,
                      color: getNodeColor(selectedNode),
                    }}
                  >
                    {selectedNode.riskLevel.toUpperCase()} RISK
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">{selectedNode.description}</p>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 uppercase tracking-wide">Dependency</span>
                <p className="text-slate-300 mt-0.5">{selectedNode.dependency}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wide">Safety Impact</span>
                <p className="text-amber-400 mt-0.5">{selectedNode.safetyImpact}</p>
              </div>
              <div>
                <span className="text-slate-500 uppercase tracking-wide">Active Operations</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedNode.operations.map((op, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-800 rounded text-slate-300">
                      {op}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
