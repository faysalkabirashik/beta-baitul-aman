import { useState, useEffect } from 'react';
import { toBengaliNumber, getBengaliDayName, getBengaliMonthName, toBengaliCalendarDate } from '@/contexts/LanguageContext';

interface DateFormats {
  hijriDate: string;
  internationalDate: string;
  bengaliCalendarDate: string;
  dayName: string;
  fullTopBarDate: string;
  fullPrayerDate: string;
  loading: boolean;
}

// Bengali number mapping for Hijri date
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

export function useDateFormats(): DateFormats {
  const [data, setData] = useState<DateFormats>({
    hijriDate: '',
    internationalDate: '',
    bengaliCalendarDate: '',
    dayName: '',
    fullTopBarDate: '',
    fullPrayerDate: '',
    loading: true,
  });

  useEffect(() => {
    const fetchHijriDate = async () => {
      try {
        const today = new Date();
        const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        
        // Use the timings endpoint which includes Hijri data and is more reliable
        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dateStr}?latitude=23.7442&longitude=90.3788&method=1`
        );
        const json = await response.json();
        
        let hijriFormatted = '';
        if (json.code === 200 && json.data?.date?.hijri) {
          const hijri = json.data.date.hijri;
          const day = parseInt(hijri.day, 10);
          const monthEn = hijri.month.en;
          const year = hijri.year;
          
          const bengaliMonth = bengaliHijriMonths[monthEn] || monthEn;
          const bengaliDay = toBengaliOrdinal(day);
          const bengaliYear = toBengaliNumber(parseInt(year, 10));
          
          hijriFormatted = `${bengaliDay} ${bengaliMonth}, ${bengaliYear} হিজরি`;
        }

        // International date (Gregorian in Bengali)
        const intlDate = `${toBengaliNumber(today.getDate())} ${getBengaliMonthName(today)} ${toBengaliNumber(today.getFullYear())}`;
        
        // Bengali calendar date
        const bengaliCal = toBengaliCalendarDate(today);
        const bengaliCalendarFormatted = `${toBengaliNumber(bengaliCal.day)} ${bengaliCal.month}, ${toBengaliNumber(bengaliCal.year)} বঙ্গাব্দ`;
        
        // Day name
        const dayName = getBengaliDayName(today);
        
        // Format for top bar: ৯ই শাবান, ১৪৪৭ হিজরি । সোমবার, ১২ মাঘ, ১৪৩২ বঙ্গাব্দ
        const fullTopBar = hijriFormatted 
          ? `${hijriFormatted} । ${dayName}, ${toBengaliNumber(bengaliCal.day)} ${bengaliCal.month}, ${toBengaliNumber(bengaliCal.year)} বঙ্গাব্দ`
          : `${dayName}, ${toBengaliNumber(bengaliCal.day)} ${bengaliCal.month}, ${toBengaliNumber(bengaliCal.year)} বঙ্গাব্দ`;
        
        // Format for prayer section: ৯ই শাবান, ১৪৪৭ হিজরি । ২৬ জানুয়ারি ২০২৬ । ১২ মাঘ, ১৪৩২ বঙ্গাব্দ
        const fullPrayer = hijriFormatted
          ? `${hijriFormatted} । ${intlDate} । ${toBengaliNumber(bengaliCal.day)} ${bengaliCal.month}, ${toBengaliNumber(bengaliCal.year)} বঙ্গাব্দ`
          : `${intlDate} । ${toBengaliNumber(bengaliCal.day)} ${bengaliCal.month}, ${toBengaliNumber(bengaliCal.year)} বঙ্গাব্দ`;

        setData({
          hijriDate: hijriFormatted,
          internationalDate: intlDate,
          bengaliCalendarDate: bengaliCalendarFormatted,
          dayName,
          fullTopBarDate: fullTopBar,
          fullPrayerDate: fullPrayer,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching date:', error);
        const today = new Date();
        const intlDate = `${toBengaliNumber(today.getDate())} ${getBengaliMonthName(today)} ${toBengaliNumber(today.getFullYear())}`;
        const bengaliCal = toBengaliCalendarDate(today);
        const dayName = getBengaliDayName(today);
        
        setData({
          hijriDate: '',
          internationalDate: intlDate,
          bengaliCalendarDate: `${toBengaliNumber(bengaliCal.day)} ${bengaliCal.month}, ${toBengaliNumber(bengaliCal.year)} বঙ্গাব্দ`,
          dayName,
          fullTopBarDate: `${dayName}, ${toBengaliNumber(bengaliCal.day)} ${bengaliCal.month}, ${toBengaliNumber(bengaliCal.year)} বঙ্গাব্দ`,
          fullPrayerDate: `${intlDate} । ${toBengaliNumber(bengaliCal.day)} ${bengaliCal.month}, ${toBengaliNumber(bengaliCal.year)} বঙ্গাব্দ`,
          loading: false,
        });
      }
    };

    fetchHijriDate();
  }, []);

  return data;
}
