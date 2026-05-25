"use client";

import React, { useState } from "react";
import { useApp, Lead } from "../context/AppContext";
import { 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  Check, 
  Eye, 
  Hash, 
  Database, 
  FileText,
  PhoneCall, 
  MessageSquare,
  Clock,
  ThumbsUp,
  X,
  Play
} from "lucide-react";

export default function PipelineView() {
  const { leads, updateLeadStatus, sendManualSMS, startCallSimulation } = useApp();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [smsInput, setSmsInput] = useState("");

  const activeLead = leads.find(l => l.id === selectedLeadId);

  const columns = [
    { id: "new", title: "Intake Queue", color: "border-accent-purple/40 bg-accent-purple/5" },
    { id: "calling", title: "Outbound Dialing", color: "border-rose-500/40 bg-rose-500/5" },
    { id: "contacted", title: "AI Engaged", color: "border-accent-indigo/40 bg-accent-indigo/5" },
    { id: "scheduled", title: "Scheduled Booking", color: "border-teal-500/40 bg-teal-500/5" },
    { id: "won", title: "Jobs Won", color: "border-emerald-500/40 bg-emerald-500/5" }
  ];

  const handleSmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsInput.trim() || !selectedLeadId) return;
    sendManualSMS(selectedLeadId, smsInput);
    setSmsInput("");
  };

  return (
    <div className="relative h-[calc(100vh-10rem)] overflow-hidden">
      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-full overflow-x-auto pb-4">
        {columns.map((col) => {
          const colLeads = leads.filter(l => l.status === col.id);
          
          return (
            <div key={col.id} className="flex flex-col h-full min-w-64 glass-panel border border-card-border rounded-2xl overflow-hidden bg-black/30">
              {/* Column Header */}
              <div className={`p-4 border-b border-card-border flex justify-between items-center bg-black/25`}>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    col.id === 'new' ? 'bg-accent-purple' :
                    col.id === 'calling' ? 'bg-rose-400' :
                    col.id === 'contacted' ? 'bg-accent-indigo' :
                    col.id === 'scheduled' ? 'bg-teal-400' : 'bg-emerald-400'
                  }`}></span>
                  {col.title}
                </h4>
                <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-400">
                  {colLeads.length}
                </span>
              </div>

              {/* Column Leads List */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-17rem)]">
                {colLeads.map((lead) => (
                  <div 
                    key={lead.id}
                    onClick={() => setSelectedLeadId(lead.id)}
                    className="glass-panel p-4 rounded-xl border border-card-border bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h5 className="font-bold text-sm text-white group-hover:text-accent-purple transition-colors truncate">
                          {lead.name}
                        </h5>
                        <span className="text-[10px] font-mono text-gray-500 font-bold bg-white/5 px-1.5 py-0.5 rounded border border-white/5 uppercase shrink-0">
                          {lead.id}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mt-1">{lead.phone}</p>
                      
                      {/* UTM attribution pill */}
                      <span className="inline-block mt-2.5 px-2 py-0.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-[9px] font-bold">
                        {lead.source}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-card-border flex justify-between items-center">
                      <span className="text-xs font-black text-white">${lead.value}</span>
                      
                      {/* Drag / Action controls */}
                      <div className="flex gap-1">
                        {col.id === 'new' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startCallSimulation(lead.id);
                            }}
                            title="Trigger AI call"
                            className="p-1 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-colors"
                          >
                            <PhoneCall className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Shift to next stage
                            const nextStages: { [key: string]: Lead["status"] } = {
                              new: "calling",
                              calling: "contacted",
                              contacted: "scheduled",
                              scheduled: "won",
                              won: "new"
                            };
                            updateLeadStatus(lead.id, nextStages[col.id]);
                          }}
                          className="p-1 rounded bg-white/5 hover:bg-accent-purple/25 border border-white/10 text-gray-400 hover:text-white transition-colors"
                          title="Advance stage"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-gray-500 italic">
                    Column empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Drawer Slide-out overlay */}
      {activeLead && (
        <div className="absolute top-0 right-0 w-full max-w-xl h-full glass-panel border-l border-card-border rounded-l-2xl shadow-2xl z-30 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-card-border bg-black/25 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500 font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10">
                  {activeLead.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-purple/10 border border-accent-purple/20 text-accent-purple uppercase">
                  {activeLead.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{activeLead.name}</h3>
            </div>
            <button 
              onClick={() => setSelectedLeadId(null)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Quick Dossier */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-black/20 border border-card-border">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone</p>
                <p className="text-xs text-white font-semibold mt-1">{activeLead.phone}</p>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-card-border">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                <p className="text-xs text-white font-semibold mt-1 truncate">{activeLead.email}</p>
              </div>
              <div className="p-3 rounded-xl bg-black/20 border border-card-border">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lead Value</p>
                <p className="text-xs text-emerald-400 font-bold mt-1">${activeLead.value}</p>
              </div>
            </div>

            {/* WhatConverts Attribution parameters */}
            <div className="p-4 rounded-xl bg-black/25 border border-card-border space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent-purple" />
                WhatConverts Marketing Attribution
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <span className="text-gray-400">Marketing Source:</span>
                  <span className="text-white block mt-0.5">{activeLead.source}</span>
                </div>
                <div>
                  <span className="text-gray-400">UTM Campaign:</span>
                  <span className="text-white block mt-0.5">{activeLead.utmCampaign}</span>
                </div>
                <div>
                  <span className="text-gray-400">UTM Keyword Search:</span>
                  <span className="text-white block mt-0.5 italic">{activeLead.utmKeyword}</span>
                </div>
                <div>
                  <span className="text-gray-400">Lead Capture Time:</span>
                  <span className="text-white block mt-0.5">{activeLead.createdTime}</span>
                </div>
              </div>
            </div>

            {/* Sync Checklist */}
            <div className="p-4 rounded-xl bg-black/25 border border-card-border space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Automated CRM Synchronization Actions
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Database className={`w-4 h-4 ${activeLead.hubspotSynced ? 'text-emerald-400' : 'text-gray-500'}`} />
                  <span className={activeLead.hubspotSynced ? 'text-white' : 'text-gray-400'}>
                    HubSpot Sync: {activeLead.hubspotSynced ? '✓ Synced' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className={`w-4 h-4 ${activeLead.jobberSynced ? 'text-emerald-400' : 'text-gray-500'}`} />
                  <span className={activeLead.jobberSynced ? 'text-white' : 'text-gray-400'}>
                    Jobber Contact: {activeLead.jobberSynced ? '✓ Synced' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className={`w-4 h-4 ${activeLead.slackNotified ? 'text-emerald-400' : 'text-gray-500'}`} />
                  <span className={activeLead.slackNotified ? 'text-white' : 'text-gray-400'}>
                    Slack Alert: {activeLead.slackNotified ? '✓ Fired' : 'Queued'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className={`w-4 h-4 ${activeLead.notionSynced ? 'text-emerald-400' : 'text-gray-500'}`} />
                  <span className={activeLead.notionSynced ? 'text-white' : 'text-gray-400'}>
                    Notion DB Page: {activeLead.notionSynced ? '✓ Created' : 'Queued'}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Calls Tab */}
            {activeLead.transcript ? (
              <div className="p-4 rounded-xl bg-black/25 border border-card-border space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <PhoneCall className="w-4 h-4 text-rose-400" />
                    Vapi / ElevenLabs Phone Call Record
                  </h4>
                  {activeLead.callSentiment && (
                    <span className="text-[10px] font-bold uppercase bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {activeLead.callSentiment} sentiment
                    </span>
                  )}
                </div>
                
                {activeLead.callSummary && (
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300 leading-relaxed italic">
                    "{activeLead.callSummary}"
                  </div>
                )}

                <div className="space-y-3 pt-2 max-h-56 overflow-y-auto border-t border-card-border">
                  {activeLead.transcript.map((line, idx) => (
                    <div key={idx} className={`flex flex-col ${line.sender === 'agent' ? 'items-start' : 'items-end'}`}>
                      <span className="text-[10px] text-gray-500 mb-0.5">{line.sender === 'agent' ? 'Chloe (AI Agent)' : 'Lead'}</span>
                      <div className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                        line.sender === 'agent' 
                          ? 'bg-accent-purple/10 text-white rounded-tl-none border border-accent-purple/20' 
                          : 'bg-white/5 text-gray-300 rounded-tr-none border border-white/10'
                      }`}>
                        {line.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeLead.status === "new" ? (
              <div className="p-4 rounded-xl bg-black/25 border border-card-border text-center py-6">
                <p className="text-xs text-gray-400">No phone conversation history exists. Trigger Vapi AI call to begin qualification.</p>
                <button
                  onClick={() => {
                    startCallSimulation(activeLead.id);
                  }}
                  className="mt-3 flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-rose-500/30 transition-all shadow-md mx-auto"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Call Outbound Lead</span>
                </button>
              </div>
            ) : null}

            {/* SMS Messenger dialogue tab */}
            <div className="p-4 rounded-xl bg-black/25 border border-card-border space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-accent-indigo" />
                Twilio SMS Conversation Thread
              </h4>
              
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {activeLead.smsHistory.map((sms, index) => {
                  if (sms.sender === "system") {
                    return (
                      <div key={index} className="flex justify-center text-[10px] text-gray-500 font-semibold bg-white/5 p-1 rounded border border-white/5 my-1">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {sms.text}
                      </div>
                    );
                  }
                  return (
                    <div key={index} className={`flex flex-col ${sms.sender === 'agent' ? 'items-end' : 'items-start'}`}>
                      <span className="text-[9px] text-gray-500 mb-0.5">{sms.sender === 'agent' ? 'Antigravity Flow' : 'Lead'}</span>
                      <div className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                        sms.sender === 'agent' 
                          ? 'bg-accent-indigo/15 text-white rounded-tr-none border border-accent-indigo/25' 
                          : 'bg-black/50 text-gray-300 rounded-tl-none border border-card-border'
                      }`}>
                        {sms.text}
                      </div>
                    </div>
                  );
                })}

                {activeLead.smsHistory.length === 0 && (
                  <p className="text-center py-4 text-xs text-gray-500 italic">No message logs. Text the lead below.</p>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSmsSubmit} className="pt-2 border-t border-card-border flex gap-2">
                <input
                  type="text"
                  placeholder="Type manual reply..."
                  value={smsInput}
                  onChange={(e) => setSmsInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs glass-input"
                />
                <button
                  type="submit"
                  className="bg-accent-indigo hover:bg-accent-indigo/90 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-accent-indigo/30 transition-all"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
