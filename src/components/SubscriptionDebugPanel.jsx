import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Eye, EyeOff, Terminal } from 'lucide-react';
import { getDisplayPlanName } from '@/lib/subscriptionUtils';

const SubscriptionDebugPanel = () => {
  const { user, userProfile, subscriptionTier, subscriptionPlan, refreshSubscription } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    await refreshSubscription();
    setTimeout(() => setLoading(false), 500);
  };

  if (!user) return null;

  if (!isVisible) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 opacity-50 hover:opacity-100 bg-slate-800 text-white rounded-full p-2 h-10 w-10 shadow-lg"
        title="Debug Subscriptions"
      >
        <Terminal className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px] overflow-auto shadow-2xl border-slate-300 bg-slate-50">
      <CardHeader className="py-3 px-4 bg-slate-900 text-white flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
           <Terminal className="h-4 w-4 text-green-400" />
           Debug: Subscription
        </CardTitle>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-slate-700 text-white" 
            onClick={handleRefresh}
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:bg-slate-700 text-white" 
            onClick={() => setIsVisible(false)}
          >
            <EyeOff className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 text-xs font-mono space-y-4">
        
        {/* Auth Context State */}
        <div className="space-y-1">
          <div className="font-bold text-slate-700 border-b pb-1">Context State</div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-slate-500">Tier (Raw):</span>
            <span className="font-bold text-blue-600">{subscriptionTier}</span>
            
            <span className="text-slate-500">Display Name:</span>
            <span className="font-bold text-green-600">{getDisplayPlanName(subscriptionTier)}</span>
            
            <span className="text-slate-500">Plan Status:</span>
            <span>{subscriptionPlan?.status || 'N/A'}</span>
          </div>
        </div>

        {/* User Metadata */}
        <div className="space-y-1">
          <div className="font-bold text-slate-700 border-b pb-1">User Metadata</div>
          <div className="break-all text-slate-600">
             {JSON.stringify(user?.user_metadata || {}, null, 2)}
          </div>
        </div>

        {/* Profile Data */}
        <div className="space-y-1">
          <div className="font-bold text-slate-700 border-b pb-1">Profile Table</div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-slate-500">Role:</span>
            <span>{userProfile?.role}</span>
            <span className="text-slate-500">Sub Tier (Profile):</span>
            <span>{userProfile?.subscription_tier || 'null'}</span>
          </div>
        </div>

        {/* Subscription Table Data */}
        <div className="space-y-1">
          <div className="font-bold text-slate-700 border-b pb-1">User Subscriptions Table</div>
          {subscriptionPlan ? (
             <pre className="bg-slate-200 p-2 rounded overflow-x-auto text-[10px]">
               {JSON.stringify(subscriptionPlan, null, 2)}
             </pre>
          ) : (
             <div className="text-amber-600 italic">No active subscription record found via context</div>
          )}
        </div>

        <div className="pt-2 border-t text-[10px] text-center text-slate-400">
           ID: {user?.id}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionDebugPanel;