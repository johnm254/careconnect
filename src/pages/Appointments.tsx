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
import { useRole } from '@/contexts/RoleContext';
import { CalendarPlus, Clock, User, Stethoscope, Search, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { TableSkeleton, CardSkeleton } from '@/components/ui/skeleton-shimmer';
import { useDebounce } from '@/hooks/use-debounce';
import { usePagination, PaginationControls } from '@/components/ui/pagination-controls';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/api';
import { useAppointments, useCreateAppointment, useUpdateAppointment, useDeleteAppointment } from '@/hooks/api/useAppointments';
import { usePatients } from '@/hooks/api/usePatients';
import { useStaffList } from '@/hooks/api/useStaff';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-600 border border-amber-500/30',
  confirmed: 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30',
  completed: 'bg-blue-500/20 text-blue-600 border border-blue-500/30',
  cancelled: 'bg-red-500/20 text-red-600 border border-red-500/30',
  'no-show': 'bg-slate-500/20 text-slate-600 border border-slate-500/30',
};

export default function Appointments() {
  const { currentRole } = useRole();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const [newAppt, setNewAppt] = useState({ patientId: '', doctorId: '', date: '', time: '', reason: '' });

  const { data: patients } = usePatients();
  const { data: staffList } = useStaffList({ role: 'doctor' });
  const doctors = staffList ?? [];

  const { data: appointments, isLoading } = useAppointments({
    doctorId: filterDoctor !== 'all' ? Number(filterDoctor) : undefined,
    status: filterStatus !== 'all' ? filterStatus : undefined,
  });
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  const filteredAppointments = (appointments ?? []).filter((apt) => {
    if (!debouncedSearch) return true;
    const term = debouncedSearch.toLowerCase();
    return (
      apt.patient_name.toLowerCase().includes(term) ||
      apt.doctor_name.toLowerCase().includes(term) ||
      (apt.reason ?? '').toLowerCase().includes(term)
    );
  });

  const canManageAppointments = currentRole === 'admin' || currentRole === 'receptionist' || currentRole === 'doctor' || currentRole === 'nurse';
  const { paginatedItems: paginatedAppointments, currentPage, totalPages, pageSize, totalItems, setCurrentPage, setPageSize } =
    usePagination(filteredAppointments);

  const selectedDateStr = selectedDate?.toISOString().split('T')[0];
  const appointmentsForDate = (appointments ?? []).filter((apt) => apt.scheduled_date === selectedDateStr);

  const handleCreate = async () => {
    if (!newAppt.patientId || !newAppt.doctorId || !newAppt.date || !newAppt.time) {
      toast({ title: 'Missing information', description: 'Patient, doctor, date and time are required.', variant: 'destructive' });
      return;
    }
    try {
      await createAppointment.mutateAsync({
        patientId: Number(newAppt.patientId),
        doctorId: Number(newAppt.doctorId),
        scheduledDate: newAppt.date,
        scheduledTime: newAppt.time,
        reason: newAppt.reason,
      });
      toast({ title: 'Appointment scheduled' });
      setIsAddDialogOpen(false);
      setNewAppt({ patientId: '', doctorId: '', date: '', time: '', reason: '' });
    } catch (err) {
      toast({ title: 'Failed to schedule', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateAppointment.mutateAsync({ id, status });
    } catch (err) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAppointment.mutateAsync(id);
      toast({ title: 'Appointment removed' });
    } catch (err) {
      toast({ title: 'Failed to remove appointment', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-64 rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <TableSkeleton rows={6} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div>
            <TextReveal>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl"><GradientText>Appointments</GradientText></h1>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="text-muted-foreground">Schedule and manage patient appointments</p>
            </TextReveal>
          </div>
          {canManageAppointments && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shadow-lg shadow-brand/20">
                    <CalendarPlus className="h-4 w-4" />
                    Book Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg border-border/50 bg-card/95 backdrop-blur-xl">
                  <DialogHeader><DialogTitle>Schedule New Appointment</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Patient</Label>
                      <Select value={newAppt.patientId} onValueChange={(v) => setNewAppt({ ...newAppt, patientId: v })}>
                        <SelectTrigger className="bg-background/50 border-border/50"><SelectValue placeholder="Select patient" /></SelectTrigger>
                        <SelectContent>
                          {patients?.map((patient) => (
                            <SelectItem key={patient.id} value={String(patient.id)}>
                              {patient.full_name} ({patient.patient_number})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Doctor</Label>
                      <Select value={newAppt.doctorId} onValueChange={(v) => setNewAppt({ ...newAppt, doctorId: v })}>
                        <SelectTrigger className="bg-background/50 border-border/50"><SelectValue placeholder="Select doctor" /></SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={String(doctor.id)}>
                              {doctor.full_name} {doctor.specialization ? `- ${doctor.specialization}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" value={newAppt.date} onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })} className="bg-background/50 border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input type="time" value={newAppt.time} onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })} className="bg-background/50 border-border/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Reason for Visit</Label>
                      <Textarea value={newAppt.reason} onChange={(e) => setNewAppt({ ...newAppt, reason: e.target.value })} placeholder="Describe the reason for this appointment..." className="bg-background/50 border-border/50" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-border/50">Cancel</Button>
                    <Button onClick={handleCreate} disabled={createAppointment.isPending}>
                      {createAppointment.isPending ? 'Scheduling…' : 'Schedule Appointment'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList className="bg-muted/50 border border-border/50 backdrop-blur-sm">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            {/* List View */}
            <TabsContent value="list" className="space-y-4">
              <Spotlight>
                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="flex flex-wrap gap-4 p-4">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search patients, doctors, reasons..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-background/50 border-border/50" />
                    </div>
                    <div className="w-full sm:w-48">
                      <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                        <SelectTrigger className="bg-background/50 border-border/50"><SelectValue placeholder="Filter by doctor" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Doctors</SelectItem>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={String(doctor.id)}>{doctor.full_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full sm:w-48">
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="bg-background/50 border-border/50"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="no-show">No-show</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </Spotlight>

              <Spotlight>
                <Card className="border-0 bg-transparent shadow-none">
                  <CardHeader><CardTitle>All Appointments</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border/50">
                          <TableHead>Patient</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Status</TableHead>
                          {canManageAppointments && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedAppointments.map((apt, index) => (
                          <motion.tr
                            key={apt.id}
                            className="border-border/50 hover:bg-accent/30 transition-colors"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-brand" />
                                {apt.patient_name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Stethoscope className="h-4 w-4 text-brand" />
                                {apt.doctor_name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {apt.scheduled_date} at {apt.scheduled_time}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">{apt.reason ?? 'N/A'}</TableCell>
                            <TableCell>
                              <span className={cn('rounded-lg px-2.5 py-1 text-xs font-semibold', statusColors[apt.status])}>
                                {apt.status}
                              </span>
                            </TableCell>
                            {canManageAppointments && (
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Select value={apt.status} onValueChange={(v) => handleStatusChange(apt.id, v)}>
                                    <SelectTrigger className="w-32 bg-background/50 border-border/50">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="confirmed">Confirm</SelectItem>
                                      <SelectItem value="completed">Complete</SelectItem>
                                      <SelectItem value="cancelled">Cancel</SelectItem>
                                      <SelectItem value="no-show">No-show</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button variant="ghost" size="sm" onClick={() => handleDelete(apt.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                    {paginatedAppointments.length === 0 && (
                      <p className="py-8 text-center text-muted-foreground">No appointments found.</p>
                    )}
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      totalItems={totalItems}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={setPageSize}
                    />
                  </CardContent>
                </Card>
              </Spotlight>
            </TabsContent>

            {/* Calendar View */}
            <TabsContent value="calendar" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Spotlight>
                    <Card className="border-0 bg-transparent shadow-none">
                      <CardContent className="p-4">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-xl pointer-events-auto" />
                      </CardContent>
                    </Card>
                  </Spotlight>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <Spotlight className="h-full">
                    <Card className="border-0 bg-transparent shadow-none h-full">
                      <CardHeader>
                        <CardTitle>
                          Appointments for {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {appointmentsForDate.map((apt, index) => (
                            <motion.div
                              key={apt.id}
                              className="flex flex-col gap-3 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 hover:bg-accent/30 transition-all sm:flex-row sm:items-center sm:justify-between"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              whileHover={{ scale: 1.01, x: 5 }}
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/20 font-bold text-brand border border-brand/30">
                                  {apt.scheduled_time}
                                </div>
                                <div>
                                  <p className="font-semibold">{apt.patient_name}</p>
                                  <p className="text-sm text-muted-foreground">{apt.doctor_name}</p>
                                  <p className="text-xs text-muted-foreground">{apt.reason}</p>
                                </div>
                              </div>
                              <span className={cn('self-start rounded-lg px-2.5 py-1 text-xs font-semibold sm:self-auto', statusColors[apt.status])}>
                                {apt.status}
                              </span>
                            </motion.div>
                          ))}
                          {appointmentsForDate.length === 0 && (
                            <p className="py-8 text-center text-muted-foreground">No appointments for this date</p>
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
