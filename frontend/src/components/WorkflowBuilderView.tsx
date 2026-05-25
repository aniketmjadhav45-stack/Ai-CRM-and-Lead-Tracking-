"use client";

import React, { useState, useCallback } from "react";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, Settings2, Sparkles, CheckCircle2 } from "lucide-react";
import { TriggerNode, ActionNode, LogicNode } from "./omniflow/CustomNodes";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  logic: LogicNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { label: 'Inbound Webhook', description: 'Triggers when a new lead is captured via WhatConverts', icon: 'trigger' },
  },
  {
    id: '2',
    type: 'action',
    position: { x: 250, y: 200 },
    data: { label: 'HubSpot Sync', description: 'Create contact and deal in CRM', icon: 'success' },
  },
  {
    id: '3',
    type: 'logic',
    position: { x: 250, y: 350 },
    data: { label: 'High Value Lead?', description: 'If deal value > $1,000', icon: 'logic' },
  },
  {
    id: '4',
    type: 'action',
    position: { x: 50, y: 550 },
    data: { label: 'AI Voice Call', description: 'Dispatch Chloe to qualify lead', icon: 'action_ai' },
  },
  {
    id: '5',
    type: 'action',
    position: { x: 450, y: 550 },
    data: { label: 'Send SMS', description: 'Send introductory text message', icon: 'action_sms' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', sourceHandle: 'true', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e3-5', source: '3', target: '5', sourceHandle: 'false', animated: true, style: { stroke: '#f43f5e', strokeWidth: 2 } },
];

export default function WorkflowBuilderView() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isTesting, setIsTesting] = useState(false);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1', strokeWidth: 2 } }, eds)),
    []
  );

  const runTest = () => {
    setIsTesting(true);
    // Simulate test completion after 3s
    setTimeout(() => {
      setIsTesting(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Header Panel */}
      <div className="glass-panel p-4 rounded-t-2xl border-x-2 border-t-2 border-card-border flex justify-between items-center z-10 relative">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
              OmniFlow Active
            </span>
          </div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            Lead Intake & Dispatch Automation
          </h3>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Settings2 className="w-3.5 h-3.5" />
            Node Settings
          </button>
          
          <button 
            onClick={runTest}
            disabled={isTesting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-accent-purple to-accent-indigo border border-accent-purple/35 hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Testing Flow...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                Test Workflow
              </>
            )}
          </button>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 border-x-2 border-b-2 border-card-border rounded-b-2xl bg-[#06060c] overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#0a0a0f]"
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1e1e2d" gap={16} />
          <Controls className="!bg-black/80 !border !border-card-border !rounded-xl !overflow-hidden fill-white" />
          <MiniMap 
            className="!bg-black/80 !border !border-card-border !rounded-xl" 
            maskColor="rgba(0, 0, 0, 0.7)"
            nodeColor={(n) => {
              if (n.type === 'trigger') return '#10b981';
              if (n.type === 'logic') return '#f59e0b';
              return '#6366f1';
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
