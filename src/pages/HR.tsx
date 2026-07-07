import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, CalendarOff, Clock, Search, Plus, UserCheck, Building, Mail, Phone, CheckCircle, XCircle } from 'lucide-react';
import { useStaffList, ApiStaff } from '@/hooks/api/useStaff';
import { useDepartments } from '@/hooks/api/useDepartments';
import { useLeaveRequests, useCreateLeaveRequest, useUpdateLeaveRequest, useAttendance, ApiLeaveRequest, ApiAttendanceRecord } from '@/hooks/api/useHR';
import { PayrollSection } from '@/components/hr/PayrollSection';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/api';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d';
import { CardSkeleton, TableSkeleton } from '@/components/ui/skeleton-shimmer';

const emptyLeaveForm = { staffId: '', leaveType: 'vacation', startDate: '', endDate: '', reason: '' };

export default function HR() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<ApiStaff | null>(null);
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [leaveForm, setLeaveForm] = useState(emptyLeaveForm);

  const { data: staff, isLoading: staffLoading } = useStaffList();
  const { data: departments } = useDepartments();
  const { data: leaveRequests, isLoading: leaveLoading } = useLeaveRequests();
  const { data: attendanceRecords, isLoading: attendanceLoading } = useAttendance(new Date().toISOString().slice(0, 10));
  const createLeave = useCreateLeaveRequest();
  const updateLeave = useUpdateLeaveRequest();

  const activeStaff = (staff ?? []).filter((s) => s.employment_status !== 'terminated');

  const filteredEmployees = activeStaff.filter((employee) => {
    const matchesSearch =
      employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.specialization ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || String(employee.department_id) === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const pendingLeaves = (leaveRequests ?? []).filter((l) => l.status === 'pending').length;
  const presentToday = (attendanceRecords ?? []).filter((a) => a.status === 'present').length;
  const onLeaveToday = activeStaff.filter((e) => e.employment_status === 'on-leave').length;

  const handleLeaveAction = async (leaveId: number, status: 'approved' | 'rejected') => {
    try {
      await updateLeave.mutateAsync({ id: leaveId, status });
      toast({ title: `Leave request ${status}` });
    } catch {
      toast({ title: 'Failed to update leave request', variant: 'destructive' });
    }
  };

  const handleCreateLeave = async () => {
    if (!leaveForm.staffId || !leaveForm.startDate || !leaveForm.endDate) {
      toast({ title: 'Missing information', description: 'Employee, start date, and end date are required.', variant: 'destructive' });
      return;
    }
    try {
      await createLeave.mutateAsync({
        staffId: Number(leaveForm.staffId),
        leaveType: leaveForm.leaveType,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason: leaveForm.reason,
      });
      toast({ title: 'Leave request submitted' });
      setIsAddLeaveOpen(false);
      setLeaveForm(emptyLeaveForm);
    } catch (err) {
      toast({ title: 'Failed to submit request', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: ApiStaff['employment_status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/20 dark:text-green-400">Active</Badge>;
      case 'on-leave':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-500/20 dark:text-yellow-400">On Leave</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400">Terminated</Badge>;
    }
  };

  const getLeaveStatusBadge = (status: ApiLeaveRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-500/20 dark:text-yellow-400">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/20 dark:text-green-400">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400">Rejected</Badge>;
    }
  };

  const getAttendanceStatusBadge = (status: ApiAttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/20 dark:text-green-400">Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400">Absent</Badge>;
      case 'late':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-500/20 dark:text-orange-400">Late</Badge>;
      case 'half-day':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/20 dark:text-blue-400">Half Day</Badge>;
    }
  };

  const leaveTypeColors: Record<string, string> = {
    vacation: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    sick: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    personal: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
    maternity: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400',
  };

  if (staffLoading || leaveLoading || attendanceLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-64 rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
          <TableSkeleton rows={5} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <TextReveal>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl"><GradientText>HR Management</GradientText></h1>
          </TextReveal>
          <TextReveal delay={0.1}>
            <p className="text-muted-foreground">Manage employees, leave requests, and attendance</p>
          </TextReveal>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[
            { label: 'Total Employees', value: activeStaff.length, sub: `${activeStaff.filter((e) => e.employment_status === 'active').length} active`, icon: Users, gradient: 'from-blue-500/20 to-blue-600/5' },
            { label: 'Present Today', value: presentToday, sub: 'Clocked in', icon: UserCheck, gradient: 'from-emerald-500/20 to-emerald-600/5' },
            { label: 'On Leave', value: onLeaveToday, sub: 'Today', icon: CalendarOff, gradient: 'from-amber-500/20 to-amber-600/5' },
            { label: 'Pending Requests', value: pendingLeaves, sub: 'Leave requests', icon: Clock, gradient: 'from-violet-500/20 to-violet-600/5' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }}>
                <CardContainer containerClassName="w-full">
                  <CardBody className="w-full">
                    <Spotlight className="w-full p-0">
                      <Card className="border-0 bg-transparent shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                          <CardItem translateZ={30}>
                            <div className={`rounded-xl p-2 bg-gradient-to-br ${stat.gradient} border border-border/30 backdrop-blur-sm`}>
                              <Icon className="h-4 w-4 text-brand" />
                            </div>
                          </CardItem>
                        </CardHeader>
                        <CardContent>
                          <CardItem translateZ={20}>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.sub}</p>
                          </CardItem>
                        </CardContent>
                      </Card>
                    </Spotlight>
                  </CardBody>
                </CardContainer>
              </motion.div>
            );
          })}
        </div>

        <Tabs defaultValue="employees" className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList>
              <TabsTrigger value="employees">Employee Records</TabsTrigger>
              <TabsTrigger value="leave">Leave Management</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="payroll">Payroll</TabsTrigger>
            </TabsList>
          </div>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Employee Directory</CardTitle>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search employees..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 sm:w-[250px]" />
                    </div>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="All Departments" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments?.map((dept) => (
                          <SelectItem key={dept.id} value={String(dept.id)}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Contract</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Hire Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
                              <span className="text-sm font-medium text-brand">{employee.full_name.split(' ').map((n) => n[0]).join('')}</span>
                            </div>
                            <div>
                              <div className="font-medium">{employee.full_name}</div>
                              <div className="text-sm text-muted-foreground">{employee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{employee.role}{employee.specialization ? ` (${employee.specialization})` : ''}</TableCell>
                        <TableCell>{departments?.find((d) => d.id === employee.department_id)?.name ?? 'N/A'}</TableCell>
                        <TableCell className="capitalize">{employee.contract_type ?? 'N/A'}</TableCell>
                        <TableCell>{getStatusBadge(employee.employment_status)}</TableCell>
                        <TableCell>{employee.hire_date ?? 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>View</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader><DialogTitle>Employee Details</DialogTitle></DialogHeader>
                              {selectedEmployee && (
                                <div className="grid gap-6">
                                  <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
                                      <span className="text-xl font-medium text-brand">{selectedEmployee.full_name.split(' ').map((n) => n[0]).join('')}</span>
                                    </div>
                                    <div>
                                      <h3 className="text-xl font-semibold">{selectedEmployee.full_name}</h3>
                                      <p className="text-muted-foreground capitalize">{selectedEmployee.role}</p>
                                      {getStatusBadge(selectedEmployee.employment_status)}
                                    </div>
                                  </div>
                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Building className="h-4 w-4" /> Department</div>
                                      <p className="font-medium">{departments?.find((d) => d.id === selectedEmployee.department_id)?.name ?? 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" /> Email</div>
                                      <p className="font-medium">{selectedEmployee.email ?? 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" /> Phone</div>
                                      <p className="font-medium">{selectedEmployee.phone ?? 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-muted-foreground">Contract Type</Label>
                                      <p className="font-medium capitalize">{selectedEmployee.contract_type ?? 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-muted-foreground">Hire Date</Label>
                                      <p className="font-medium">{selectedEmployee.hire_date ?? 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-muted-foreground">Base Salary</Label>
                                      <p className="font-medium">{selectedEmployee.base_salary ? `$${selectedEmployee.base_salary.toLocaleString()}/mo` : 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                      <Label className="text-muted-foreground">Address</Label>
                                      <p className="font-medium">{selectedEmployee.address ?? 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                      <Label className="text-muted-foreground">Emergency Contact</Label>
                                      <p className="font-medium">{selectedEmployee.emergency_contact ?? 'N/A'}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Management Tab */}
          <TabsContent value="leave" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Leave Requests</CardTitle>
                  <Dialog open={isAddLeaveOpen} onOpenChange={(open) => { setIsAddLeaveOpen(open); if (!open) setLeaveForm(emptyLeaveForm); }}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Request</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Submit Leave Request</DialogTitle></DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Employee</Label>
                          <Select value={leaveForm.staffId} onValueChange={(v) => setLeaveForm({ ...leaveForm, staffId: v })}>
                            <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                            <SelectContent>
                              {activeStaff.map((emp) => (
                                <SelectItem key={emp.id} value={String(emp.id)}>{emp.full_name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Leave Type</Label>
                          <Select value={leaveForm.leaveType} onValueChange={(v) => setLeaveForm({ ...leaveForm, leaveType: v })}>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vacation">Vacation</SelectItem>
                              <SelectItem value="sick">Sick Leave</SelectItem>
                              <SelectItem value="personal">Personal</SelectItem>
                              <SelectItem value="maternity">Maternity</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input type="date" value={leaveForm.startDate} onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input type="date" value={leaveForm.endDate} onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Reason</Label>
                          <Textarea value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} placeholder="Reason for leave..." />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddLeaveOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateLeave} disabled={createLeave.isPending}>{createLeave.isPending ? 'Submitting…' : 'Submit Request'}</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(leaveRequests ?? []).map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell className="font-medium">{leave.staff_name}</TableCell>
                        <TableCell>
                          <Badge className={`${leaveTypeColors[leave.leave_type]} hover:${leaveTypeColors[leave.leave_type]}`}>
                            {leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{leave.start_date}</TableCell>
                        <TableCell>{leave.end_date}</TableCell>
                        <TableCell>{Math.ceil((new Date(leave.end_date).getTime() - new Date(leave.start_date).getTime()) / 86400000) + 1}</TableCell>
                        <TableCell>{getLeaveStatusBadge(leave.status)}</TableCell>
                        <TableCell className="text-right">
                          {leave.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className="gap-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10" onClick={() => handleLeaveAction(leave.id, 'approved')}>
                                <CheckCircle className="h-3 w-3" /> Approve
                              </Button>
                              <Button size="sm" variant="outline" className="gap-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => handleLeaveAction(leave.id, 'rejected')}>
                                <XCircle className="h-3 w-3" /> Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">{leave.approved_at?.slice(0, 10)}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(leaveRequests ?? []).length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No leave requests yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Today's Attendance</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(attendanceRecords ?? []).map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.staff_name}</TableCell>
                        <TableCell>{record.work_date}</TableCell>
                        <TableCell>{record.clock_in || '-'}</TableCell>
                        <TableCell>{record.clock_out || '-'}</TableCell>
                        <TableCell>{record.hours_worked ? `${record.hours_worked.toFixed(1)}h` : '-'}</TableCell>
                        <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
                      </TableRow>
                    ))}
                    {(attendanceRecords ?? []).length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No attendance recorded for today yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll">
            <PayrollSection staff={activeStaff} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
