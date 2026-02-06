import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { mockAppointments, mockPatients, mockStaff } from '@/data/mockData';
import { useRole } from '@/contexts/RoleContext';
import { CalendarPlus, Clock, User, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';

const statusColors = {
  pending: 'bg-amber-500/20 text-amber-600 border border-amber-500/30',
  confirmed: 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30',
  completed: 'bg-blue-500/20 text-blue-600 border border-blue-500/30',
  cancelled: 'bg-red-500/20 text-red-600 border border-red-500/30',
};

export default function Appointments() {
  const { currentRole } = useRole();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const doctors = mockStaff.filter((s) => s.role === 'doctor');

  const filteredAppointments = mockAppointments.filter((apt) => {
    const doctorMatch = filterDoctor === 'all' || apt.doctorId === filterDoctor;
    const statusMatch = filterStatus === 'all' || apt.status === filterStatus;
    return doctorMatch && statusMatch;
  });

  const canManageAppointments = currentRole === 'admin' || currentRole === 'receptionist';

  return (
    <Layout>
      <div className="space-y-6">
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
                <GradientText>Appointments</GradientText>
              </h1>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="text-muted-foreground">Schedule and manage patient appointments</p>
            </TextReveal>
          </div>
          {canManageAppointments && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                      <CalendarPlus className="h-4 w-4" />
                      Book Appointment
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-lg border-border/50 bg-card/95 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle>Schedule New Appointment</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Patient</Label>
                      <Select>
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPatients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name} ({patient.id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Doctor</Label>
                      <Select>
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" className="bg-background/50 border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input type="time" className="bg-background/50 border-border/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Reason for Visit</Label>
                      <Textarea placeholder="Describe the reason for this appointment..." className="bg-background/50 border-border/50" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-border/50">Cancel</Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Schedule Appointment</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList className="bg-muted/50 border border-border/50 backdrop-blur-sm">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            {/* List View */}
            <TabsContent value="list" className="space-y-4">
              {/* Filters */}
              <Spotlight>
                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48">
                      <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Filter by doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Doctors</SelectItem>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-48">
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </Spotlight>

              {/* Appointments Table */}
              <Spotlight>
                <Card className="border-0 bg-transparent shadow-none">
                  <CardHeader>
                    <CardTitle>All Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50">
                          <TableHead>ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Status</TableHead>
                          {canManageAppointments && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAppointments.map((apt, index) => (
                          <motion.tr
                            key={apt.id}
                            className="border-border/50 hover:bg-accent/30 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                          >
                            <TableCell className="font-medium">{apt.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                {apt.patientName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-primary" />
                                {apt.doctorName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {apt.date} at {apt.time}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">{apt.reason}</TableCell>
                            <TableCell>
                              <span className={cn('rounded-lg px-2.5 py-1 text-xs font-semibold', statusColors[apt.status])}>
                                {apt.status}
                              </span>
                            </TableCell>
                            {canManageAppointments && (
                              <TableCell className="text-right">
                                <Select defaultValue={apt.status}>
                                  <SelectTrigger className="w-32 bg-background/50 border-border/50">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirm</SelectItem>
                                    <SelectItem value="completed">Complete</SelectItem>
                                    <SelectItem value="cancelled">Cancel</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            )}
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </Spotlight>
            </TabsContent>

            {/* Calendar View */}
            <TabsContent value="calendar" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Spotlight>
                    <Card className="border-0 bg-transparent shadow-none">
                      <CardContent className="p-4">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="rounded-xl pointer-events-auto"
                        />
                      </CardContent>
                    </Card>
                  </Spotlight>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Spotlight className="h-full">
                    <Card className="border-0 bg-transparent shadow-none h-full">
                      <CardHeader>
                        <CardTitle>
                          Appointments for {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockAppointments
                            .filter((apt) => apt.date === selectedDate?.toISOString().split('T')[0])
                            .map((apt, index) => (
                              <motion.div 
                                key={apt.id} 
                                className="flex items-center justify-between rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 hover:bg-accent/30 transition-all"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                whileHover={{ scale: 1.01, x: 5 }}
                              >
                                <div className="flex items-center gap-4">
                                  <motion.div 
                                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 font-bold text-primary border border-primary/30"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                  >
                                    {apt.time}
                                  </motion.div>
                                  <div>
                                    <p className="font-semibold">{apt.patientName}</p>
                                    <p className="text-sm text-muted-foreground">{apt.doctorName}</p>
                                    <p className="text-xs text-muted-foreground">{apt.reason}</p>
                                  </div>
                                </div>
                                <span className={cn('rounded-lg px-2.5 py-1 text-xs font-semibold', statusColors[apt.status])}>
                                  {apt.status}
                                </span>
                              </motion.div>
                            ))}
                          {mockAppointments.filter((apt) => apt.date === selectedDate?.toISOString().split('T')[0]).length === 0 && (
                            <motion.p 
                              className="py-8 text-center text-muted-foreground"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              No appointments for this date
                            </motion.p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Spotlight>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}
