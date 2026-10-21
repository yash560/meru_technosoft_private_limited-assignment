'use client';

import React, { useState } from 'react';
import { X, Bug, Plus, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DefectItem, TestSeverity, TestModule } from '../types/qa';

interface NewDefectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDefect: (defect: DefectItem) => void;
}

export const NewDefectModal: React.FC<NewDefectModalProps> = ({
  isOpen,
  onClose,
  onSubmitDefect
}) => {
  const [title, setTitle] = useState('');
  const [module, setModule] = useState<TestModule>('GST_TAX');
  const [severity, setSeverity] = useState<TestSeverity>('P1_CRITICAL');
  const [environment, setEnvironment] = useState('Staging-v5.2 / Node 20');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newDefect: DefectItem = {
      id: `DEFECT-${Math.floor(100 + Math.random() * 900)}`,
      title,
      testCaseId: 'TC-CUSTOM-QA',
      module,
      severity,
      status: 'OPEN',
      reporter: 'Brane Autonomous QA',
      assignee: 'Rushabh Shah',
      environment,
      description,
      stepsToReproduce: steps ? steps.split('\n').filter(s => s.trim()) : ['Manual verification in UI'],
      expectedBehavior: expected || 'System operates without assertion failure',
      actualBehavior: actual || 'Discrepancy observed during test execution',
      logSnippet: `ERROR [QASentinel] Defect logged for ${module} under ${environment}`,
      createdAt: new Date().toISOString()
    };

    onSubmitDefect(newDefect);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Log New Financial QA Defect
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Create structured bug ticket with reproduction steps for engineering triage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Defect Summary / Title *
            </label>
            <input
              id="defect-title-input"
              type="text"
              required
              placeholder="e.g. Inconsistent HSN tax slab suggestion for Composite supply"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Module
              </label>
              <select
                id="defect-module-select"
                value={module}
                onChange={(e) => setModule(e.target.value as TestModule)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="BANK_FEED">Plaid Bank Feeds</option>
                <option value="GENERAL_LEDGER">General Ledger Invariance</option>
                <option value="GST_TAX">GST & Tax Compliance</option>
                <option value="AI_MUNIMJI">AI Munimji Copilot</option>
                <option value="TALLY_SYNC">Tally Prime Sync</option>
                <option value="E2E_JOURNEY">Playwright E2E</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Severity
              </label>
              <select
                id="defect-severity-select-input"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as TestSeverity)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="P0_BLOCKER">P0 Blocker</option>
                <option value="P1_CRITICAL">P1 Critical</option>
                <option value="P2_MAJOR">P2 Major</option>
                <option value="P3_MINOR">P3 Minor</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Environment
              </label>
              <input
                id="defect-env-input"
                type="text"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description & Context
            </label>
            <textarea
              id="defect-desc-input"
              rows={2}
              placeholder="Detailed description of the bug and financial risk..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Steps to Reproduce (one per line)
            </label>
            <textarea
              id="defect-steps-input"
              rows={3}
              placeholder="1. Navigate to Invoicing&#10;2. Add item with 12% GST&#10;3. Click Save"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none font-mono text-[11px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Expected Behavior
              </label>
              <input
                id="defect-expected-input"
                type="text"
                placeholder="Exact accounting / tax outcome expected"
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Actual Behavior
              </label>
              <input
                id="defect-actual-input"
                type="text"
                placeholder="Observed error or calculation drift"
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              id="defect-submit-btn"
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md shadow-rose-600/20"
            >
              Submit Ticket to Triage
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
