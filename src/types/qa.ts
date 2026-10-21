export type TestSeverity = 'P0_BLOCKER' | 'P1_CRITICAL' | 'P2_MAJOR' | 'P3_MINOR';
export type TestStatus = 'PASSED' | 'FAILED' | 'RUNNING' | 'PENDING' | 'SKIPPED';
export type TestType = 'UNIT' | 'INTEGRATION' | 'E2E' | 'SECURITY' | 'PERFORMANCE';
export type TestModule = 
  | 'BANK_FEED' 
  | 'GENERAL_LEDGER' 
  | 'GST_TAX' 
  | 'AI_MUNIMJI' 
  | 'TALLY_SYNC' 
  | 'E2E_JOURNEY';

export interface TestCase {
  id: string;
  title: string;
  module: TestModule;
  moduleName: string;
  type: TestType;
  severity: TestSeverity;
  status: TestStatus;
  durationMs: number;
  assertionCount: number;
  description: string;
  preconditions: string[];
  steps: string[];
  expectedResult: string;
  actualResult?: string;
  errorMessage?: string;
  stackTrace?: string;
  testData: Record<string, any>;
  codeSnippet: string;
  tags: string[];
  lastRunTimestamp: string;
}

export interface TestSuite {
  id: string;
  name: string;
  module: TestModule;
  description: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  durationMs: number;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  testCaseIds: string[];
}

export interface ChaosScenario {
  id: string;
  key: string;
  title: string;
  module: TestModule;
  description: string;
  technicalImpact: string;
  expectedAssertionFailure: string;
  active: boolean;
}

export interface DefectItem {
  id: string;
  title: string;
  testCaseId: string;
  module: TestModule;
  severity: TestSeverity;
  status: 'OPEN' | 'IN_TRIAGE' | 'RESOLVED' | 'VERIFIED';
  reporter: string;
  assignee: string;
  environment: string;
  description: string;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  logSnippet: string;
  createdAt: string;
}

export interface PerformanceMetric {
  concurrency: number;
  throughputTps: number;
  latencyP50: number;
  latencyP90: number;
  latencyP99: number;
  heapMemoryMb: number;
  cpuUtilizationPct: number;
  errorRatePct: number;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  testId?: string;
  message: string;
  detail?: string;
}
