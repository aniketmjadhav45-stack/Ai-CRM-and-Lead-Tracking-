"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Bot, 
  Volume2, 
  Settings2, 
  MessageSquare, 
  PhoneOff, 
  PhoneCall, 
  Play, 
  Mic, 
  Sparkles,
  Award,
  TrendingUp,
  BrainCircuit
} from "lucide-react";

export default function VoiceAgentView() {
  const { 
    voiceSettings, 
    setVoiceSettings,
    activeCallSimulator, 
    respondToCallAgent, 
    endCallSimulation,
    startCallSimulation,
    leads
  } = useApp();

  const [userInput, setUserInput] = useState("");

  const handleSpeakSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    respondToCallAgent(userInput);
    setUserInput("");
  };

  const getWaveformBars = () => {
    return Array.from({ length: 18 }).map((_, idx) => {
      // Dynamic height pulsing simulation using pure tailwind animation delays
      const delays = ["delay-75", "delay-100", "delay-150", "delay-200", "delay-300", "delay-500"];
      const randomDelay = delays[idx % delays.length];
      return (
        <span 
          key={idx} 
          className={`w-1.5 bg-gradient-to-t from-accent-purple to-accent-pink rounded-full animate-bounce ${randomDelay} ${
            activeCallSimulator.status === "connected" ? "h-12" : "h-2"
          }`}
        ></span>
      );
    });
  };

  // Find a new lead available to call
  const callableLead = leads.find(l => l.status === "new");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)] overflow-hidden">
      
      {/* Vapi / ElevenLabs Audio Sandbox Simulator */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-card-border bg-black/40 flex flex-col justify-between overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none"></div>

        {/* Simulator Header */}
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
              <Bot className="w-4.5 h-4.5 text-rose-400" />
              AI Phone Call Sandbox
            </h4>
            <p className="text-xs text-gray-400">Trigger simulated calls to observe ElevenLabs vocal syntax and Vapi Webhooks.</p>
          </div>
          
          {activeCallSimulator.status !== "idle" && (
            <button
              onClick={endCallSimulation}
              className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors border border-rose-500/30"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Hang Up</span>
            </button>
          )}
        </div>

        {/* Sandbox central visualizer */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden my-4">
          {activeCallSimulator.status === "idle" ? (
            /* Idle display */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Volume2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-white">No Active Phone Session</h5>
                <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                  Start an outgoing call simulation using any available lead from your CRM pipeline, or hit the trigger below to dial Robert.
                </p>
              </div>

              {callableLead ? (
                <button
                  onClick={() => startCallSimulation(callableLead.id)}
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-accent-purple hover:opacity-90 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(244,63,94,0.15)] border border-rose-500/30"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call {callableLead.name}</span>
                </button>
              ) : (
                <p className="text-[10px] text-yellow-500 font-bold bg-yellow-500/10 px-3 py-1 rounded border border-yellow-500/20">
                  ⚠️ Please trigger a new mock lead in the header to create a callable contact first.
                </p>
              )}
            </div>
          ) : (
            /* Active Call display */
            <div className="flex-1 flex flex-col justify-between overflow-hidden space-y-4">
              {/* Pulsing visual wave */}
              <div className="h-20 bg-black/40 border border-card-border rounded-2xl flex items-center justify-center gap-1.5 px-6">
                {activeCallSimulator.status === "calling" ? (
                  <div className="text-xs text-rose-400 font-bold uppercase tracking-wider flex items-center gap-2 animate-pulse">
                    <PhoneCall className="w-4 h-4 animate-bounce" />
                    <span>Dialing outbound CRM Contact... Ringing...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                      <Mic className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="flex-1 flex justify-center items-center gap-1">
                      {getWaveformBars()}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gray-500 bg-white/5 border border-white/5 px-2 py-0.5 rounded uppercase">
                      Vapi Active
                    </span>
                  </>
                )}
              </div>

              {/* Conversation transcript bubbles */}
              <div className="flex-1 p-4 rounded-2xl bg-black/50 border border-card-border overflow-y-auto space-y-4 max-h-[calc(100vh-27rem)] scroll-smooth">
                {activeCallSimulator.transcript.map((line, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col ${line.sender === 'agent' ? 'items-start' : 'items-end'} animate-in fade-in slide-in-from-bottom-2 duration-200`}
                  >
                    <span className="text-[9px] text-gray-500 mb-0.5 font-bold uppercase tracking-wider">
                      {line.sender === 'agent' ? voiceSettings.agentName : 'Homeowner (User Input)'}
                    </span>
                    <div className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                      line.sender === 'agent' 
                        ? 'bg-accent-purple/10 text-white rounded-tl-none border border-accent-purple/25 shadow-sm' 
                        : 'bg-rose-500/10 text-gray-200 rounded-tr-none border border-rose-500/25'
                    }`}>
                      {line.text}
                    </div>
                  </div>
                ))}

                {activeCallSimulator.status === "connected" && activeCallSimulator.transcript.length === 1 && (
                  <div className="p-3 bg-accent-purple/5 border border-accent-purple/20 text-accent-purple font-semibold rounded-xl text-center text-xs animate-pulse">
                    🎤 Chloe spoke! Type your reply below (e.g. "Hi, I have a slab leak, please book a plumber") to simulate the dialogue.
                  </div>
                )}
              </div>

              {/* Speak input */}
              {activeCallSimulator.status === "connected" && (
                <form onSubmit={handleSpeakSubmit} className="flex gap-2 relative z-10">
                  <input
                    type="text"
                    required
                    placeholder="Type what the homeowner would say..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl text-sm glass-input"
                  />
                  <button
                    type="submit"
                    className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-6 py-3 rounded-xl border border-rose-500/30 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Speak to Agent</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Voice Prompt & Settings */}
      <div className="glass-panel p-6 rounded-2xl border border-card-border flex flex-col justify-between space-y-6 overflow-y-auto">
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-1.5">
            <Settings2 className="w-4.5 h-4.5 text-rose-400" />
            ElevenLabs Voice Agent Engine
          </h4>
          <p className="text-xs text-gray-400 mt-1 leading-normal">
            Configure prompt definitions, vocal latency metrics, and TTS accent settings.
          </p>
        </div>

        <div className="space-y-4 flex-1 py-2">
          {/* Accent choice */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Voice Model</label>
            <select
              value={voiceSettings.voiceId}
              onChange={(e) => setVoiceSettings({ ...voiceSettings, voiceId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-xs glass-input bg-black"
            >
              <option value="elevenlabs_warm_chloe">Chloe (ElevenLabs Warm - US Female)</option>
              <option value="elevenlabs_pro_adam">Adam (ElevenLabs Professional - US Male)</option>
              <option value="vapi_sweet_emma">Emma (Vapi Sweet - British Female)</option>
            </select>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">System Assistant Prompt Instruction</label>
            <textarea
              rows={6}
              value={voiceSettings.greeting}
              onChange={(e) => setVoiceSettings({ ...voiceSettings, greeting: e.target.value })}
              className="w-full p-2.5 rounded-xl text-xs glass-input font-medium"
            />
          </div>

          {/* Latency meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-400">Simulation Vocal Latency</span>
              <span className="text-white">{voiceSettings.latency}ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="500"
              step="10"
              value={voiceSettings.latency}
              onChange={(e) => setVoiceSettings({ ...voiceSettings, latency: parseInt(e.target.value) })}
              className="w-full h-1 bg-white/10 rounded accent-rose-500 appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-card-border space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
            <BrainCircuit className="w-4 h-4 text-rose-400" />
            <span>AI Intent Classification Active</span>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed">
            The automated pipeline checks available spots, qualifications (homeowner, fee agreement), and commits scheduling records using webhook APIs.
          </p>
        </div>

      </div>

    </div>
  );
}
