import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage, toBengaliNumber, getBengaliDayName } from '@/contexts/LanguageContext';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useDateFormats } from '@/hooks/useDateFormats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Sun, Moon, Loader2, Sunrise, Sunset, Timer } from 'lucide-react';

function to12HourFormat(time: string, language: string): string {
  if (time === '-' || !time) return '-';
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  
  if (language === 'bn') {
    return `${toBengaliNumber(hour12)}:${toBengaliNumber(String(minutes).padStart(2, '0'))} ${period === 'PM' ? '' : ''}`;
  }
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

function hasTimePassed(timeStr: string): boolean {
  if (timeStr === '-' || !timeStr) return false;
  
  const now = new Date();
  const [hours, minutes] = timeStr.split(':').map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = hours * 60 + minutes;
  
  return currentMinutes >= targetMinutes;
}

function parseTimeToDate(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function getTimeRemaining(targetTime: string): string {
  if (targetTime === '-' || !targetTime) return '';
  const now = new Date();
  const target = parseTimeToDate(targetTime);
  let diff = target.getTime() - now.getTime();
  if (diff < 0) diff += 24 * 60 * 60 * 1000;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function PrayerTimesSection() {
  const { t, language } = useLanguage();
  const { prayers, nextPrayer, currentPrayer, sehriTime, iftarTime, hijriDate, loading, error } = usePrayerTimes();
  const dateFormats = useDateFormats();
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!nextPrayer?.time) return;
    const interval = setInterval(() => {
      setCountdown(getTimeRemaining(nextPrayer.time));
    }, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer?.time]);

  const formatTime = (time: string) => {
    return to12HourFormat(time, language);
  };

  const iqamahTimes: Record<string, string> = {
    'ফজর': '06:10',
    'যোহর': '13:30',
    'আসর': '16:30',
    'মাগরিব': '17:43',
    'ইশা': '19:45',
  };

  const getCurrentIqamah = (): string | null => {
    if (!currentPrayer) return null;
    const iqamah = iqamahTimes[currentPrayer.name];
    if (iqamah && !hasTimePassed(iqamah)) {
      return iqamah;
    }
    return null;
  };

  const getNextIqamah = (): string | null => {
    if (!nextPrayer) return null;
    return iqamahTimes[nextPrayer.name] || null;
  };

  const currentIqamah = getCurrentIqamah();
  const nextIqamah = getNextIqamah();

  if (loading) {
    return (
      <section id="prayer-times" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  const today = new Date();
  const dayName = getBengaliDayName(today);

  return (
    <section id="prayer-times" className="py-12 sm:py-16 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(220,60%,35%,0.04),transparent_60%)]" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="section-divider pb-4 inline-block">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('prayer.title')}
            </h2>
          </div>
          <p className="text-muted-foreground text-sm md:text-base mt-4">
            {dateFormats.loading ? hijriDate : dateFormats.fullPrayerDate}
          </p>
          <p className="text-primary font-semibold mt-1">{dayName}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {/* Current & Next Prayer Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Card className="h-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
              <CardContent className="p-4 flex flex-col justify-center h-full relative">
                {currentPrayer && (
                  <div className="text-center mb-4 pb-4 border-b border-white/20">
                    <p className="text-xs uppercase tracking-wider opacity-70 mb-1">
                      বর্তমান ওয়াক্ত
                    </p>
                    <h3 className="text-2xl font-bold">{currentPrayer.name}</h3>
                    {currentIqamah && (
                      <p className="text-sm mt-1 opacity-90">
                        ইকামতঃ {formatTime(currentIqamah)}
                      </p>
                    )}
                  </div>
                )}
                
                {nextPrayer && (
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 animate-float">
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-xs uppercase tracking-wider opacity-70 mb-1">
                      পরবর্তী নামাজ
                    </p>
                    <h3 className="text-xl font-bold text-golden mb-1">{nextPrayer.name}</h3>
                    <p className="text-2xl font-bold mb-1">
                      {formatTime(nextPrayer.time)}
                    </p>
                    {nextIqamah && (
                      <p className="text-sm opacity-90">
                        ইকামতঃ {formatTime(nextIqamah)}
                      </p>
                    )}
                    {countdown && (
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <div className="flex items-center justify-center gap-1 text-xs opacity-80">
                          <Timer className="w-3 h-3" />
                          <span>বাকি সময়</span>
                        </div>
                        <p className="text-lg font-mono font-bold text-golden mt-1 tabular-nums">
                          {countdown}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Prayer Times Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="card-elevated h-full card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-golden animate-spin-slow" />
                  {t('prayer.title')}
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-primary ml-auto animate-float" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error ? (
                  <p className="text-destructive text-center py-4">{error}</p>
                ) : (
                  <div className="-mx-4 sm:mx-0 overflow-x-auto">
                    <table className="w-full min-w-[400px] sm:min-w-0">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-3 sm:px-2 font-semibold text-foreground text-sm">
                            নামাজ
                          </th>
                          <th className="text-center py-3 px-3 sm:px-2 font-semibold text-foreground text-sm">
                            {t('prayer.adhan')}
                          </th>
                          <th className="text-center py-3 px-3 sm:px-2 font-semibold text-foreground text-sm">
                            {t('prayer.iqamah')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {prayers.map((prayer, index) => (
                          <motion.tr
                            key={prayer.nameKey}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={`border-b border-border/50 transition-colors ${
                              nextPrayer?.name === prayer.name
                                ? 'prayer-active bg-primary/5'
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            <td className="py-2.5 px-3 sm:px-2">
                              <span className="font-medium text-foreground text-sm">
                                {prayer.name}
                              </span>
                              {nextPrayer?.name === prayer.name && (
                                <span className="ml-2 inline-flex px-1.5 py-0.5 bg-golden text-white text-xs rounded-full animate-pulse-soft">
                                  Next
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 sm:px-2 text-center">
                              <span className="text-base sm:text-lg font-semibold text-foreground">
                                {formatTime(prayer.adhan)}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 sm:px-2 text-center">
                              <span className="text-base sm:text-lg font-semibold text-primary">
                                {formatTime(prayer.iqamah)}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                        <motion.tr
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          className="bg-gradient-to-r from-golden/10 via-golden/5 to-golden/10"
                        >
                          <td className="py-2.5 px-3 sm:px-2">
                            <span className="font-bold text-golden text-sm">
                              {t('prayer.jummah')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 sm:px-2 text-center">
                            <span className="text-base sm:text-lg font-semibold text-foreground">
                              {language === 'bn' ? '১:১৫' : '1:15'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 sm:px-2 text-center">
                            <span className="text-base sm:text-lg font-semibold text-golden">
                              {language === 'bn' ? '১:৩০' : '1:30'}
                            </span>
                          </td>
                        </motion.tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sehri & Iftar Times */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="space-y-3 sm:space-y-4 h-full flex flex-col">
              <Card className="flex-1 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white overflow-hidden card-hover">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2 animate-float-slow">
                    <Sunrise className="w-5 h-5" />
                  </div>
                  <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
                    সেহরির শেষ সময়
                  </p>
                  <p className="text-2xl font-bold text-amber-300">
                    {formatTime(sehriTime)}
                  </p>
                </CardContent>
              </Card>

              <Card className="flex-1 bg-gradient-to-br from-orange-500 to-red-600 text-white overflow-hidden card-hover">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2 animate-float-slow" style={{ animationDelay: '-1s' }}>
                    <Sunset className="w-5 h-5" />
                  </div>
                  <p className="text-xs uppercase tracking-wider opacity-80 mb-1">
                    ইফতারের সময়
                  </p>
                  <p className="text-2xl font-bold text-amber-200">
                    {formatTime(iftarTime)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
