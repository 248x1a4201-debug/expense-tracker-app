import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  FolderTree,
  Terminal,
  BookOpen,
  HelpCircle,
  Download,
  ExternalLink,
  ChevronRight,
  Database,
  Layers,
} from 'lucide-react';
import { FLUTTER_FILES, FLUTTER_PROJECT_STRUCTURE } from '../../data/flutterProjectCode';

export const FlutterProjectViewer: React.FC = () => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'files' | 'viva' | 'setup' | 'architecture'>('files');

  const selectedFile = FLUTTER_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCurrent = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadBundle = () => {
    // Generate combined bundle
    let fullBundle = `=== EXPENSE TRACKER FLUTTER PROJECT SOURCE CODE BUNDLE ===\n`;
    fullBundle += `PROJECT ARCHITECTURE TREE:\n${FLUTTER_PROJECT_STRUCTURE}\n\n`;

    FLUTTER_FILES.forEach((f) => {
      fullBundle += `====================================================\n`;
      fullBundle += `FILE: ${f.path}\n`;
      fullBundle += `DESCRIPTION: ${f.description}\n`;
      fullBundle += `====================================================\n\n`;
      fullBundle += f.code;
      fullBundle += `\n\n`;
    });

    const blob = new Blob([fullBundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ExpenseTracker_Flutter_Complete_Source.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden select-none">
      {/* Top Navigation Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Flutter & Dart Academic Deliverables Hub
            </h2>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Flutter 3.x+
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Production-ready Dart files, SQLite schema, setup commands, and College Viva Guide
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadBundle}
            className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Full Code Bundle</span>
          </button>
        </div>
      </div>

      {/* Segmented View Selector */}
      <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'files'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Source Files ({FLUTTER_FILES.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('setup')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'setup'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Setup & Run Instructions</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Architecture & SQLite Schema</span>
        </button>

        <button
          onClick={() => setActiveTab('viva')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'viva'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>College Viva Voce Q&A</span>
        </button>
      </div>

      {/* Main Body */}
      {activeTab === 'files' ? (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File Tree Sidebar */}
          <div className="w-full md:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-3 overflow-y-auto shrink-0 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 px-2 py-1 block uppercase tracking-wider">
              Project Structure
            </span>
            {FLUTTER_FILES.map((file, idx) => {
              const isSelected = selectedFileIndex === idx;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono ml-1 shrink-0">
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
            {/* Viewer Header */}
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-emerald-400 font-bold">{selectedFile.path}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadCurrent}
                  className="h-8 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>

            {/* Code Pre Box */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
              <pre className="selection:bg-emerald-800 selection:text-white">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      ) : activeTab === 'setup' ? (
        <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-600" />
              <span>Step-by-Step Guide to Run in Android Studio or VS Code</span>
            </h3>

            <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  1. Prerequisites Check
                </h4>
                <p>
                  Ensure you have the Flutter SDK (3.16.0+) installed and added to your system PATH.
                  Check with terminal:
                </p>
                <div className="p-2.5 mt-1 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs">
                  flutter doctor
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  2. Create Project & Replace Lib Directory
                </h4>
                <p>Initialize a new Flutter project in your workspace:</p>
                <div className="p-2.5 mt-1 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs">
                  flutter create expense_tracker<br />
                  cd expense_tracker
                </div>
                <p className="mt-1 text-slate-500">
                  Copy the provided <code className="text-emerald-600">pubspec.yaml</code> and all{' '}
                  <code className="text-emerald-600">lib/</code> files from this hub into your project directory.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  3. Install Dependencies
                </h4>
                <p>Fetch the SQLite, FL Chart, and Provider packages:</p>
                <div className="p-2.5 mt-1 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs">
                  flutter pub get
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  4. Launch Simulator & Run App
                </h4>
                <p>Launch either an Android Emulator or iOS Simulator and execute:</p>
                <div className="p-2.5 mt-1 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs">
                  flutter run
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'architecture' ? (
        <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <span>Clean Architecture & SQLite Database Schema</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-emerald-600 block mb-1">1. Presentation Layer</span>
                <p className="text-slate-600 dark:text-slate-400">
                  Stateful and Stateless UI widgets, FL Chart interactive canvases, bottom navigation, and modal forms.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-blue-600 block mb-1">2. Domain & State Layer</span>
                <p className="text-slate-600 dark:text-slate-400">
                  ChangeNotifier providers (Theme, Currency, State) ensuring responsive state updates across screens.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-purple-600 block mb-1">3. Data & Storage Layer</span>
                <p className="text-slate-600 dark:text-slate-400">
                  SQLite (sqflite) relational engine with serialized models and indexed transaction tables.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Project Folder Tree
              </h4>
              <div className="p-4 bg-slate-950 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto">
                <pre>{FLUTTER_PROJECT_STRUCTURE}</pre>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>College Viva Voce Questions & Answers Guide</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  Q1: Why did you choose Flutter and Dart for this Expense Tracker?
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>Answer:</strong> Flutter renders natively at 60/120 FPS via the Impeller engine without the JavaScript bridge overhead seen in hybrid frameworks. Dart provides Ahead-of-Time (AOT) compilation for fast launch times and Just-in-Time (JIT) compilation for hot reload productivity.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  Q2: Why use SQLite (sqflite) instead of NoSQL key-value (Hive or SharedPreferences)?
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>Answer:</strong> Personal finance systems demand relational aggregation operations (e.g. <code>SUM(amount) GROUP BY category</code>, date interval filtering, and transaction sorting). SQLite offers full ACID transaction guarantees and structured SQL query indexing.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  Q3: How does the application handle offline data persistence?
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>Answer:</strong> The app adopts an Offline-First architectural pattern. All records are written directly to local SQLite database tables on device storage. Data remains persistent across device reboots and app updates with zero network dependency.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slate-900 dark:text-white">
                  Q4: How does Budget utilization calculation work?
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>Answer:</strong> Upon transaction commit, the system queries the aggregate sum of expenses in the current month matching the transaction's category. If <code>(sum / monthlyLimit) &gt;= 0.85</code>, a threshold alert event is created and notified.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
