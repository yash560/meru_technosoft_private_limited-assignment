'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Tag, 
  FileCode2,
  SlidersHorizontal
} from 'lucide-react';
import { TestCase, TestSeverity, TestModule, TestType } from '../types/qa';

interface TestCaseMatrixViewProps {
  testCases: TestCase[];
  onSelectTestCase: (tc: TestCase) => void;
}

export const TestCaseMatrixView: React.FC<TestCaseMatrixViewProps> = ({
  testCases,
  onSelectTestCase
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredCases = testCases.filter(tc => {
    const matchesSearch = 
      tc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeverity = selectedSeverity === 'ALL' || tc.severity === selectedSeverity;
    const matchesModule = selectedModule === 'ALL' || tc.module === selectedModule;
    const matchesType = selectedType === 'ALL' || tc.type === selectedType;

    return matchesSearch && matchesSeverity && matchesModule && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-sky-500" />
            <span>Master Test Case Specification Matrix</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete inventory of automated verification cases, assertions, preconditions, and Playwright scripts
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing <span className="font-bold text-slate-900 dark:text-white">{filteredCases.length}</span> of {testCases.length} Test Cases
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              id="search-test-matrix"
              type="text"
              placeholder="Search by ID, keyword, tag (e.g. Plaid, Invariance, GST, SQL, 194J)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Severity Dropdown */}
          <select
            id="matrix-severity-filter"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="P0_BLOCKER">P0 Blocker</option>
            <option value="P1_CRITICAL">P1 Critical</option>
            <option value="P2_MAJOR">P2 Major</option>
            <option value="P3_MINOR">P3 Minor</option>
          </select>

          {/* Module Dropdown */}
          <select
            id="matrix-module-filter"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Modules</option>
            <option value="BANK_FEED">Plaid Bank Feeds</option>
            <option value="GENERAL_LEDGER">General Ledger Invariance</option>
            <option value="GST_TAX">GST & Tax Compliance</option>
            <option value="AI_MUNIMJI">AI Munimji Copilot</option>
            <option value="TALLY_SYNC">Tally Prime Sync</option>
            <option value="E2E_JOURNEY">Playwright E2E</option>
          </select>

          {/* Type Dropdown */}
          <select
            id="matrix-type-filter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Test Types</option>
            <option value="UNIT">Unit Tests</option>
            <option value="INTEGRATION">Integration Tests</option>
            <option value="E2E">E2E Browser Tests</option>
            <option value="SECURITY">Security / Guardrails</option>
            <option value="PERFORMANCE">Performance Tests</option>
          </select>

        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Test ID</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4">Test Title & Specification</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Asserts</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredCases.map((tc) => (
                <tr 
                  key={tc.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap">
                    {tc.id}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {tc.moduleName}
                  </td>
                  <td className="py-3 px-4 max-w-md">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {tc.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {tc.description}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tc.tags.map(t => (
                        <span key={t} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tc.severity === 'P0_BLOCKER' 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' 
                        : tc.severity === 'P1_CRITICAL'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {tc.severity.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    {tc.type}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {tc.assertionCount} checks
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      tc.status === 'PASSED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {tc.status === 'PASSED' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                      <span>{tc.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      id={`inspect-${tc.id.toLowerCase()}`}
                      onClick={() => onSelectTestCase(tc)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/80 text-sky-700 dark:text-sky-300 font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Spec & Code</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
