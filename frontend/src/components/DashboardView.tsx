"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import { 
  DollarSign, 
  Percent, 
  PhoneCall, 
  Zap, 
  ArrowUpRight, 
  TrendingUp,
  Clock,
  Sparkles,
  Bot,
  Activity
} from "lucide-react";

export default function DashboardView() {
  const { leads, appointments, webhookLogs, setActiveTab } = useApp();

  // Calculations
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const wonLeads = leads.filter(l => l.status === "won");
  const wonValue = wonLeads.reduce((sum, l) => sum + l.value, 0);
  
  const conversionRate = leads.length > 0 
    ? Math.round((wonLeads.length / leads.length) * 100) 
    : 0;

  const totalCalls = leads.filter(l => l.transcript !== null || l.status === "calling").length + 24; // offset for mock calls

  // Lead Sources breakdown
  const sourceCounts = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const totalLeadsCount = leads.length;

  return (
    <div className="space-y-6">
      {/* Visual greeting card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-accent-purple/20 via-accent-indigo/10 to-transparent border border-accent-purple/25 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-purple animate-pulse" />
            Apex Climate & Plumbing AI System Active
          </h3>
          <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
            Your automated operating system is running. We are currently listening to incoming webhooks, syncing contact fields to CRMs, and initializing AI voice agents to follow up within seconds.
          </p>
        </div>
        <button
          onClick={() => setActiveTab("workflows")}
          className="text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
        >
          <span>View Active Workflows</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total CRM Pipe Value */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Projected Pipe Value</p>
            <h4 className="text-2xl font-bold text-white tracking-tight">${totalValue.toLocaleString()}</h4>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 w-fit">
              <TrendingUp className="w-3 h-3" />
              +$8,400 this week
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-accent-purple" />
          </div>
        </div>

        {/* Lead Conversion Rate */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lead-to-Job Rate</p>
            <h4 className="text-2xl font-bold text-white tracking-tight">{conversionRate}%</h4>
            <span className="text-[10px] text-green-400 font-semibold flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20 w-fit">
              Industry Avg: 15%
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center">
            <Percent className="w-5 h-5 text-accent-indigo" />
          </div>
        </div>

        {/* AI Phone Calls */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Calls Placed</p>
            <h4 className="text-2xl font-bold text-white tracking-tight">{totalCalls}</h4>
            <span className="text-[10px] text-accent-purple font-semibold flex items-center gap-1 bg-accent-purple/10 px-2 py-0.5 rounded-full border border-accent-purple/20 w-fit">
              <PhoneCall className="w-3 h-3 animate-pulse" />
              92.4% success rate
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-accent-purple" />
          </div>
        </div>

        {/* Response Time */}
        <div className="glass-panel p-5 rounded-2xl border border-card-border flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Response Time</p>
            <h4 className="text-2xl font-bold text-white tracking-tight">24 seconds</h4>
            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 w-fit">
              <Clock className="w-3 h-3" />
              Fully Automated
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Analytics Graph & Source Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funnel Pipeline Visualizer */}
        <div className="glass-panel p-6 rounded-2xl border border-card-border lg:col-span-2 flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white tracking-tight uppercase">Automated Pipeline Conversion Funnel</h4>
            <p className="text-xs text-gray-400">Track drop-off percentage across our visual AI booking sequence.</p>
          </div>

          <div className="space-y-4 py-4">
            {/* Step 1 */}
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-300 mb-1.5">
                <span>1. Webhook Intake (WhatConverts / Ads)</span>
                <span className="text-white">100% (42 leads)</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent-purple to-accent-indigo rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-300 mb-1.5">
                <span>2. HubSpot & Jobber CRM Sync</span>
                <span className="text-white">100% (42 leads)</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent-purple to-accent-indigo rounded-full animate-pulse" style={{ width: "100%" }}></div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-300 mb-1.5">
                <span>3. Outbound AI Call Placed</span>
                <span className="text-white">90% (38 qualified)</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent-purple to-accent-indigo rounded-full" style={{ width: "90%" }}></div>
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-300 mb-1.5">
                <span>4. Calendar Appointment Booked</span>
                <span className="text-white">68% (29 appointments)</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent-purple to-accent-indigo rounded-full" style={{ width: "68%" }}></div>
              </div>
            </div>

            {/* Step 5 */}
            <div>
              <div className="flex justify-between text-xs font-medium text-gray-300 mb-1.5">
                <span>5. Job Completed & Closed-Won</span>
                <span className="text-white">45% (19 jobs won)</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent-purple to-accent-indigo rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Source distribution card */}
        <div className="glass-panel p-6 rounded-2xl border border-card-border">
          <div className="mb-4">
            <h4 className="text-sm font-bold text-white tracking-tight uppercase">Lead Source Share</h4>
            <p className="text-xs text-gray-400">Marketing channels syncing to platform</p>
          </div>

          <div className="space-y-4 py-2">
            {Object.entries(sourceCounts).map(([source, count]) => {
              const percentage = totalLeadsCount > 0 ? Math.round((count / totalLeadsCount) * 100) : 0;
              const sourceColors: { [key: string]: string } = {
                "Google Ads": "bg-accent-purple",
                "Facebook Ads": "bg-accent-indigo",
                "Local SEO": "bg-teal-400",
                "Yelp Search": "bg-rose-400",
                "Organic": "bg-emerald-400"
              };
              const colorClass = sourceColors[source] || "bg-gray-400";
              
              return (
                <div key={source} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-300 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${colorClass}`}></span>
                      {source}
                    </span>
                    <span className="text-white font-bold">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full">
                    <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Realtime logs stream */}
      <div className="glass-panel p-6 rounded-2xl border border-card-border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-purple" />
              Live Operations Queue Activity Feed (BullMQ Engine)
            </h4>
            <p className="text-xs text-gray-400">Realtime automation hooks executing in the background.</p>
          </div>
          <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider animate-pulse">
            listening live
          </span>
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {webhookLogs.map((log) => (
            <div key={log.id} className="p-3 rounded-xl bg-black/40 border border-card-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-accent-purple font-mono bg-accent-purple/10 px-2 py-0.5 rounded border border-accent-purple/20">
                  {log.event}
                </span>
                <span className="text-gray-300 font-medium">{log.source}</span>
                <span className="text-[10px] text-gray-500 max-w-sm truncate hidden md:inline">{log.payload}</span>
              </div>
              <span className="text-gray-500 font-mono text-[10px]">{log.timestamp}</span>
            </div>
          ))}

          {webhookLogs.length === 0 && (
            <div className="text-center py-6 text-xs text-gray-500">
              No recent background tasks. Click 'Simulate Lead Capture' above to generate automation logs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
