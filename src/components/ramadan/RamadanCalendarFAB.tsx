import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, toBengaliNumber } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, MapPin, Globe, Clock, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { CALCULATION_METHODS } from '@/hooks/usePrayerTimes';

const cities = [
  { name: 'ঢাকা', nameEn: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  { name: 'চট্টগ্রাম', nameEn: 'Chittagong', lat: 22.3569, lng: 91.7832 },
  { name: 'সিলেট', nameEn: 'Sylhet', lat: 24.8949, lng: 91.8687 },
  { name: 'রাজশাহী', nameEn: 'Rajshahi', lat: 24.3745, lng: 88.6042 },
  { name: 'খুলনা', nameEn: 'Khulna', lat: 22.8456, lng: 89.5403 },
  { name: 'বরিশাল', nameEn: 'Barisal', lat: 22.701, lng: 90.3535 },
  { name: 'রংপুর', nameEn: 'Rangpur', lat: 25.7439, lng: 89.2752 },
  { name: 'ময়মনসিংহ', nameEn: 'Mymensingh', lat: 24.7471, lng: 90.4203 },
];

export function RamadanCalendarFAB() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [settings, setSettings] = useState({
    city: 'ঢাকা',
    lat: 23.8103,
    lng: 90.4125,
    language: 'bn',
    timeFormat: '12h',
    method: '1',
    orientation: 'portrait',
  });

  const handleCityChange = (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    if (city) {
      setSettings({
        ...settings,
        city: city.name,
        lat: city.lat,
        lng: city.lng,
      });
    }
  };

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      // Fetch Ramadan 2026 prayer times (March 2026)
      const response = await fetch(
        `https://api.aladhan.com/v1/calendar/2026/3?latitude=${settings.lat}&longitude=${settings.lng}&method=${settings.method}`
      );
      const data = await response.json();
      const ramadanDays = data.data;

      // Create PDF
      const isPortrait = settings.orientation === 'portrait';
      const pdf = new jsPDF({
        orientation: isPortrait ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;

      // Header
      pdf.setFillColor(34, 139, 34); // Forest green
      pdf.rect(0, 0, pageWidth, 40, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.text(
        settings.language === 'bn' ? 'রমজান ক্যালেন্ডার ২০২৬' : 'Ramadan Calendar 2026',
        pageWidth / 2,
        20,
        { align: 'center' }
      );

      pdf.setFontSize(12);
      const cityText = settings.language === 'bn' 
        ? settings.city 
        : cities.find(c => c.name === settings.city)?.nameEn || settings.city;
      pdf.text(cityText, pageWidth / 2, 32, { align: 'center' });

      // Table header
      let y = 50;
      const colWidths = isPortrait 
        ? [15, 30, 25, 25, 25, 25, 25]
        : [20, 40, 35, 35, 35, 35, 35];
      
      pdf.setFillColor(245, 245, 220);
      pdf.rect(margin, y, pageWidth - margin * 2, 10, 'F');

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      
      const headers = settings.language === 'bn'
        ? ['দিন', 'তারিখ', 'সেহরি', 'ফজর', 'সূর্যোদয়', 'ইফতার', 'মাগরিব']
        : ['Day', 'Date', 'Sehri', 'Fajr', 'Sunrise', 'Iftar', 'Maghrib'];

      let x = margin;
      headers.forEach((header, i) => {
        pdf.text(header, x + colWidths[i] / 2, y + 7, { align: 'center' });
        x += colWidths[i];
      });

      y += 12;

      // Data rows
      pdf.setFontSize(9);
      ramadanDays.slice(0, 30).forEach((day: any, index: number) => {
        if (y > pageHeight - 30) {
          pdf.addPage();
          y = 20;
        }

        const timings = day.timings;
        const gregorian = day.date.gregorian;
        const hijri = day.date.hijri;

        // Alternate row colors
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');
        }

        const formatTime = (time: string) => {
          const cleanTime = time.split(' ')[0];
          if (settings.timeFormat === '12h') {
            const [h, m] = cleanTime.split(':');
            const hour = parseInt(h);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            return `${hour12}:${m} ${ampm}`;
          }
          return cleanTime;
        };

        // Sehri is usually 10 mins before Fajr
        const fajrTime = timings.Fajr.split(' ')[0];
        const [fH, fM] = fajrTime.split(':').map(Number);
        const sehriMins = fH * 60 + fM - 10;
        const sehriH = Math.floor(sehriMins / 60);
        const sehriM = sehriMins % 60;
        const sehriTime = `${String(sehriH).padStart(2, '0')}:${String(sehriM).padStart(2, '0')}`;

        const rowData = [
          settings.language === 'bn' ? toBengaliNumber(index + 1) : String(index + 1),
          `${gregorian.day}/${gregorian.month.number}`,
          formatTime(sehriTime),
          formatTime(timings.Fajr),
          formatTime(timings.Sunrise),
          formatTime(timings.Maghrib),
          formatTime(timings.Maghrib),
        ];

        x = margin;
        rowData.forEach((cell, i) => {
          pdf.text(cell, x + colWidths[i] / 2, y, { align: 'center' });
          x += colWidths[i];
        });

        y += 8;
      });

      // Footer
      pdf.setFillColor(34, 139, 34);
      pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text(
        settings.language === 'bn' 
          ? 'বাইতুল আমান জামে মসজিদ | ধানমন্ডি, ঢাকা' 
          : 'Baitul Aman Jamae Masjid | Dhanmondi, Dhaka',
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );

      // Save
      pdf.save(`ramadan-calendar-2026-${settings.city}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }

    setIsGenerating(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* FAB Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-golden text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <Calendar className="w-5 h-5" />
        <span className="hidden sm:inline font-medium text-sm">
          {t('ramadan.download')}
        </span>
      </motion.button>

      {/* Generator Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {t('ramadan.title')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* City Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('ramadan.selectCity')}
              </Label>
              <Select value={settings.city} onValueChange={handleCityChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('ramadan.selectCity')} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {language === 'bn' ? city.name : city.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t('ramadan.language')}
              </Label>
              <RadioGroup
                value={settings.language}
                onValueChange={(v) => setSettings({ ...settings, language: v })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bn" id="lang-bn" />
                  <Label htmlFor="lang-bn">বাংলা</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="lang-en" />
                  <Label htmlFor="lang-en">English</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Time Format */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t('ramadan.timeFormat')}
              </Label>
              <RadioGroup
                value={settings.timeFormat}
                onValueChange={(v) => setSettings({ ...settings, timeFormat: v })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12h" id="time-12" />
                  <Label htmlFor="time-12">12-hour</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24h" id="time-24" />
                  <Label htmlFor="time-24">24-hour</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Calculation Method */}
            <div className="space-y-2">
              <Label>{t('ramadan.method')}</Label>
              <Select 
                value={settings.method} 
                onValueChange={(v) => setSettings({ ...settings, method: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CALCULATION_METHODS).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Orientation */}
            <div className="space-y-2">
              <Label>{t('ramadan.orientation')}</Label>
              <RadioGroup
                value={settings.orientation}
                onValueChange={(v) => setSettings({ ...settings, orientation: v })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="portrait" id="orient-port" />
                  <Label htmlFor="orient-port">{t('ramadan.portrait')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="landscape" id="orient-land" />
                  <Label htmlFor="orient-land">{t('ramadan.landscape')}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generatePDF}
            disabled={isGenerating}
            className="w-full btn-golden text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                তৈরি হচ্ছে...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {t('ramadan.generate')}
              </>
            )}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
