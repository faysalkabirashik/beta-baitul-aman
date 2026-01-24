import { useState, useEffect } from 'react';
import { formatBengaliDate, formatBengaliTime, toBengaliNumber } from '@/contexts/LanguageContext';

interface ClockState {
  time: string;
  date: string;
  fullDate: Date;
  hours: number;
  minutes: number;
  seconds: number;
}

export function useFloatingClock() {
  const [clock, setClock] = useState<ClockState>(() => {
    const now = new Date();
    return {
      time: formatBengaliTime(now),
      date: formatBengaliDate(now),
      fullDate: now,
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock({
        time: formatBengaliTime(now),
        date: formatBengaliDate(now),
        fullDate: now,
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return clock;
}

export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollY, isScrolled };
}
