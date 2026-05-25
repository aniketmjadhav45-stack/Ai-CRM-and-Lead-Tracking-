"use client";

import React from "react";
import { AppProvider, useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardView from "../components/DashboardView";
import PipelineView from "../components/PipelineView";
import WorkflowBuilderView from "../components/WorkflowBuilderView";
import VoiceAgentView from "../components/VoiceAgentView";
import CalendarView from "../components/CalendarView";
import MessagingView from "../components/MessagingView";
import IntegrationsView from "../components/IntegrationsView";
import AnalyticsView from "../components/AnalyticsView";
import { PhoneCall, Sparkles } from "lucide-react";

function MainContent() {
  const { activeTab, setActiveTab, activeCallSimulator } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "pipeline":
        return <PipelineView />;
      case "workflows":
        return <WorkflowBuilderView />;
      case "voice-agent":
        return <VoiceAgentView />;
      case "calendar":
        return <CalendarView />;
      case "messaging":
        return <MessagingView />;
      case "integrations":
        return <IntegrationsView />;
      case "analytics":
        return <AnalyticsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* 1. Sidebar Nav */}
      <Sidebar />

      {/* 2. Main Wrapper */}
      <div className="flex-1 pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header />

        {/* Core Scroll View panel */}
        <main className="flex-1 mt-20 p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating active call HUD (Head-Up Display) */}
      {activeCallSimulator.status !== "idle" && activeTab !== "voice-agent" && (
        <button
          onClick={() => setActiveTab("voice-agent")}
          className="fixed bottom-6 right-6 z-50 glass-panel bg-rose-500/10 border-2 border-rose-500/40 p-4.5 rounded-2xl flex items-center gap-3.5 shadow-[0_0_25px_rgba(244,63,94,0.3)] animate-bounce group"
        >
          <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center pulse-glow shrink-0">
            <PhoneCall className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="text-left">
            <h5 className="font-bold text-xs text-white group-hover:text-rose-400 transition-colors uppercase tracking-wider flex items-center gap-1">
              <span>Active AI Call Session</span>
              <Sparkles className="w-3 h-3 text-rose-400 animate-pulse" />
            </h5>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
              {activeCallSimulator.status === "calling" ? "Ringing contact..." : "Connected to lead • Click to join"}
            </p>
          </div>
        </button>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
