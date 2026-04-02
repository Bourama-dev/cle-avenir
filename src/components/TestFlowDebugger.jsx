import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Activity, Database, CheckCircle2 } from 'lucide-react';
import { incrementAction, getCareerStats } from '@/services/careerStats';
import { reinforceCareer } from '@/services/reinforceCareer';

const TestFlowDebugger = ({ userVector, topCareers, currentStep, totalSteps }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('flow');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setIsVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const handleTestTrigger = async (action, code) => {
    addLog(`Triggering ${action} for ${code}`);
    if (['clicked', 'liked', 'chosen'].includes(action)) {
      await incrementAction(code, action);
      addLog(`Success: ${action} incremented`);
    } else if (action === 'reinforce') {
      await reinforceCareer(code, userVector?.normalizedVector || userVector?.riasec);
      addLog(`Success: Dimensions reinforced for ${code}`);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] w-[450px] max-h-[90vh] bg-slate-900 text-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col border border-slate-700 font-mono text-xs">
      <div className="p-3 border-b border-slate-700 flex justify-between items-center bg-slate-950">
        <h3 className="font-bold flex items-center gap-2 text-indigo-400">
          <Activity size={16} /> CléAvenir Debugger
        </h3>
        <button onClick={() => setIsVisible(false)} className="text-slate-400 hover:text-white">
          <X size={16} />
        </button>
      </div>

      <div className="flex border-b border-slate-800 bg-slate-900">
        {['flow', 'vector', 'scores', 'logs'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${activeTab === tab ? 'border-indigo-500 text-white bg-slate-800' : 'border-transparent text-slate-500 hover:bg-slate-800'}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
        {activeTab === 'flow' && (
          <div className="space-y-4">
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <h4 className="text-white font-bold mb-2">Test Progress</h4>
              {currentStep !== undefined ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-900 rounded-full h-2">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
                  </div>
                  <span>{currentStep}/{totalSteps}</span>
                </div>
              ) : (
                <span className="text-yellow-400">Test not active / completed</span>
              )}
            </div>

            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <h4 className="text-white font-bold mb-2">State Check</h4>
              <ul className="space-y-1">
                <li className="flex justify-between">User Vector Generated: {userVector ? <CheckCircle2 size={14} className="text-green-400"/> : '❌'}</li>
                <li className="flex justify-between">Careers Scored: {topCareers?.length > 0 ? <CheckCircle2 size={14} className="text-green-400"/> : '❌'}</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'vector' && (
          <div className="space-y-4">
            {userVector ? (
              <>
                <div>
                  <h4 className="text-indigo-300 font-bold mb-1">RIASEC Profile</h4>
                  <pre className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px]">
                    {JSON.stringify(userVector.riasec, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-indigo-300 font-bold mb-1">Normalized Vector (L2: {userVector.metadata?.magnitude?.toFixed(2)})</h4>
                  <pre className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] max-h-40 overflow-auto">
                    {JSON.stringify(userVector.normalizedVector, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <p className="text-slate-500">No vector data available yet.</p>
            )}
          </div>
        )}

        {activeTab === 'scores' && (
          <div className="space-y-4">
            {topCareers?.length > 0 ? (
              topCareers.slice(0, 5).map((c, i) => (
                <div key={c.code} className="bg-slate-800 p-2 rounded border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white truncate max-w-[200px]" title={c.libelle}>{i+1}. {c.libelle}</span>
                    <span className="text-indigo-400">{c.final_score?.toFixed(3)}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 grid grid-cols-2 gap-1 mb-2">
                    <span>Raw: {c.raw_score?.toFixed(3)}</span>
                    <span>Z: {c.zScore?.toFixed(3)}</span>
                    <span>Boost: {c.boostApplied?.toFixed(3)}</span>
                    <span>{c.riasecMajeur}{c.riasecMineur}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-6 text-[10px] bg-slate-900 border-slate-700" onClick={() => handleTestTrigger('clicked', c.code)}>Sim Click</Button>
                    <Button size="sm" variant="outline" className="h-6 text-[10px] bg-slate-900 border-slate-700" onClick={() => handleTestTrigger('liked', c.code)}>Sim Like</Button>
                    <Button size="sm" variant="outline" className="h-6 text-[10px] bg-slate-900 border-slate-700" onClick={() => handleTestTrigger('chosen', c.code)}>Sim Choose</Button>
                  </div>
                </div>
              ))
            ) : (
               <p className="text-slate-500">No careers scored yet.</p>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-1">
            {logs.map((log, i) => (
              <div key={i} className="text-[10px] border-b border-slate-800 pb-1">{log}</div>
            ))}
            {logs.length === 0 && <span className="text-slate-500">No logs yet.</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestFlowDebugger;