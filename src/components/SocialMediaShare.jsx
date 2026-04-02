import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Facebook, Twitter, Instagram, Linkedin, Link as LinkIcon } from 'lucide-react';
import { socialMediaService } from '@/services/socialMediaService';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SocialMediaShare = ({ content = "Découvrez mon parcours avec CléAvenir !", url = window.location.href }) => {
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Lien copié !",
      description: "Le lien a été copié dans votre presse-papiers.",
    });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-slate-500 mr-2">Partager :</span>
      <TooltipProvider>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full w-9 h-9 border-slate-200 hover:bg-slate-100 hover:text-[#1877F2] transition-colors"
              onClick={() => socialMediaService.shareContent('facebook', content)}
            >
              <Facebook className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Partager sur Facebook</p></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full w-9 h-9 border-slate-200 hover:bg-slate-100 hover:text-[#000000] transition-colors"
              onClick={() => socialMediaService.shareContent('x', content)}
            >
              <Twitter className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Partager sur X (Twitter)</p></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full w-9 h-9 border-slate-200 hover:bg-slate-100 hover:text-[#0A66C2] transition-colors"
              onClick={() => socialMediaService.shareContent('linkedin', content)}
            >
              <Linkedin className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Partager sur LinkedIn</p></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full w-9 h-9 border-slate-200 hover:bg-slate-100 hover:text-[#E1306C] transition-colors"
              onClick={() => socialMediaService.shareContent('instagram', content)}
            >
              <Instagram className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Notre page Instagram</p></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full w-9 h-9 border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              onClick={handleCopyLink}
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Copier le lien</p></TooltipContent>
        </Tooltip>

      </TooltipProvider>
    </div>
  );
};

export default SocialMediaShare;