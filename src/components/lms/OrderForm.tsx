import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { X, CreditCard, Truck, Loader2, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

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
  const [orderType, setOrderType] = useState<'buy' | 'preorder'>(book.isPreOrder ? 'preorder' : 'buy');
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentOptions = orderType === 'buy'
    ? [
        { id: 'cod', label: t('order.cod'), icon: <Truck className="w-4 h-4" /> },
        { id: 'bkash', label: t('order.bkash'), icon: <CreditCard className="w-4 h-4" /> },
        { id: 'nagad', label: t('order.nagad'), icon: <CreditCard className="w-4 h-4" /> },
      ]
    : [
        { id: 'bkash', label: t('order.bkash'), icon: <CreditCard className="w-4 h-4" /> },
        { id: 'nagad', label: t('order.nagad'), icon: <CreditCard className="w-4 h-4" /> },
        { id: 'bank', label: t('order.bank'), icon: <CreditCard className="w-4 h-4" /> },
      ];

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
            bookPrice: book.price.toString(),
            orderType: orderType,
            paymentMethod: paymentMethod,
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
        className="mt-8 max-w-lg mx-auto"
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
      className="mt-8 max-w-lg mx-auto"
    >
      <Card className="card-elevated border-primary/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">{t('order.title')}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Selected Book */}
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg mb-6">
            {book.image ? (
              <img
                src={book.image}
                alt={book.title}
                className="w-16 h-20 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-20 rounded bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">📖</span>
              </div>
            )}
            <div>
              <h4 className="font-semibold">{book.title}</h4>
              <p className="text-sm text-muted-foreground">{book.author}</p>
              <p className="text-lg font-bold text-primary">৳{book.price}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Type */}
            {!book.isPreOrder && (
              <div className="space-y-2">
                <Label>অর্ডার ধরন</Label>
                <RadioGroup
                  value={orderType}
                  onValueChange={(v) => {
                    setOrderType(v as 'buy' | 'preorder');
                    setPaymentMethod('bkash');
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buy" id="buy" />
                    <Label htmlFor="buy">{t('order.buyNow')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="preorder" id="preorder" />
                    <Label htmlFor="preorder">{t('order.preBook')}</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

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
                rows={3}
                className={errors.address ? 'border-destructive' : ''}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>{t('order.paymentMethod')}</Label>
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
                      className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 border-muted cursor-pointer transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      {option.icon}
                      <span className="text-xs">{option.label}</span>
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
  );
}
