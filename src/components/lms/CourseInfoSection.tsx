import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, User, Phone } from 'lucide-react';

export function CourseInfoSection() {
  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="card-elevated overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  মাসব্যাপী বিশেষ কুরআন শিক্ষা কোর্স
                </h3>
                
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-medium">প্রশিক্ষক: হযরত মাওলানা কেফায়াতুল্লাহ</span>
                </div>

                <p className="bengali-text text-muted-foreground mb-6">
                  নোয়াখালী থেকে আগত বিশিষ্ট কারী সাহেব হযরত মাওলানা কেফায়াতুল্লাহ এর পরিচালনায় 
                  বিশেষ তাজবীদ ও তিলাওয়াত শিক্ষা কোর্স।
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-golden" />
                    <div>
                      <p className="text-xs text-muted-foreground">সময়কাল</p>
                      <p className="text-sm font-medium">জানুয়ারি - মার্চ ২০২৬</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-golden" />
                    <div>
                      <p className="text-xs text-muted-foreground">সময়</p>
                      <p className="text-sm font-medium">মাগরিবের পর</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-golden" />
                    <div>
                      <p className="text-xs text-muted-foreground">স্থান</p>
                      <p className="text-sm font-medium">বাইতুল আমান মসজিদ</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-golden" />
                    <div>
                      <p className="text-xs text-muted-foreground">যোগাযোগ</p>
                      <p className="text-sm font-medium">০১৫৫২-৬৩২৪৫১</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
