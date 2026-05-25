"use client";

import React from "react";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  KanbanSquare,
  GitBranch,
  PhoneCall,
  Calendar,
  MessageSquare,
  Cable,
  BarChart3,
  Bot,
  Users
} from "lucide-react";

export default function Sidebar() {
  const { activeTab, setActiveTab } = useApp();

  const menuItems = [
    { id: "dashboard", label: "Operations Dashboard", icon: LayoutDashboard },
    { id: "leads", label: "Advanced Leads Table", icon: Users },
    { id: "pipeline", label: "CRM Lead Pipeline", icon: KanbanSquare },
    { id: "workflows", label: "Zapier Automations", icon: GitBranch },
    { id: "voice-agent", label: "AI Voice Call Center", icon: PhoneCall },
    { id: "calendar", label: "Dispatch Calendar", icon: Calendar },
    { id: "messaging", label: "SMS & WhatsApp Box", icon: MessageSquare },
    { id: "integrations", label: "Integrations Hub", icon: Cable },
    { id: "analytics", label: "Attribution & ROI", icon: BarChart3 },
  ];

  return (
    <aside className="w-72 glass-panel border-r border-card-border h-screen flex flex-col fixed left-0 top-0 z-20">
      {/* Brand logo */}
      <div className="p-6 border-b border-card-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-purple to-accent-indigo flex items-center justify-center border border-accent-purple/40 pulse-glow">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight text-white">
            Antigravity<span className="text-accent-purple text-glow-purple">.flow</span>
          </h1>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
            Home Service AI Core
          </p>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-accent-purple/20 to-accent-indigo/15 text-white border border-accent-purple/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${
                isActive ? "text-accent-purple scale-110" : "text-gray-400 group-hover:text-white"
              }`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-card-border bg-black/20">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-accent-purple/20 border border-accent-purple/40 flex items-center justify-center text-xs font-semibold text-accent-purple">
            AP
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Apex Plumbing & HVAC</p>
            <p className="text-[10px] text-green-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Workspace Active
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
