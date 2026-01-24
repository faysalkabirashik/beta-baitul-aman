import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, User, Phone } from 'lucide-react';

export function ProgramDetails() {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-muted/50 py-8"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="card-elevated">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Instructor Image */}
                <div className="md:w-1/3">
                  <div className="aspect-square rounded-xl overflow-hidden bg-muted">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                      alt="Instructor"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="md:w-2/3 space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">
                    মাসব্যাপী বিশেষ কুরআন শিক্ষা কোর্স
                  </h3>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-5 h-5 text-primary" />
                    <span className="font-medium">প্রশিক্ষক: মাওলানা কেফায়াতুল্লাহ</span>
                  </div>

                  <p className="bengali-text text-muted-foreground">
                    নোয়াখালী থেকে আগত বিশিষ্ট কারী সাহেব মাওলানা কেফায়াতুল্লাহ এর পরিচালনায় 
                    বিশেষ তাজবীদ ও তিলাওয়াত শিক্ষা কোর্স। এই কোর্সে কুরআন মাজীদের সঠিক উচ্চারণ, 
                    মাখরাজ ও তাজবীদের নিয়মাবলী হাতে-কলমে শেখানো হবে।
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-golden mt-0.5" />
                      <div>
                        <p className="font-semibold">সময়কাল</p>
                        <p className="text-sm text-muted-foreground">জানুয়ারি - মার্চ ২০২৬</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-golden mt-0.5" />
                      <div>
                        <p className="font-semibold">সময়</p>
                        <p className="text-sm text-muted-foreground">প্রতিদিন মাগরিবের পর</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-golden mt-0.5" />
                      <div>
                        <p className="font-semibold">স্থান</p>
                        <p className="text-sm text-muted-foreground">বাইতুল আমান জামে মসজিদ</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-golden mt-0.5" />
                      <div>
                        <p className="font-semibold">যোগাযোগ</p>
                        <p className="text-sm text-muted-foreground">০১৫৫২-৬৩২৪৫১</p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="pt-4 border-t border-border">
                    <p className="font-semibold mb-2">কোর্সে যা শেখানো হবে:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        তাজবীদের মৌলিক নিয়মাবলী
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        সঠিক মাখরাজ শিক্ষা
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        নূন সাকিন ও তানবীনের বিধান
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        মীম সাকিনের বিধান
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        মাদ্দের প্রকারভেদ
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        ওয়াকফের নিয়মাবলী
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
