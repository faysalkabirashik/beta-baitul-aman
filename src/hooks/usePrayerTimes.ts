import { useState, useEffect } from 'react';

interface PrayerTime {
  name: string;
  nameKey: string;
  adhan: string;
  iqamah: string;
}

interface PrayerTimesData {
  date: string;
  hijriDate: string;
  prayers: PrayerTime[];
  nextPrayer: {
    name: string;
    nameKey: string;
    time: string;
    remaining: string;
  } | null;
  currentPrayer: {
    name: string;
    nameKey: string;
  } | null;
  sehriTime: string;
  iftarTime: string;
  loading: boolean;
  error: string | null;
}

// Aladhan API calculation methods
export const CALCULATION_METHODS = {
  1: 'University of Islamic Sciences, Karachi',
  2: 'Islamic Society of North America (ISNA)',
  3: 'Muslim World League',
  4: 'Umm Al-Qura University, Makkah',
  5: 'Egyptian General Authority of Survey',
  7: 'Institute of Geophysics, University of Tehran',
  8: 'Gulf Region',
  9: 'Kuwait',
  10: 'Qatar',
  11: 'Majlis Ugama Islam Singapura, Singapore',
  12: 'Union Organization Islamic de France',
  13: 'Diyanet İşleri Başkanlığı, Turkey',
  14: 'Spiritual Administration of Muslims of Russia',
  15: 'Moonsighting Committee Worldwide',
  16: 'Dubai (unofficial)',
};

export function usePrayerTimes(
  latitude: number = 23.7442, // Dhaka default
  longitude: number = 90.3788,
  method: number = 1 // Karachi method
): PrayerTimesData {
  const [data, setData] = useState<PrayerTimesData>({
    date: '',
    hijriDate: '',
    prayers: [],
    nextPrayer: null,
    currentPrayer: null,
    sehriTime: '',
    iftarTime: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const today = new Date();
        const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${method}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch prayer times');
        
        const json = await response.json();
        const timings = json.data.timings;
        const hijri = json.data.date.hijri;

        // Fixed Iqamah times for Baitul Aman Masjid
        const iqamahTimes: Record<string, string> = {
          Fajr: '06:10',
          Dhuhr: '13:30',
          Asr: '16:30',
          Maghrib: '17:43',
          Isha: '19:45',
        };

        const prayers: PrayerTime[] = [
          { name: 'ফজর', nameKey: 'prayer.fajr', adhan: timings.Fajr, iqamah: iqamahTimes.Fajr },
          { name: 'সূর্যোদয়', nameKey: 'prayer.sunrise', adhan: timings.Sunrise, iqamah: '-' },
          { name: 'যোহর', nameKey: 'prayer.dhuhr', adhan: timings.Dhuhr, iqamah: iqamahTimes.Dhuhr },
          { name: 'আসর', nameKey: 'prayer.asr', adhan: timings.Asr, iqamah: iqamahTimes.Asr },
          { name: 'মাগরিব', nameKey: 'prayer.maghrib', adhan: timings.Maghrib, iqamah: iqamahTimes.Maghrib },
          { name: 'ইশা', nameKey: 'prayer.isha', adhan: timings.Isha, iqamah: iqamahTimes.Isha },
        ];

        // Sehri time is Fajr adhan time (end of Sehri)
        const sehriTime = timings.Fajr;
        // Iftar time is Maghrib adhan time
        const iftarTime = timings.Maghrib;

        // Calculate next prayer and current prayer
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        
        let nextPrayer = null;
        let currentPrayer = null;
        let previousPrayer = null;
        
        for (let i = 0; i < prayers.length; i++) {
          const prayer = prayers[i];
          if (prayer.adhan === '-') continue;
          
          const [hours, minutes] = prayer.adhan.split(':').map(Number);
          const prayerMinutes = hours * 60 + minutes;
          
          if (prayerMinutes > currentMinutes) {
            const diffMinutes = prayerMinutes - currentMinutes;
            const hoursRemaining = Math.floor(diffMinutes / 60);
            const minsRemaining = diffMinutes % 60;
            
            nextPrayer = {
              name: prayer.name,
              nameKey: prayer.nameKey,
              time: prayer.adhan,
              remaining: hoursRemaining > 0 
                ? `${hoursRemaining}ঘ ${minsRemaining}মি`
                : `${minsRemaining}মি`,
            };
            
            // Current waqt is the previous prayer
            if (previousPrayer) {
              currentPrayer = {
                name: previousPrayer.name,
                nameKey: previousPrayer.nameKey,
              };
            }
            break;
          }
          previousPrayer = prayer;
        }

        // If no next prayer found, we're after Isha (current is Isha)
        if (!nextPrayer && previousPrayer) {
          currentPrayer = {
            name: previousPrayer.name,
            nameKey: previousPrayer.nameKey,
          };
        }

        setData({
          date: json.data.date.gregorian.date,
          hijriDate: `${hijri.day} ${hijri.month.en} ${hijri.year}`,
          prayers,
          nextPrayer,
          currentPrayer,
          sehriTime,
          iftarTime,
          loading: false,
          error: null,
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'নামাযের সময় লোড করতে সমস্যা হয়েছে',
        }));
      }
    };

    fetchPrayerTimes();
    
    // Refresh every minute
    const interval = setInterval(fetchPrayerTimes, 60000);
    return () => clearInterval(interval);
  }, [latitude, longitude, method]);

  return data;
}

function addMinutes(timeStr: string, mins: number): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + mins;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}
