import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, ArrowLeft, HeartPulse, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/text-reveal';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const PANEL_IMAGE =
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85';

export default function PatientLogin() {
  const navigate = useNavigate();
  const { setCurrentRole, setIsLoggedIn } = useRole();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole('patient');
    setIsLoggedIn(true);
    navigate('/patient/dashboard');
  };

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
        onClick={() => navigate('/')}
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
            alt="Doctor consultation"
            className="h-full w-full object-cover object-center"
          />
          {/* Dark overlay — photo visible in both light and dark mode */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
        </div>

        {/* Content */}
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
                Your Health,
                <br />
                <GradientText>Our Priority</GradientText>
              </h1>
              <p className="mt-5 text-lg text-white/70 max-w-md">
                Book consultations, track appointments, and stay connected with your care team.
              </p>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-col gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[
                'Instant appointment booking',
                'Same-day confirmations',
                'Your full health history in one place',
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
                { label: '10k+', desc: 'Patients' },
                { label: '50+', desc: 'Specializations' },
                { label: 'Same Day', desc: 'Bookings' },
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
              <CardTitle className="text-2xl font-bold">Patient Sign In</CardTitle>
              <CardDescription>Welcome back — sign in to manage your care</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
                  />
                </motion.div>

                <motion.p
                  className="text-center text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  This is a demo. Enter any credentials to continue.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button type="submit" className="w-full relative overflow-hidden group" size="lg">
                    <span className="relative z-10">Sign In</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/20 to-primary/0"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
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
                  transition={{ delay: 0.8 }}
                  className="text-center text-sm text-muted-foreground"
                >
                  New to MedCare?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/patient/signup')}
                    className="text-primary hover:underline font-semibold"
                  >
                    Create an account
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
