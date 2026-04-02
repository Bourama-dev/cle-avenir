import { useToast } from '@/components/ui/use-toast';

export function useSafeToast() {
  try {
    const toastContext = useToast();
    if (!toastContext) {
      throw new Error('useToast returned null or undefined');
    }
    return toastContext;
  } catch (error) {
    console.warn('useToast was called outside of a ToastProvider context or encountered an error. Using safe fallback.', error);
    return {
      toast: () => {},
      dismiss: () => {},
      toasts: [],
    };
  }
}