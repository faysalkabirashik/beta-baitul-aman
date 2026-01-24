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

// Bengali number mapping for Hijri date - handle multiple API formats
const bengaliHijriMonths: Record<string, string> = {
  'Muḥarram': 'মুহাররম',
  'Muharram': 'মুহাররম',
  'Ṣafar': 'সফর',
  'Safar': 'সফর',
  'Rabīʿ al-Awwal': 'রবিউল আওয়াল',
  "Rabi' al-Awwal": 'রবিউল আওয়াল',
  'Rabīʿ al-Thānī': 'রবিউস সানি',
  "Rabi' al-Thani": 'রবিউস সানি',
  'Jumādá al-Ūlá': 'জমাদিউল আওয়াল',
  'Jumada al-Awwal': 'জমাদিউল আওয়াল',
  'Jumādá al-Ākhirah': 'জমাদিউস সানি',
  'Jumada al-Thani': 'জমাদিউস সানি',
  'Rajab': 'রজব',
  'Shaʿbān': 'শাবান',
  "Sha'ban": 'শাবান',
  'Shaban': 'শাবান',
  'Ramaḍān': 'রমজান',
  'Ramadan': 'রমজান',
  'Shawwāl': 'শাওয়াল',
  'Shawwal': 'শাওয়াল',
  'Dhū al-Qaʿdah': 'জিলক্বদ',
  "Dhu al-Qi'dah": 'জিলক্বদ',
  'Dhū al-Ḥijjah': 'জিলহজ্জ',
  'Dhu al-Hijjah': 'জিলহজ্জ',
};

// Convert number to Bengali ordinal
function toBengaliOrdinal(num: number): string {
  const bengaliNum = toBengaliNumber(num);
  // Add ordinal suffix based on number
  if (num === 1) return '১লা';
  if (num === 2) return '২রা';
  if (num === 3) return '৩রা';
  if (num === 4) return '৪ঠা';
  if (num >= 5 && num <= 18) return bengaliNum + 'ই';
  if (num === 19) return '১৯শে';
  if (num === 20) return '২০শে';
  if (num >= 21 && num <= 31) return bengaliNum + 'শে';
  return bengaliNum;
}

// Fetch Hijri date from Aladhan API
async function fetchHijriDate(): Promise<{ formatted: string; raw: string }> {
  try {
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const response = await fetch(`https://api.aladhan.com/v1/gpiToH/${dateStr}`);
    const data = await response.json();
    if (data.code === 200 && data.data) {
      const hijri = data.data.hijri;
      const day = parseInt(hijri.day, 10);
      const monthEn = hijri.month.en;
      const year = hijri.year;
      
      // Format in Bengali: ৫ই শাবান, ১৪৪৭ হিজরি
      const bengaliMonth = bengaliHijriMonths[monthEn] || monthEn;
      const bengaliDay = toBengaliOrdinal(day);
      const bengaliYear = toBengaliNumber(parseInt(year, 10));
      
      return {
        formatted: `${bengaliDay} ${bengaliMonth}, ${bengaliYear} হিজরি`,
        raw: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
      };
    }
  } catch (error) {
    console.error('Error fetching Hijri date:', error);
  }
  return { formatted: '', raw: '' };
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
      if (hijri.formatted) {
        setClock(prev => ({
          ...prev,
          hijriDate: hijri.formatted,
          // Format: Hijri | International date
          dateWithHijri: `${hijri.formatted} । ${prev.date}`,
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
        // Format: Hijri | International date
        dateWithHijri: prev.hijriDate ? `${prev.hijriDate} । ${bengaliDate}` : bengaliDate,
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
