// import { useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { useLanguage } from '@/contexts/LanguageContext';
// import { TopBar } from '@/components/layout/TopBar';
// import { Header } from '@/components/layout/Header';
// import { Footer } from '@/components/layout/Footer';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { supabase } from '@/integrations/supabase/client';
// import { toast } from 'sonner';
// import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
// import { z } from 'zod';

// const loginSchema = z.object({
//   email: z.string().email('সঠিক ইমেইল দিন'),
//   password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'),
// });

// const signupSchema = loginSchema.extend({
//   name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে'),
//   confirmPassword: z.string(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: 'পাসওয়ার্ড মিলছে না',
//   path: ['confirmPassword'],
// });

// export default function Auth() {
//   const { t } = useLanguage();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const isLogin = searchParams.get('login') === 'true';

//   // Default to signup, only show login if explicitly requested
//   const [activeTab, setActiveTab] = useState(isLogin ? 'login' : 'signup');
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const [loginData, setLoginData] = useState({ email: '', password: '' });
//   const [signupData, setSignupData] = useState({ 
//     name: '', 
//     email: '', 
//     password: '', 
//     confirmPassword: '' 
//   });

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     try {
//       loginSchema.parse(loginData);
//     } catch (err) {
//       if (err instanceof z.ZodError) {
//         const newErrors: Record<string, string> = {};
//         err.errors.forEach((error) => {
//           if (error.path[0]) {
//             newErrors[error.path[0] as string] = error.message;
//           }
//         });
//         setErrors(newErrors);
//         return;
//       }
//     }

//     setIsLoading(true);

//     const { error } = await supabase.auth.signInWithPassword({
//       email: loginData.email,
//       password: loginData.password,
//     });

//     setIsLoading(false);

//     if (error) {
//       if (error.message.includes('Invalid login credentials')) {
//         toast.error('ইমেইল বা পাসওয়ার্ড ভুল হয়েছে');
//       } else {
//         toast.error(error.message);
//       }
//       return;
//     }

//     toast.success('সফলভাবে লগইন হয়েছে!');
//     navigate('/');
//   };

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     try {
//       signupSchema.parse(signupData);
//     } catch (err) {
//       if (err instanceof z.ZodError) {
//         const newErrors: Record<string, string> = {};
//         err.errors.forEach((error) => {
//           if (error.path[0]) {
//             newErrors[error.path[0] as string] = error.message;
//           }
//         });
//         setErrors(newErrors);
//         return;
//       }
//     }

//     setIsLoading(true);

//     const redirectUrl = `${window.location.origin}/`;

//     const { error } = await supabase.auth.signUp({
//       email: signupData.email,
//       password: signupData.password,
//       options: {
//         emailRedirectTo: redirectUrl,
//         data: {
//           full_name: signupData.name,
//         },
//       },
//     });

//     setIsLoading(false);

//     if (error) {
//       if (error.message.includes('already registered')) {
//         toast.error('এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে');
//       } else {
//         toast.error(error.message);
//       }
//       return;
//     }

//     toast.success('সফলভাবে নিবন্ধন হয়েছে! দয়া করে লগইন করুন।');
//     setActiveTab('login');
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <TopBar />
//       <Header />

//       <main className="py-16">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="max-w-md mx-auto"
//           >
//             <Card className="card-elevated">
//               <CardHeader className="text-center">
//                 <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto mb-4">
//                   بأ
//                 </div>
//                 <CardTitle className="text-2xl">{t('footer.mosqueName')}</CardTitle>
//                 <CardDescription>
//                   {activeTab === 'login' 
//                     ? 'আপনার অ্যাকাউন্টে লগইন করুন' 
//                     : 'নতুন অ্যাকাউন্ট তৈরি করুন'
//                   }
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Tabs value={activeTab} onValueChange={setActiveTab}>
//                   <TabsList className="grid w-full grid-cols-2 mb-6">
//                     <TabsTrigger value="login">{t('nav.login')}</TabsTrigger>
//                     <TabsTrigger value="signup">{t('nav.signup')}</TabsTrigger>
//                   </TabsList>

//                   {/* Login Tab */}
//                   <TabsContent value="login">
//                     <form onSubmit={handleLogin} className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="login-email">{t('auth.email')}</Label>
//                         <div className="relative">
//                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                           <Input
//                             id="login-email"
//                             type="email"
//                             value={loginData.email}
//                             onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
//                             placeholder="example@email.com"
//                             className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
//                           />
//                         </div>
//                         {errors.email && (
//                           <p className="text-sm text-destructive">{errors.email}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="login-password">{t('auth.password')}</Label>
//                         <div className="relative">
//                           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                           <Input
//                             id="login-password"
//                             type="password"
//                             value={loginData.password}
//                             onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
//                             placeholder="••••••••"
//                             className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
//                           />
//                         </div>
//                         {errors.password && (
//                           <p className="text-sm text-destructive">{errors.password}</p>
//                         )}
//                       </div>

//                       <Button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full btn-golden text-white"
//                       >
//                         {isLoading ? (
//                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                         ) : null}
//                         {t('nav.login')}
//                         <ArrowRight className="w-4 h-4 ml-2" />
//                       </Button>
//                     </form>

//                     <p className="text-center text-sm text-muted-foreground mt-4">
//                       {t('auth.noAccount')}{' '}
//                       <button
//                         type="button"
//                         onClick={() => setActiveTab('signup')}
//                         className="text-primary font-medium hover:underline"
//                       >
//                         {t('nav.signup')}
//                       </button>
//                     </p>
//                   </TabsContent>

//                   {/* Signup Tab */}
//                   <TabsContent value="signup">
//                     <form onSubmit={handleSignup} className="space-y-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="signup-name">{t('order.name')}</Label>
//                         <div className="relative">
//                           <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                           <Input
//                             id="signup-name"
//                             type="text"
//                             value={signupData.name}
//                             onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
//                             placeholder="আপনার নাম"
//                             className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
//                           />
//                         </div>
//                         {errors.name && (
//                           <p className="text-sm text-destructive">{errors.name}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="signup-email">{t('auth.email')}</Label>
//                         <div className="relative">
//                           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                           <Input
//                             id="signup-email"
//                             type="email"
//                             value={signupData.email}
//                             onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
//                             placeholder="example@email.com"
//                             className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
//                           />
//                         </div>
//                         {errors.email && (
//                           <p className="text-sm text-destructive">{errors.email}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="signup-password">{t('auth.password')}</Label>
//                         <div className="relative">
//                           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                           <Input
//                             id="signup-password"
//                             type="password"
//                             value={signupData.password}
//                             onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
//                             placeholder="••••••••"
//                             className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
//                           />
//                         </div>
//                         {errors.password && (
//                           <p className="text-sm text-destructive">{errors.password}</p>
//                         )}
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="signup-confirm">{t('auth.confirmPassword')}</Label>
//                         <div className="relative">
//                           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                           <Input
//                             id="signup-confirm"
//                             type="password"
//                             value={signupData.confirmPassword}
//                             onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
//                             placeholder="••••••••"
//                             className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
//                           />
//                         </div>
//                         {errors.confirmPassword && (
//                           <p className="text-sm text-destructive">{errors.confirmPassword}</p>
//                         )}
//                       </div>

//                       <Button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full btn-golden text-white"
//                       >
//                         {isLoading ? (
//                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                         ) : null}
//                         {t('nav.signup')}
//                         <ArrowRight className="w-4 h-4 ml-2" />
//                       </Button>
//                     </form>

//                     <p className="text-center text-sm text-muted-foreground mt-4">
//                       {t('auth.hasAccount')}{' '}
//                       <button
//                         type="button"
//                         onClick={() => setActiveTab('login')}
//                         className="text-primary font-medium hover:underline"
//                       >
//                         {t('nav.login')}
//                       </button>
//                     </p>
//                   </TabsContent>
//                 </Tabs>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }


// ==============================================================





import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('সঠিক ইমেইল দিন'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'পাসওয়ার্ড মিলছে না',
  path: ['confirmPassword'],
});

export default function Auth() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get('login') === 'true';
  
  // Default to signup, only show login if explicitly requested
  const [activeTab, setActiveTab] = useState(isLogin ? 'login' : 'signup');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      loginSchema.parse(loginData);
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

    const { error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    setIsLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('ইমেইল বা পাসওয়ার্ড ভুল হয়েছে');
      } else {
        toast.error(error.message);
      }
      return;
    }

    toast.success('সফলভাবে লগইন হয়েছে!');
    navigate('/');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      signupSchema.parse(signupData);
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

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: signupData.name,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে');
      } else {
        toast.error(error.message);
      }
      return;
    }

    toast.success('সফলভাবে নিবন্ধন হয়েছে! দয়া করে লগইন করুন।');
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <Card className="card-elevated">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto mb-4">
                  بأ
                </div>
                <CardTitle className="text-2xl">{t('footer.mosqueName')}</CardTitle>
                <CardDescription>
                  {activeTab === 'login' 
                    ? 'আপনার অ্যাকাউন্টে লগইন করুন' 
                    : 'নতুন অ্যাকাউন্ট তৈরি করুন'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">{t('nav.login')}</TabsTrigger>
                    <TabsTrigger value="signup">{t('nav.signup')}</TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">{t('auth.email')}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="login-email"
                            type="email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            placeholder="example@email.com"
                            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">{t('auth.password')}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type="password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            placeholder="••••••••"
                            className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.password && (
                          <p className="text-sm text-destructive">{errors.password}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-golden text-white"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        {t('nav.login')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {t('auth.noAccount')}{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className="text-primary font-medium hover:underline"
                      >
                        {t('nav.signup')}
                      </button>
                    </p>
                  </TabsContent>

                  {/* Signup Tab */}
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">{t('order.name')}</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-name"
                            type="text"
                            value={signupData.name}
                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                            placeholder="আপনার নাম"
                            className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">{t('auth.email')}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            placeholder="example@email.com"
                            className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">{t('auth.password')}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            placeholder="••••••••"
                            className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.password && (
                          <p className="text-sm text-destructive">{errors.password}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm">{t('auth.confirmPassword')}</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="signup-confirm"
                            type="password"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full btn-golden text-white"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        {t('nav.signup')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                      {t('auth.hasAccount')}{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-primary font-medium hover:underline"
                      >
                        {t('nav.login')}
                      </button>
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
























// ============================

// import { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import { z } from "zod";
// import { toast } from "sonner";
// import { Loader2, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";

// import { useLanguage } from "@/contexts/LanguageContext";
// import { supabase } from "@/integrations/supabase/client";

// import { TopBar } from "@/components/layout/TopBar";
// import { Header } from "@/components/layout/Header";
// import { Footer } from "@/components/layout/Footer";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";

// /* ================= ENV ================= */
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// /* ================= SCHEMAS ================= */
// const loginSchema = z.object({
//   identifier: z.string().min(5, "ইমেইল বা ফোন নম্বর দিন"),
//   password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর"),
// });

// const signupSchema = z
//   .object({
//     name: z.string().min(2, "নাম দিন"),
//     email: z.string().email("সঠিক ইমেইল দিন"),
//     phone: z.string().regex(/^01[3-9]\d{8}$/, "সঠিক ফোন নম্বর দিন"),
//     password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর"),
//     confirmPassword: z.string(),
//   })
//   .refine((d) => d.password === d.confirmPassword, {
//     message: "পাসওয়ার্ড মিলছে না",
//     path: ["confirmPassword"],
//   });

// /* ================= COMPONENT ================= */
// export default function Auth() {
//   const { t } = useLanguage();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const isLogin = searchParams.get("login") === "true";

//   const [activeTab, setActiveTab] = useState(isLogin ? "login" : "signup");
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   /* ---------- LOGIN ---------- */
//   const [loginData, setLoginData] = useState({
//     identifier: "",
//     password: "",
//   });

//   /* ---------- SIGNUP ---------- */
//   const [signupData, setSignupData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//   });

//   /* ---------- OTP ---------- */
//   const [otp, setOtp] = useState("");
//   const [showOtp, setShowOtp] = useState(false);

//   /* ================= LOGIN HANDLER ================= */
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     try {
//       loginSchema.parse(loginData);
//     } catch (err: any) {
//       const errs: any = {};
//       err.errors.forEach((e: any) => (errs[e.path[0]] = e.message));
//       setErrors(errs);
//       return;
//     }

//     setIsLoading(true);

//     const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(loginData),
//     });

//     const data = await res.json();
//     setIsLoading(false);

//     if (!res.ok) {
//       toast.error(data.message);
//       return;
//     }

//     toast.success("লগইন সফল");
//     navigate("/");
//   };

//   /* ================= SIGNUP (SEND OTP) ================= */
//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     try {
//       signupSchema.parse(signupData);
//     } catch (err: any) {
//       const errs: any = {};
//       err.errors.forEach((e: any) => (errs[e.path[0]] = e.message));
//       setErrors(errs);
//       return;
//     }

//     setIsLoading(true);

//     /* 1️⃣ Supabase OTP */
//     const { error } = await supabase.auth.signUp({
//       email: signupData.email,
//       password: signupData.password,
//       options: {
//         data: { name: signupData.name },
//       },
//     });

//     if (error) {
//       toast.error(error.message);
//       setIsLoading(false);
//       return;
//     }

//     /* 2️⃣ Save to MongoDB (unverified) */
//     await fetch(`${API_BASE_URL}/api/auth/register`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(signupData),
//     });

//     setIsLoading(false);
//     setShowOtp(true);
//     toast.success("OTP ইমেইলে পাঠানো হয়েছে");
//   };

//   /* ================= OTP VERIFY ================= */
//   const handleVerifyOtp = async () => {
//     setIsLoading(true);

//     const { data, error } = await supabase.auth.verifyOtp({
//       email: signupData.email,
//       token: otp,
//       type: "email",
//     });

//     if (error) {
//       toast.error("OTP ভুল");
//       setIsLoading(false);
//       return;
//     }

//     /* Save to Google Sheet */
//     await supabase.functions.invoke("submit-to-sheets", {
//       body: {
//         formType: "signup",
//         data: {
//           name: signupData.name,
//           email: signupData.email,
//           phone: signupData.phone,
//         },
//       },
//     });

//     toast.success("একাউন্ট সফলভাবে তৈরি হয়েছে");
//     navigate("/");
//   };

//   /* ================= GOOGLE LOGIN ================= */
//   const handleGoogleLogin = async () => {
//     await supabase.auth.signInWithOAuth({
//       provider: "google",
//       options: {
//         redirectTo: window.location.origin,
//       },
//     });
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen bg-background">
//       <TopBar />
//       <Header />

//       <main className="py-16">
//         <div className="container mx-auto px-4">
//           <Card className="max-w-md mx-auto">
//             <CardHeader className="text-center">
//               <CardTitle>Baitul Aman Masjid</CardTitle>
//               <CardDescription>
//                 {activeTab === "login" ? "লগইন করুন" : "নতুন একাউন্ট তৈরি করুন"}
//               </CardDescription>
//             </CardHeader>

//             <CardContent>
//               <Tabs value={activeTab} onValueChange={setActiveTab}>
//                 <TabsList className="grid grid-cols-2">
//                   <TabsTrigger value="login">Login</TabsTrigger>
//                   <TabsTrigger value="signup">Sign Up</TabsTrigger>
//                 </TabsList>

//                 {/* LOGIN */}
//                 <TabsContent value="login">
//                   <form onSubmit={handleLogin} className="space-y-4">
//                     <Label>Email / Phone</Label>
//                     <Input
//                       value={loginData.identifier}
//                       onChange={(e) =>
//                         setLoginData({ ...loginData, identifier: e.target.value })
//                       }
//                     />

//                     <Label>Password</Label>
//                     <Input
//                       type="password"
//                       value={loginData.password}
//                       onChange={(e) =>
//                         setLoginData({ ...loginData, password: e.target.value })
//                       }
//                     />

//                     <Button className="w-full" disabled={isLoading}>
//                       {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                       Login
//                     </Button>

//                     <Button
//                       type="button"
//                       variant="outline"
//                       className="w-full"
//                       onClick={handleGoogleLogin}
//                     >
//                       Google দিয়ে Login
//                     </Button>
//                   </form>
//                 </TabsContent>

//                 {/* SIGNUP */}
//                 <TabsContent value="signup">
//                   {!showOtp ? (
//                     <form onSubmit={handleSignup} className="space-y-3">
//                       <Input placeholder="নাম" onChange={(e)=>setSignupData({...signupData,name:e.target.value})}/>
//                       <Input placeholder="ইমেইল" onChange={(e)=>setSignupData({...signupData,email:e.target.value})}/>
//                       <Input placeholder="ফোন" onChange={(e)=>setSignupData({...signupData,phone:e.target.value})}/>
//                       <Input type="password" placeholder="একটি পাসওয়ার্ড নির্বাচন করুন" onChange={(e)=>setSignupData({...signupData,password:e.target.value})}/>
//                       <Input type="password" placeholder="পুনরায় পাসওয়ার্ড লিখুন" onChange={(e)=>setSignupData({...signupData,confirmPassword:e.target.value})}/>
//                       <Button className="w-full">Sign Up</Button>
//                     </form>
//                   ) : (
//                     <div className="space-y-3">
//                       <Input placeholder="OTP দিন" value={otp} onChange={(e)=>setOtp(e.target.value)}/>
//                       <Button onClick={handleVerifyOtp} className="w-full">
//                         Verify OTP
//                       </Button>
//                     </div>
//                   )}
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//           </Card>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
