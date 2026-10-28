import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, ArrowLeft, HeartPulse, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/text-reveal';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const PANEL_IMAGE =
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=85';

export default function PatientSignup() {
  const navigate = useNavigate();
  const { setCurrentRole, setIsLoggedIn } = useRole();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!formData.fullName.trim()) next.fullName = 'Full name is required';
    if (!formData.email.trim()) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = 'Invalid email format';
    if (!formData.phone.trim()) next.phone = 'Phone number is required';
    if (!formData.password) next.password = 'Password is required';
    else if (formData.password.length < 8) next.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setCurrentRole('patient');
      setIsLoggedIn(true);
      navigate('/patient/dashboard');
    }
  };

  const fields: { name: keyof typeof formData; label: string; type: string; placeholder: string }[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000' },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'At least 8 characters' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Confirm your password' },
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      <motion.div
        className="fixed right-4 top-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ThemeToggle />
      </motion.div>

      <motion.button
        onClick={() => navigate('/patient/login')}
        className="fixed left-4 top-4 z-50 flex items-center gap-1.5 p-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Back</span>
      </motion.button>

      <FloatingParticles className="z-0 opacity-20" quantity={20} />

      {/* Left Panel — full-bleed photo */}
      <div className="relative hidden min-h-screen w-1/2 lg:block">
        <div className="absolute inset-0">
          <img
            src={PANEL_IMAGE}
            alt="Healthcare"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Stethoscope className="h-7 w-7 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-white">MedCare HMS</span>
          </motion.div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
                Start Your
                <br />
                <GradientText>Health Journey</GradientText>
              </h1>
              <p className="mt-5 text-lg text-white/70 max-w-md">
                Create a free account and book your first consultation in minutes.
              </p>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-col gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[
                'Free to register, no hidden fees',
                'Book appointments in 3 simple steps',
                'Email confirmations & reminders',
              ].map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm text-white/70">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-10 grid grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              {[
                { label: 'Free', desc: 'To Register' },
                { label: '3 Steps', desc: 'To Book' },
                { label: 'Instant', desc: 'Confirmation' },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4">
                  <p className="text-xl font-bold text-primary">{stat.label}</p>
                  <p className="text-xs text-white/60 mt-0.5">{stat.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.p
            className="text-xs text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            © 2025 MedCare HMS. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="relative z-10 flex w-full items-center justify-center p-8 lg:w-1/2">
        {/* Mobile background */}
        <div className="absolute inset-0 z-0 lg:hidden">
          <img src={PANEL_IMAGE} alt="" className="h-full w-full object-cover opacity-10" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md"
        >
          <Card className="border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1 text-center">
              <motion.div
                className="mb-4 flex justify-center lg:hidden"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30">
                  <HeartPulse className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>Join MedCare — it's free</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                {fields.map(({ name, label, type, placeholder }, i) => (
                  <motion.div
                    key={name}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                  >
                    <Label htmlFor={name}>{label}</Label>
                    <Input
                      id={name}
                      name={name}
                      type={type}
                      placeholder={placeholder}
                      value={formData[name]}
                      onChange={handleChange}
                      className={cn(
                        'bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50',
                        errors[name] && 'border-destructive'
                      )}
                    />
                    {errors[name] && (
                      <p className="text-xs text-destructive">{errors[name]}</p>
                    )}
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  className="pt-2"
                >
                  <Button type="submit" className="w-full relative overflow-hidden group" size="lg">
                    <span className="relative z-10">Create Account</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/20 to-primary/0"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                  className="text-center text-sm text-muted-foreground"
                >
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/patient/login')}
                    className="text-primary hover:underline font-semibold"
                  >
                    Sign in
                  </button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
