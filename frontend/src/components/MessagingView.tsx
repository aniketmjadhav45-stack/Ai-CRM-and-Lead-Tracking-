"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  Sparkles, 
  Info,
  Clock,
  PhoneCall,
  Smartphone,
  CheckCheck
} from "lucide-react";

export default function MessagingView() {
  const { leads, sendManualSMS } = useApp();
  const [selectedThreadId, setSelectedThreadId] = useState<string>("L-101");
  const [smsInput, setSmsInput] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  const activeLead = leads.find(l => l.id === selectedThreadId) || leads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsInput.trim() || !activeLead) return;
    sendManualSMS(activeLead.id, smsInput);
    setSmsInput("");
  };

  const generateAiReply = () => {
    if (!activeLead) return;
    setAiGenerating(true);
    
    // Simulate OpenAI API generation delay
    setTimeout(() => {
      let draftText = `Hi ${activeLead.name}! Chloe here from Apex Climate. We've received your service request for ${activeLead.utmCampaign?.replace(/_/g, " ") || "HVAC Diagnostic"}. We have technicians available today. Let us know if you want us to lock you in!`;
      
      if (activeLead.status === "scheduled") {
        draftText = `Hi ${activeLead.name}! Checking in regarding your upcoming appointment. Our technician Sarah is scheduled to arrive during your designated slot. Let us know if you have any questions!`;
      } else if (activeLead.status === "won") {
        draftText = `Hello ${activeLead.name}! Thank you again for choosing Apex Plumbing. I hope your service was excellent! Let us know if you need anything else or would like to leave a review.`;
      }
      
      setSmsInput(draftText);
      setAiGenerating(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-10rem)] overflow-hidden">
      
      {/* Threads list sidebar */}
      <div className="glass-panel rounded-2xl border border-card-border bg-black/40 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-card-border bg-black/25 flex justify-between items-center">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-accent-purple" />
            Active Conversations
          </h4>
          <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-400 font-bold">
            {leads.length} Active
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-card-border/50">
          {leads.map((lead) => {
            const lastMsg = lead.smsHistory[lead.smsHistory.length - 1];
            const isSelected = lead.id === selectedThreadId;
            return (
              <button
                key={lead.id}
                onClick={() => setSelectedThreadId(lead.id)}
                className={`w-full p-4 text-left flex justify-between items-start gap-2.5 transition-all ${
                  isSelected 
                    ? "bg-gradient-to-r from-accent-purple/10 to-accent-indigo/5 border-l-2 border-l-accent-purple" 
                    : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="font-bold text-xs text-white truncate">{lead.name}</h5>
                    <span className="text-[9px] text-gray-500 font-bold uppercase shrink-0">{lead.id}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">
                    {lastMsg ? lastMsg.text : "No messages yet."}
                  </p>
                </div>
                <span className="text-[9px] text-gray-500 shrink-0 font-medium">
                  {lastMsg ? lastMsg.time : "09:30 AM"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message window */}
      {activeLead ? (
        <div className="md:col-span-2 glass-panel rounded-2xl border border-card-border bg-black/40 overflow-hidden flex flex-col justify-between">
          {/* Thread Header */}
          <div className="p-4 border-b border-card-border bg-black/25 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm text-white">{activeLead.name}</h4>
              <p className="text-[10px] text-gray-400 font-semibold">{activeLead.phone} • {activeLead.source}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] font-bold bg-accent-purple/10 text-accent-purple border border-accent-purple/20 px-2.5 py-0.5 rounded-full uppercase">
                Twilio SMS Active
              </span>
            </div>
          </div>

          {/* Dialogue Thread */}
          <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-22rem)]">
            {activeLead.smsHistory.map((sms, index) => {
              if (sms.sender === "system") {
                return (
                  <div key={index} className="flex justify-center text-[10px] text-gray-500 font-semibold bg-white/5 p-1.5 rounded border border-white/5 my-2 w-fit mx-auto">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {sms.text}
                  </div>
                );
              }
              return (
                <div key={index} className={`flex flex-col ${sms.sender === 'agent' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] text-gray-500 mb-0.5 font-bold uppercase tracking-wider">
                    {sms.sender === 'agent' ? 'Apex automated dispatch' : 'Lead'}
                  </span>
                  <div className={`p-3 rounded-2xl text-xs max-w-[75%] leading-relaxed ${
                    sms.sender === 'agent' 
                      ? 'bg-accent-indigo/15 text-white rounded-tr-none border border-accent-indigo/25' 
                      : 'bg-black/50 text-gray-300 rounded-tl-none border border-card-border'
                  }`}>
                    {sms.text}
                  </div>
                  {sms.sender === 'agent' && (
                    <span className="text-[8px] text-emerald-400 font-bold flex items-center gap-0.5 mt-0.5 uppercase tracking-wider">
                      <CheckCheck className="w-3 h-3 text-emerald-400" />
                      Sent & read
                    </span>
                  )}
                </div>
              );
            })}

            {activeLead.smsHistory.length === 0 && (
              <div className="text-center py-12 text-xs text-gray-500 italic">
                No messaging records yet. Write a message below or hit 'Smart AI Copilot Reply' to draft one.
              </div>
            )}
          </div>

          {/* Actions & Input */}
          <div className="p-4 border-t border-card-border bg-black/25 space-y-3">
            {/* AI Assistant drafting tool */}
            <div className="flex justify-between items-center bg-accent-purple/5 border border-accent-purple/15 p-2 rounded-xl">
              <span className="text-[10px] text-gray-300 font-bold flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-accent-purple" />
                Antigravity Smart AI responder
              </span>
              <button
                type="button"
                onClick={generateAiReply}
                disabled={aiGenerating}
                className="text-[10px] font-bold bg-accent-purple/15 hover:bg-accent-purple/25 text-accent-purple px-3 py-1 rounded border border-accent-purple/35 flex items-center gap-1 disabled:opacity-50 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>{aiGenerating ? "Generating draft..." : "Smart AI Copilot Reply"}</span>
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Type manual text message..."
                value={smsInput}
                onChange={(e) => setSmsInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl text-sm glass-input"
              />
              <button
                type="submit"
                className="bg-accent-indigo hover:bg-accent-indigo/90 text-white font-bold text-xs px-5 py-3 rounded-xl border border-accent-indigo/30 transition-all flex items-center gap-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send SMS</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="md:col-span-2 glass-panel rounded-2xl border border-card-border bg-black/40 flex flex-col justify-center items-center text-center p-8 text-xs text-gray-500">
          <MessageSquare className="w-10 h-10 text-gray-600 mb-2" />
          No conversation thread selected.
        </div>
      )}

    </div>
  );
}
