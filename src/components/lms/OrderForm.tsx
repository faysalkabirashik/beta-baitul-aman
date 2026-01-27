import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { X, Loader2, CheckCircle, Minus, Plus, Gift } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import book21Ghontay from '@/assets/book-21-ghontay.png';

interface BookItem {
  id: string;
  title: string;
  author: string;
  price: number;
  image?: string;
  isPreOrder?: boolean;
}

interface OrderFormProps {
  book: BookItem;
  onClose: () => void;
}

const orderSchema = z.object({
  name: z.string().min(2, 'নাম অবশ্যই ২ অক্ষরের বেশি হতে হবে').max(100),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'সঠিক ফোন নম্বর দিন (01XXXXXXXXX)'),
  address: z.string().min(10, 'সম্পূর্ণ ঠিকানা দিন').max(500),
});

export function OrderForm({ book, onClose }: OrderFormProps) {
  const { t } = useLanguage();
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

  const totalPrice = book.price * quantity;

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
      // Submit to Google Sheets via edge function
      const { data: result, error } = await supabase.functions.invoke('submit-to-sheets', {
        body: {
          formType: 'order',
          data: {
            name: formData.name,
            phone: formData.phone,
            address: formData.address,
            bookTitle: book.title,
            bookPrice: totalPrice.toString(),
            quantity: quantity.toString(),
            orderType: 'buy',
            paymentMethod: 'cod',
          },
        },
      });

      if (error) {
        console.error('Order submission error:', error);
        toast.error('অর্ডার জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        setIsSubmitting(false);
        return;
      }

      console.log('Order submitted successfully:', result);
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success(t('order.success'));

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('অর্ডার জমা দিতে সমস্যা হয়েছে।');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mt-8 max-w-4xl mx-auto"
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
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-8 max-w-4xl mx-auto"
    >
      <Card className="card-elevated border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">{t('order.title')}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Book Image */}
            <div className="flex flex-col items-center justify-start">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full max-w-[280px] h-auto object-contain rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full max-w-[280px] aspect-[3/4] rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-6xl">📖</span>
                </div>
              )}
              <div className="mt-4 text-center">
                <h4 className="font-semibold text-lg">{book.title}</h4>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                <p className="text-2xl font-bold text-primary mt-2">৳{book.price}</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              {/* Selected Book Summary */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-4">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-12 h-14 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-14 rounded bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">📖</span>
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-sm line-clamp-1">{book.title}</h4>
                  <p className="text-primary font-bold">৳{totalPrice}</p>
                </div>
              </div>

              {/* Bonus Book Notice */}
              <div className="flex items-center gap-3 p-3 bg-golden/10 border border-golden/30 rounded-lg mb-4">
                <Gift className="w-5 h-5 text-golden flex-shrink-0" />
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
                {/* Quantity */}
                <div className="space-y-2">
                  <Label>পরিমাণ</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">{t('order.name')}</Label>
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
                  <Label htmlFor="phone">{t('order.phone')}</Label>
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
                  <Label htmlFor="address">{t('order.address')}</Label>
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
                    t('order.placeOrder')
                  )}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
