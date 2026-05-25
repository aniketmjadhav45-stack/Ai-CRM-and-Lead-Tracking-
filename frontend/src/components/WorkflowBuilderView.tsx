"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Sparkles, 
  Settings2, 
  Play, 
  CheckCircle2, 
  Database, 
  Bot, 
  MessageSquare, 
  Hash,
  ArrowDown,
  Mail,
  Zap
} from "lucide-react";

export default function WorkflowBuilderView() {
  const { workflowSettings, setWorkflowSettings } = useApp();
  const [testingStatus, setTestingStatus] = useState<"idle" | "running" | "node1" | "node2" | "node3" | "node4" | "complete">("idle");

  const runTestAutomation = () => {
    setTestingStatus("running");
    
    setTimeout(() => {
      setTestingStatus("node1"); // trigger intake
      setTimeout(() => {
        setTestingStatus("node2"); // sync CRM
        setTimeout(() => {
          setTestingStatus("node3"); // slack alert
          setTimeout(() => {
            setTestingStatus("node4"); // outbound voice call
            setTimeout(() => {
              setTestingStatus("complete");
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 500);
  };

  const getStatusBadge = (node: string) => {
    if (testingStatus === "idle") return null;
    
    const nodeOrder = ["node1", "node2", "node3", "node4", "complete"];
    const currentIdx = nodeOrder.indexOf(testingStatus);
    const targetIdx = nodeOrder.indexOf(node);
    
    if (testingStatus === "complete" || currentIdx > targetIdx) {
      return (
        <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Delivered
        </span>
      );
    }
    
    if (testingStatus === node) {
      return (
        <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
          <Zap className="w-3.5 h-3.5 animate-spin" />
          Processing
        </span>
      );
    }
    
    return (
      <span className="text-[10px] font-bold bg-white/5 text-gray-500 border border-white/10 px-2 py-0.5 rounded">
        Queued
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)] overflow-hidden">
      
      {/* Visual Workspace Canvas */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-card-border bg-black/40 flex flex-col justify-between overflow-y-auto grid-dots relative">
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-purple/5 to-transparent pointer-events-none"></div>
        
        {/* Canvas Toolbar */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-accent-purple" />
              Active Builder Canvas
            </h4>
            <p className="text-xs text-gray-400">Configure visual flow nodes mapping lead triggers to active systems.</p>
          </div>
          
          <button
            onClick={runTestAutomation}
            disabled={testingStatus !== "idle" && testingStatus !== "complete"}
            className="flex items-center gap-2 bg-gradient-to-r from-accent-purple to-accent-indigo hover:from-accent-purple/90 hover:to-accent-indigo/90 text-white text-xs font-semibold px-4.5 py-2 rounded-xl border border-accent-purple/40 shadow-[0_0_15px_rgba(139,92,246,0.15)] disabled:opacity-50 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{testingStatus === "idle" || testingStatus === "complete" ? "Test Automation Flow" : "Simulating Flow..."}</span>
          </button>
        </div>

        {/* Vertical Nodes Sequence */}
        <div className="flex-1 flex flex-col items-center py-6 space-y-6 relative z-10">
          
          {/* Node 1: Trigger */}
          <div className={`w-full max-w-md glass-panel p-4.5 rounded-2xl border-2 transition-all duration-300 ${
            testingStatus === "node1" ? "border-glow scale-[1.02]" : "border-card-border"
          }`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent-purple" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-white">Lead Trigger Intake</h5>
                  <p className="text-[10px] text-gray-400 font-semibold">WhatConverts webhook lead capture</p>
                </div>
              </div>
              {getStatusBadge("node1")}
            </div>
          </div>

          <ArrowDown className="w-5 h-5 text-gray-600 animate-bounce" />

          {/* Node 2: CRM Sync */}
          <div className={`w-full max-w-md glass-panel p-4.5 rounded-2xl border-2 transition-all duration-300 ${
            testingStatus === "node2" ? "border-glow scale-[1.02]" : "border-card-border"
          }`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent-indigo/10 border border-accent-indigo/20 flex items-center justify-center">
                  <Database className="w-5 h-5 text-accent-indigo" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-white">CRM Direct Sync</h5>
                  <p className="text-[10px] text-gray-400 font-semibold">Creates record in HubSpot & Jobber client files</p>
                </div>
              </div>
              {getStatusBadge("node2")}
            </div>
          </div>

          <ArrowDown className="w-5 h-5 text-gray-600" />

          {/* Node 3: Slack Ping */}
          <div className={`w-full max-w-md glass-panel p-4.5 rounded-2xl border-2 transition-all duration-300 ${
            testingStatus === "node3" ? "border-glow scale-[1.02]" : "border-card-border"
          }`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Hash className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-white">Slack Notification</h5>
                  <p className="text-[10px] text-gray-400 font-semibold">Dispatches notification to channel #leads-alert</p>
                </div>
              </div>
              {getStatusBadge("node3")}
            </div>
          </div>

          <ArrowDown className="w-5 h-5 text-gray-600" />

          {/* Node 4: AI Voice Dialing */}
          <div className={`w-full max-w-md glass-panel p-4.5 rounded-2xl border-2 transition-all duration-300 ${
            testingStatus === "node4" ? "border-glow scale-[1.02]" : "border-card-border"
          }`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-white">Outbound AI Voice Call</h5>
                  <p className="text-[10px] text-gray-400 font-semibold">Vapi/ElevenLabs auto-dial call sequences</p>
                </div>
              </div>
              {getStatusBadge("node4")}
            </div>
          </div>

        </div>

        {/* Completion status dialog */}
        {testingStatus === "complete" && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Test Pipeline Completed Successfully. HubSpot, Jobber, Slack, and Vapi successfully triggered!</span>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      <div className="glass-panel p-6 rounded-2xl border border-card-border flex flex-col justify-between space-y-6 overflow-y-auto">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
            <Settings2 className="w-4.5 h-4.5 text-accent-purple" />
            Automation Settings
          </h4>
          <p className="text-xs text-gray-400 mt-1 leading-normal">
            Customize notification copy and templates used in your active Zapier-style workflow actions.
          </p>
        </div>

        <div className="space-y-4 flex-1 py-4">
          {/* SMS template settings */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Twilio Auto-SMS Confirmation</label>
            <textarea
              rows={3}
              value={workflowSettings.smsTemplate}
              onChange={(e) => setWorkflowSettings({ ...workflowSettings, smsTemplate: e.target.value })}
              className="w-full p-2.5 rounded-xl text-xs glass-input"
            />
          </div>

          {/* Email Subject settings */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Welcome Subject</label>
            <input
              type="text"
              value={workflowSettings.emailSubject}
              onChange={(e) => setWorkflowSettings({ ...workflowSettings, emailSubject: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs glass-input font-medium"
            />
          </div>

          {/* Email body settings */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email Welcome Template</label>
            <textarea
              rows={5}
              value={workflowSettings.emailTemplate}
              onChange={(e) => setWorkflowSettings({ ...workflowSettings, emailTemplate: e.target.value })}
              className="w-full p-2.5 rounded-xl text-xs glass-input"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-card-border text-[10px] text-gray-500 font-semibold leading-relaxed">
          Variables supported: <code className="text-accent-purple">{"{{lead_name}}"}</code>, <code className="text-accent-purple">{"{{service_type}}"}</code>, <code className="text-accent-purple">{"{{assigned_tech}}"}</code>. Settings persist in local runtime sandbox memory.
        </div>

      </div>

    </div>
  );
}
