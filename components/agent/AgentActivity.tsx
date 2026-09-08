"use client";

import React from "react";
import { 
  CheckCircle2, 
  Clock, 
  Cpu, 
  AlertCircle, 
  ShieldCheck, 
  Loader2, 
  Terminal, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { AgentTraceStep, AgentStatus, AgentType } from "@/lib/agents/types";

interface AgentActivityProps {
  title?: string;
  agentType?: AgentType;
  status: AgentStatus;
  steps: AgentTraceStep[];
  currentAction?: string;
  className?: string;
  onInspectTrace?: () => void;
}

export function AgentActivity({
  title = "AI Agent Activity Log",
  agentType = "networking_agent",
  status,
  steps,
  currentAction,
  className = "",
  onInspectTrace,
}: AgentActivityProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "executing":
      case "planning":
        return (
          <Badge variant="indigo" size="sm">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Executing Tools
          </Badge>
        );
      case "waiting_for_approval":
        return (
          <Badge variant="amber" size="sm">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Paused for Human Approval
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="emerald" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="rose" size="sm">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="slate" size="sm">
            Standing By
          </Badge>
        );
    }
  };

  const formatAgentName = (type: string) => {
    switch (type) {
      case "career_agent":
        return "Career Navigation Agent";
      case "networking_agent":
        return "Autonomous Networking Agent";
      case "relationship_agent":
        return "Relationship Intelligence Agent";
      default:
        return "Career Intelligence Agent";
    }
  };

  return (
    <div className={`rounded-2xl border border-[#F0E3E7] bg-white p-5 space-y-4 shadow-[0_2px_12px_rgba(74,12,43,0.03)] ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E3E7] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#FDF2F5] border border-[#F4CEDB] text-[#7A1443]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1E1218] flex items-center gap-2">
              {title}
              <span className="text-[10px] text-[#7A1443] font-mono">
                ({formatAgentName(agentType)})
              </span>
            </h3>
            <p className="text-[11px] text-[#7D6F77]">
              Live audit trace of autonomous reasoning and controlled tool execution.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {getStatusBadge()}
          {onInspectTrace && (
            <Button
              size="sm"
              variant="outline"
              onClick={onInspectTrace}
              className="text-xs border-[#E8D1D8] text-[#7A1443] hover:bg-[#FDF2F5] py-1 px-2.5 h-auto"
            >
              <Terminal className="w-3 h-3 mr-1" />
              Trace
            </Button>
          )}
        </div>
      </div>

      {/* Current In-flight Action */}
      {currentAction && status === "executing" && (
        <div className="p-3 rounded-xl bg-[#FDF2F5] border border-[#F4CEDB] flex items-center gap-3 text-xs text-[#7A1443] animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-[#7A1443] shrink-0" />
          <span className="font-medium">{currentAction}</span>
        </div>
      )}

      {/* Step Timeline */}
      {steps.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#7D6F77] space-y-1">
          <Sparkles className="w-6 h-6 mx-auto text-[#7D6F77] opacity-60" />
          <p>No recent agent actions recorded yet.</p>
          <p className="text-[10px] text-[#7D6F77]">Run an agent workflow to observe real-time tool execution.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
          {steps.map((step) => {
            const isCompleted = step.status === "completed";
            const isWaiting = step.status === "waiting_for_approval";
            const isFailed = step.status === "failed";

            return (
              <div
                key={step.stepNumber}
                className={`p-3 rounded-xl border transition text-xs flex items-start justify-between gap-3 ${
                  isWaiting
                    ? "bg-amber-50/80 border-amber-300 text-amber-900"
                    : isFailed
                    ? "bg-rose-50/80 border-rose-300 text-rose-900"
                    : "bg-[#FAF7F8] border-[#F0E3E7] text-[#1E1218] hover:bg-[#FDF2F5]"
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {isWaiting ? (
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                    ) : isFailed ? (
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-bold text-[#7D6F77]">
                        #{step.stepNumber}
                      </span>
                      <span className="font-bold text-[#1E1218] truncate">
                        {step.toolName}
                      </span>
                      {isWaiting && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                          Human Review Needed
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#7D6F77] truncate">
                      {step.description}
                    </p>
                    <p className="text-[10px] text-[#4A3E45] font-mono bg-white rounded px-2 py-0.5 mt-1 border border-[#F0E3E7] truncate">
                      {step.outputSummary}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#7D6F77] font-mono flex items-center gap-1 justify-end">
                    <Clock className="w-2.5 h-2.5" />
                    {step.durationMs}ms
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
