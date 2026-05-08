"use client";

import { useState } from "react";

const SAMPLE_LOGS = `[2024-01-15 10:23:01] ERROR Login attempt failed - invalid password for user@demo.com
[2024-01-15 10:23:04] WARN  Rate limit approaching for IP 192.168.1.105 (4/5 attempts)
[2024-01-15 10:23:07] ERROR Login attempt failed - invalid password for user@demo.com
[2024-01-15 10:23:07] ERROR Rate limit exceeded for IP 192.168.1.105
[2024-01-15 10:23:12] ERROR MFA verification failed - OTP expired for user@demo.com
[2024-01-15 10:23:15] INFO  Account temporarily locked for user@demo.com`;

interface AnalysisResponse {
  rootCause: string;
  failureSequence: string[];
  suggestedFix: string;
}

export default function LogSense() {
  const [logs, setLogs] = useState(SAMPLE_LOGS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyse = async () => {
    if (!logs.trim()) {
      setError("Please paste some logs to analyse.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyse logs");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("An error occurred while analysing the logs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setLogs("");
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <header className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">LogSense</h1>
            <p className="text-sm text-zinc-400">AI-powered log diagnostics and root cause analysis.</p>
          </div>
        </header>

        {/* Top Panel: Input */}
        <section className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="logs" className="block text-sm font-medium text-zinc-300">
              Raw Logs Input
            </label>
            <button
              onClick={handleClear}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1"
            >
              Clear
            </button>
          </div>
          <textarea
            id="logs"
            value={logs}
            onChange={(e) => setLogs(e.target.value)}
            placeholder="Paste your system or application logs here..."
            className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-emerald-400/90 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-y"
            spellCheck={false}
          />

          {error && (
            <p className="mt-3 text-sm text-red-400 flex items-center gap-2 animate-in fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAnalyse}
              disabled={loading || !logs.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Analysing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Analyse Logs
                </>
              )}
            </button>
          </div>
        </section>

        {/* Bottom Panel: Results */}
        {result && !loading && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 shadow-xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full -mr-16 -mt-16"></div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                Root Cause
              </h2>
              <p className="text-zinc-100 text-lg leading-relaxed">{result.rootCause}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 shadow-xl backdrop-blur-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                  Failure Sequence
                </h2>
                <div className="space-y-4">
                  {result.failureSequence.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium border border-zinc-700/50">
                        {idx + 1}
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed mt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-xl backdrop-blur-sm h-fit">
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Suggested Fix
                </h2>
                <p className="text-emerald-100/90 text-sm leading-relaxed">{result.suggestedFix}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
