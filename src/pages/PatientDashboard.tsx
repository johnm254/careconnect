import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, CalendarPlus, Calendar, Clock, LogOut, HeartPulse, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientOrb } from '@/components/ui/animated-gradient';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { GradientText } from '@/components/ui/text-reveal';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

const mockAppointments = [
  {
    id: '1',
    doctorName: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    department: 'Cardiology',
    date: '2026-11-05',
    time: '10:00',
    status: 'confirmed' as const,
  },
  {
    id: '2',
    doctorName: 'Dr. Michael Chen',
    specialization: 'General Practitioner',
    department: 'General Medicine',
    date: '2026-11-15',
    time: '14:30',
    status: 'pending' as const,
  },
  {
    id: '3',
    doctorName: 'Dr. Aisha Patel',
    specialization: 'Pediatrician',
    department: 'Pediatrics',
    date: '2026-10-10',
    time: '09:30',
    status: 'completed' as const,
  },
];

const statusConfig = {
  confirmed: { label: 'Confirmed', className: 'bg-green-500/15 text-green-600 border-green-500/30' },
  pending: { label: 'Pending', className: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30' },
  completed: { label: 'Completed', className: 'bg-muted text-muted-foreground border-border' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setCurrentRole } = useRole();

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setCurrentRole('admin');
    navigate('/');
  };

  const upcoming = mockAppointments.filter((a) => a.status !== 'completed' && a.status !== 'cancelled');
  const past = mockAppointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <GradientOrb className="left-1/4 top-0 opacity-50" />
        <GradientOrb className="right-1/4 bottom-0 bg-primary/5 opacity-50" />
      </div>
      <FloatingParticles className="z-0" quantity={20} />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">MedCare HMS</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, <GradientText>Patient</GradientText>
              </h1>
              <p className="text-sm text-muted-foreground">Manage your health appointments</p>
            </div>
          </div>
        </motion.div>

        {/* Book Consultation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="cursor-pointer"
          onClick={() => navigate('/book-consultation')}
        >
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-xl shadow-xl hover:border-primary/50 hover:shadow-primary/10 transition-all">
            <CardContent className="flex flex-col sm:flex-row items-center gap-6 p-8">
              <motion.div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/20 border border-primary/30"
                whileHover={{ rotate: 10, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <HeartPulse className="h-10 w-10 text-primary" />
              </motion.div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground">Book a Consultation</h2>
                <p className="mt-1 text-muted-foreground">
                  Choose a doctor, pick a time, and get care — in just 3 steps.
                </p>
              </div>
              <Button size="lg" className="shrink-0 gap-2">
                <CalendarPlus className="h-5 w-5" />
                Book Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Appointments */}
        {upcoming.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Appointments
            </h2>
            <div className="space-y-3">
              {upcoming.map((appt, i) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <Card className="border border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-all">
                    <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 border border-primary/20">
                        <Stethoscope className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{appt.doctorName}</p>
                        <p className="text-sm text-muted-foreground">{appt.specialization} · {appt.department}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(appt.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {appt.time}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn('text-xs', statusConfig[appt.status].className)}
                        >
                          {statusConfig[appt.status].label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Past Appointments */}
        {past.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Past Appointments
            </h2>
            <div className="space-y-3">
              {past.map((appt, i) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.08 }}
                >
                  <Card className="border border-border/30 bg-card/50 backdrop-blur-sm opacity-75">
                    <CardContent className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted/50 border border-border/50">
                        <Stethoscope className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{appt.doctorName}</p>
                        <p className="text-sm text-muted-foreground">{appt.specialization} · {appt.department}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(appt.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {appt.time}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn('text-xs', statusConfig[appt.status].className)}
                        >
                          {statusConfig[appt.status].label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
