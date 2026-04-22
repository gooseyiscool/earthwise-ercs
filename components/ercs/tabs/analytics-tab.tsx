"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Battery,
  Sun,
  AlertTriangle,
  Clock,
  Target,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  Minus,
} from "lucide-react"

interface LiveMetric {
  id: string
  label: string
  value: number
  unit: string
  trend: "up" | "down" | "stable"
  icon: React.ReactNode
  color: string
  baseValue: number
  variance: number
}

export function AnalyticsTab() {
  const [liveMetrics, setLiveMetrics] = useState<LiveMetric[]>([
    { id: "power", label: "Power Consumption", value: 42.8, unit: "MW", trend: "down", icon: <Zap className="w-5 h-5" />, color: "cyan", baseValue: 42.8, variance: 3 },
    { id: "voltage", label: "Grid Voltage", value: 10.6, unit: "kV", trend: "up", icon: <Activity className="w-5 h-5" />, color: "emerald", baseValue: 10.6, variance: 0.5 },
    { id: "temp", label: "Transformer Temp", value: 67.3, unit: "°C", trend: "down", icon: <Thermometer className="w-5 h-5" />, color: "amber", baseValue: 67.3, variance: 5 },
    { id: "humidity", label: "Control Room Humidity", value: 45.5, unit: "%", trend: "down", icon: <Droplets className="w-5 h-5" />, color: "blue", baseValue: 45.5, variance: 4 },
    { id: "airflow", label: "Ventilation Airflow", value: 849.2, unit: "m³/min", trend: "down", icon: <Wind className="w-5 h-5" />, color: "teal", baseValue: 849.2, variance: 50 },
    { id: "uptime", label: "System Uptime", value: 99.7, unit: "%", trend: "stable", icon: <Clock className="w-5 h-5" />, color: "emerald", baseValue: 99.7, variance: 0.3 },
  ])

  const [historicalData, setHistoricalData] = useState<number[]>([65, 70, 68, 72, 78, 82, 85, 80, 76, 79, 82, 88, 92, 85, 78, 75, 72, 68, 65, 62, 58, 55, 60, 65])

  // Fluctuate live metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => prev.map(metric => {
        const change = (Math.random() - 0.5) * metric.variance * 2
        const newValue = Math.max(0, metric.baseValue + change)
        const prevValue = metric.value
        let newTrend: "up" | "down" | "stable" = "stable"
        
        if (newValue > prevValue + 0.1) newTrend = "up"
        else if (newValue < prevValue - 0.1) newTrend = "down"
        
        return {
          ...metric,
          value: Number(newValue.toFixed(1)),
          trend: newTrend,
        }
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Update historical data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setHistoricalData(prev => {
        const newData = [...prev.slice(1)]
        const lastValue = prev[prev.length - 1]
        const change = (Math.random() - 0.5) * 10
        newData.push(Math.max(40, Math.min(100, lastValue + change)))
        return newData
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const hourlyData = [
    { hour: "00:00", grid: 85, solar: 0, battery: 15, demand: 72 },
    { hour: "02:00", grid: 88, solar: 0, battery: 12, demand: 65 },
    { hour: "04:00", grid: 90, solar: 0, battery: 10, demand: 58 },
    { hour: "06:00", grid: 82, solar: 8, battery: 10, demand: 68 },
    { hour: "08:00", grid: 70, solar: 20, battery: 10, demand: 82 },
    { hour: "10:00", grid: 55, solar: 35, battery: 10, demand: 92 },
    { hour: "12:00", grid: 50, solar: 40, battery: 10, demand: 95 },
    { hour: "14:00", grid: 52, solar: 38, battery: 10, demand: 88 },
    { hour: "16:00", grid: 60, solar: 25, battery: 15, demand: 85 },
    { hour: "18:00", grid: 75, solar: 10, battery: 15, demand: 78 },
    { hour: "20:00", grid: 82, solar: 0, battery: 18, demand: 72 },
    { hour: "22:00", grid: 85, solar: 0, battery: 15, demand: 68 },
  ]

  const weeklyIncidents = [
    { day: "Mon", incidents: 2, resolved: 2 },
    { day: "Tue", incidents: 1, resolved: 1 },
    { day: "Wed", incidents: 3, resolved: 3 },
    { day: "Thu", incidents: 0, resolved: 0 },
    { day: "Fri", incidents: 4, resolved: 4 },
    { day: "Sat", incidents: 1, resolved: 1 },
    { day: "Sun", incidents: 0, resolved: 0 },
  ]

  const kpis = [
    { label: "Grid Uptime", value: "98.7%", target: "99%", trend: "up", color: "emerald" },
    { label: "Safety Incidents", value: "0", target: "0", trend: "stable", color: "emerald" },
    { label: "Response Time", value: "2.3 min", target: "3 min", trend: "up", color: "emerald" },
    { label: "Energy Efficiency", value: "94.2%", target: "95%", trend: "down", color: "amber" },
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4" />
    if (trend === "down") return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      cyan: "text-cyan-400",
      emerald: "text-emerald-400",
      amber: "text-amber-400",
      blue: "text-blue-400",
      teal: "text-teal-400",
      red: "text-red-400",
    }
    return colors[color] || "text-slate-400"
  }

  const getBgColorClass = (color: string) => {
    const colors: Record<string, string> = {
      cyan: "bg-cyan-500/20",
      emerald: "bg-emerald-500/20",
      amber: "bg-amber-500/20",
      blue: "bg-blue-500/20",
      teal: "bg-teal-500/20",
      red: "bg-red-500/20",
    }
    return colors[color] || "bg-slate-500/20"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Analytics</h2>
          <p className="text-sm text-slate-500">Live system metrics and historical trends</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/50 rounded-lg text-cyan-400">
            Live
          </button>
          <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:bg-slate-700">
            Today
          </button>
          <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:bg-slate-700">
            Week
          </button>
          <button className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:bg-slate-700">
            Month
          </button>
        </div>
      </div>

      {/* Live System Metrics */}
      <div className="grid grid-cols-6 gap-4">
        {liveMetrics.map((metric, i) => (
          <motion.div
            key={metric.id}
            className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getBgColorClass(metric.color)} ${getColorClass(metric.color)}`}>
                {metric.icon}
              </div>
              <div className={`flex items-center gap-1 ${
                metric.trend === "up" ? "text-emerald-400" :
                metric.trend === "down" ? "text-red-400" :
                "text-slate-400"
              }`}>
                {getTrendIcon(metric.trend)}
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-1">{metric.label}</p>
            <motion.p
              className={`text-2xl font-bold ${getColorClass(metric.color)}`}
              key={metric.value}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
            >
              {metric.value}
              <span className="text-sm font-normal text-slate-500 ml-1">{metric.unit}</span>
            </motion.p>
          </motion.div>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 uppercase">{kpi.label}</span>
              {kpi.trend === "up" ? (
                <TrendingUp className={`w-4 h-4 ${kpi.color === "emerald" ? "text-emerald-400" : "text-amber-400"}`} />
              ) : kpi.trend === "down" ? (
                <TrendingDown className={`w-4 h-4 ${kpi.color === "emerald" ? "text-emerald-400" : "text-amber-400"}`} />
              ) : (
                <Target className={`w-4 h-4 ${kpi.color === "emerald" ? "text-emerald-400" : "text-amber-400"}`} />
              )}
            </div>
            <p className={`text-2xl font-bold ${kpi.color === "emerald" ? "text-emerald-400" : "text-amber-400"}`}>{kpi.value}</p>
            <p className="text-xs text-slate-500 mt-1">Target: {kpi.target}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Historical Trends - Power Demand */}
        <motion.div
          className="col-span-8 bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-300">Historical Trends - Power Demand (24h)</h3>
              <p className="text-xs text-slate-500">Real-time updating chart</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-xs text-cyan-400">Live</span>
            </div>
          </div>

          <div className="h-48 flex items-end gap-1">
            {historicalData.map((value, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-cyan-500/30 to-cyan-500/10 rounded-t relative group"
                animate={{ height: `${value}%` }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-slate-800 px-1.5 py-0.5 rounded text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {Math.round(value)}%
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-slate-500">
            <span>-24h</span>
            <span>-18h</span>
            <span>-12h</span>
            <span>-6h</span>
            <span>Now</span>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="col-span-4 space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Today's Summary */}
          <div className="bg-[#0d1419] border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Today&apos;s Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400">Grid Supply</span>
                </div>
                <span className="text-sm font-medium text-slate-200">1,245 MWh</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-slate-400">Solar Generation</span>
                </div>
                <span className="text-sm font-medium text-slate-200">320 MWh</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">Battery Discharge</span>
                </div>
                <span className="text-sm font-medium text-slate-200">85 MWh</span>
              </div>
              <div className="pt-3 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total Consumption</span>
                  <span className="text-sm font-bold text-cyan-400">1,650 MWh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Savings */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">Cost Savings</h3>
            <p className="text-2xl font-bold text-emerald-400">R 245,000</p>
            <p className="text-xs text-slate-400 mt-1">From solar and battery usage today</p>
            <div className="mt-3 flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="w-3 h-3" />
              <span>12% better than average</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Energy Mix Chart */}
        <motion.div
          className="col-span-6 bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-300">Energy Supply Mix (24h)</h3>
              <p className="text-xs text-slate-500">Distribution by source over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-slate-400">Grid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-slate-400">Solar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-400">Battery</span>
              </div>
            </div>
          </div>

          {/* Stacked bar chart */}
          <div className="h-40 flex items-end gap-2">
            {hourlyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col-reverse h-32">
                  <motion.div
                    className="w-full bg-amber-500/80 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${data.grid}%` }}
                    transition={{ delay: 0.7 + i * 0.03, duration: 0.5 }}
                  />
                  <motion.div
                    className="w-full bg-yellow-500/80"
                    initial={{ height: 0 }}
                    animate={{ height: `${data.solar}%` }}
                    transition={{ delay: 0.75 + i * 0.03, duration: 0.5 }}
                  />
                  <motion.div
                    className="w-full bg-emerald-500/80 rounded-b"
                    initial={{ height: 0 }}
                    animate={{ height: `${data.battery}%` }}
                    transition={{ delay: 0.8 + i * 0.03, duration: 0.5 }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-2">{data.hour.split(":")[0]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Incidents */}
        <motion.div
          className="col-span-3 bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-300">Weekly Incidents</h3>
              <p className="text-xs text-slate-500">Grid events</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <AlertTriangle className="w-3 h-3" />
              <span>100% resolved</span>
            </div>
          </div>

          <div className="h-28 flex items-end gap-3">
            {weeklyIncidents.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <motion.div
                  className="w-full bg-amber-500/60 rounded"
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.incidents / 4) * 100}%` }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  style={{ minHeight: data.incidents > 0 ? "8px" : "0px" }}
                />
                <span className="text-xs text-slate-500 mt-2">{data.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Response Performance */}
        <motion.div
          className="col-span-3 bg-[#0d1419] border border-slate-700/50 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-300">Response Performance</h3>
              <p className="text-xs text-slate-500">Average times</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <Clock className="w-3 h-3" />
              <span>Under target</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-2 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Detection</span>
                <span className="text-sm font-bold text-cyan-400">0.5 min</span>
              </div>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Assessment</span>
                <span className="text-sm font-bold text-cyan-400">1.2 min</span>
              </div>
            </div>
            <div className="p-2 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Action</span>
                <span className="text-sm font-bold text-cyan-400">0.6 min</span>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400">Total Avg</span>
              <span className="text-sm font-bold text-emerald-400">2.3 min</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
