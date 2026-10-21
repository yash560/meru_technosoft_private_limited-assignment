'use client';

import React, { useState } from 'react';
import { 
  Bug, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  Copy, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { DefectItem, TestSeverity } from '../types/qa';

interface DefectTrackerViewProps {
  defects: DefectItem[];
  onOpenNewDefectModal: () => void;
}

export const DefectTrackerView: React.FC<DefectTrackerViewProps> = ({
  defects,
  onOpenNewDefectModal
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedDefect, setSelectedDefect] = useState<DefectItem>(defects[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDefects = defects.filter(d => {
    if (selectedSeverity === 'ALL') return true;
    return d.severity === selectedSeverity;
  });

  const copyJiraMarkdown = (defect: DefectItem) => {
    const text = `h2. [${defect.id}] ${defect.title}
*Severity:* ${defect.severity}
*Module:* ${defect.module}
*Environment:* ${defect.environment}
*Reporter:* ${defect.reporter}

h3. Description
${defect.description}

h3. Steps to Reproduce
${defect.stepsToReproduce.map((s, i) => `# ${s}`).join('\n')}

h3. Expected Behavior
${defect.expectedBehavior}

h3. Actual Behavior
${defect.actualBehavior}

h3. Stack Log
{code}
${defect.logSnippet}
{code}`;

    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {});
      }
    } catch (e) {
      // Safe fallback for environments without clipboard permissions
    }
    setCopiedId(defect.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bug className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Financial QA Defect Backlog & Triage
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracked software discrepancies, edge-case tax calculation bugs, and resolution states
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Severity Filter */}
          <select
            id="defect-severity-select"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="P0_BLOCKER">P0 Blocker</option>
            <option value="P1_CRITICAL">P1 Critical</option>
            <option value="P2_MAJOR">P2 Major</option>
          </select>

          {/* New Defect Button */}
          <button
            id="btn-log-defect"
            onClick={onOpenNewDefectModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Defect</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Defect List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Identified Defects ({filteredDefects.length})
          </div>

          <div className="space-y-2.5">
            {filteredDefects.map((defect) => {
              const isSelected = selectedDefect?.id === defect.id;
              const isP0 = defect.severity === 'P0_BLOCKER';
              const isP1 = defect.severity === 'P1_CRITICAL';

              return (
                <div
                  key={defect.id}
                  onClick={() => setSelectedDefect(defect)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-50/80 dark:bg-sky-950/30 border-sky-400 dark:border-sky-700 ring-1 ring-sky-400/50 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                      {defect.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      defect.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : defect.status === 'RESOLVED'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {defect.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                    {defect.title}
                  </h4>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className={`font-semibold ${isP0 ? 'text-rose-600 dark:text-rose-400' : isP1 ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      {defect.severity.replace('_', ' ')}
                    </span>
                    <span>Assignee: {defect.assignee}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Defect Detail Drawer (7 Cols) */}
        {selectedDefect && (
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                    {selectedDefect.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedDefect.module}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedDefect.title}
                </h3>
              </div>

              <button
                id="btn-copy-jira"
                onClick={() => copyJiraMarkdown(selectedDefect)}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center space-x-1 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedId === selectedDefect.id ? 'Copied!' : 'Copy Jira/Linear'}</span>
              </button>
            </div>

            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
              <div>
                <span className="text-slate-400 block">Severity:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDefect.severity}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Status:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDefect.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Assignee:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDefect.assignee}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Environment:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedDefect.environment}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">Defect Overview & Impact</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedDefect.description}
              </p>
            </div>

            {/* Steps to Reproduce */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">Deterministic Steps to Reproduce</h4>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                {selectedDefect.stepsToReproduce.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Expected vs Actual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">Expected Behavior:</span>
                <p className="text-emerald-700 dark:text-emerald-400">{selectedDefect.expectedBehavior}</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 space-y-1">
                <span className="font-bold text-rose-800 dark:text-rose-300">Actual Behavior:</span>
                <p className="text-rose-700 dark:text-rose-400">{selectedDefect.actualBehavior}</p>
              </div>
            </div>

            {/* Log Snippet */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">Engine Telemetry & Stack Trace</h4>
              <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto">
                {selectedDefect.logSnippet}
              </pre>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
