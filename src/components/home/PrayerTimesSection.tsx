import { motion } from 'framer-motion';
import { useLanguage, toBengaliNumber, getBengaliDayName } from '@/contexts/LanguageContext';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useDateFormats } from '@/hooks/useDateFormats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Sun, Moon, Loader2, Sunrise, Sunset } from 'lucide-react';

// Convert 24h to 12h format in Bengali
function to12HourFormat(time: string, language: string): string {
  if (time === '-' || !time) return '-';
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? (language === 'bn' ? 'PM' : 'PM') : (language === 'bn' ? 'AM' : 'AM');
  const hour12 = hours % 12 || 12;
  
  if (language === 'bn') {
    return `${toBengaliNumber(hour12)}:${toBengaliNumber(String(minutes).padStart(2, '0'))}`;
  }
  return `${hour12}:${String(minutes).padStart(2, '0')}`;
}

// Check if a given time has passed
function hasTimePassed(timeStr: string): boolean {
  if (timeStr === '-' || !timeStr) return false;
  
  const now = new Date();
  const [hours, minutes] = timeStr.split(':').map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = hours * 60 + minutes;
  
  return currentMinutes >= targetMinutes;
}

export function PrayerTimesSection() {
  const { t, language } = useLanguage();
  const { prayers, nextPrayer, currentPrayer, sehriTime, iftarTime, hijriDate, loading, error } = usePrayerTimes();
  const dateFormats = useDateFormats();

  const formatTime = (time: string) => {
    return to12HourFormat(time, language);
  };

  // Get Iqamah times
  const iqamahTimes: Record<string, string> = {
    'ফজর': '06:10',
    'যোহর': '13:30',
    'আসর': '16:30',
    'মাগরিব': '17:43',
    'ইশা': '19:45',
  };

  // Get current prayer's iqamah if not passed
  const getCurrentIqamah = (): string | null => {
    if (!currentPrayer) return null;
    const iqamah = iqamahTimes[currentPrayer.name];
    if (iqamah && !hasTimePassed(iqamah)) {
      return iqamah;
    }
    return null;
  };

  // Get next prayer's iqamah
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
    <section id="prayer-times" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t('prayer.title')}
          </h2>
          {/* Date line: Hijri | International | Bengali Calendar */}
          <p className="text-muted-foreground text-sm md:text-base">
            {dateFormats.loading ? hijriDate : dateFormats.fullPrayerDate}
          </p>
          {/* Day name on separate line */}
          <p className="text-primary font-semibold mt-1">{dayName}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {/* Current & Next Prayer Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <Card className="h-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
              <CardContent className="p-4 flex flex-col justify-center h-full">
                {/* Current Waqt */}
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
                
                {/* Next Prayer */}
                {nextPrayer && (
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
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
                    <p className="text-xs opacity-70 mt-1">
                      বাকি সময়ঃ {nextPrayer.remaining}
                    </p>
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
            <Card className="card-elevated h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sun className="w-5 h-5 text-golden" />
                  {t('prayer.title')}
                  <Moon className="w-5 h-5 text-primary ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error ? (
                  <p className="text-destructive text-center py-4">{error}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 font-semibold text-foreground">
                            নামাজ
                          </th>
                          <th className="text-center py-3 px-2 font-semibold text-foreground">
                            {t('prayer.adhan')}
                          </th>
                          <th className="text-center py-3 px-2 font-semibold text-foreground">
                            {t('prayer.iqamah')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {prayers.map((prayer, index) => (
                          <tr
                            key={prayer.nameKey}
                            className={`border-b border-border/50 transition-colors ${
                              nextPrayer?.name === prayer.name
                                ? 'prayer-active bg-primary/5'
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            <td className="py-2 px-2">
                              <span className="font-medium text-foreground">
                                {prayer.name}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span className="text-lg font-semibold text-foreground">
                                {formatTime(prayer.adhan)}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span className="text-lg font-semibold text-primary">
                                {formatTime(prayer.iqamah)}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {/* Jummah - Only show as additional info, not replacing Dhuhr */}
                        <tr className="bg-golden/10">
                          <td className="py-2 px-2">
                            <span className="font-bold text-golden">
                              {t('prayer.jummah')}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span className="text-lg font-semibold text-foreground">
                              {language === 'bn' ? '১:১৫' : '1:15'}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <span className="text-lg font-semibold text-golden">
                              {language === 'bn' ? '১:৩০' : '1:30'}
                            </span>
                          </td>
                        </tr>
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
            <div className="space-y-4 h-full flex flex-col">
              {/* Sehri Time */}
              <Card className="flex-1 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2">
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

              {/* Iftar Time */}
              <Card className="flex-1 bg-gradient-to-br from-orange-500 to-red-600 text-white overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full text-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2">
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
