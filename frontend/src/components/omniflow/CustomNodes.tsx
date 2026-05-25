import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap, Play, MessageSquare, Bot, GitMerge, CheckCircle2 } from 'lucide-react';

const icons: Record<string, React.ReactNode> = {
  trigger: <Zap className="w-5 h-5 text-emerald-400" />,
  action_sms: <MessageSquare className="w-5 h-5 text-blue-400" />,
  action_ai: <Bot className="w-5 h-5 text-purple-400" />,
  logic: <GitMerge className="w-5 h-5 text-amber-400" />,
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />
};

export const TriggerNode = memo(({ data, isConnectable }: any) => {
  return (
    <div className="glass-panel p-4 rounded-xl border-2 border-emerald-500/30 bg-black/80 shadow-[0_0_15px_rgba(16,185,129,0.15)] min-w-[250px]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          {icons[data.icon || 'trigger']}
        </div>
        <div>
          <h5 className="text-sm font-bold text-white">{data.label}</h5>
          <p className="text-[10px] text-gray-400 mt-0.5">{data.description || 'Starts the workflow'}</p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-emerald-400 border-2 border-black"
      />
    </div>
  );
});

export const ActionNode = memo(({ data, isConnectable }: any) => {
  return (
    <div className="glass-panel p-4 rounded-xl border border-card-border bg-black/80 hover:border-accent-purple/50 transition-colors min-w-[250px]">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-black"
      />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
          {icons[data.icon || 'action_sms']}
        </div>
        <div>
          <h5 className="text-sm font-bold text-white">{data.label}</h5>
          <p className="text-[10px] text-gray-400 mt-0.5">{data.description || 'Executes a task'}</p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-400 border-2 border-black"
      />
    </div>
  );
});

export const LogicNode = memo(({ data, isConnectable }: any) => {
  return (
    <div className="glass-panel p-4 rounded-xl border border-amber-500/30 bg-black/80 min-w-[250px]">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-amber-400 border-2 border-black"
      />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          {icons[data.icon || 'logic']}
        </div>
        <div>
          <h5 className="text-sm font-bold text-white">{data.label}</h5>
          <p className="text-[10px] text-gray-400 mt-0.5">{data.description}</p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: '25%' }}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-emerald-400 border-2 border-black"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: '75%' }}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-rose-400 border-2 border-black"
      />
    </div>
  );
});
