import React, { useState, useEffect } from 'react';

export default function MaintenanceCountdown() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const targetDate = new Date('2026-03-13T10:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft('Maintenance terminée !');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days} jours ${hours} heures ${minutes} minutes ${seconds} secondes`);
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="font-mono text-lg md:text-xl font-bold p-4 rounded-lg shadow-sm border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--color-primary)] animate-pulse-subtle">
      {timeLeft}
    </div>
  );
}