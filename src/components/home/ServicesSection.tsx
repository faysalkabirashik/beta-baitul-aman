import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  Users, 
  Heart, 
  Calendar, 
  Building2, 
  GraduationCap 
} from 'lucide-react';

interface Service {
  icon: React.ReactNode;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
}

const services: Service[] = [
  {
    icon: <BookOpen className="w-8 h-8" />,
    titleBn: 'কুরআন শিক্ষা',
    titleEn: 'Quran Education',
    descriptionBn: 'তাজবীদসহ সঠিক কুরআন তিলাওয়াত শেখানো হয়',
    descriptionEn: 'Learn proper Quran recitation with Tajweed',
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    titleBn: 'ইসলামী শিক্ষা',
    titleEn: 'Islamic Studies',
    descriptionBn: 'ইসলামের মৌলিক বিষয়াবলী শেখানো হয়',
    descriptionEn: 'Basic Islamic education and fundamentals',
  },
  {
    icon: <Users className="w-8 h-8" />,
    titleBn: 'জুমআর নামাজ',
    titleEn: 'Jummah Prayer',
    descriptionBn: 'প্রতি শুক্রবার জুমআর নামাজ ও খুতবা',
    descriptionEn: 'Weekly Friday prayers and Khutbah',
  },
  {
    icon: <Heart className="w-8 h-8" />,
    titleBn: 'জানাযার ব্যবস্থা',
    titleEn: 'Janazah Services',
    descriptionBn: 'জানাযার নামাজ ও দাফনের ব্যবস্থাপনা',
    descriptionEn: 'Funeral prayer and burial arrangements',
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    titleBn: 'ইসলামী অনুষ্ঠান',
    titleEn: 'Islamic Events',
    descriptionBn: 'রমজান, ঈদ ও বিশেষ ইসলামী অনুষ্ঠান',
    descriptionEn: 'Ramadan, Eid and special Islamic events',
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    titleBn: 'পাঁচ ওয়াক্ত নামাজ',
    titleEn: 'Five Daily Prayers',
    descriptionBn: 'প্রতিদিন পাঁচ ওয়াক্ত জামাতে নামাজ',
    descriptionEn: 'Daily congregational prayers',
  },
];

export function ServicesSection() {
  const { language } = useLanguage();

  return (
    <section id="services" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {language === 'bn' ? 'সেবাসমূহ' : 'Our Services'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'bn' 
              ? 'বাইতুল আমান মসজিদ থেকে আমরা যে সেবা প্রদান করি'
              : 'Services provided by Baitul Aman Mosque'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-elevated h-full hover:border-primary/30 transition-colors group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {language === 'bn' ? service.titleBn : service.titleEn}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {language === 'bn' ? service.descriptionBn : service.descriptionEn}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
