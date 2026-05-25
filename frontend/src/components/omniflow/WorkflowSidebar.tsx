import React from 'react';
import { Zap, Bot, MessageSquare, Mail, GitMerge } from 'lucide-react';

export default function WorkflowSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string, nodeData: any) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, data: nodeData }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 border-l-2 border-card-border bg-[#06060c] p-4 flex flex-col gap-4 z-10 overflow-y-auto hidden md:flex">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Triggers</h3>
        <div className="flex flex-col gap-2">
          <div 
            className="glass-panel p-3 rounded-lg border border-emerald-500/30 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors"
            onDragStart={(e) => onDragStart(e, 'trigger', { label: 'Inbound Webhook', description: 'Triggers on external API hit', icon: 'trigger' })}
            draggable
          >
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white">Inbound Webhook</span>
            </div>
          </div>
          <div 
            className="glass-panel p-3 rounded-lg border border-emerald-500/30 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors"
            onDragStart={(e) => onDragStart(e, 'trigger', { label: 'New Lead', description: 'Triggers when CRM lead added', icon: 'trigger' })}
            draggable
          >
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-white">New Lead</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-4">Actions</h3>
        <div className="flex flex-col gap-2">
          <div 
            className="glass-panel p-3 rounded-lg border border-white/10 cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-colors"
            onDragStart={(e) => onDragStart(e, 'action', { label: 'Send SMS', description: 'Twilio text message', icon: 'action_sms' })}
            draggable
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-white">Send SMS</span>
            </div>
          </div>
          <div 
            className="glass-panel p-3 rounded-lg border border-white/10 cursor-grab active:cursor-grabbing hover:border-sky-500/50 transition-colors"
            onDragStart={(e) => onDragStart(e, 'action', { label: 'Send Email', description: 'SendGrid email', icon: 'action_email' })}
            draggable
          >
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-semibold text-white">Send Email</span>
            </div>
          </div>
          <div 
            className="glass-panel p-3 rounded-lg border border-white/10 cursor-grab active:cursor-grabbing hover:border-purple-500/50 transition-colors"
            onDragStart={(e) => onDragStart(e, 'action', { label: 'AI Voice Call', description: 'Vapi AI Agent call', icon: 'action_ai' })}
            draggable
          >
            <div className="flex items-center gap-3">
              <Bot className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-white">AI Voice Call</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-4">Logic</h3>
        <div className="flex flex-col gap-2">
          <div 
            className="glass-panel p-3 rounded-lg border border-amber-500/30 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors"
            onDragStart={(e) => onDragStart(e, 'logic', { label: 'If / Else', description: 'Branch based on conditions', icon: 'logic' })}
            draggable
          >
            <div className="flex items-center gap-3">
              <GitMerge className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-white">If / Else Branch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
