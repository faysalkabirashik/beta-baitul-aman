import { motion } from 'framer-motion';
import { BookOpen, Clock, MapPin, Phone } from 'lucide-react';

export function CourseInfoSection() {
  return (
    <section className="mt-14 px-4 md:px-6">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground bengali-text">
          ২১ দিনে, ২১ ঘন্টায়{' '}
          <span className="text-primary">“নূরানী পদ্ধতিতে”</span>{' '}
          পবিত্র কুরআন ও দ্বীন শিক্ষা।
        </h2>
      </motion.div>

      {/* Instructor – MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="max-w-3xl mx-auto mb-10 p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center bengali-text"
      >
        <p className="text-lg font-semibold text-foreground mb-1">
          প্রশিক্ষক: হযরত মাওলানা ক্বারী মুহাম্মাদ কিফায়াতুল্লাহ
        </p>

        <p className="text-sm text-muted-foreground mb-2">
          (ফাজলে দারুন উলুম দেওবন্দ)
        </p>

        <p className="text-muted-foreground">
          মহাপরিচালক, নূরানী ফাউন্ডেশন ও ইমাম প্রশিক্ষক,
          ইসলামিক ফাউন্ডেশন, ঢাকা।
        </p>

        <p className="text-muted-foreground mt-1">
          ঘাটার চর (শহীদনগর), আটিবাজার, কেরানীগঞ্জ, ঢাকা।
        </p>

        <p className="mt-3 font-medium text-foreground">
          (মোবাইল: <span dir="ltr">০১৭১১-৩৯২৫৯৫</span>)
        </p>
      </motion.div>

      {/* Supporting Information */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5 mb-10 bengali-text">
        <div className="p-5 bg-background/70 rounded-xl">
          <h4 className="font-semibold text-primary mb-2">পরিচালনায়</h4>
          <p>
            মো. মনিরুল ইসলাম মিলন<br />
            সহকারী সচিব, মাধ্যমিক ও উচ্চ শিক্ষা বিভাগ,<br />
            শিক্ষা মন্ত্রণালয়।
          </p>
        </div>

        <div className="p-5 bg-background/70 rounded-xl">
          <h4 className="font-semibold text-primary mb-2">
            ভিডিও এডিটিং ও ওয়েব ডিজাইন
          </h4>
          <p>
            মো: আবু সাঈদ<br />
            সিনিয়র লেকচারার, সিএসই,<br />
            ইন্ডিপেন্ডেন্ট ইউনিভার্সিটি বাংলাদেশ
          </p>
          <p className="mt-2">
            মোঃ ফয়সাল কবির আশিক<br />
            বিএসসি, সিএসই,<br />
            ইন্ডিপেন্ডেন্ট ইউনিভার্সিটি, বাংলাদেশ
          </p>
        </div>

        <div className="p-5 bg-background/70 rounded-xl">
          <h4 className="font-semibold text-primary mb-2">কৃতজ্ঞতায়</h4>
          <p>
            বাইতুল আমান মসজিদ কমিটি, খতিব, ইমাম,
            খাদেম এবং কুরআন শিক্ষার্থী মুসল্লীবৃন্দ।
          </p>
        </div>

        <div className="p-5 bg-background/70 rounded-xl">
          <h4 className="font-semibold text-primary mb-2">বিশেষ সহযোগিতায়</h4>
          <p>
            ওয়াহিদ উদ্দিন মাহমুদ<br />
            ধানমন্ডি, ঢাকা।
          </p>
        </div>
      </div>

      {/* Course Meta – COMPACT STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div className="flex flex-col items-center p-4 bg-background/60 rounded-lg">
          <Clock className="w-5 h-5 text-primary mb-2" />
          <span className="text-xs text-muted-foreground">সময়কাল</span>
          <span className="font-semibold text-foreground bengali-text text-center">
            ৯ থেকে ২৯ জানুয়ারি ’২৬
          </span>
        </div>

        <div className="flex flex-col items-center p-4 bg-background/60 rounded-lg">
          <Clock className="w-5 h-5 text-primary mb-2" />
          <span className="text-xs text-muted-foreground">সময়</span>
          <span className="font-semibold text-foreground bengali-text">
            বাদ এশা (১ ঘণ্টা)
          </span>
        </div>

        <div className="flex flex-col items-center p-4 bg-background/60 rounded-lg">
          <MapPin className="w-5 h-5 text-primary mb-2" />
          <span className="text-xs text-muted-foreground">স্থান</span>
          <span className="font-semibold text-foreground bengali-text text-center">
            বায়তুল আমান মসজিদ<br />
            ধানমন্ডি, রোড ৭, ঢাকা
          </span>
        </div>

        <div className="flex flex-col items-center p-4 bg-background/60 rounded-lg">
          <Phone className="w-5 h-5 text-primary mb-2" />
          <span className="text-xs text-muted-foreground">যোগাযোগ</span>
          <span className="font-semibold text-foreground text-center" dir="ltr">
            ০১৭১১-৩৯২৫৯৫<br />
            ০১৭১৪-৬৬৬৭৭৭
          </span>
        </div>
      </div>
    </section>
  );
}
