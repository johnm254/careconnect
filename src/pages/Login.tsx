import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Spotlight } from '@/components/ui/spotlight';
import { GradientOrb } from '@/components/ui/animated-gradient';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const { loginStaff } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await loginStaff(email, password);
      navigate('/dashboard');
    } catch (err) {
      toast({
        title: 'Login failed',
        description: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <GradientOrb className="left-1/4 top-1/4" />
        <GradientOrb className="right-1/4 bottom-1/4 bg-brand/10" />
      </div>
      <FloatingParticles className="z-0" quantity={30} />
      
      {/* Left Panel - Branding */}
      <div className="relative hidden w-1/2 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <BackgroundBeams className="z-0" />
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Logo className="h-14 w-14" />
          </motion.div>
          <span className="text-2xl font-bold text-foreground">La-tullah Medical Centre</span>
        </motion.div>
        
        <div className="relative z-10">
          <TextReveal delay={0.2}>
            <h1 className="text-5xl font-bold leading-tight text-foreground">
              Staff Portal
              <br />
              <GradientText>La-tullah Medical Centre</GradientText>
            </h1>
          </TextReveal>
          <TextReveal delay={0.4}>
            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              Manage patients, appointments, and hospital operations along Mikindani Main Road, Mombasa.
            </p>
          </TextReveal>

          <motion.div
            className="mt-8 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {[
              { label: 'Mombasa', desc: 'Mikindani, Kenya' },
              { label: '0722 872147', desc: 'Reception Line' },
            ].map((stat, i) => (
              <Spotlight key={i} className="p-4">
                <p className="text-lg font-bold text-brand">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </Spotlight>
            ))}
          </motion.div>
        </div>

        <motion.p
          className="relative z-10 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          © 2026 La-tullah Medical Centre. All rights reserved.
        </motion.p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="relative z-10 flex w-full items-center justify-center p-4 sm:p-8 lg:w-1/2">
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
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Logo className="h-14 w-14" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>Sign in with your staff account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-brand/50"
                  />
                </motion.div>

                {/* Password */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-brand/50"
                  />
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    type="submit"
                    className="w-full relative overflow-hidden group"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <span className="relative z-10">{isSubmitting ? 'Signing in…' : 'Sign In'}</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-brand/0 via-primary-foreground/20 to-brand/0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </Button>
                </motion.div>
                 
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>
                 
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-border/50 hover:border-brand/50 hover:bg-brand/5"
                    size="lg"
                    onClick={() => navigate('/book-consultation')}
                  >
                    Book a Consultation
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
