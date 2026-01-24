import { motion } from 'framer-motion';
import { useLanguage, toBengaliNumber } from '@/contexts/LanguageContext';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Sun, Moon, Loader2 } from 'lucide-react';

export function PrayerTimesSection() {
  const { t, language } = useLanguage();
  const { prayers, nextPrayer, hijriDate, loading, error } = usePrayerTimes();

  const formatTime = (time: string) => {
    if (time === '-') return '-';
    if (language === 'bn') {
      const [hours, minutes] = time.split(':');
      return `${toBengaliNumber(hours)}:${toBengaliNumber(minutes)}`;
    }
    return time;
  };

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
          <p className="text-muted-foreground">{hijriDate}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Next Prayer Highlight */}
          {nextPrayer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <Card className="h-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden">
                <CardContent className="p-6 flex flex-col justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8" />
                  </div>
                  <p className="text-sm uppercase tracking-wider opacity-80 mb-1">
                    {t('prayer.nextPrayer')}
                  </p>
                  <h3 className="text-3xl font-bold mb-2">{nextPrayer.name}</h3>
                  <p className="text-4xl font-bold text-golden mb-2">
                    {formatTime(nextPrayer.time)}
                  </p>
                  <p className="text-sm opacity-80">
                    {t('prayer.timeRemaining')}: {nextPrayer.remaining}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Prayer Times Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="card-elevated">
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
                            <td className="py-3 px-2">
                              <span className="font-medium text-foreground">
                                {prayer.name}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="text-lg font-semibold text-foreground">
                                {formatTime(prayer.adhan)}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="text-lg font-semibold text-primary">
                                {formatTime(prayer.iqamah)}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {/* Jummah */}
                        <tr className="bg-golden/10">
                          <td className="py-3 px-2">
                            <span className="font-bold text-golden">
                              {t('prayer.jummah')}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="text-lg font-semibold text-foreground">
                              {language === 'bn' ? '১:১৫' : '1:15'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center">
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
        </div>
      </div>
    </section>
  );
}
