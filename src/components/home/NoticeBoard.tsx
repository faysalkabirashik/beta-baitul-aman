import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, Pin, ChevronRight, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Notice {
  id: string;
  title: string;
  message: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export function NoticeBoard() {
  const { t, language } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotices(data || []);
      } catch {
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const pinned = notices.length > 0 ? notices[0] : null;
  const upcoming = notices.slice(1);

  if (loading) {
    return (
      <section id="events" className="py-12 sm:py-16 bg-background relative overflow-hidden">
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!pinned && upcoming.length === 0) return null;

  return (
    <section id="events" className="py-12 sm:py-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(40,90%,50%,0.04),transparent_60%)]" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bell className="w-6 h-6 text-golden animate-float" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {language === 'bn' ? 'নোটিশ বোর্ড' : 'Notice Board'}
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {/* Pinned Notice - Large Card */}
          {pinned && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="h-full bg-gradient-to-br from-primary/10 via-primary/5 to-golden/10 border-primary/30 overflow-hidden relative card-hover">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(40,90%,50%,0.1),transparent_50%)]" />
                <div className="absolute top-4 right-4">
                  <span className="flex items-center gap-1 px-3 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full shadow-lg">
                    <Pin className="w-3 h-3" />
                    {language === 'bn' ? 'পিন করা' : 'Pinned'}
                  </span>
                </div>
                <CardContent className="p-5 sm:p-8 flex flex-col justify-center h-full min-h-[220px] sm:min-h-[250px] relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                      <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                        {pinned.title}
                      </h3>
                    </div>
                  </div>

                  {pinned.message && (
                    <p className="text-muted-foreground bengali-text mb-4 sm:mb-6 text-sm sm:text-base">
                      {pinned.message}
                    </p>
                  )}

                  <Link to="/learn-quran">
                    <Button
                      className="btn-golden text-white group"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Other Notices List */}
          {upcoming.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="card-elevated h-full card-hover">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    {language === 'bn' ? 'আরও নোটিশ' : 'More Notices'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {upcoming.map((notice, index) => (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 hover:from-primary/5 hover:to-golden/5 border border-transparent hover:border-primary/20 transition-all duration-300 cursor-pointer group"
                    >
                      <h4 className="font-semibold text-foreground text-sm mb-1.5 group-hover:text-primary transition-colors">
                        {notice.title}
                      </h4>
                      {notice.message && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notice.message}
                        </p>
                      )}
                    </motion.div>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full mt-4 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground group"
                  >
                    <span>{t('notice.viewAll')}</span>
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
