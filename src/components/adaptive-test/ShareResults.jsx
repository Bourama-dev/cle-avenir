import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Copy, Twitter, Linkedin, Facebook } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShareResults = ({ primaryProfile }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;
  const shareText = `Je viens de découvrir que mon profil professionnel est "${primaryProfile}" avec CléAvenir ! 🚀 Découvrez le vôtre ici :`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700">
            <Share2 className="w-4 h-4" /> Partager mes résultats
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Partager vos résultats 🎉</DialogTitle>
          <DialogDescription>
            Montrez à votre réseau vos découvertes professionnelles !
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-center gap-4 py-6">
             <Button size="icon" className="rounded-full bg-[#1DA1F2] hover:bg-[#1a91da]" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}>
                <Twitter className="w-5 h-5 text-white" />
             </Button>
             <Button size="icon" className="rounded-full bg-[#0A66C2] hover:bg-[#0958a8]" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}>
                <Linkedin className="w-5 h-5 text-white" />
             </Button>
             <Button size="icon" className="rounded-full bg-[#1877F2] hover:bg-[#166fe5]" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}>
                <Facebook className="w-5 h-5 text-white" />
             </Button>
        </div>

        <div className="flex items-center space-x-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="grid flex-1 gap-2">
            <p className="text-sm text-slate-500 font-medium truncate">
                {shareUrl}
            </p>
          </div>
          <Button size="sm" onClick={copyToClipboard} className={copied ? "bg-green-600 hover:bg-green-700" : ""}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareResults;