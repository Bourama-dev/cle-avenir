import React, { useState, useEffect } from 'react';
import { verifyProfessionsTable } from '@/scripts/verifyProfessions';
import { testCareerMatching, quickMatchTest } from '@/scripts/testMatching';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, PlayCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProfessionsVerification = () => {
  const [verificationResult, setVerificationResult] = useState(null);
  const [matchingResult, setMatchingResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const runVerification = async () => {
    setLoading(true);
    try {
      const result = await verifyProfessionsTable();
      setVerificationResult(result);
      
      if (result.success) {
        toast({
          title: "✅ Verification Complete",
          description: `Found ${result.count} professions in database`
        });
      } else {
        toast({
          title: "❌ Verification Failed",
          description: result.error?.message || 'Unknown error',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const runMatchingTest = async () => {
    setLoading(true);
    try {
      const result = await testCareerMatching();
      setMatchingResult(result);
      
      if (result.success) {
        toast({
          title: "✅ Matching Test Complete",
          description: `Tested ${result.profilesTested} user profiles`
        });
      } else {
        toast({
          title: "❌ Test Failed",
          description: result.error?.message || 'Unknown error',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const runQuickTest = async () => {
    setLoading(true);
    try {
      const result = await quickMatchTest();
      
      if (result.success) {
        toast({
          title: "✅ Quick Test Passed",
          description: `Profile: ${result.profileType}, Top Match: ${result.topMatch?.libelle || 'N/A'}`
        });
      } else {
        toast({
          title: "⚠️ Test Issue",
          description: result.error || 'No matches found',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button 
          onClick={runVerification} 
          disabled={loading}
          className="gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Verify Database
        </Button>
        
        <Button 
          onClick={runMatchingTest} 
          disabled={loading}
          variant="secondary"
          className="gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
          Test Matching
        </Button>

        <Button 
          onClick={runQuickTest} 
          disabled={loading}
          variant="outline"
          className="gap-2"
        >
          Quick Test
        </Button>
      </div>

      {verificationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {verificationResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              Database Verification Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600">Total Professions</div>
                  <div className="text-2xl font-bold">{verificationResult.count}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600">Data Issues</div>
                  <div className="text-2xl font-bold">{verificationResult.issues?.length || 0}</div>
                </div>
              </div>

              {verificationResult.professions && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Professions Found:</h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {verificationResult.professions.map((prof, index) => (
                      <div key={prof.id} className="p-3 bg-white border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{index + 1}. {prof.libelle}</div>
                            <div className="text-sm text-slate-600">Code ROME: {prof.rome_code}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">
                              {prof.salary_min}€ - {prof.salary_max}€
                            </div>
                            <div className="text-xs text-slate-500">{prof.trend}</div>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {prof.tags?.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {matchingResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {matchingResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              Matching Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600">Professions</div>
                  <div className="text-2xl font-bold">{matchingResult.professionCount}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600">Profiles Tested</div>
                  <div className="text-2xl font-bold">{matchingResult.profilesTested}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-slate-600">Status</div>
                  <div className="text-lg font-bold text-green-600">✅ PASSED</div>
                </div>
              </div>

              {matchingResult.results && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Test Profile Results:</h4>
                  <div className="space-y-3">
                    {matchingResult.results.map((result, index) => (
                      <div key={index} className="p-4 bg-white border rounded-lg">
                        <div className="font-semibold mb-2">{result.profile}</div>
                        <div className="text-sm text-slate-600 mb-2">
                          Type: {result.classified.type} | Score: {result.classified.score}%
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Top 3 Matches:</div>
                          {result.topMatches.map((match, idx) => (
                            <div key={idx} className="text-sm pl-4">
                              {idx + 1}. {match.libelle} ({match.rome_code}) - {match.matchScore}%
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfessionsVerification;