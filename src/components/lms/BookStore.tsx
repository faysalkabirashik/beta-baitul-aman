import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ShoppingCart, Book, CreditCard, Truck, Loader2, CheckCircle, X, Gift } from 'lucide-react';
import { z } from 'zod';
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

const bonusBook = {
  title: '২১ ঘন্টায় নুরানি পদ্দবতিতে পবিত্র কুরআন শিক্ষা',
  image: book21Ghontay,
};

export function BookStore() {
  const { t } = useLanguage();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [isFormHighlighted, setIsFormHighlighted] = useState(false);
  const orderFormRef = useRef<HTMLDivElement>(null);
  
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentOptions = [
    { id: 'cod', label: t('order.cod'), icon: <Truck className="w-4 h-4" /> },
    { id: 'bkash', label: t('order.bkash'), icon: <CreditCard className="w-4 h-4" /> },
    { id: 'nagad', label: t('order.nagad'), icon: <CreditCard className="w-4 h-4" /> },
  ];

  const formatPrice = (price: number) => {
    return `৳${price}`;
  };

  const handleOrder = () => {
    setShowOrderForm(true);
    setIsFormHighlighted(true);
    
    // Scroll to order form
    setTimeout(() => {
      orderFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    // Remove highlight after animation
    setTimeout(() => {
      setIsFormHighlighted(false);
    }, 1500);
  };

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
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success(t('order.success'));

    setTimeout(() => {
      setShowOrderForm(false);
      setIsSuccess(false);
      setFormData({ name: '', phone: '', address: '' });
    }, 2000);
  };

  const handleClose = () => {
    setShowOrderForm(false);
    setIsSuccess(false);
    setFormData({ name: '', phone: '', address: '' });
  };

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

        {/* Book + Order Form Side by Side */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Book Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="card-elevated h-full overflow-hidden group">
                {/* Book Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/10 to-golden/10">
                  <img
                    src={mainBook.image}
                    alt={mainBook.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                    {mainBook.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {mainBook.author}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(mainBook.price)}
                    </span>
                    <Button
                      size="sm"
                      onClick={handleOrder}
                      className="btn-golden text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {t('lms.order')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Form */}
            <motion.div
              ref={orderFormRef}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <AnimatePresence mode="wait">
                {!showOrderForm ? (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <Card className="card-elevated h-full flex items-center justify-center">
                      <CardContent className="text-center p-8">
                        <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground bengali-text">
                          বই অর্ডার করতে "অর্ডার করুন" বাটনে ক্লিক করুন
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <Card className="card-elevated border-primary/30 h-full flex items-center justify-center">
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
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className={`card-elevated transition-all duration-500 ${
                      isFormHighlighted ? 'ring-2 ring-golden ring-offset-2 shadow-lg shadow-golden/20' : ''
                    }`}>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg">{t('order.title')}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={handleClose}>
                          <X className="w-5 h-5" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {/* Selected Book Info */}
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-4">
                          <img
                            src={mainBook.image}
                            alt={mainBook.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm line-clamp-1">{mainBook.title}</h4>
                            <p className="text-lg font-bold text-primary">৳{mainBook.price}</p>
                          </div>
                        </div>

                        {/* Bonus Book Info */}
                        <div className="p-3 bg-golden/10 rounded-lg mb-4 border border-golden/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Gift className="w-4 h-4 text-golden" />
                            <p className="text-sm font-semibold text-golden">এই বইয়ের সাথে আরও যা পাবেনঃ</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <img
                              src={bonusBook.image}
                              alt={bonusBook.title}
                              className="w-10 h-14 object-cover rounded"
                            />
                            <p className="text-sm text-foreground">{bonusBook.title}</p>
                          </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                          {/* Name */}
                          <div className="space-y-1">
                            <Label htmlFor="name" className="text-sm">{t('order.name')}</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="আপনার নাম"
                              className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                          </div>

                          {/* Phone */}
                          <div className="space-y-1">
                            <Label htmlFor="phone" className="text-sm">{t('order.phone')}</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="01XXXXXXXXX"
                              className={errors.phone ? 'border-destructive' : ''}
                            />
                            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                          </div>

                          {/* Address */}
                          <div className="space-y-1">
                            <Label htmlFor="address" className="text-sm">{t('order.address')}</Label>
                            <Textarea
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="সম্পূর্ণ ঠিকানা"
                              rows={2}
                              className={errors.address ? 'border-destructive' : ''}
                            />
                            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                          </div>

                          {/* Payment Method */}
                          <div className="space-y-1">
                            <Label className="text-sm">{t('order.paymentMethod')}</Label>
                            <RadioGroup
                              value={paymentMethod}
                              onValueChange={setPaymentMethod}
                              className="grid grid-cols-3 gap-2"
                            >
                              {paymentOptions.map((option) => (
                                <div key={option.id}>
                                  <RadioGroupItem
                                    value={option.id}
                                    id={option.id}
                                    className="peer sr-only"
                                  />
                                  <Label
                                    htmlFor={option.id}
                                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 border-muted cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 text-xs"
                                  >
                                    {option.icon}
                                    <span>{option.label}</span>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
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
                              t('order.placeOrder')
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
