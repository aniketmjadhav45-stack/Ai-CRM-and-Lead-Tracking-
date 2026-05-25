"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Play, Sparkles, Activity, Database, Check, PhoneCall, X } from "lucide-react";

export default function Header() {
  const { activeTab, simulateNewLead, webhookLogs, activeCallSimulator } = useApp();
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Miller",
    phone: "(512) 555-0199",
    email: "john.miller@gmail.com",
    service: "Emergency Drain Repair",
    source: "Google Ads" as const,
    value: 850
  });

  const tabTitles: { [key: string]: string } = {
    dashboard: "Operations Dashboard",
    pipeline: "CRM Lead Pipeline",
    workflows: "Zapier Automations",
    "voice-agent": "AI Voice Call Center",
    calendar: "Dispatch Calendar",
    messaging: "SMS & WhatsApp Box",
    integrations: "Integrations Hub",
    analytics: "Attribution & ROI Analytics",
  };

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    simulateNewLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      value: formData.value,
      source: formData.source,
      utmSource: formData.source === "Google Ads" ? "google" : formData.source === "Facebook Ads" ? "facebook" : formData.source === "Yelp Search" ? "yelp" : "organic",
      utmCampaign: formData.service.toLowerCase().replace(/\s+/g, "_"),
      utmKeyword: `${formData.service.toLowerCase()} service cost`
    });
    setShowSimulateModal(false);
  };

  return (
    <header className="h-20 glass-panel border-b border-card-border px-8 flex items-center justify-between fixed top-0 right-0 left-72 z-10">
      {/* Title & Status */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          {tabTitles[activeTab] || "Operations Console"}
        </h2>
        
        {/* Connection pills */}
        <div className="flex items-center gap-2 max-md:hidden">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            AI Live Dialer Online
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold bg-accent-purple/10 text-accent-purple px-2.5 py-1 rounded-full border border-accent-purple/20">
            <Database className="w-3.5 h-3.5" />
            CRM Synced
          </span>
        </div>
      </div>

      {/* Control panel and trigger */}
      <div className="flex items-center gap-4">
        {/* Vapi Active Alert Ring */}
        {activeCallSimulator.status === "connected" && (
          <div className="flex items-center gap-2 bg-rose-500/15 border border-rose-500/30 px-3.5 py-1.5 rounded-xl animate-pulse">
            <PhoneCall className="w-4 h-4 text-rose-400 animate-bounce" />
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              AI Calling Lead...
            </span>
          </div>
        )}

        {/* Simulate button */}
        <button
          onClick={() => setShowSimulateModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-accent-purple to-accent-indigo hover:from-accent-purple/90 hover:to-accent-indigo/90 text-white text-sm font-semibold px-4 py-2.5 rounded-xl border border-accent-purple/40 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.25)] hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Simulate Lead Capture</span>
        </button>
      </div>

      {/* Custom Simulator Modal Backdrop */}
      {showSimulateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          {/* Modal Container */}
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-card-border overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-card-border bg-gradient-to-r from-accent-purple/10 to-accent-indigo/10 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-accent-purple" />
                <h3 className="font-bold text-lg text-white">Trigger Mock Automation Webhook</h3>
              </div>
              <button 
                onClick={() => setShowSimulateModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulate} className="p-6 space-y-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                This triggers a simulated incoming lead webhook (WhatConverts payload) and initializes the BullMQ pipeline, syncing with HubSpot/Jobber, notifying Slack, and dialing Vapi AI.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">Lead Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-sm glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">Estimated Value ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl text-sm glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-sm glass-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-sm glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">Service Request</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-sm glass-input bg-black"
                  >
                    <option value="Emergency Drain Repair">Emergency Drain Repair</option>
                    <option value="HVAC Replacement Diagnostic">HVAC Replacement Diagnostic</option>
                    <option value="Tankless Water Heater Install">Tankless Water Heater Install</option>
                    <option value="Slab Leak Detection">Slab Leak Detection</option>
                    <option value="Annual AC System Tune-Up">Annual AC System Tune-Up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">Marketing Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl text-sm glass-input bg-black"
                  >
                    <option value="Google Ads">Google Ads (Paid search)</option>
                    <option value="Facebook Ads">Facebook Ads (Social target)</option>
                    <option value="Local SEO">Local SEO (Organic Maps)</option>
                    <option value="Yelp Search">Yelp Directory Search</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-card-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-accent-purple to-accent-indigo text-white text-sm font-semibold px-5 py-2 rounded-xl border border-accent-purple/40 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                >
                  <Play className="w-4 h-4" />
                  <span>Execute Pipeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
