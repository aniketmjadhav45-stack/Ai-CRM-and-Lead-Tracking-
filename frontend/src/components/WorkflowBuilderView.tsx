"use client";

import React, { useState, useCallback, useRef } from "react";
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
  OnConnect,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, Settings2, Sparkles, Trash2 } from "lucide-react";
import { TriggerNode, ActionNode, LogicNode } from "./omniflow/CustomNodes";
import WorkflowSidebar from "./omniflow/WorkflowSidebar";

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  logic: LogicNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

function FlowRenderer() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

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

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const typeStr = event.dataTransfer.getData('application/reactflow');
      if (!typeStr) {
        return;
      }

      const parsed = JSON.parse(typeStr);
      const type = parsed.type;
      const nodeData = parsed.data;

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { ...nodeData },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition],
  );

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
  };

  const runTest = () => {
    setIsTesting(true);
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
            Workflow Builder
          </h3>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={clearCanvas}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Canvas
          </button>
          
          <button 
            onClick={runTest}
            disabled={isTesting || nodes.length === 0}
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

      <div className="flex flex-1 border-x-2 border-b-2 border-card-border rounded-b-2xl bg-[#06060c] overflow-hidden relative">
        {/* React Flow Canvas */}
        <div className="flex-1 h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
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

        {/* Sidebar Palette */}
        <WorkflowSidebar />
      </div>
    </div>
  );
}

export default function WorkflowBuilderView() {
  return (
    <ReactFlowProvider>
      <FlowRenderer />
    </ReactFlowProvider>
  );
}
