import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Users, CalendarOff, Clock, Search, Plus, UserCheck, Building, Mail, Phone, CheckCircle, XCircle,
} from 'lucide-react';
import { mockEmployees, mockLeaveRequests, mockAttendanceRecords, mockLeaveBalances } from '@/data/hrMockData';
import { Employee, LeaveRequest, AttendanceRecord } from '@/types/hr';
import { PayrollSection } from '@/components/hr/PayrollSection';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d';
import { useLoading } from '@/hooks/use-loading';
import { CardSkeleton, TableSkeleton } from '@/components/ui/skeleton-shimmer';

export default function HR() {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [attendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const isLoading = useLoading(800);

  const departments = [...new Set(employees.map((e) => e.department))];

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending').length;
  const presentToday = attendanceRecords.filter((a) => a.status === 'present').length;
  const onLeaveToday = employees.filter((e) => e.status === 'on-leave').length;

  const handleLeaveAction = (leaveId: string, action: 'approved' | 'rejected') => {
    setLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === leaveId
          ? { ...leave, status: action, approvedBy: 'Admin', approvedAt: new Date().toISOString().split('T')[0] }
          : leave
      )
    );
  };

  const getStatusBadge = (status: Employee['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/20 dark:text-green-400">Active</Badge>;
      case 'on-leave':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-500/20 dark:text-yellow-400">On Leave</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400">Terminated</Badge>;
    }
  };

  const getLeaveStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-500/20 dark:text-yellow-400">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/20 dark:text-green-400">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/20 dark:text-red-400">Rejected</Badge>;
    }
  };

  const getAttendanceStatusBadge = (status: AttendanceRecord['status']) => {
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

  const getLeaveTypeBadge = (type: LeaveRequest['type']) => {
    const colors: Record<LeaveRequest['type'], string> = {
      vacation: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
      sick: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
      personal: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
      maternity: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400',
      other: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400',
    };
    return <Badge className={`${colors[type]} hover:${colors[type]}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-64 rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <TableSkeleton rows={5} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TextReveal>
            <h1 className="text-3xl font-bold tracking-tight">
              <GradientText>HR Management</GradientText>
            </h1>
          </TextReveal>
          <TextReveal delay={0.1}>
            <p className="text-muted-foreground">Manage employees, leave requests, and attendance</p>
          </TextReveal>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Total Employees', value: employees.length, sub: `${employees.filter((e) => e.status === 'active').length} active`, icon: Users, gradient: 'from-blue-500/20 to-blue-600/5' },
            { label: 'Present Today', value: presentToday, sub: 'Clocked in', icon: UserCheck, gradient: 'from-emerald-500/20 to-emerald-600/5' },
            { label: 'On Leave', value: onLeaveToday, sub: 'Today', icon: CalendarOff, gradient: 'from-amber-500/20 to-amber-600/5' },
            { label: 'Pending Requests', value: pendingLeaves, sub: 'Leave requests', icon: Clock, gradient: 'from-violet-500/20 to-violet-600/5' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <CardContainer containerClassName="w-full">
                  <CardBody className="w-full">
                    <Spotlight className="w-full p-0">
                      <Card className="border-0 bg-transparent shadow-none">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                          <CardItem translateZ={30}>
                            <motion.div 
                              className={`rounded-xl p-2 bg-gradient-to-br ${stat.gradient} border border-border/30 backdrop-blur-sm`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Icon className="h-4 w-4 text-primary" />
                            </motion.div>
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

        {/* Tabs */}
        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="employees">Employee Records</TabsTrigger>
            <TabsTrigger value="leave">Leave Management</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Employee Directory</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-[250px] pl-9"
                      />
                    </div>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
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
                      <TableHead>Position</TableHead>
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <span className="text-sm font-medium text-primary">
                                {employee.name.split(' ').map((n) => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-muted-foreground">{employee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell className="capitalize">{employee.contractType}</TableCell>
                        <TableCell>{getStatusBadge(employee.status)}</TableCell>
                        <TableCell>{employee.hireDate}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedEmployee(employee)}>
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Employee Details</DialogTitle>
                              </DialogHeader>
                              {selectedEmployee && (
                                <div className="grid gap-6">
                                  <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                      <span className="text-xl font-medium text-primary">
                                        {selectedEmployee.name.split(' ').map((n) => n[0]).join('')}
                                      </span>
                                    </div>
                                    <div>
                                      <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                                      <p className="text-muted-foreground">{selectedEmployee.position}</p>
                                      {getStatusBadge(selectedEmployee.status)}
                                    </div>
                                  </div>
                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Building className="h-4 w-4" />
                                        Department
                                      </div>
                                      <p className="font-medium">{selectedEmployee.department}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        Email
                                      </div>
                                      <p className="font-medium">{selectedEmployee.email}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        Phone
                                      </div>
                                      <p className="font-medium">{selectedEmployee.phone}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-muted-foreground">Contract Type</Label>
                                      <p className="font-medium capitalize">{selectedEmployee.contractType}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-muted-foreground">Hire Date</Label>
                                      <p className="font-medium">{selectedEmployee.hireDate}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-muted-foreground">Salary</Label>
                                      <p className="font-medium">${selectedEmployee.salary.toLocaleString()}/year</p>
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                      <Label className="text-muted-foreground">Address</Label>
                                      <p className="font-medium">{selectedEmployee.address}</p>
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                      <Label className="text-muted-foreground">Emergency Contact</Label>
                                      <p className="font-medium">{selectedEmployee.emergencyContact}</p>
                                    </div>
                                  </div>
                                  {/* Leave Balance */}
                                  <div className="space-y-2">
                                    <h4 className="font-semibold">Leave Balance</h4>
                                    <div className="grid gap-2 sm:grid-cols-3">
                                      {(() => {
                                        const balance = mockLeaveBalances.find((b) => b.employeeId === selectedEmployee.id);
                                        if (!balance) return null;
                                        return (
                                          <>
                                            <div className="rounded-lg border p-3">
                                              <p className="text-sm text-muted-foreground">Vacation</p>
                                              <p className="text-lg font-semibold">
                                                {balance.vacation - balance.used.vacation}/{balance.vacation}
                                              </p>
                                            </div>
                                            <div className="rounded-lg border p-3">
                                              <p className="text-sm text-muted-foreground">Sick Leave</p>
                                              <p className="text-lg font-semibold">
                                                {balance.sick - balance.used.sick}/{balance.sick}
                                              </p>
                                            </div>
                                            <div className="rounded-lg border p-3">
                                              <p className="text-sm text-muted-foreground">Personal</p>
                                              <p className="text-lg font-semibold">
                                                {balance.personal - balance.used.personal}/{balance.personal}
                                              </p>
                                            </div>
                                          </>
                                        );
                                      })()}
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
                <div className="flex items-center justify-between">
                  <CardTitle>Leave Requests</CardTitle>
                  <Dialog open={isAddLeaveOpen} onOpenChange={setIsAddLeaveOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Leave Request</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label>Employee</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map((emp) => (
                                <SelectItem key={emp.id} value={emp.id}>
                                  {emp.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Leave Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vacation">Vacation</SelectItem>
                              <SelectItem value="sick">Sick Leave</SelectItem>
                              <SelectItem value="personal">Personal</SelectItem>
                              <SelectItem value="maternity">Maternity</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input type="date" />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input type="date" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Reason</Label>
                          <Textarea placeholder="Reason for leave..." />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAddLeaveOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsAddLeaveOpen(false)}>Submit Request</Button>
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
                    {leaveRequests.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell className="font-medium">{leave.employeeName}</TableCell>
                        <TableCell>{getLeaveTypeBadge(leave.type)}</TableCell>
                        <TableCell>{leave.startDate}</TableCell>
                        <TableCell>{leave.endDate}</TableCell>
                        <TableCell>
                          {Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}
                        </TableCell>
                        <TableCell>{getLeaveStatusBadge(leave.status)}</TableCell>
                        <TableCell className="text-right">
                          {leave.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10"
                                onClick={() => handleLeaveAction(leave.id, 'approved')}
                              >
                                <CheckCircle className="h-3 w-3" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                                onClick={() => handleLeaveAction(leave.id, 'rejected')}
                              >
                                <XCircle className="h-3 w-3" />
                                Reject
                              </Button>
                            </div>
                          )}
                          {leave.status !== 'pending' && (
                            <span className="text-sm text-muted-foreground">
                              {leave.approvedBy && `By ${leave.approvedBy}`}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Attendance</CardTitle>
              </CardHeader>
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
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.employeeName}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.clockIn || '-'}</TableCell>
                        <TableCell>{record.clockOut || '-'}</TableCell>
                        <TableCell>{record.hoursWorked ? `${record.hoursWorked}h` : '-'}</TableCell>
                        <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Tab */}
          <TabsContent value="payroll">
            <PayrollSection employees={employees} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
