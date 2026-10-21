'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from '../components/Navbar';
import { DashboardView } from '../components/DashboardView';
import { TestRunnerView } from '../components/TestRunnerView';
import { TestCaseMatrixView } from '../components/TestCaseMatrixView';
import { ChaosEngineView } from '../components/ChaosEngineView';
import { PerformanceView } from '../components/PerformanceView';
import { DefectTrackerView } from '../components/DefectTrackerView';
import { TestCaseModal } from '../components/TestCaseModal';
import { NewDefectModal } from '../components/NewDefectModal';

import { 
  INITIAL_SUITES, 
  INITIAL_TEST_CASES, 
  CHAOS_SCENARIOS, 
  INITIAL_DEFECTS 
} from '../data/mockData';
import { TestSuite, TestCase, ChaosScenario, DefectItem, ExecutionLog } from '../types/qa';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const [suites, setSuites] = useState<TestSuite[]>(INITIAL_SUITES);
  const [testCases, setTestCases] = useState<TestCase[]>(INITIAL_TEST_CASES);
  const [chaosScenarios, setChaosScenarios] = useState<ChaosScenario[]>(CHAOS_SCENARIOS);
  const [defects, setDefects] = useState<DefectItem[]>(INITIAL_DEFECTS);

  const [logs, setLogs] = useState<ExecutionLog[]>([
    { id: 'log-0', timestamp: new Date().toISOString(), level: 'INFO', message: 'HelloBooks QA Harness initialized. 34 test cases calibrated.' },
    { id: 'log-1', timestamp: new Date().toISOString(), level: 'SUCCESS', message: 'Double-entry balance identity (Assets = Liab + Equity) verified across 250k journal records.' },
    { id: 'log-2', timestamp: new Date().toISOString(), level: 'INFO', message: 'Plaid webhook ingestion deduplication cache warm.' }
  ]);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [isNewDefectOpen, setIsNewDefectOpen] = useState<boolean>(false);
  const [filterHorizon, setFilterHorizon] = useState<string>('all');

  // Initialize Theme on Mount
  useEffect(() => {
    // Default to dark mode for developer / high-contrast enterprise theme
    document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const handleToggleChaos = (scenarioId: string) => {
    setChaosScenarios(prev =>
      prev.map(s => s.id === scenarioId ? { ...s, active: !s.active } : s)
    );
  };

  const handleResetChaos = () => {
    setChaosScenarios(prev => prev.map(s => ({ ...s, active: false })));
    setTestCases(prev => prev.map(tc => ({ ...tc, status: 'PASSED' })));
    setSuites(prev => prev.map(s => ({ ...s, failedTests: 0, passedTests: s.totalTests, status: 'COMPLETED' })));
  };

  const addLog = (level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', message: string, detail?: string) => {
    setLogs(prev => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toISOString(),
        level,
        message,
        detail
      }
    ]);
  };

  // Run full test execution with realistic simulated delays and chaos injection handling
  const handleRunAll = async () => {
    setIsRunning(true);
    addLog('INFO', 'Starting execution of 34 test cases across 6 suites...');

    const activeChaos = chaosScenarios.filter(s => s.active);

    // Reset status to RUNNING
    setTestCases(prev => prev.map(tc => ({ ...tc, status: 'RUNNING' })));

    await new Promise(r => setTimeout(r, 600));

    // Determine results based on active chaos scenarios
    const updatedCases: TestCase[] = testCases.map(tc => {
      // Check if this case is affected by active chaos
      const isUnbalancedChaos = tc.id === 'TC-GL-02' && activeChaos.some(c => c.key === 'unbalanced_journal');
      const isDuplicatePlaid = tc.id === 'TC-BF-01' && activeChaos.some(c => c.key === 'duplicate_plaid_tx');
      const isGstinChaos = tc.id === 'TC-GT-02' && activeChaos.some(c => c.key === 'invalid_gstin_checksum');
      const isPromptChaos = tc.id === 'TC-AI-01' && activeChaos.some(c => c.key === 'ai_prompt_injection');
      const isTallyChaos = tc.id === 'TC-TL-02' && activeChaos.some(c => c.key === 'tally_timeout_504');

      if (isUnbalancedChaos) {
        return {
          ...tc,
          status: 'FAILED',
          actualResult: 'FAILED: Database rejected unbalanced journal entry. Debits: ₹15,400.00, Credits: ₹15,399.50 (Diff: ₹0.50). Check constraint violation.',
          errorMessage: 'UnbalancedJournalEntryException: Debits and credits must balance to 0'
        };
      }

      if (isDuplicatePlaid) {
        return {
          ...tc,
          status: 'FAILED',
          actualResult: 'FAILED: Webhook replay storm injected duplicate key into buffer before deduplication check completed.',
          errorMessage: 'DuplicateTransactionKeyException: externalId tx_plaid_99214 already exists'
        };
      }

      if (isGstinChaos) {
        return {
          ...tc,
          status: 'FAILED',
          actualResult: 'FAILED: Invalid 15th checksum character 9 accepted by form regex. Expected check digit 5.',
          errorMessage: 'GstinChecksumMismatchException: Check digit calculation failed'
        };
      }

      if (isPromptChaos) {
        return {
          ...tc,
          status: 'PASSED', // Intercepted successfully
          actualResult: 'PASSED: Copilot security guardrail deflected prompt injection attack. HTTP 403 returned with zero data leakage.'
        };
      }

      if (isTallyChaos) {
        return {
          ...tc,
          status: 'PASSED', // Successfully retried
          actualResult: 'PASSED: Recovered after 2 exponential backoff retries (504 gateway simulated).'
        };
      }

      return {
        ...tc,
        status: 'PASSED',
        actualResult: tc.expectedResult
      };
    });

    setTestCases(updatedCases);

    // Update suites
    setSuites(prev => prev.map(s => {
      const suiteCases = updatedCases.filter(tc => s.testCaseIds.includes(tc.id));
      const passed = suiteCases.filter(c => c.status === 'PASSED').length;
      const failed = suiteCases.filter(c => c.status === 'FAILED').length;
      return {
        ...s,
        passedTests: passed,
        failedTests: failed,
        status: failed > 0 ? 'FAILED' : 'COMPLETED'
      };
    }));

    // Output logs
    updatedCases.forEach(tc => {
      if (tc.status === 'FAILED') {
        addLog('ERROR', `FAIL: ${tc.id} - ${tc.title}`, tc.actualResult);
      } else {
        addLog('SUCCESS', `PASS: ${tc.id} - ${tc.title} (${tc.durationMs}ms)`);
      }
    });

    const failedCount = updatedCases.filter(c => c.status === 'FAILED').length;
    if (failedCount === 0) {
      addLog('SUCCESS', 'All 34 test cases passed! Double-entry ledger invariance verified 100%.');
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    } else {
      addLog('WARN', `Execution completed with ${failedCount} intentional chaos failure(s) quarantined.`);
    }

    setIsRunning(false);
  };

  const handleRunSuite = async (suiteId: string) => {
    setIsRunning(true);
    const targetSuite = suites.find(s => s.id === suiteId);
    if (!targetSuite) {
      setIsRunning(false);
      return;
    }

    addLog('INFO', `Executing suite: ${targetSuite.name}...`);
    await new Promise(r => setTimeout(r, 400));

    targetSuite.testCaseIds.forEach(tcId => {
      const tc = testCases.find(t => t.id === tcId);
      if (tc) {
        addLog('SUCCESS', `PASS: ${tc.id} - ${tc.title} (${tc.durationMs}ms)`);
      }
    });

    addLog('SUCCESS', `Suite ${targetSuite.name} finished with 100% pass rate.`);
    setIsRunning(false);
  };

  const handleNewDefectSubmit = (newDefect: DefectItem) => {
    setDefects(prev => [newDefect, ...prev]);
    addLog('WARN', `New defect ticket logged: ${newDefect.id} - ${newDefect.title}`);
  };

  const totalTests = testCases.length;
  const passedTests = testCases.filter(t => t.status === 'PASSED').length;
  const failedTests = testCases.filter(t => t.status === 'FAILED').length;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        totalTests={totalTests}
        passedTests={passedTests}
        failedTests={failedTests}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            suites={suites}
            testCases={testCases}
            defects={defects}
            onRunAll={handleRunAll}
            onRunSuite={handleRunSuite}
            isRunning={isRunning}
            onSelectTab={setActiveTab}
            onSelectTestCase={setSelectedTestCase}
            filterHorizon={filterHorizon}
            setFilterHorizon={setFilterHorizon}
          />
        )}

        {activeTab === 'runner' && (
          <TestRunnerView
            suites={suites}
            testCases={testCases}
            onRunAll={handleRunAll}
            onRunSuite={handleRunSuite}
            isRunning={isRunning}
            logs={logs}
            onSelectTestCase={setSelectedTestCase}
            chaosActiveCount={chaosScenarios.filter(s => s.active).length}
          />
        )}

        {activeTab === 'matrix' && (
          <TestCaseMatrixView
            testCases={testCases}
            onSelectTestCase={setSelectedTestCase}
          />
        )}

        {activeTab === 'chaos' && (
          <ChaosEngineView
            scenarios={chaosScenarios}
            onToggleScenario={handleToggleChaos}
            onResetChaos={handleResetChaos}
            onExecuteChaosRun={handleRunAll}
            isRunning={isRunning}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceView />
        )}

        {activeTab === 'defects' && (
          <DefectTrackerView
            defects={defects}
            onOpenNewDefectModal={() => setIsNewDefectOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/60 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Meru QA Sentinel</span>
            <span>•</span>
            <span>HelloBooks.ai Quality Engine</span>
            <span>•</span>
            <span>Meru Technosoft Private Limited</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Built by Yash Jain</span>
            <span>•</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              34 Tests Calibrated (100% Invariant)
            </span>
          </div>
        </div>
      </footer>

      {/* Test Case Inspection Modal */}
      <TestCaseModal
        testCase={selectedTestCase}
        onClose={() => setSelectedTestCase(null)}
      />

      {/* New Defect Logging Modal */}
      <NewDefectModal
        isOpen={isNewDefectOpen}
        onClose={() => setIsNewDefectOpen(false)}
        onSubmitDefect={handleNewDefectSubmit}
      />

    </div>
  );
}
