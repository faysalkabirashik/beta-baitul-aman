import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Pin, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  isPinned?: boolean;
  isHighlight?: boolean;
}

const events: Event[] = [
  {
    id: '1',
    title: 'মাসব্যাপী বিশেষ কুরআন শিক্ষা',
    date: 'জানুয়ারি - মার্চ ২০২৬',
    time: 'প্রতিদিন মাগরিবের পর',
    isPinned: true,
    isHighlight: true,
  },
  {
    id: '2',
    title: 'সাপ্তাহিক ইসলামী আলোচনা',
    date: 'প্রতি শুক্রবার',
    time: 'আসরের পর',
    isPinned: false,
  },
  {
    id: '3',
    title: 'শিশুদের জন্য কুরআন ক্লাস',
    date: 'প্রতি শনিবার',
    time: 'সকাল ১০টা',
    isPinned: false,
  },
  {
    id: '4',
    title: 'রমজান প্রস্তুতি সেমিনার',
    date: '১৫ ফেব্রুয়ারি ২০২৬',
    time: 'মাগরিবের পর',
    isPinned: false,
  },
];

export function NoticeBoard() {
  const { t } = useLanguage();

  return (
    <section id="events" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bell className="w-6 h-6 text-golden animate-pulse-soft" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('notice.title')}
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Pinned Event - Large Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="h-full bg-gradient-to-br from-primary/10 to-golden/10 border-primary/30 overflow-hidden relative">
              <div className="absolute top-4 right-4">
                <span className="flex items-center gap-1 px-3 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full">
                  <Pin className="w-3 h-3" />
                  পিন করা
                </span>
              </div>
              <CardContent className="p-8 flex flex-col justify-center h-full min-h-[250px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                      {events[0].title}
                    </h3>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-5 h-5" />
                    <span>{events[0].date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bell className="w-5 h-5" />
                    <span>{events[0].time}</span>
                  </div>
                </div>

                <p className="text-muted-foreground bengali-text mb-6">
                  মাওলানা কেফায়াতুল্লাহ সাহেবের পরিচালনায় বিশেষ কুরআন শিক্ষা কোর্স। 
                  নোয়াখালী থেকে তাজবীদ ও তিলাওয়াত শিক্ষা। সবার জন্য উন্মুক্ত।
                </p>

                <Link to="/learn-quran">
                  <Button className="btn-golden text-white">
                    বিস্তারিত দেখুন
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Other Events List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card-elevated h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  আসন্ন অনুষ্ঠান
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.slice(1).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <h4 className="font-semibold text-foreground text-sm mb-1">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{event.date}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                    </div>
                  </motion.div>
                ))}

                <Button
                  variant="outline"
                  className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  {t('notice.viewAll')}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
