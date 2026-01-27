import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Book, ShoppingCart, Loader2, CheckCircle, Gift } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import bookQuranDinShikkha from '@/assets/book-quran-din-shikkha.png';
import book21Ghontay from '@/assets/book-21-ghontay.png';

const orderSchema = z.object({
  name: z.string().min(2, 'নাম অবশ্যই ২ অক্ষরের বেশি হতে হবে').max(100),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'সঠিক ফোন নম্বর দিন (01XXXXXXXXX)'),
  address: z.string().min(10, 'সম্পূর্ণ ঠিকানা দিন').max(500),
});

const mainBook = {
  id: '1',
  title: 'নূরানি পদ্দতিতে পবিত্র কুরআন ও দ্বীন শিক্ষা',
  author: 'হযরত মাওলানা কেফায়াতুল্লাহ',
  price: 250,
  image: bookQuranDinShikkha,
};

export function BookStore() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const totalPrice = mainBook.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      orderSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('submit-to-sheets', {
        body: {
          formType: 'order',
          data: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            bookTitle: mainBook.title,
            bookPrice: totalPrice.toString(),
            quantity: quantity.toString(),
            orderType: 'buy',
          },
        },
      });

      if (error) {
        console.error('Order submission error:', error);
        toast.error('অর্ডার জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success(t('order.success'));

      setTimeout(() => {
        setIsSuccess(false);
        setShowForm(false);
        setFormData({ name: '', phone: '', address: '' });
        setQuantity(1);
      }, 3000);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('অর্ডার জমা দিতে সমস্যা হয়েছে।');
      setIsSubmitting(false);
    }
  };


  if (isSuccess) {
    return (
      <section id="book-store" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="card-elevated border-primary/30">
              <CardContent className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {t('order.success')}
                </h3>
                <p className="text-muted-foreground bengali-text">
                  আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="book-store" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Book className="w-6 h-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('lms.books')}
            </h2>
          </div>
          <p className="text-muted-foreground">
            কুরআন শিক্ষার জন্য প্রয়োজনীয় বইসমূহ
          </p>
        </motion.div>

        {/* Single Book Card with Integrated Order Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <Card className="card-elevated overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side - Book Image and Info */}
                <div className="p-6 lg:p-8 bg-gradient-to-br from-primary/5 to-golden/5 flex flex-col items-center justify-center">
                  <div className="relative">
                    <img
                      src={mainBook.image}
                      alt={mainBook.title}
                      className="w-full max-w-[300px] h-auto object-contain rounded-lg shadow-xl"
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {mainBook.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {mainBook.author}
                    </p>
                    <p className="text-3xl font-bold text-primary mb-4">৳{mainBook.price}</p>
                    {!showForm && (
                      <Button
                        onClick={() => setShowForm(true)}
                        className="btn-golden text-white"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        অর্ডার করুন
                      </Button>
                    )}
                  </div>
                </div>

                {/* Right Side - Order Form */}
                <div className="p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-border">
                  {showForm ? (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">অর্ডার ফর্ম</h4>
                      
                      {/* Selected Book Summary */}
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-4">
                        <img
                          src={mainBook.image}
                          alt={mainBook.title}
                          className="w-12 h-14 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm line-clamp-1">{mainBook.title}</h5>
                          <p className="text-primary font-bold">৳{totalPrice}</p>
                        </div>
                      </div>

                      {/* Bonus Book Notice */}
                      <div className="flex items-start gap-3 p-3 bg-golden/10 border border-golden/30 rounded-lg mb-4">
                        <Gift className="w-5 h-5 text-golden flex-shrink-0 mt-0.5" />
                        <div className="flex items-center gap-2">
                          <img
                            src={book21Ghontay}
                            alt="বোনাস বই"
                            className="w-10 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="text-xs text-muted-foreground">এই বইয়ের সাথে আরও যা পাবেন:</p>
                            <p className="text-sm font-medium">২১ ঘন্টায় নুরানি পদ্দবতিতে পবিত্র কুরআন শিক্ষা</p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-2">
                          <Label htmlFor="name">নাম</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="আপনার নাম"
                            className={errors.name ? 'border-destructive' : ''}
                          />
                          {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label htmlFor="phone">ফোন নম্বর</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="01XXXXXXXXX"
                            className={errors.phone ? 'border-destructive' : ''}
                          />
                          {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone}</p>
                          )}
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                          <Label htmlFor="address">ঠিকানা</Label>
                          <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="সম্পূর্ণ ঠিকানা"
                            rows={2}
                            className={errors.address ? 'border-destructive' : ''}
                          />
                          {errors.address && (
                            <p className="text-sm text-destructive">{errors.address}</p>
                          )}
                        </div>

                        {/* Submit */}
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full btn-golden text-white"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              প্রক্রিয়াকরণ হচ্ছে...
                            </>
                          ) : (
                            'অর্ডার সম্পন্ন করুন'
                          )}
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8">
                      <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mb-4" />
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        বই অর্ডার করুন
                      </h4>
                      <p className="text-muted-foreground mb-4 max-w-xs">
                        অর্ডার করতে বাম পাশের "অর্ডার করুন" বাটনে ক্লিক করুন
                      </p>
                      <Button
                        onClick={() => setShowForm(true)}
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary/5"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        অর্ডার শুরু করুন
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
