import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Stethoscope, User, Lock, Calendar, Clock, Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { GradientText } from '@/components/ui/text-reveal';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=85';

const PATIENT_IMAGE =
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80';

const STAFF_IMAGE =
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      <motion.div
        className="fixed right-4 top-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ThemeToggle />
      </motion.div>
      <FloatingParticles className="z-0 opacity-30" quantity={20} />

      {/* ─── Left: Hero Image Panel ─────────────────────────────── */}
      <div className="relative hidden min-h-screen w-1/2 lg:block">
        {/* Photo */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Modern hospital"
            className="h-full w-full object-cover"
          />
          {/* Dark overlay — theme-independent so photo always shows through */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
        </div>

        {/* Content on top of image */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
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

          {/* Headline */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
                World-Class Care,
                <br />
                <GradientText>At Your Fingertips</GradientText>
              </h1>
              <p className="mt-5 text-lg text-white/70 max-w-md leading-relaxed">
                Book consultations, manage appointments, and access expert medical care — all in one place.
              </p>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {[
                'Instant appointment booking',
                'Real-time confirmation',
                '500+ specialist doctors',
              ].map((item, i) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm text-white/70">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              className="mt-10 grid grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { label: '10k+', desc: 'Patients Served' },
                { label: '500+', desc: 'Specialists' },
                { label: '99.9%', desc: 'Uptime' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <p className="text-2xl font-bold text-primary">{s.label}</p>
                  <p className="text-xs text-white/60 mt-0.5">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.p
            className="text-xs text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            © 2025 MedCare HMS. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* ─── Right: Portal Selection ─────────────────────────────── */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center p-6 lg:w-1/2 lg:p-12">
        {/* Mobile logo */}
        <motion.div
          className="mb-8 flex items-center gap-3 lg:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold">MedCare HMS</span>
        </motion.div>

        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
            How are you accessing
            <br />
            <GradientText>MedCare today?</GradientText>
          </h2>
        </motion.div>

        <div className="flex w-full max-w-sm flex-col gap-4">
          {/* Patient Portal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="cursor-pointer"
            onClick={() => navigate('/patient/login')}
          >
            <div className="group relative overflow-hidden rounded-2xl border-2 border-border/50 bg-card shadow-lg hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              {/* Image strip */}
              <div className="relative h-28 overflow-hidden">
                <img
                  src={PATIENT_IMAGE}
                  alt="Patient care"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card" />
                <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/90 backdrop-blur-sm shadow-lg">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Patient Portal</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Sign in or register to book consultations
                    </p>
                  </div>
                  <motion.div
                    className="mt-1 shrink-0"
                    animate={{ x: 0 }}
                    whileHover={{ x: 3 }}
                  >
                    <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </div>

                <div className="mt-3 flex gap-2">
                  {[
                    { icon: Calendar, text: 'Book appointments' },
                    { icon: Clock, text: 'View history' },
                  ].map(({ icon: Icon, text }) => (
                    <span
                      key={text}
                      className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      <Icon className="h-3 w-3" />
                      {text}
                    </span>
                  ))}
                </div>

                <Button className="mt-4 w-full gap-2" size="default">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Staff Portal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="cursor-pointer"
            onClick={() => navigate('/staff/login')}
          >
            <div className="group relative overflow-hidden rounded-2xl border-2 border-border/50 bg-card shadow-lg hover:border-border hover:shadow-xl transition-all duration-300">
              {/* Image strip */}
              <div className="relative h-24 overflow-hidden">
                <img
                  src={STAFF_IMAGE}
                  alt="Medical team"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card" />
                <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-muted/80 backdrop-blur-sm border border-border/50 shadow-lg">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="p-5 pt-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Staff Portal</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Doctors, nurses & administrators
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  {[
                    { icon: Stethoscope, text: 'Clinical staff' },
                    { icon: Shield, text: 'Admin' },
                  ].map(({ icon: Icon, text }) => (
                    <span
                      key={text}
                      className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                    >
                      <Icon className="h-3 w-3" />
                      {text}
                    </span>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full gap-2 border-border/60 hover:border-border"
                  size="default"
                >
                  Staff Login
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.p
          className="mt-6 text-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          © 2025 MedCare HMS · All rights reserved
        </motion.p>
      </div>
    </div>
  );
}
