import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/RoleContext';
import { mockDashboardStats, weeklyAppointmentsData, recentActivity, mockAppointments } from '@/data/mockData';
import { Users, Calendar, Receipt, Bed, UserPlus, CalendarPlus, Activity, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d';

const statCards = [
  { label: 'Total Patients', value: mockDashboardStats.totalPatients, icon: Users, gradient: 'from-blue-500/20 to-blue-600/5' },
  { label: "Today's Appointments", value: mockDashboardStats.todayAppointments, icon: Calendar, gradient: 'from-emerald-500/20 to-emerald-600/5' },
  { label: 'Pending Bills', value: mockDashboardStats.pendingBills, icon: Receipt, gradient: 'from-amber-500/20 to-amber-600/5' },
  { label: 'Available Beds', value: mockDashboardStats.availableBeds, icon: Bed, gradient: 'from-violet-500/20 to-violet-600/5' },
];

const activityIcons: Record<string, typeof Activity> = {
  patient: Users,
  appointment: Calendar,
  billing: Receipt,
};

export default function Dashboard() {
  const { currentRole } = useRole();
  const navigate = useNavigate();

  const todayAppointments = mockAppointments.filter(apt => apt.date === '2025-01-30');

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <TextReveal>
              <h1 className="text-3xl font-bold tracking-tight">
                <GradientText>Dashboard</GradientText>
              </h1>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
            </TextReveal>
          </div>
          <motion.div 
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {(currentRole === 'admin' || currentRole === 'receptionist') && (
              <>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={() => navigate('/patients')} variant="outline" className="gap-2 border-border/50 backdrop-blur-sm">
                    <UserPlus className="h-4 w-4" />
                    Add Patient
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={() => navigate('/appointments')} className="gap-2 shadow-lg shadow-primary/20">
                    <CalendarPlus className="h-4 w-4" />
                    New Appointment
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <CardContainer containerClassName="w-full">
                  <CardBody className="w-full">
                    <Spotlight className="w-full p-0">
                      <Card className="border-0 bg-transparent shadow-none">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <CardItem translateZ={30}>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                                <p className="text-4xl font-bold mt-1">{stat.value}</p>
                              </div>
                            </CardItem>
                            <CardItem translateZ={50}>
                              <motion.div 
                                className={`rounded-2xl p-4 bg-gradient-to-br ${stat.gradient} border border-border/30 backdrop-blur-sm`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Icon className="h-7 w-7 text-primary" />
                              </motion.div>
                            </CardItem>
                          </div>
                        </CardContent>
                      </Card>
                    </Spotlight>
                  </CardBody>
                </CardContainer>
              </motion.div>
            );
          })}
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Appointments Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Spotlight className="h-full">
              <Card className="border-0 bg-transparent shadow-none h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      className="p-2 rounded-lg bg-primary/10"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Activity className="h-5 w-5 text-primary" />
                    </motion.div>
                    Weekly Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyAppointmentsData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
                        }}
                      />
                      <Bar dataKey="appointments" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Spotlight>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Spotlight className="h-full">
              <Card className="border-0 bg-transparent shadow-none h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div
                      className="p-2 rounded-lg bg-primary/10"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Clock className="h-5 w-5 text-primary" />
                    </motion.div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => {
                      const Icon = activityIcons[activity.type] || Activity;
                      return (
                        <motion.div 
                          key={activity.id} 
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <motion.div 
                            className="rounded-xl bg-primary/10 p-2.5"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <Icon className="h-4 w-4 text-primary" />
                          </motion.div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.message}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </Spotlight>
          </motion.div>
        </div>

        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    className="p-2 rounded-lg bg-primary/10"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Calendar className="h-5 w-5 text-primary" />
                  </motion.div>
                  Today's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayAppointments.length === 0 ? (
                    <motion.p 
                      className="text-center text-muted-foreground py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      No appointments scheduled for today
                    </motion.p>
                  ) : (
                    todayAppointments.map((apt, index) => (
                      <motion.div
                        key={apt.id}
                        className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 hover:bg-accent/30 transition-all"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ scale: 1.01, x: 5 }}
                      >
                        <div className="flex items-center gap-4">
                          <motion.div 
                            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {apt.time.split(':')[0]}
                          </motion.div>
                          <div>
                            <p className="font-semibold">{apt.patientName}</p>
                            <p className="text-sm text-muted-foreground">{apt.doctorName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{apt.time}</p>
                          <motion.span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                              apt.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
                                : apt.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-600 border border-amber-500/30'
                                : apt.status === 'completed'
                                ? 'bg-blue-500/20 text-blue-600 border border-blue-500/30'
                                : 'bg-red-500/20 text-red-600 border border-red-500/30'
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {apt.status}
                          </motion.span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </Spotlight>
        </motion.div>
      </div>
    </Layout>
  );
}
