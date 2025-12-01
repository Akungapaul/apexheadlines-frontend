interface ShareOptions {
  title: string;
  text?: string;
  url: string;
}

/**
 * Share content using Web Share API or fallback to social media
 */
export const shareContent = async (options: ShareOptions): Promise<boolean> => {
  const { title, text, url } = options;

  // Try Web Share API first (mobile)
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return false; // User cancelled
      }
    }
  }

  return false;
};

/**
 * Generate social media share URLs
 */
export const getSocialShareUrl = (
  platform: 'twitter' | 'facebook' | 'linkedin' | 'reddit' | 'whatsapp',
  options: ShareOptions
): string => {
  const { title, text, url } = options;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text || title);

  const urls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
  };

  return urls[platform];
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
};
