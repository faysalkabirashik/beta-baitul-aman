import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

interface PrayerTimesRow {
  fajr_adhan: string | null;
  fajr_iqamah: string | null;
  sunrise: string | null;
  dhuhr_adhan: string | null;
  dhuhr_iqamah: string | null;
  asr_adhan: string | null;
  asr_iqamah: string | null;
  maghrib_adhan: string | null;
  maghrib_iqamah: string | null;
  isha_adhan: string | null;
  isha_iqamah: string | null;
  jummah_adhan: string | null;
  jummah_iqamah: string | null;
  sehri_time: string | null;
  iftar_time: string | null;
  date: string;
}

function buildPrayersFromData(
  timings: Record<string, string>,
  overrideIqamah?: PrayerTimesRow
): PrayerTime[] {
  const fix = (field: string, alt?: string | null) => field || alt || '-';

  return [
    { name: 'ফজর', nameKey: 'prayer.fajr', adhan: timings.Fajr, iqamah: fix(timings.FajrIqamah, overrideIqamah?.fajr_iqamah) },
    { name: 'সূর্যোদয়', nameKey: 'prayer.sunrise', adhan: timings.Sunrise, iqamah: '-' },
    { name: 'যোহর', nameKey: 'prayer.dhuhr', adhan: timings.Dhuhr, iqamah: fix(timings.DhuhrIqamah, overrideIqamah?.dhuhr_iqamah) },
    { name: 'আসর', nameKey: 'prayer.asr', adhan: timings.Asr, iqamah: fix(timings.AsrIqamah, overrideIqamah?.asr_iqamah) },
    { name: 'মাগরিব', nameKey: 'prayer.maghrib', adhan: timings.Maghrib, iqamah: fix(timings.MaghribIqamah, overrideIqamah?.maghrib_iqamah) },
    { name: 'ইশা', nameKey: 'prayer.isha', adhan: timings.Isha, iqamah: fix(timings.IshaIqamah, overrideIqamah?.isha_iqamah) },
  ];
}

function computeNextCurrent(prayers: PrayerTime[]) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let nextPrayer = null;
  let currentPrayer = null;
  let previousPrayer = null;

  for (const prayer of prayers) {
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

  if (!nextPrayer && previousPrayer) {
    currentPrayer = {
      name: previousPrayer.name,
      nameKey: previousPrayer.nameKey,
    };
  }

  return { nextPrayer, currentPrayer };
}

const DEFAULT_IQAMAH: Record<string, string> = {
  Fajr: '06:10',
  Dhuhr: '13:30',
  Asr: '16:30',
  Maghrib: '17:43',
  Isha: '19:45',
};

async function fetchFromSupabase(): Promise<PrayerTimesRow | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('prayer_times')
      .select('*')
      .eq('date', today)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) return null;
    return data as unknown as PrayerTimesRow;
  } catch {
    return null;
  }
}

async function fetchFromAladhan(
  latitude: number,
  longitude: number,
  method: number
): Promise<{ timings: Record<string, string>; hijriDate: string; gregorianDate: string } | null> {
  try {
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=${method}`
    );

    if (!response.ok) return null;

    const json = await response.json();
    return {
      timings: json.data.timings,
      hijriDate: `${json.data.date.hijri.day} ${json.data.date.hijri.month.en} ${json.data.date.hijri.year}`,
      gregorianDate: json.data.date.gregorian.date,
    };
  } catch {
    return null;
  }
}

export function usePrayerTimes(
  latitude: number = 23.7442,
  longitude: number = 90.3788,
  method: number = 1
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
        const dbRow = await fetchFromSupabase();

        if (dbRow) {
          const timings: Record<string, string> = {
            Fajr: dbRow.fajr_adhan || '',
            FajrIqamah: dbRow.fajr_iqamah || DEFAULT_IQAMAH.Fajr,
            Sunrise: dbRow.sunrise || '',
            Dhuhr: dbRow.dhuhr_adhan || '',
            DhuhrIqamah: dbRow.dhuhr_iqamah || DEFAULT_IQAMAH.Dhuhr,
            Asr: dbRow.asr_adhan || '',
            AsrIqamah: dbRow.asr_iqamah || DEFAULT_IQAMAH.Asr,
            Maghrib: dbRow.maghrib_adhan || '',
            MaghribIqamah: dbRow.maghrib_iqamah || DEFAULT_IQAMAH.Maghrib,
            Isha: dbRow.ish_adhan || dbRow.isha_adhan || '',
            IshaIqamah: dbRow.ish_iqamah || dbRow.isha_iqamah || DEFAULT_IQAMAH.Isha,
          };

          const prayers = buildPrayersFromData(timings);
          const { nextPrayer, currentPrayer } = computeNextCurrent(prayers);

          setData({
            date: dbRow.date || '',
            hijriDate: '',
            prayers,
            nextPrayer,
            currentPrayer,
            sehriTime: dbRow.sehri_time || '',
            iftarTime: dbRow.iftar_time || '',
            loading: false,
            error: null,
          });
          return;
        }

        const aladhan = await fetchFromAladhan(latitude, longitude, method);
        if (!aladhan) throw new Error('Failed to fetch prayer times');

        const timings = aladhan.timings;
        const iqamahTimings: Record<string, string> = {
          ...timings,
          FajrIqamah: DEFAULT_IQAMAH.Fajr,
          DhuhrIqamah: DEFAULT_IQAMAH.Dhuhr,
          AsrIqamah: DEFAULT_IQAMAH.Asr,
          MaghribIqamah: DEFAULT_IQAMAH.Maghrib,
          IshaIqamah: DEFAULT_IQAMAH.Isha,
        };

        const prayers = buildPrayersFromData(iqamahTimings);
        const { nextPrayer, currentPrayer } = computeNextCurrent(prayers);

        setData({
          date: aladhan.gregorianDate,
          hijriDate: aladhan.hijriDate,
          prayers,
          nextPrayer,
          currentPrayer,
          sehriTime: timings.Fajr,
          iftarTime: timings.Maghrib,
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

    const interval = setInterval(fetchPrayerTimes, 60000);
    return () => clearInterval(interval);
  }, [latitude, longitude, method]);

  return data;
}
