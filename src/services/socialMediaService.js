export const socialMediaService = {
  shareToInstagram: (content, imageUrl) => {
    // Instagram doesn't have a direct share URL with content via web intents that reliably works for all users.
    // Standard approach: open Instagram profile or suggest copy-pasting.
    window.open('https://www.instagram.com/cleavenir', '_blank');
  },

  shareToX: (content, currentUrl) => {
    const text = encodeURIComponent(content);
    const url = encodeURIComponent(currentUrl || window.location.href);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  },

  shareToLinkedIn: (content, currentUrl) => {
    const url = encodeURIComponent(currentUrl || window.location.href);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(shareUrl, '_blank', 'width=600,height=600');
  },

  shareToFacebook: (currentUrl) => {
    const url = encodeURIComponent(currentUrl || window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  },

  shareContent: (platform, content, imageUrl = null) => {
    const currentUrl = window.location.href;
    
    switch (platform.toLowerCase()) {
      case 'instagram':
        return socialMediaService.shareToInstagram(content, imageUrl);
      case 'x':
      case 'twitter':
        return socialMediaService.shareToX(content, currentUrl);
      case 'linkedin':
        return socialMediaService.shareToLinkedIn(content, currentUrl);
      case 'facebook':
        return socialMediaService.shareToFacebook(currentUrl);
      default:
        console.warn(`[socialMediaService] Unsupported platform: ${platform}`);
    }
  }
};