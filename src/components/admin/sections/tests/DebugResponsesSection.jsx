import React, { useState } from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Copy, Check, Terminal } from "lucide-react";

const DebugResponsesSection = ({ data, title = "Données Debug" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!data) return null;

  return (
    <div className="border rounded-lg bg-slate-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Terminal className="h-4 w-4" />
          {title}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs"
          onClick={handleCopy}
        >
          {copied ? (
            <><Check className="mr-2 h-3 w-3 text-green-600" /> Copié</>
          ) : (
            <><Copy className="mr-2 h-3 w-3" /> Copier JSON</>
          )}
        </Button>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <AccordionTrigger className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800">
            Voir le contenu brut
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 pt-0">
              <pre className="text-xs font-mono bg-slate-900 text-green-400 p-4 rounded-md overflow-x-auto max-h-[300px]">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DebugResponsesSection;