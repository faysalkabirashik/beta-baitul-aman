import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Phone, Mail, Lock, User, Calendar, CheckCircle } from 'lucide-react';
import { z } from 'zod';

const registrationSchema = z.object({
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'সঠিক ফোন নম্বর দিন (01XXXXXXXXX)'),
  email: z.string().email('সঠিক ইমেইল দিন').optional().or(z.literal('')),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'),
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে'),
  age: z.string().min(1, 'বয়স দিন'),
});

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export function RegistrationModal({ isOpen, onClose, onLoginClick }: RegistrationModalProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    name: '',
    age: '',
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

    // Use phone as email if no email provided
    const emailToUse = formData.email || `${formData.phone}@baitulaman.local`;

    try {
      // First, submit to Google Sheets
      const { error: sheetsError } = await supabase.functions.invoke('submit-to-sheets', {
        body: {
          formType: 'registration',
          data: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            age: formData.age,
          },
        },
      });

      if (sheetsError) {
        console.error('Sheets submission error:', sheetsError);
        // Continue with auth signup even if sheets fails
      }

      // Then, sign up the user
      const { error } = await supabase.auth.signUp({
        email: emailToUse,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.name,
            phone: formData.phone,
            age: formData.age,
          },
        },
      });

      setIsLoading(false);

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('এই ফোন নম্বর/ইমেইল দিয়ে ইতিমধ্যে নিবন্ধন করা হয়েছে');
        } else {
          toast.error(error.message);
        }
        return;
      }

      setIsSuccess(true);
      toast.success('সফলভাবে নিবন্ধন হয়েছে!');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('নিবন্ধন করতে সমস্যা হয়েছে।');
      setIsLoading(false);
    }
    
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setFormData({ phone: '', email: '', password: '', name: '', age: '' });
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
              সফলভাবে নিবন্ধন হয়েছে!
            </h3>
            <p className="text-muted-foreground bengali-text">
              আপনি এখন লগইন করতে পারবেন।
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
            নিবন্ধন এর জন্য তথ্য দিন
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="reg-password">পাসওয়ার্ড *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="reg-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

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
                className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="reg-age">বয়স (আনুমানিক) *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="reg-age"
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="২৫"
                className={`pl-10 ${errors.age ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age}</p>
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
