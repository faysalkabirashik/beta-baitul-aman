import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Phone, User, MapPin, Mail, CheckCircle } from 'lucide-react';
import { z } from 'zod';

const registrationSchema = z.object({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে'),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'সঠিক ফোন নম্বর দিন (01XXXXXXXXX)'),
  email: z.string().email('সঠিক ইমেইল দিন').optional().or(z.literal('')),
  address: z.string().min(5, 'ঠিকানা দিন').max(500),
});

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export function RegistrationModal({ isOpen, onClose, onLoginClick }: RegistrationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      registrationSchema.parse(formData);
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

    setIsLoading(true);

    try {
      // Submit to Google Sheets
      const { error: sheetsError } = await supabase.functions.invoke('submit-to-sheets', {
        body: {
          formType: 'registration',
          data: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
          },
        },
      });

      if (sheetsError) {
        console.error('Sheets submission error:', sheetsError);
        toast.error('তথ্য জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setIsSuccess(true);
      toast.success('সফলভাবে সাবমিট হয়েছে!');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('তথ্য জমা দিতে সমস্যা হয়েছে।');
      setIsLoading(false);
    }
    
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setFormData({ name: '', phone: '', email: '', address: '' });
    }, 2000);
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              সফলভাবে সাবমিট হয়েছে!
            </h3>
            <p className="text-muted-foreground bengali-text">
              শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            আপনার তথ্য দিন
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="reg-name">নাম *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="reg-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="আপনার নাম"
                className={`pl-10 ${errors.name ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary focus:border-primary'}`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="reg-email">ইমেইল (অপশনাল)</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="reg-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="reg-phone">ফোন নম্বর *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="reg-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="01XXXXXXXXX"
                className={`pl-10 ${errors.phone ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="reg-address">ঠিকানা *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="reg-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="সম্পূর্ণ ঠিকানা"
                rows={2}
                className={`pl-10 ${errors.address ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full btn-golden text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                প্রক্রিয়াকরণ হচ্ছে...
              </>
            ) : (
              'সাবমিট'
            )}
          </Button>

          {/* Already registered option */}
          <p className="text-center text-sm text-muted-foreground pt-2">
            অলরেডি নিবন্ধন আছে?{' '}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-primary font-medium hover:underline"
            >
              লগইন করুন
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
