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
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Spotlight } from '@/components/ui/spotlight';
import { GradientOrb } from '@/components/ui/animated-gradient';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const roles: { role: UserRole; label: string; description: string; icon: typeof Shield }[] = [
  { role: 'admin', label: 'Administrator', description: 'Full system access', icon: Shield },
  { role: 'doctor', label: 'Doctor', description: 'Patient care & records', icon: Heart },
  { role: 'nurse', label: 'Nurse', description: 'Patient assistance', icon: UserCog },
  { role: 'receptionist', label: 'Receptionist', description: 'Scheduling & billing', icon: ClipboardList },
];

export default function Signup() {
  const navigate = useNavigate();
  const { setCurrentRole, setIsLoggedIn } = useRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentRole(selectedRole);
      setIsLoggedIn(true);
      navigate('/dashboard');
    }
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

      {/* Back Button - Fixed Top Left */}
      <motion.button
        onClick={() => navigate('/')}
        className="fixed left-4 top-4 z-50 p-2 rounded-lg hover:bg-accent transition-colors"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ArrowLeft className="h-5 w-5" />
      </motion.button>

      {/* Background Effects */}
      <div className="absolute inset-0">
        <GradientOrb className="left-1/4 top-1/4" />
        <GradientOrb className="right-1/4 bottom-1/4 bg-primary/10" />
      </div>
      <FloatingParticles className="z-0" quantity={30} />
      
      {/* Left Panel - Branding */}
      <div className="relative hidden w-1/2 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <BackgroundBeams className="z-0" />
        
        {/* Splash Image */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img 
            src="/auth-splash.svg" 
            alt="Medical splash" 
            className="w-3/4 h-3/4 object-contain opacity-30"
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center gap-3"
        >
          <motion.div 
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Stethoscope className="h-8 w-8 text-primary" />
          </motion.div>
          <span className="text-2xl font-bold text-foreground">MedCare HMS</span>
        </motion.div>
        
        <div className="relative z-10">
          <TextReveal delay={0.2}>
            <h1 className="text-5xl font-bold leading-tight text-foreground">
              Join Our
              <br />
              <GradientText>Healthcare Team</GradientText>
            </h1>
          </TextReveal>
          <TextReveal delay={0.4}>
            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              Create your account and start managing patient care efficiently with our modern healthcare management system.
            </p>
          </TextReveal>
          
          <motion.div 
            className="mt-8 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {[
              { label: '10k+', desc: 'Patients Served' },
              { label: '500+', desc: 'Doctors' },
              { label: '99.9%', desc: 'Uptime' },
            ].map((stat, i) => (
              <Spotlight key={i} className="p-4">
                <p className="text-2xl font-bold text-primary">{stat.label}</p>
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
          © 2025 MedCare HMS. All rights reserved.
        </motion.p>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="relative z-10 flex w-full items-center justify-center p-8 lg:w-1/2">
        {/* Mobile Splash Image */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center z-0 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src="/auth-splash.svg" 
            alt="Medical splash" 
            className="w-2/3 h-auto object-contain opacity-20"
          />
        </motion.div>

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
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>Join the healthcare revolution</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={cn(
                      'bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50',
                      errors.fullName && 'border-destructive'
                    )}
                  />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                </motion.div>

                {/* Email */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@hospital.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={cn(
                      'bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50',
                      errors.email && 'border-destructive'
                    )}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </motion.div>

                {/* Role Selection */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label>Select Role</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map(({ role, label, icon: Icon }, index) => (
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
                          'relative flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-center transition-all overflow-hidden',
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
                        <Icon className={cn('h-4 w-4 relative z-10', selectedRole === role ? 'text-primary' : 'text-muted-foreground')} />
                        <span className={cn('text-xs font-semibold relative z-10', selectedRole === role && 'text-primary')}>{label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={cn(
                      'bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50',
                      errors.password && 'border-destructive'
                    )}
                  />
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </motion.div>

                {/* Confirm Password */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={cn(
                      'bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50',
                      errors.confirmPassword && 'border-destructive'
                    )}
                  />
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="pt-2"
                >
                  <Button 
                    type="submit" 
                    className="w-full relative overflow-hidden group" 
                    size="lg"
                  >
                    <span className="relative z-10">Create Account</span>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/20 to-primary/0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </Button>
                </motion.div>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Already have an account?</span>
                  </div>
                </div>

                {/* Sign In Link */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-border/50 hover:border-primary/50 hover:bg-primary/5"
                    size="lg"
                    onClick={() => navigate('/')}
                  >
                    Sign In Instead
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
