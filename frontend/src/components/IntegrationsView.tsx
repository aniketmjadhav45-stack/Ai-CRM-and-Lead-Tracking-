"use client";

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  Cable, 
  Database, 
  Link, 
  Check, 
  Terminal, 
  RefreshCw,
  ExternalLink,
  Bot,
  MessageCircle,
  FileCode,
  X
} from "lucide-react";

export default function IntegrationsView() {
  const { webhookLogs } = useApp();
  const [activeConnections, setActiveConnections] = useState<{ [key: string]: boolean }>({
    hubspot: true,
    jobber: true,
    salesforce: false,
    gohighlevel: false,
    twilio: true,
    whatsapp: true,
    vapi: true,
    notion: true,
    slack: true
  });
  const [showOauthModal, setShowOauthModal] = useState<string | null>(null);
  const [authorizing, setAuthorizing] = useState(false);

  const triggerOAuthConnection = (id: string) => {
    setShowOauthModal(id);
  };

  const completeOAuth = () => {
    if (!showOauthModal) return;
    setAuthorizing(true);
    
    // Simulate OAuth handshake
    setTimeout(() => {
      setActiveConnections(prev => ({
        ...prev,
        [showOauthModal]: true
      }));
      setAuthorizing(false);
      setShowOauthModal(null);
    }, 1500);
  };

  const disconnectConnection = (id: string) => {
    setActiveConnections(prev => ({
      ...prev,
      [id]: false
    }));
  };

  const integrations = [
    { id: "hubspot", name: "HubSpot CRM", desc: "Sync customer details, deals, and notes automatically.", category: "CRM Integration", icon: Database },
    { id: "jobber", name: "Jobber Dispatch", desc: "Sync custom scheduling, invoices, and dispatcher routes.", category: "Service Dispatch", icon: Database },
    { id: "salesforce", name: "Salesforce CRM", desc: "Sync accounts, leads, and custom pipeline workflows.", category: "CRM Integration", icon: Database },
    { id: "gohighlevel", name: "GoHighLevel", desc: "Map marketing leads, review collection, and email lists.", category: "Marketing CRM", icon: Database },
    { id: "twilio", name: "Twilio voice & SMS", desc: "Send automated text-backs, trigger AI voice calls, and logs phone records.", category: "Communication", icon: MessageCircle },
    { id: "whatsapp", name: "WhatsApp Business", desc: "Sync double-opt-in message templates and templates.", category: "Communication", icon: MessageCircle },
    { id: "vapi", name: "Vapi AI Voice", desc: "Map conversational system prompts and trigger phone agents.", category: "Conversational AI", icon: Bot },
    { id: "notion", name: "Notion logs", desc: "Export automation results, UTM fields, and logs into a Notion page.", category: "Developer Database", icon: FileCode },
    { id: "slack", name: "Slack Alerts", desc: "Alert sales channels with high-value CRM webhook captures.", category: "Developer Tools", icon: FileCode }
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-10rem)] overflow-y-auto pr-2">
      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const isConnected = activeConnections[item.id];
          return (
            <div 
              key={item.id}
              className={`glass-panel p-5 rounded-2xl border-2 flex flex-col justify-between h-48 transition-all ${
                isConnected ? 'border-accent-purple/30 bg-accent-purple/[0.02]' : 'border-card-border bg-black/25'
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  
                  {/* Status indicator */}
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1 ${
                    isConnected 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-white/5 text-gray-500 border border-white/10"
                  }`}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>

                <h5 className="font-bold text-sm text-white mt-3.5 flex items-center gap-2">
                  <item.icon className={`w-4.5 h-4.5 ${isConnected ? 'text-accent-purple' : 'text-gray-500'}`} />
                  {item.name}
                </h5>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed truncate">{item.desc}</p>
              </div>

              <div className="pt-3 border-t border-card-border flex justify-end gap-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => disconnectConnection(item.id)}
                      className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Disconnect
                    </button>
                    <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => triggerOAuthConnection(item.id)}
                    className="text-[10px] font-semibold text-white bg-gradient-to-r from-accent-purple to-accent-indigo hover:opacity-90 border border-accent-purple/35 px-4.5 py-1.5 rounded-lg transition-all flex items-center gap-1"
                  >
                    <Link className="w-3 h-3" />
                    <span>Connect Account</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Developers JSON monitor window */}
      <div className="glass-panel p-6 rounded-2xl border border-card-border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-accent-purple" />
              API Webhook Payloads Console
            </h4>
            <p className="text-xs text-gray-400">Inspect raw inbound and outbound JSON payloads executing on backend nodes.</p>
          </div>
          <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-500">
            Node.js Webhook Logger
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-1">
          {webhookLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="p-4 rounded-xl bg-black/60 border border-card-border font-mono text-[10px] space-y-2">
              <div className="flex justify-between items-center border-b border-card-border pb-1.5 text-gray-400 font-bold">
                <span className="text-accent-purple">{log.event}</span>
                <span>{log.timestamp}</span>
              </div>
              <pre className="text-gray-300 leading-normal overflow-x-auto select-all p-1 bg-black/40 rounded">
                {log.payload}
              </pre>
            </div>
          ))}

          {webhookLogs.length === 0 && (
            <p className="text-center py-6 text-xs text-gray-500 italic col-span-2">No webhook records in payload monitor queue.</p>
          )}
        </div>
      </div>

      {/* Simulated OAuth Modal Backdrop */}
      {showOauthModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-card-border overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-card-border bg-gradient-to-r from-accent-purple/10 to-accent-indigo/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Cable className="w-5 h-5 text-accent-purple" />
                <h4 className="font-bold text-white text-base">Authorize API Connection</h4>
              </div>
              <button 
                onClick={() => setShowOauthModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                Antigravity Flow is requesting read/write OAuth scopes to synchronize client cards, communication logs, and pipelines with your authorized account.
              </p>

              <div className="p-4 rounded-xl bg-black/40 border border-card-border space-y-3">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Permissions Requested:</h5>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Read contacts and client profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Create pipeline deals and jobs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Configure webhook listeners</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-card-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOauthModal(null)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={completeOAuth}
                  disabled={authorizing}
                  className="text-xs font-semibold text-white bg-gradient-to-r from-accent-purple to-accent-indigo px-5 py-2 rounded-xl border border-accent-purple/35 flex items-center gap-1 shadow-md disabled:opacity-50"
                >
                  {authorizing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Link className="w-3.5 h-3.5" />
                  )}
                  <span>{authorizing ? "Authorizing..." : "Grant Secure Access"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
