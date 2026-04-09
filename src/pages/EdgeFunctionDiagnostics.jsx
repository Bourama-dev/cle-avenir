import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

const EdgeFunctionDiagnostics = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testFunction = async (functionName, body) => {
    setLoading(prev => ({ ...prev, [functionName]: true }));
    try {
      console.log(`Testing ${functionName} with body:`, body);

      const { data, error } = await supabase.functions.invoke(functionName, { body });

      console.log(`Response from ${functionName}:`, { data, error });

      setResults(prev => ({
        ...prev,
        [functionName]: {
          status: error ? 'error' : 'success',
          error: error ? {
            message: error.message,
            code: error.code,
            status: error.status,
            ...error
          } : null,
          data: data ? JSON.stringify(data, null, 2) : null,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (err) {
      console.error(`Exception testing ${functionName}:`, err);
      setResults(prev => ({
        ...prev,
        [functionName]: {
          status: 'error',
          error: { message: err.message, ...err },
          data: null,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [functionName]: false }));
    }
  };

  const functions = [
    {
      name: 'chat-advisor',
      body: {
        message: 'Hello',
        history: [],
        userId: 'test-user',
        context: { systemInstruction: 'Test' },
        mode: 'career_advisor'
      }
    },
    {
      name: 'get-rome-job-offers',
      body: { code: 'M1607', limit: 2 }
    },
    {
      name: 'get-rome-training-courses',
      body: { code: 'M1607' }
    },
    {
      name: 'get-rome-metier-detail',
      body: { code: 'M1607' }
    },
    {
      name: 'get-jobs',
      body: { limit: 2 }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Edge Function Diagnostics</h1>
          <p className="text-slate-600">Test which edge functions are deployed and working</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {functions.map(fn => (
            <Card key={fn.name} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <code className="bg-slate-100 px-2 py-1 rounded text-sm">{fn.name}</code>
                  <Button
                    size="sm"
                    onClick={() => testFunction(fn.name, fn.body)}
                    disabled={loading[fn.name]}
                    variant="outline"
                  >
                    {loading[fn.name] ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      'Test'
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {results[fn.name] ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {results[fn.name].status === 'success' ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-green-700 font-medium">Success</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <span className="text-red-700 font-medium">Error</span>
                        </>
                      )}
                      <span className="text-xs text-slate-500 ml-auto">{results[fn.name].timestamp}</span>
                    </div>

                    {results[fn.name].error && (
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <p className="text-xs font-mono text-red-700">
                          {results[fn.name].error.message}
                        </p>
                        {results[fn.name].error.status && (
                          <p className="text-xs text-red-600 mt-1">Status: {results[fn.name].error.status}</p>
                        )}
                      </div>
                    )}

                    {results[fn.name].data && (
                      <div className="bg-slate-50 p-3 rounded border border-slate-200 max-h-48 overflow-y-auto">
                        <p className="text-xs font-mono text-slate-700">
                          {results[fn.name].data}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 py-8 text-center">Click "Test" to run</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">How to use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p>1. Click "Test" for each edge function to check if it's deployed</p>
            <p>2. Check browser DevTools Console (F12) for detailed logs</p>
            <p>3. Look for error messages that indicate what's wrong (404, 429, network errors, etc.)</p>
            <p>4. If all functions return errors, check Supabase project for deployment status</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EdgeFunctionDiagnostics;
