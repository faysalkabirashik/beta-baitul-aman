import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Users, Star, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import baitulAmanImage from '@/assets/baitul-aman.jpg';
import baitulAmanNight from '@/assets/baitul-aman-night.png';
import logoImage from '@/assets/logo-baitul-aman.png';

interface AuthorityMember {
  id: string;
  name_bn: string;
  name_en: string;
  role_bn: string;
  role_en: string;
  photo_url: string | null;
  sort_order: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
}

const About = () => {
  const { language } = useLanguage();
  const [members, setMembers] = useState<AuthorityMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('community_members')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMembers(data || []);
      } catch {
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <main>
        <section className="relative h-[35vh] min-h-[280px] overflow-hidden">
          <img
            src={baitulAmanImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/50 to-primary/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-white"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4">
                {language === 'bn'
                  ? 'বাইতুল আমান মসজিদ - শান্তির ঘর, ইমানের আলো'
                  : 'Baitul Aman Mosque - House of Peace, Light of Faith'}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(220,60%,35%,0.03),transparent_60%)]" />
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden aspect-video group"
              >
                <img
                  src={baitulAmanNight}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white">
                    <img
                      src={logoImage}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-semibold drop-shadow-lg">
                      {language === 'bn' ? 'বাইতুল আমান মসজিদ' : 'Baitul Aman Masjid'}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {language === 'bn' ? 'আমাদের পরিচয়' : 'Our Identity'}
                  </h2>
                  <div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/60 mb-6" />
                </div>

                <div className="space-y-4 text-foreground/80 bengali-text leading-relaxed">
                  <p>
                    {language === 'bn'
                      ? 'বাইতুল আমান মসজিদ ধানমন্ডি, ঢাকার প্রাণকেন্দ্রে অবস্থিত একটি ঐতিহ্যবাহী ইসলামী প্রতিষ্ঠান। ১৯৮৫ সালে প্রতিষ্ঠিত এই মসজিদটি এলাকার মুসলিম সম্প্রদায়ের জন্য একটি শান্তির কেন্দ্র হিসেবে কাজ করে আসছে।'
                      : 'Baitul Aman Mosque is a historic Islamic institution located in the heart of Dhanmondi, Dhaka. Established in 1985, this mosque has been serving as a center of peace for the local Muslim community.'}
                  </p>
                  <p>
                    {language === 'bn'
                      ? 'প্রতিদিন পাঁচ ওয়াক্ত নামাজ জামাতে আদায়ের পাশাপাশি এখানে কুরআন শিক্ষা, ইসলামী আলোচনা, এবং বিভিন্ন সামাজিক কার্যক্রম পরিচালিত হয়। প্রতি শুক্রবার জুমআর নামাজ ও বিশেষ খুতবা অনুষ্ঠিত হয় যা এলাকাবাসীর কাছে অত্যন্ত জনপ্রিয়।'
                      : 'In addition to five daily congregational prayers, the mosque organizes Quran education, Islamic discussions, and various social activities. Friday Jummah prayers with special Khutbah are held every week and are very popular among the residents.'}
                  </p>
                  <p>
                    {language === 'bn'
                      ? 'আমাদের লক্ষ্য হল ইসলামের শান্তির বাণী প্রচার করা এবং একটি সুশৃঙ্খল, শিক্ষিত ও নৈতিক সমাজ গঠনে ভূমিকা রাখা।'
                      : 'Our goal is to spread the peaceful message of Islam and play a role in building a disciplined, educated, and moral society.'}
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto"
            >
              {[
                {
                  icon: MapPin,
                  label: language === 'bn' ? 'ঠিকানা' : 'Address',
                  value: language === 'bn'
                    ? 'ধানমন্ডি, রোড ৭, ঢাকা'
                    : 'Dhanmondi, Road 7, Dhaka',
                },
                {
                  icon: Clock,
                  label: language === 'bn' ? 'প্রতিষ্ঠিত' : 'Established',
                  value: '১৯৮৫',
                },
                {
                  icon: Users,
                  label: language === 'bn' ? 'সাপ্তাহিক জামাত' : 'Weekly Congregation',
                  value: language === 'bn' ? '১০০০+' : '1000+',
                },
                {
                  icon: Star,
                  label: language === 'bn' ? 'সেবা' : 'Services',
                  value: language === 'bn' ? '১০+' : '10+',
                },
              ].map((item) => (
                <Card key={item.label} className="border-primary/20 card-hover text-center">
                  <CardContent className="p-4 sm:p-6">
                    <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="font-semibold text-foreground text-sm">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(220,60%,35%,0.03),transparent_60%)]" />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {language === 'bn' ? 'আমাদের টিম' : 'Our Team'}
              </h2>
              <div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/60 mx-auto" />
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                {language === 'bn'
                  ? 'মসজিদ পরিচালনা ও ধর্মীয় সেবায় নিয়োজিত আমাদের সম্মানিত সদস্যবৃন্দ'
                  : 'Our esteemed members dedicated to mosque management and religious services'}
              </p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : members.length === 0 ? (
              <p className="text-center text-muted-foreground">
                {language === 'bn' ? 'কোনো সদস্য পাওয়া যায়নি।' : 'No members found.'}
              </p>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
              >
                {members.map((member) => (
                  <motion.div key={member.id} variants={itemVariants}>
                    <Card className="card-hover border-primary/10 overflow-hidden group">
                      <CardContent className="p-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                          <span className="text-2xl font-bold text-primary-foreground">
                            {getInitials(language === 'bn' ? member.name_bn : member.name_en)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {language === 'bn' ? member.name_bn : member.name_en}
                        </h3>
                        <p className="text-sm text-golden font-medium">
                          {language === 'bn' ? member.role_bn : member.role_en}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
