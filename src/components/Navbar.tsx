'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Play, 
  Layers, 
  Flame, 
  Activity, 
  Bug, 
  Sun, 
  Moon, 
  ExternalLink,
  Cpu
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  totalTests: number;
  passedTests: number;
  failedTests: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleDarkMode,
  totalTests,
  passedTests,
  failedTests
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Executive QA', icon: Activity },
    { id: 'runner', label: 'Live Test Runner', icon: Play },
    { id: 'matrix', label: 'Test Matrix', icon: Layers },
    { id: 'chaos', label: 'Chaos Engine', icon: Flame },
    { id: 'performance', label: 'Load & Concurrency', icon: Cpu },
    { id: 'defects', label: 'Defect Tracker', icon: Bug },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-[#0c1222]/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 text-white shadow-md shadow-sky-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  Meru QA Sentinel
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  HelloBooks.ai
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Meru Technosoft • Automated Financial QA & Verification Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/80 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'defects' && failedTests > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                      {failedTests}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Stats, Theme Toggle, Target Link */}
          <div className="flex items-center space-x-3">
            {/* Live Test Status Pill */}
            <div className="hidden lg:flex items-center space-x-2 text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {passedTests}/{totalTests} Tests Green
              </span>
            </div>

            {/* Dark/Light Mode Switcher */}
            <button
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              aria-label="Toggle theme mode"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Recruiter / Company Link */}
            <a
              href="https://hellobooks.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center space-x-1 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
            >
              <span>HelloBooks.ai</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-200 dark:border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 whitespace-nowrap px-2.5 py-1 rounded-md text-xs font-semibold ${
                  isActive
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
