import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { UserRole } from '@/types/hospital';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, Shield, UserCog, Heart, ClipboardList, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { GradientText } from '@/components/ui/text-reveal';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const PANEL_IMAGE =
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=85';

const roles: { role: UserRole; label: string; description: string; icon: typeof Shield }[] = [
  { role: 'admin', label: 'Administrator', description: 'Full system access', icon: Shield },
  { role: 'doctor', label: 'Doctor', description: 'Patient care & records', icon: Heart },
  { role: 'nurse', label: 'Nurse', description: 'Patient assistance', icon: UserCog },
  { role: 'receptionist', label: 'Receptionist', description: 'Scheduling & billing', icon: ClipboardList },
];

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentRole, setIsLoggedIn } = useRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole(selectedRole);
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* Theme Toggle - Fixed Top Right */}
      <motion.div
        className="fixed right-4 top-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ThemeToggle />
      </motion.div>

      {/* Back to Landing */}
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
            alt="Medical professional"
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
                Hospital Management
                <br />
                <GradientText>Made Simple</GradientText>
              </h1>
              <p className="mt-5 text-lg text-white/70 max-w-md">
                Streamline patient care, appointments, and billing with our modern healthcare management system.
              </p>
            </motion.div>

            <motion.div
              className="mt-10 grid grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { label: '10k+', desc: 'Patients Served' },
                { label: '500+', desc: 'Doctors' },
                { label: '99.9%', desc: 'Uptime' },
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
            transition={{ delay: 0.8 }}
          >
            © 2025 MedCare HMS. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
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
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>Select your role and sign in to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <Label>Select Role</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {roles.map(({ role, label, description, icon: Icon }, index) => (
                      <motion.button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'relative flex flex-col items-start gap-1 rounded-xl border-2 p-4 text-left transition-all overflow-hidden',
                          selectedRole === role
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                            : 'border-border/50 hover:border-primary/50 hover:bg-accent/50'
                        )}
                      >
                        {selectedRole === role && (
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"
                            layoutId="selectedRole"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-2">
                          <Icon className={cn('h-5 w-5', selectedRole === role ? 'text-primary' : 'text-muted-foreground')} />
                          <span className={cn('text-sm font-semibold', selectedRole === role && 'text-primary')}>{label}</span>
                        </div>
                        <span className="relative z-10 text-xs text-muted-foreground">{description}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

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
                    className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
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
                    className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
                  />
                </motion.div>

                {/* Demo Notice */}
                <motion.p
                  className="text-center text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  This is a demo. Enter any credentials to continue.
                </motion.p>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    type="submit"
                    className="w-full relative overflow-hidden group"
                    size="lg"
                  >
                    <span className="relative z-10">Sign In</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/20 to-primary/0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </Button>
                </motion.div>

                {/* Contact Admin Note */}
                <motion.p
                  className="text-center text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Need access? Contact your administrator.
                </motion.p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
