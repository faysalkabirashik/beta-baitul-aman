import { useState, useEffect } from 'react';
import { formatBengaliTime, toBengaliNumber, getBengaliDayName, getBengaliMonthName } from '@/contexts/LanguageContext';

interface ClockState {
  time: string;
  date: string;
  dateWithHijri: string;
  fullDate: Date;
  hours: number;
  minutes: number;
  seconds: number;
  hijriDate: string;
}

// Fetch Hijri date from Aladhan API
async function fetchHijriDate(): Promise<string> {
  try {
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const response = await fetch(`https://api.aladhan.com/v1/gpiToH/${dateStr}`);
    const data = await response.json();
    if (data.code === 200 && data.data) {
      const hijri = data.data.hijri;
      return `${hijri.day} ${hijri.month.ar} ${hijri.year}`;
    }
  } catch (error) {
    console.error('Error fetching Hijri date:', error);
  }
  return '';
}

function formatBengaliDateWithDay(date: Date): string {
  const day = getBengaliDayName(date);
  const dateNum = toBengaliNumber(date.getDate());
  const month = getBengaliMonthName(date);
  return `${day}, ${dateNum} ${month}`;
}

export function useFloatingClock() {
  const [clock, setClock] = useState<ClockState>(() => {
    const now = new Date();
    return {
      time: formatBengaliTime(now),
      date: formatBengaliDateWithDay(now),
      dateWithHijri: formatBengaliDateWithDay(now),
      fullDate: now,
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
      hijriDate: '',
    };
  });

  useEffect(() => {
    // Fetch Hijri date on mount
    fetchHijriDate().then((hijri) => {
      if (hijri) {
        setClock(prev => ({
          ...prev,
          hijriDate: hijri,
          dateWithHijri: hijri ? `${hijri} | ${prev.date}` : prev.date,
        }));
      }
    });
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const bengaliDate = formatBengaliDateWithDay(now);
      setClock(prev => ({
        time: formatBengaliTime(now),
        date: bengaliDate,
        dateWithHijri: prev.hijriDate ? `${prev.hijriDate} | ${bengaliDate}` : bengaliDate,
        fullDate: now,
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
        hijriDate: prev.hijriDate,
      }));
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
