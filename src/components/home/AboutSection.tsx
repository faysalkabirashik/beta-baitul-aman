import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import baitulAmanImage from '@/assets/baitul-aman.jpg';

export function AboutSection() {
  const { language } = useLanguage();

  return (
    <section id="about" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'বাইতুল আমান মসজিদ - শান্তির ঘর'
              : 'Baitul Aman Mosque - House of Peace'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden aspect-video"
          >
            <img
              src={baitulAmanImage}
              alt="বাইতুল আমান মসজিদ"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground/80 bengali-text leading-relaxed">
                {language === 'bn' 
                  ? 'বাইতুল আমান মসজিদ একটি শান্তির ঘর যেখানে মুসলিম সম্প্রদায় একত্রিত হয়ে আল্লাহর ইবাদত করে। আমরা কুরআন শিক্ষা, ইসলামী জ্ঞান প্রচার এবং সামাজিক সেবায় নিবেদিত। প্রতিদিন পাঁচ ওয়াক্ত নামাজ জামাতে আদায় করা হয় এবং প্রতি শুক্রবার জুমআর নামাজ ও খুতবা অনুষ্ঠিত হয়।'
                  : 'Baitul Aman Mosque is a house of peace where the Muslim community gathers to worship Allah. We are dedicated to Quran education, spreading Islamic knowledge, and community service. Five daily prayers are offered in congregation, and Friday prayers with Khutbah are held every week.'
                }
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-primary/20">
                <CardContent className="p-4 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground text-sm">
                      {language === 'bn' ? 'ঠিকানা' : 'Address'}
                    </h4>
                    <p className="text-muted-foreground text-xs">
                      {language === 'bn' 
                        ? 'বাইতুল আমান মসজিদ, ধানমন্ডি, রোড ৭, ঢাকা'
                        : 'Baitul Aman Mosque, Dhanmondi, Road 7, Dhaka'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-4 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground text-sm">
                      {language === 'bn' ? 'সময়' : 'Timing'}
                    </h4>
                    <p className="text-muted-foreground text-xs">
                      {language === 'bn' 
                        ? 'সব সময় খোলা'
                        : 'Open 24/7'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-4 flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground text-sm">
                      {language === 'bn' ? 'ফোন' : 'Phone'}
                    </h4>
                    <p className="text-muted-foreground text-xs">০১৫৫২-৬৩২৪৫১</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-4 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground text-sm">
                      {language === 'bn' ? 'ইমেইল' : 'Email'}
                    </h4>
                    <p className="text-muted-foreground text-xs">info@baitulaman.com</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
