import { motion } from 'framer-motion';
import { BookOpen, Clock, MapPin, Phone } from 'lucide-react';

export function CourseInfoSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-14 max-w-6xl mx-auto p-6 md:p-8
                 bg-gradient-to-r from-primary/10 to-golden/10
                 rounded-2xl border border-primary/20"
    >
      {/* Title */}
      <div className="text-center mb-10">
        <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-foreground bengali-text">
          ২১ দিনে, ২১ ঘন্টায়{' '}
          <span className="text-primary">“নূরানী পদ্ধতিতে”</span>{' '}
          পবিত্র কুরআন ও দ্বীন শিক্ষা।
        </h2>
      </div>

      {/* Instructor – MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mb-10 p-6
                   rounded-xl bg-primary/15 border border-primary/30
                   text-center bengali-text"
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

      {/* Supporting Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-10 bengali-text">
        <div className="p-5 bg-background/70 rounded-xl border">
          <h4 className="font-semibold text-primary mb-2">পরিচালনায়</h4>
          <p>
            মো. মনিরুল ইসলাম মিলন<br />
            সহকারী সচিব, মাধ্যমিক ও উচ্চ শিক্ষা বিভাগ,<br />
            শিক্ষা মন্ত্রণালয়।
          </p>
        </div>

        <div className="p-5 bg-background/70 rounded-xl border">
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

        <div className="p-5 bg-background/70 rounded-xl border">
          <h4 className="font-semibold text-primary mb-2">কৃতজ্ঞতায়</h4>
          <p>
            বাইতুল আমান মসজিদ কমিটি, খতিব, ইমাম,
            খাদেম এবং কুরআন শিক্ষার্থী মুসল্লীবৃন্দ।
          </p>
        </div>

        <div className="p-5 bg-background/70 rounded-xl border">
          <h4 className="font-semibold text-primary mb-2">বিশেষ সহযোগিতায়</h4>
          <p>
            ওয়াহিদ উদ্দিন মাহমুদ<br />
            ধানমন্ডি, ঢাকা।
          </p>
        </div>
      </div>

      {/* Course Meta – RESTORED CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-background/80 rounded-lg border">
          <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">সময়কাল</p>
          <p className="font-semibold bengali-text">
            ৯ থেকে ২৯ জানুয়ারি ’২৬
          </p>
        </div>

        <div className="p-4 bg-background/80 rounded-lg border">
          <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">সময়</p>
          <p className="font-semibold bengali-text">
            বাদ এশা (১ ঘণ্টা)
          </p>
        </div>

        <div className="p-4 bg-background/80 rounded-lg border">
          <MapPin className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">স্থান</p>
          <p className="font-semibold bengali-text">
            বায়তুল আমান মসজিদ<br />
            ধানমন্ডি, রোড ৭, ঢাকা
          </p>
        </div>

        <div className="p-4 bg-background/80 rounded-lg border">
          <Phone className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">যোগাযোগ</p>
          <p className="font-semibold" dir="ltr">
            ০১৭১১-৩৯২৫৯৫<br />
            ০১৭১৪-৬৬৬৭৭৭
          </p>
        </div>
      </div>
    </motion.section>
  );
}
