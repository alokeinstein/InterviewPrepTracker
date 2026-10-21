'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  Server,
  Database,
  Layers,
  Cpu,
  Share2,
  Trash2,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  History,
  HardDrive,
} from 'lucide-react';

interface CanvasNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
}

interface CanvasEdge {
  id: string;
  from: string;
  to: string;
  protocol: string;
  isAsync: boolean;
}

interface WhiteboardCanvasProps {
  initialDesign?: {
    id: string;
    title: string;
    versions: {
      versionNumber: number;
      nodes: any;
      edges: any;
      scalabilityScore: number | null;
      spofsDetected: string[];
      bottleneckNotes: string | null;
      aiReviewSummary: string | null;
    }[];
  };
}

const PALETTE = [
  { type: 'client', label: 'Client / App', icon: Layers },
  { type: 'cdn', label: 'CDN / Edge', icon: Share2 },
  { type: 'load_balancer', label: 'Load Balancer', icon: Cpu },
  { type: 'app_server', label: 'App Cluster', icon: Server },
  { type: 'cache', label: 'Redis Cache', icon: Layers },
  { type: 'database', label: 'SQL Primary', icon: Database },
  { type: 'replica', label: 'Read Replica', icon: Database },
  { type: 'queue', label: 'Message Queue / Kafka', icon: Layers },
  { type: 'storage', label: 'Object Storage (S3)', icon: HardDrive },
];

export function WhiteboardCanvas({ initialDesign }: WhiteboardCanvasProps) {
  const latestVersion = initialDesign?.versions?.[0];

  const [nodes, setNodes] = useState<CanvasNode[]>(
    (latestVersion?.nodes as CanvasNode[]) || [
      { id: 'client-1', type: 'client', label: 'Client (Web/Mobile)', x: 60, y: 140 },
      { id: 'cdn-1', type: 'cdn', label: 'Cloudflare CDN', x: 240, y: 140 },
      { id: 'lb-1', type: 'load_balancer', label: 'Nginx LB', x: 420, y: 140 },
      { id: 'app-1', type: 'app_server', label: 'API Servers', x: 600, y: 140 },
      { id: 'cache-1', type: 'cache', label: 'Redis Cluster', x: 780, y: 60 },
      { id: 'db-1', type: 'database', label: 'Postgres Primary', x: 780, y: 220 },
    ]
  );

  const [edges, setEdges] = useState<CanvasEdge[]>(
    (latestVersion?.edges as CanvasEdge[]) || [
      { id: 'e1', from: 'client-1', to: 'cdn-1', protocol: 'HTTPS', isAsync: false },
      { id: 'e2', from: 'cdn-1', to: 'lb-1', protocol: 'HTTPS', isAsync: false },
      { id: 'e3', from: 'lb-1', to: 'app-1', protocol: 'HTTP/2', isAsync: false },
      { id: 'e4', from: 'app-1', to: 'cache-1', protocol: 'TCP', isAsync: false },
      { id: 'e5', from: 'app-1', to: 'db-1', protocol: 'SQL', isAsync: false },
    ]
  );

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [aiReview, setAiReview] = useState<any>(
    latestVersion?.aiReviewSummary
      ? {
          scalabilityScore: latestVersion.scalabilityScore,
          spofs: latestVersion.spofsDetected,
          bottlenecks: latestVersion.bottleneckNotes ? [latestVersion.bottleneckNotes] : [],
          summary: latestVersion.aiReviewSummary,
          recommendations: ['Ensure cross-AZ failover for Primary DB.'],
        }
      : null
  );
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const addNode = (type: string, label: string) => {
    const newNode: CanvasNode = {
      id: `${type}-${Date.now().toString().slice(-4)}`,
      type,
      label,
      x: 100 + Math.random() * 500,
      y: 100 + Math.random() * 250,
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
    setEdges(edges.filter((e) => e.from !== id && e.to !== id));
    if (selectedNode === id) setSelectedNode(null);
  };

  const handleNodeClick = (id: string) => {
    if (connectFrom) {
      if (connectFrom !== id) {
        // Create edge
        const newEdge: CanvasEdge = {
          id: `edge-${Date.now()}`,
          from: connectFrom,
          to: id,
          protocol: 'HTTP/REST',
          isAsync: false,
        };
        setEdges([...edges, newEdge]);
      }
      setConnectFrom(null);
    } else {
      setSelectedNode(id);
    }
  };

  const handleReviewArchitecture = async () => {
    setIsReviewing(true);
    try {
      const res = await fetch('/api/ai/review-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designId: initialDesign?.id,
          versionNumber: (initialDesign?.versions?.length || 1) + 1,
          nodes,
          edges,
          requirements: initialDesign?.title || 'Distributed Scalable Service',
        }),
      });
      const data = await res.json();
      setAiReview(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Canvas Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-border bg-card/60 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="font-mono text-xs">
              WHITEBOARD CANVAS
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              Version {initialDesign?.versions?.length || 1}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {initialDesign?.title || 'System Architecture Whiteboard'}
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConnectFrom(connectFrom ? null : selectedNode)}
            disabled={!selectedNode && !connectFrom}
            className={`text-xs h-9 gap-1.5 ${connectFrom ? 'bg-primary/20 text-primary border-primary' : ''}`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{connectFrom ? 'Click Target Node' : 'Connect Selected Node'}</span>
          </Button>

          <Button
            size="sm"
            onClick={handleReviewArchitecture}
            isLoading={isReviewing}
            className="text-xs h-9 gap-1.5 bg-gradient-to-r from-primary to-blue-600 text-white"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Architecture Review</span>
          </Button>
        </div>
      </div>

      {/* Palette Toolbar */}
      <div className="p-3 rounded-xl border border-border bg-muted/40 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-mono font-semibold uppercase text-muted-foreground mr-2 shrink-0">
          Component Palette:
        </span>
        {PALETTE.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              onClick={() => addNode(item.type, item.label)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 text-xs font-medium text-foreground transition-all shrink-0 hover:shadow-sm"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              <span>+ {item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Canvas Workspace */}
      <div className="relative h-[480px] w-full rounded-2xl border-2 border-border/80 bg-background overflow-hidden shadow-inner p-6">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Render Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNode === node.id;
          const isSource = connectFrom === node.id;

          return (
            <div
              key={node.id}
              onClick={() => handleNodeClick(node.id)}
              style={{
                transform: `translate(${node.x}px, ${node.y}px)`,
              }}
              className={`absolute cursor-pointer select-none rounded-xl border-2 p-3.5 shadow-md transition-all flex items-center gap-2.5 bg-card min-w-[150px] ${
                isSource
                  ? 'border-amber-500 ring-4 ring-amber-500/20'
                  : isSelected
                  ? 'border-primary ring-4 ring-primary/20'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Server className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{node.label}</p>
                <p className="text-[10px] font-mono text-muted-foreground uppercase">{node.type}</p>
              </div>
              {isSelected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNode(node.id);
                  }}
                  className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                  title="Delete Node"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* Connections List Overlay */}
        <div className="absolute bottom-4 left-4 max-w-sm rounded-xl border border-border bg-card/80 backdrop-blur-md p-3 text-xs space-y-1.5 shadow-lg">
          <p className="font-semibold text-muted-foreground text-[10px] uppercase font-mono">
            Active Connections ({edges.length})
          </p>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {edges.map((e) => (
              <div key={e.id} className="flex items-center justify-between font-mono text-[11px] text-foreground/80">
                <span>{e.from} → {e.to}</span>
                <Badge variant={e.isAsync ? 'warning' : 'outline'} className="text-[9px] px-1 py-0">
                  {e.protocol}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Architectural Review Card */}
      {aiReview && (
        <Card className="border-primary/30 bg-primary/5 animate-in fade-in">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI Architecture Critique & Bottleneck Analysis</span>
              </CardTitle>
              <Badge variant="success" className="font-mono text-xs">
                Scalability Score: {aiReview.scalabilityScore}/10
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <p className="text-sm text-foreground/90 leading-relaxed">{aiReview.summary}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiReview.spofs && aiReview.spofs.length > 0 && (
                <div className="p-3.5 rounded-lg border border-destructive/30 bg-destructive/5 space-y-1.5">
                  <span className="text-xs font-semibold text-destructive flex items-center gap-1.5 uppercase font-mono">
                    <AlertTriangle className="h-3.5 w-3.5" /> Single Points of Failure (SPOFs)
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                    {aiReview.spofs.map((s: string, i: number) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiReview.recommendations && aiReview.recommendations.length > 0 && (
                <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
                  <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5 uppercase font-mono">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Socratic Next Actions
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                    {aiReview.recommendations.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
