"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  MousePointerClick, 
  RefreshCw,
  Info
} from "lucide-react";

export default function AnalyticsView() {
  const { leads } = useApp();

  // ROI Calculator States
  const [spend, setSpend] = useState(2500); // monthly marketing budget
  const [leadVal, setLeadVal] = useState(950); // average ticket size
  const [convRate, setConvRate] = useState(22); // conversion percentage

  // Campaigns Mock Data
  const campaigns = [
    { name: "HVAC Urgent Repair - Austin", source: "Google Ads", medium: "cpc", clicks: 340, leads: 18, spend: 1200, value: 15300 },
    { name: "Clogged Sink Drain Specialist", source: "Facebook Ads", medium: "social", clicks: 520, leads: 12, spend: 800, value: 5400 },
    { name: "Apex GMB Profile SEO", source: "Local SEO", medium: "organic", clicks: 890, leads: 22, spend: 500, value: 20900 },
    { name: "Slab Leak Repair Directory", source: "Yelp Search", medium: "directory", clicks: 120, leads: 4, spend: 300, value: 4800 },
  ];

  // Calculator Math
  const costPerClick = 2.45; // average cost per click
  const estimatedLeads = Math.round((spend / costPerClick) * (convRate / 100) * 0.15); 
  const estimatedJobs = Math.round(estimatedLeads * (convRate / 100));
  const estimatedRevenue = estimatedJobs * leadVal;
  const netProfit = estimatedRevenue - spend;
  const projectedROI = spend > 0 ? Math.round((netProfit / spend) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Attribution Table */}
      <div className="glass-panel p-6 rounded-2xl border border-card-border">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight uppercase flex items-center gap-2">
              <Target className="w-4.5 h-4.5 text-accent-purple" />
              WhatConverts Lead Attribution & Source Tracking
            </h4>
            <p className="text-xs text-gray-400">Deep campaign parameter logs synced with incoming WhatConverts API payloads.</p>
          </div>
          <span className="text-[10px] font-semibold bg-accent-purple/10 text-accent-purple px-2.5 py-1 rounded-full border border-accent-purple/20 flex items-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin-slow" />
            Active UTM Tracking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-card-border text-gray-400 font-semibold uppercase tracking-wider pb-3">
                <th className="py-3 px-2">Campaign Name</th>
                <th className="py-3 px-2">Marketing Source</th>
                <th className="py-3 px-2 text-center">Visits / Click</th>
                <th className="py-3 px-2 text-center">Leads Generated</th>
                <th className="py-3 px-2 text-right">Ad Spend</th>
                <th className="py-3 px-2 text-right">Pipeline Revenue</th>
                <th className="py-3 px-2 text-right">ROI (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-gray-300 font-medium">
              {campaigns.map((camp) => {
                const roi = Math.round(((camp.value - camp.spend) / camp.spend) * 100);
                return (
                  <tr key={camp.name} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-2 text-white font-bold">{camp.name}</td>
                    <td className="py-3.5 px-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px]">
                        {camp.source} ({camp.medium})
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-center text-gray-400">{camp.clicks}</td>
                    <td className="py-3.5 px-2 text-center font-bold text-accent-purple">{camp.leads}</td>
                    <td className="py-3.5 px-2 text-right text-gray-400">${camp.spend.toLocaleString()}</td>
                    <td className="py-3.5 px-2 text-right text-emerald-400 font-semibold">${camp.value.toLocaleString()}</td>
                    <td className="py-3.5 px-2 text-right font-bold">
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        +{roi}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic ROI Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Container */}
        <div className="glass-panel p-6 rounded-2xl border border-card-border lg:col-span-1 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white uppercase flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-accent-indigo" />
              ROI Pipeline Estimator
            </h4>
            <p className="text-xs text-gray-400">Configure parameters to calculate simulated ROI.</p>
          </div>

          {/* Spend Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-300">Monthly Ad Budget</span>
              <span className="text-white">${spend.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={spend}
              onChange={(e) => setSpend(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-purple"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
              <span>$500</span>
              <span>$10,000</span>
            </div>
          </div>

          {/* Deal Value Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-300">Average Booking Value</span>
              <span className="text-white">${leadVal.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={leadVal}
              onChange={(e) => setLeadVal(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-purple"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
              <span>$200</span>
              <span>$5,000</span>
            </div>
          </div>

          {/* Lead to Job Conversion rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-300">Conversion Rate</span>
              <span className="text-white">{convRate}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={convRate}
              onChange={(e) => setConvRate(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent-purple"
            />
            <div className="flex justify-between text-[10px] text-gray-500 font-semibold">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        {/* Outputs Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Estimated Leads card */}
          <div className="glass-panel p-6 rounded-2xl border border-card-border flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Estimated Monthly Leads</p>
              <h3 className="text-4xl font-extrabold text-white text-glow-purple">{estimatedLeads}</h3>
              <p className="text-[10px] text-gray-500 leading-normal pt-1">Calculated using an average Cost-Per-Click of $2.45 across home services searches.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center mt-4">
              <MousePointerClick className="w-5 h-5 text-accent-purple" />
            </div>
          </div>

          {/* Project Monthly Revenue */}
          <div className="glass-panel p-6 rounded-2xl border border-card-border flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Projected Revenue</p>
              <h3 className="text-4xl font-extrabold text-emerald-400 text-glow-indigo">${estimatedRevenue.toLocaleString()}</h3>
              <p className="text-[10px] text-gray-500 leading-normal pt-1">Estimated conversion results in {estimatedJobs} closed-won jobs per month.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mt-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          {/* Profit ROI summary */}
          <div className="glass-panel p-6 rounded-2xl border border-card-border md:col-span-2 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-1.5 text-center md:text-left">
              <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-1.5 justify-center md:justify-start">
                <Info className="w-4 h-4 text-accent-purple" />
                Projected ROI Summary Analysis
              </h4>
              <p className="text-xs text-gray-300 max-w-lg leading-relaxed">
                By investing an ad budget of <strong className="text-white">${spend.toLocaleString()}</strong> at a ticket price of <strong className="text-white">${leadVal.toLocaleString()}</strong>, your company is estimated to net a net profit of <strong className="text-emerald-400">${netProfit.toLocaleString()}</strong> monthly!
              </p>
            </div>

            <div className="text-center bg-gradient-to-tr from-accent-purple/10 to-accent-indigo/10 border border-accent-purple/35 p-4 rounded-2xl min-w-44 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Projected ROI</p>
              <h3 className="text-3xl font-black text-white mt-1 text-glow-purple">+{projectedROI}%</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
