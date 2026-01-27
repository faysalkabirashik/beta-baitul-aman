import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'bn' | 'en';

interface Translations {
  [key: string]: {
    bn: string;
    en: string;
  };
}

// Complete translations for the platform
export const translations: Translations = {
  // Navigation
  'nav.home': { bn: 'হোম', en: 'Home' },
  'nav.prayerTimes': { bn: 'নামাযের সময়', en: 'Prayer Times' },
  'nav.notices': { bn: 'নোটিশ', en: 'Notices' },
  'nav.services': { bn: 'সেবাসমূহ', en: 'Services' },
  'nav.about': { bn: 'আমাদের সম্পর্কে', en: 'About Us' },
  'nav.learnQuran': { bn: 'কুরআন শিক্ষা', en: 'Learn Quran' },
  'nav.join': { bn: 'যুক্ত হোন', en: 'Join Us' },
  'nav.login': { bn: 'লগইন', en: 'Login' },
  'nav.signup': { bn: 'নিবন্ধন', en: 'Sign Up' },
  'nav.logout': { bn: 'লগআউট', en: 'Logout' },

  // Hero Section
  'hero.title': { bn: 'বাইতুল আমান মসজিদ', en: 'Baitul Aman Masjid' },
  'hero.subtitle': { bn: 'শান্তির ঘর - ঢাকার প্রাণকেন্দ্রে ইসলামের আলো', en: 'House of Peace - Light of Islam in the Heart of Dhaka' },
  'hero.cta': { bn: 'বিশেষ কোরআন প্রশিক্ষন ২০২৬', en: 'Special Quran Training 2026' },
  'hero.donate': { bn: 'দান করুন', en: 'Donate' },

  // Info Carousel
  'carousel.ayahTitle': { bn: 'আজকের আয়াত', en: "Today's Verse" },
  'carousel.khutbahTitle': { bn: 'খুতবার বিষয়', en: 'Khutbah Topic' },
  'carousel.hadithTitle': { bn: 'আজকের হাদিস', en: "Today's Hadith" },

  // Prayer Times
  'prayer.title': { bn: 'নামাযের সময়সূচী', en: 'Prayer Schedule' },
  'prayer.fajr': { bn: 'ফজর', en: 'Fajr' },
  'prayer.sunrise': { bn: 'সূর্যোদয়', en: 'Sunrise' },
  'prayer.dhuhr': { bn: 'যোহর', en: 'Dhuhr' },
  'prayer.asr': { bn: 'আসর', en: 'Asr' },
  'prayer.maghrib': { bn: 'মাগরিব', en: 'Maghrib' },
  'prayer.isha': { bn: 'ইশা', en: 'Isha' },
  'prayer.jummah': { bn: 'জুমা', en: 'Jummah' },
  'prayer.adhan': { bn: 'আযান', en: 'Adhan' },
  'prayer.iqamah': { bn: 'ইকামত', en: 'Iqamah' },
  'prayer.nextPrayer': { bn: 'পরবর্তী নামাজ', en: 'Next Prayer' },
  'prayer.timeRemaining': { bn: 'বাকি সময়', en: 'Time Remaining' },

  // Notice Board
  'notice.title': { bn: 'বিজ্ঞপ্তি বোর্ড', en: 'Notice Board' },
  'notice.pinnedEvent': { bn: 'মাসব্যাপী বিশেষ কুরআন শিক্ষা', en: 'Month-long Special Quran Education' },
  'notice.viewAll': { bn: 'সব দেখুন', en: 'View All' },

  // Footer
  'footer.mosqueName': { bn: 'বাইতুল আমান মসজিদ', en: 'Baitul Aman Masjid' },
  'footer.address': { bn: 'ধানমন্ডি, রোড ৭, ঢাকা', en: 'Dhanmondi, Road 7, Dhaka' },
  'footer.officeHours': { bn: 'অফিস সময়', en: 'Office Hours' },
  'footer.officeTime': { bn: 'সকাল ১০টা - দুপুর ১২টা এবং বিকাল ৪টা - সন্ধ্যা ৬টা', en: '10 AM - 12 PM and 4 PM - 6 PM' },
  'footer.mobile': { bn: 'মোবাইল', en: 'Mobile' },
  'footer.downloadApp': { bn: 'অ্যাপ ডাউনলোড করুন', en: 'Download App' },
  'footer.followUs': { bn: 'আমাদের অনুসরণ করুন', en: 'Follow Us' },
  'footer.quickLinks': { bn: 'দ্রুত লিংক', en: 'Quick Links' },
  'footer.rights': { bn: 'সর্বস্বত্ব সংরক্ষিত', en: 'All Rights Reserved' },

  // LMS
  'lms.title': { bn: 'বিশেষ কোরআন প্রশিক্ষন ২০২৬', en: 'Special Quran Training 2026' },
  'lms.instructor': { bn: 'প্রশিক্ষক: হযরত মাওলানা কেফায়াতুল্লাহ', en: 'Instructor: Hazrat Mawlana Kefayatullah' },
  'lms.details': { bn: 'বিস্তারিত', en: 'Details' },
  'lms.lecture': { bn: 'লেকচার', en: 'Lecture' },
  'lms.previous': { bn: 'পূর্ববর্তী', en: 'Previous' },
  'lms.next': { bn: 'পরবর্তী', en: 'Next' },
  'lms.quiz': { bn: 'কুইজ', en: 'Quiz' },
  'lms.submit': { bn: 'জমা দিন', en: 'Submit' },
  'lms.skip': { bn: 'এড়িয়ে যান', en: 'Skip' },
  'lms.joinUs': { bn: 'আমাদের সাথে যুক্ত হোন', en: 'Join Us' },
  'lms.books': { bn: 'প্রয়োজনীয় বইসমূহ', en: 'Required Books' },
  'lms.order': { bn: 'অর্ডার করুন', en: 'Order Now' },
  'lms.progress': { bn: 'আপনার অগ্রগতি', en: 'Your Progress' },

  // Order Form
  'order.title': { bn: 'অর্ডার ফর্ম', en: 'Order Form' },
  'order.name': { bn: 'নাম', en: 'Name' },
  'order.phone': { bn: 'ফোন নম্বর', en: 'Phone Number' },
  'order.address': { bn: 'ঠিকানা', en: 'Address' },
  'order.paymentMethod': { bn: 'পেমেন্ট পদ্ধতি', en: 'Payment Method' },
  'order.buyNow': { bn: 'এখনই কিনুন', en: 'Buy Now' },
  'order.preBook': { bn: 'প্রি-বুকিং', en: 'Pre-book' },
  'order.cod': { bn: 'ক্যাশ অন ডেলিভারি', en: 'Cash on Delivery' },
  'order.bkash': { bn: 'বিকাশ', en: 'Bkash' },
  'order.nagad': { bn: 'নগদ', en: 'Nagad' },
  'order.bank': { bn: 'ব্যাংক ট্রান্সফার', en: 'Bank Transfer' },
  'order.placeOrder': { bn: 'অর্ডার সম্পন্ন করুন', en: 'Place Order' },
  'order.success': { bn: 'অর্ডার সফল হয়েছে!', en: 'Order Successful!' },

  // Ramadan Calendar
  'ramadan.title': { bn: 'রমজান ক্যালেন্ডার ২০২৬', en: 'Ramadan Calendar 2026' },
  'ramadan.download': { bn: 'রমজান ক্যালেন্ডার ২০২৬ ডাউনলোড করুন', en: 'Download Ramadan Calendar 2026' },
  'ramadan.selectCity': { bn: 'শহর নির্বাচন করুন', en: 'Select City' },
  'ramadan.pickFromMap': { bn: 'ম্যাপ থেকে বাছাই করুন', en: 'Pick from Map' },
  'ramadan.language': { bn: 'ভাষা', en: 'Language' },
  'ramadan.timeFormat': { bn: 'সময় ফরম্যাট', en: 'Time Format' },
  'ramadan.method': { bn: 'হিসাব পদ্ধতি', en: 'Calculation Method' },
  'ramadan.orientation': { bn: 'অরিয়েন্টেশন', en: 'Orientation' },
  'ramadan.portrait': { bn: 'পোর্ট্রেট', en: 'Portrait' },
  'ramadan.landscape': { bn: 'ল্যান্ডস্কেপ', en: 'Landscape' },
  'ramadan.generate': { bn: 'ক্যালেন্ডার তৈরি করুন', en: 'Generate Calendar' },
  'ramadan.sehri': { bn: 'সেহরি', en: 'Sehri' },
  'ramadan.iftar': { bn: 'ইফতার', en: 'Iftar' },

  // Auth
  'auth.email': { bn: 'ইমেইল', en: 'Email' },
  'auth.password': { bn: 'পাসওয়ার্ড', en: 'Password' },
  'auth.confirmPassword': { bn: 'পাসওয়ার্ড নিশ্চিত করুন', en: 'Confirm Password' },
  'auth.forgotPassword': { bn: 'পাসওয়ার্ড ভুলে গেছেন?', en: 'Forgot Password?' },
  'auth.noAccount': { bn: 'অ্যাকাউন্ট নেই?', en: "Don't have an account?" },
  'auth.hasAccount': { bn: 'ইতিমধ্যে অ্যাকাউন্ট আছে?', en: 'Already have an account?' },

  // Common
  'common.loading': { bn: 'লোড হচ্ছে...', en: 'Loading...' },
  'common.error': { bn: 'ত্রুটি হয়েছে', en: 'An error occurred' },
  'common.success': { bn: 'সফল!', en: 'Success!' },
  'common.cancel': { bn: 'বাতিল', en: 'Cancel' },
  'common.confirm': { bn: 'নিশ্চিত করুন', en: 'Confirm' },
  'common.save': { bn: 'সংরক্ষণ করুন', en: 'Save' },
  'common.close': { bn: 'বন্ধ করুন', en: 'Close' },

  // Days of week
  'day.saturday': { bn: 'শনিবার', en: 'Saturday' },
  'day.sunday': { bn: 'রবিবার', en: 'Sunday' },
  'day.monday': { bn: 'সোমবার', en: 'Monday' },
  'day.tuesday': { bn: 'মঙ্গলবার', en: 'Tuesday' },
  'day.wednesday': { bn: 'বুধবার', en: 'Wednesday' },
  'day.thursday': { bn: 'বৃহস্পতিবার', en: 'Thursday' },
  'day.friday': { bn: 'শুক্রবার', en: 'Friday' },

  // Months
  'month.january': { bn: 'জানুয়ারি', en: 'January' },
  'month.february': { bn: 'ফেব্রুয়ারি', en: 'February' },
  'month.march': { bn: 'মার্চ', en: 'March' },
  'month.april': { bn: 'এপ্রিল', en: 'April' },
  'month.may': { bn: 'মে', en: 'May' },
  'month.june': { bn: 'জুন', en: 'June' },
  'month.july': { bn: 'জুলাই', en: 'July' },
  'month.august': { bn: 'আগস্ট', en: 'August' },
  'month.september': { bn: 'সেপ্টেম্বর', en: 'September' },
  'month.october': { bn: 'অক্টোবর', en: 'October' },
  'month.november': { bn: 'নভেম্বর', en: 'November' },
  'month.december': { bn: 'ডিসেম্বর', en: 'December' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('baitul-aman-lang');
      return (saved as Language) || 'bn';
    }
    return 'bn';
  });

  useEffect(() => {
    localStorage.setItem('baitul-aman-lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'bn' ? 'en' : 'bn');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Helper function to convert numbers to Bengali numerals
export function toBengaliNumber(num: number | string): string {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (digit) => bengaliNumerals[parseInt(digit)]);
}

// Get Bengali day name
export function getBengaliDayName(date: Date): string {
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  return days[date.getDay()];
}

// Get Bengali month name
export function getBengaliMonthName(date: Date): string {
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  return months[date.getMonth()];
}

// Format date in Bengali
export function formatBengaliDate(date: Date): string {
  const day = getBengaliDayName(date);
  const dateNum = toBengaliNumber(date.getDate());
  const month = getBengaliMonthName(date);
  return `${day}, ${dateNum} ${month}`;
}

// Format time in Bengali (12-hour)
export function formatBengaliTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${toBengaliNumber(hours)}:${toBengaliNumber(minutesStr)} ${ampm}`;
}
