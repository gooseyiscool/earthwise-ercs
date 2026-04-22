"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  Send,
  Zap,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface AssistantTabProps {
  scenario: "stable" | "warning" | "critical"
}

export function AssistantTab({ scenario }: AssistantTabProps) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: `Welcome to the ERCS AI Assistant. I'm here to help you monitor energy systems, analyze risks, and recommend safe operational decisions. Current system status: ${
        scenario === "critical"
          ? "CRITICAL - Grid instability detected. I recommend reviewing immediate response options."
          : scenario === "warning"
          ? "WARNING - Grid conditions are unstable. Consider preventive measures."
          : "STABLE - All systems operating normally."
      }`,
      timestamp: new Date(),
      suggestions: [
        "What's the current risk level?",
        "Recommend an action plan",
        "Show safety checklist",
        "Analyze grid stability",
      ],
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): { content: string; suggestions: string[] } => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("risk") || lowerMessage.includes("level")) {
      return {
        content:
          scenario === "critical"
            ? "Current risk assessment:\n\n• **Overall Risk Level**: HIGH (85%)\n• **Grid Stability**: Critical - Frequency below 49Hz\n• **Safety Impact**: Ventilation systems at risk\n• **Recommended Action**: Initiate controlled load reduction\n\nThe Sishen processing plant is most affected. I recommend reviewing the emergency response procedures immediately."
            : scenario === "warning"
            ? "Current risk assessment:\n\n• **Overall Risk Level**: MEDIUM (45%)\n• **Grid Stability**: Unstable - Voltage fluctuations detected\n• **Safety Impact**: Monitoring elevated\n• **Recommended Action**: Prepare for potential load shedding\n\nCurrent conditions may escalate if grid stability doesn't improve within 2 hours."
            : "Current risk assessment:\n\n• **Overall Risk Level**: LOW (15%)\n• **Grid Stability**: Stable - All parameters normal\n• **Safety Impact**: None\n• **Recommended Action**: Continue standard monitoring\n\nNo immediate concerns. Next scheduled maintenance: Transformer T3 at 14:00.",
        suggestions: ["What should we do?", "Show detailed metrics", "Generate report"],
      }
    }

    if (lowerMessage.includes("action") || lowerMessage.includes("recommend") || lowerMessage.includes("should")) {
      return {
        content:
          scenario === "critical"
            ? "Based on current conditions, I recommend the following action plan:\n\n1. **Immediate**: Initiate controlled shutdown of non-critical loads at Sishen\n2. **Within 5 min**: Verify backup ventilation is online\n3. **Within 10 min**: Complete safety checklist and get supervisor approval\n4. **Ongoing**: Monitor grid frequency - resume operations when stable for 15+ minutes\n\n⚠️ This action requires Shift Supervisor approval. Safety checklist must be completed first."
            : scenario === "warning"
            ? "Recommended preventive actions:\n\n1. **Now**: Reduce non-critical loads by 20%\n2. **Prepare**: Have backup systems on standby\n3. **Monitor**: Track grid frequency closely\n4. **Communicate**: Alert shift personnel of potential load shedding\n\nThese actions can be approved by Shift Supervisor level."
            : "Current recommendation: **Maintain standard operations**\n\nNo immediate action required. However, I suggest:\n\n• Review upcoming load shedding schedule\n• Confirm backup battery state of charge\n• Check solar panel output optimization\n\nWould you like me to generate a detailed operational report?",
        suggestions: ["Show safety checklist", "Simulate scenario", "View audit trail"],
      }
    }

    if (lowerMessage.includes("safety") || lowerMessage.includes("checklist")) {
      return {
        content:
          "Safety Checklist Status:\n\n✅ Risk Assessment Completed\n✅ Personnel Accounted For\n✅ Backup Systems Verified\n✅ Communication Channels Active\n⬜ Shift Supervisor Approval (pending)\n\nGo to the **Governance** tab to complete the full permit-to-work process before taking action.",
        suggestions: ["Open Governance tab", "What's the approval process?", "Show escalation path"],
      }
    }

    if (lowerMessage.includes("grid") || lowerMessage.includes("stability") || lowerMessage.includes("analyze")) {
      return {
        content:
          scenario === "critical"
            ? "Grid Analysis:\n\n📉 **Voltage**: 118kV (Critical - below 120kV threshold)\n📉 **Frequency**: 48.8Hz (Critical - below 49Hz threshold)\n📈 **Load Factor**: 98% (Critical - approaching capacity)\n\nThe grid is experiencing significant stress. Eskom load shedding Stage 4 is in effect. Battery backup has approximately 4 hours of capacity at current draw.\n\n**Trend**: Deteriorating over past 30 minutes"
            : scenario === "warning"
            ? "Grid Analysis:\n\n⚠️ **Voltage**: 128kV (Warning - below 130kV threshold)\n📊 **Frequency**: 49.5Hz (Marginal)\n📈 **Load Factor**: 92% (Elevated)\n\nGrid conditions are unstable but manageable. Load shedding Stage 2 announced for 14:00-16:00.\n\n**Trend**: Stable but requires monitoring"
            : "Grid Analysis:\n\n✅ **Voltage**: 132kV (Normal)\n✅ **Frequency**: 50.0Hz (Normal)\n✅ **Load Factor**: 78% (Normal)\n\nAll grid parameters within normal operating range. Solar contribution at 25% is optimal for current conditions.\n\n**Trend**: Stable",
        suggestions: ["Show historical data", "Predict next 4 hours", "Compare to yesterday"],
      }
    }

    return {
      content:
        "I can help you with:\n\n• **Risk Assessment** - Current threat levels and impacts\n• **Action Recommendations** - Safe response strategies\n• **Grid Analysis** - Real-time stability metrics\n• **Safety Protocols** - Checklist and compliance status\n• **Scenario Simulation** - Test response strategies\n\nWhat would you like to know more about?",
      suggestions: ["What's the current risk?", "Recommend actions", "Analyze grid stability"],
    }
  }

  const handleSend = (message?: string) => {
    const messageText = message || input.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(messageText)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const quickActions = [
    { icon: AlertTriangle, label: "Risk Report", color: "amber" },
    { icon: Lightbulb, label: "Recommendations", color: "cyan" },
    { icon: Shield, label: "Safety Status", color: "emerald" },
    { icon: TrendingUp, label: "Grid Analysis", color: "purple" },
  ]

  return (
    <div className="p-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-200">AI Assistant</h2>
            <p className="text-sm text-slate-500">Energy decision support</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-slate-400">Online</span>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#0d1419] border border-slate-700/50 rounded-xl overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.type === "user"
                      ? "bg-cyan-500/20 border border-cyan-500/30 rounded-2xl rounded-br-sm"
                      : "bg-slate-800/50 border border-slate-700/50 rounded-2xl rounded-bl-sm"
                  } p-4`}
                >
                  {message.type === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-cyan-400 font-medium">ERCS Assistant</span>
                    </div>
                  )}
                  <div className="text-sm text-slate-200 whitespace-pre-wrap">
                    {message.content.split("**").map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i} className="text-cyan-400">
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-slate-500">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(suggestion)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full text-xs text-slate-300 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-slate-500"
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-cyan-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about energy systems, risks, or recommendations..."
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl transition-colors"
              >
                <Send className="w-5 h-5 text-slate-900" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 space-y-4">
          {/* Quick Actions */}
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.label)}
                  className="w-full px-3 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-left transition-colors flex items-center gap-2"
                >
                  <action.icon className={`w-4 h-4 text-${action.color}-400`} />
                  <span className="text-sm text-slate-300">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Context */}
          <div className={`rounded-xl p-4 border ${
            scenario === "critical"
              ? "bg-red-500/10 border-red-500/30"
              : scenario === "warning"
              ? "bg-amber-500/10 border-amber-500/30"
              : "bg-emerald-500/10 border-emerald-500/30"
          }`}>
            <h3 className="text-sm font-semibold text-slate-300 mb-3">System Context</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <span className={
                  scenario === "critical" ? "text-red-400" : scenario === "warning" ? "text-amber-400" : "text-emerald-400"
                }>
                  {scenario.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Alert Level</span>
                <span className="text-slate-300">
                  {scenario === "critical" ? "High" : scenario === "warning" ? "Medium" : "Low"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Active Alerts</span>
                <span className="text-slate-300">
                  {scenario === "critical" ? "3" : scenario === "warning" ? "2" : "0"}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Topics */}
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Recent Topics</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Grid stability analysis</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Risk assessment</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Action recommendations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
