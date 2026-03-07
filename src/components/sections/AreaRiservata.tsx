import { useEffect } from 'react';

interface AreaRiservataProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AreaRiservata({ isOpen, onClose }: AreaRiservataProps) {
  useEffect(() => {
    if (isOpen) {
      // Redirect to unified area-clienti entry page
      const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
      window.location.href = base + '/area-clienti/';
    }
  }, [isOpen]);

  return null;
}
