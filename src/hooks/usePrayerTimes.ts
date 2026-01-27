import { useState, useEffect } from 'react';

interface PrayerTime {
  name: string;
  nameKey: string;
  adhan: string;
  iqamah: string;
}

interface ProhibitedTime {
  name: string;
  start: string;
  end: string;
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
  prohibitedTimes: ProhibitedTime[];
  naflPrayerTimes: {
    ishraq: { start: string; end: string };
    chasht: { start: string; end: string };
    awwabin: { start: string; end: string };
    tahajjud: { start: string; end: string };
  };
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

// Fixed Iqamah times for Baitul Aman Masjid
const BAITUL_AMAN_IQAMAH: Record<string, string> = {
  Fajr: '05:55',
  Dhuhr: '13:30',
  Asr: '16:30',
  Maghrib: '17:46',
  Isha: '19:30',
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
    prohibitedTimes: [],
    naflPrayerTimes: {
      ishraq: { start: '', end: '' },
      chasht: { start: '', end: '' },
      awwabin: { start: '', end: '' },
      tahajjud: { start: '', end: '' },
    },
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

        // Use Baitul Aman Masjid Iqamah times
        const prayers: PrayerTime[] = [
          { name: 'ফজর', nameKey: 'prayer.fajr', adhan: timings.Fajr, iqamah: BAITUL_AMAN_IQAMAH.Fajr },
          { name: 'যোহর', nameKey: 'prayer.dhuhr', adhan: timings.Dhuhr, iqamah: BAITUL_AMAN_IQAMAH.Dhuhr },
          { name: 'আসর', nameKey: 'prayer.asr', adhan: timings.Asr, iqamah: BAITUL_AMAN_IQAMAH.Asr },
          { name: 'মাগরিব', nameKey: 'prayer.maghrib', adhan: timings.Maghrib, iqamah: BAITUL_AMAN_IQAMAH.Maghrib },
          { name: 'ইশা', nameKey: 'prayer.isha', adhan: timings.Isha, iqamah: BAITUL_AMAN_IQAMAH.Isha },
        ];

        // Sehri time is Fajr adhan time (end of Sehri)
        const sehriTime = timings.Fajr;
        // Iftar time is Maghrib adhan time
        const iftarTime = timings.Maghrib;

        // Calculate prohibited times
        const sunriseTime = timings.Sunrise;
        const zawalTime = subtractMinutes(timings.Dhuhr, 10); // Approximately 10 min before Dhuhr
        const sunsetTime = timings.Sunset;
        
        const prohibitedTimes: ProhibitedTime[] = [
          { 
            name: 'সূর্যোদয়ের সময়', 
            start: sunriseTime, 
            end: addMinutes(sunriseTime, 20) 
          },
          { 
            name: 'যাওয়ালের সময়', 
            start: subtractMinutes(zawalTime, 5), 
            end: timings.Dhuhr 
          },
          { 
            name: 'সূর্যাস্তের সময়', 
            start: subtractMinutes(sunsetTime, 20), 
            end: sunsetTime 
          },
        ];

        // Calculate Nafl prayer times
        const naflPrayerTimes = {
          ishraq: { 
            start: addMinutes(sunriseTime, 20), 
            end: addMinutes(sunriseTime, 60) 
          },
          chasht: { 
            start: addMinutes(sunriseTime, 90), 
            end: subtractMinutes(zawalTime, 15) 
          },
          awwabin: { 
            start: addMinutes(timings.Maghrib, 15), 
            end: addMinutes(timings.Maghrib, 60) 
          },
          tahajjud: { 
            start: '03:00', 
            end: subtractMinutes(timings.Fajr, 10) 
          },
        };

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
          prohibitedTimes,
          naflPrayerTimes,
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

function subtractMinutes(timeStr: string, mins: number): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes - mins;
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}
