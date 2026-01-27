import { motion } from 'framer-motion';
import { BookOpen, Clock, MapPin, Phone } from 'lucide-react';

export function CourseInfoSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-golden/10 rounded-2xl border border-primary/20"
    >
      <div className="text-center mb-6">
        <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-foreground mb-2">
          মাসব্যাপী বিশেষ কুরআন শিক্ষা কোর্স
        </h3>
        <p className="text-muted-foreground bengali-text">
          প্রশিক্ষক: হযরত মাওলানা কেফায়াতুল্লাহ
        </p>
        <p className="text-sm text-muted-foreground/80 bengali-text">
          মহাপরিচালক, নূরানি ফাউন্ডেশন । ইমাম প্রশিক্ষক, ইসলামিক ফাউন্ডেশন
        </p>
      </div>

      <p className="text-center text-muted-foreground bengali-text mb-6 max-w-2xl mx-auto">
        নোয়াখালী থেকে আগত বিশিষ্ট কারী সাহেব হযরত মাওলানা কেফায়াতুল্লাহ এর পরিচালনায় বিশেষ তাজবীদ ও তিলাওয়াত শিক্ষা কোর্স।
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
          <Clock className="w-5 h-5 text-primary mb-2" />
          <span className="text-xs text-muted-foreground">সময়কাল</span>
          <span className="font-semibold text-foreground text-center bengali-text">৯ জানুয়ারি - ২৯ ফেব্রুয়ারি'২৬</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
          <Clock className="w-5 h-5 text-primary mb-2" />
          <span className="text-xs text-muted-foreground">সময়</span>
          <span className="font-semibold text-foreground bengali-text">বাদ এশা (১ ঘন্টা)</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
          <MapPin className="w-5 h-5 text-primary mb-2" />
          <span className="text-xs text-muted-foreground">স্থান</span>
          <span className="font-semibold text-foreground text-center bengali-text">বাইতুল আমান মসজিদ</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-background/50 rounded-lg">
          <Phone className="w-5 h-5 text-primary mb-2" />
          <span className="text-xs text-muted-foreground">যোগাযোগ</span>
          <span className="font-semibold text-foreground text-lg tracking-wide" dir="ltr">০১৫৫২-৬৩২৪৫১</span>
        </div>
      </div>
    </motion.div>
  );
}
