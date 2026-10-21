'use client';

import React from 'react';
import { X, CheckCircle2, Clock, Code2, Tag, Layers, ShieldCheck, Database } from 'lucide-react';
import { TestCase } from '../types/qa';

interface TestCaseModalProps {
  testCase: TestCase | null;
  onClose: () => void;
}

export const TestCaseModal: React.FC<TestCaseModalProps> = ({ testCase, onClose }) => {
  if (!testCase) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              {testCase.id}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {testCase.moduleName}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              testCase.severity === 'P0_BLOCKER' 
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }`}>
              {testCase.severity.replace('_', ' ')}
            </span>
          </div>

          <button
            id="btn-close-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Title & Description */}
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {testCase.title}
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
              {testCase.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 font-medium">
            <div>
              <span className="text-slate-400 block text-[11px]">Type:</span>
              <span className="text-slate-900 dark:text-white font-mono">{testCase.type}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Execution Time:</span>
              <span className="text-slate-900 dark:text-white font-mono">{testCase.durationMs}ms</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Assertions:</span>
              <span className="text-slate-900 dark:text-white font-mono">{testCase.assertionCount} strict checks</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{testCase.status}</span>
            </div>
          </div>

          {/* Preconditions */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Preconditions & Test Setup
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
              {testCase.preconditions.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          {/* Execution Steps */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Execution Steps
            </h3>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-300">
              {testCase.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>

          {/* Expected vs Actual */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-[11px]">Expected Result:</span>
              <p className="text-emerald-700 dark:text-emerald-400 leading-relaxed">{testCase.expectedResult}</p>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 space-y-1">
              <span className="font-bold text-sky-800 dark:text-sky-300 block text-[11px]">Actual Result:</span>
              <p className="text-sky-700 dark:text-sky-400 leading-relaxed">{testCase.actualResult || 'Executed successfully with 0 assertion failures.'}</p>
            </div>
          </div>

          {/* Test Data JSON */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-sky-500" />
              <span>Test Payload Data</span>
            </h3>
            <pre className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto">
              {JSON.stringify(testCase.testData, null, 2)}
            </pre>
          </div>

          {/* Automated Test Code Snippet */}
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Code2 className="w-3.5 h-3.5 text-sky-500" />
              <span>Automated Test Implementation (Playwright / Jest)</span>
            </h3>
            <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
              {testCase.codeSnippet}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold text-xs transition-colors"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
