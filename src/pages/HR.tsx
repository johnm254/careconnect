import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Users,
  CalendarOff,
  Clock,
  Search,
  Plus,
  UserCheck,
  UserX,
  Building,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { mockEmployees, mockLeaveRequests, mockAttendanceRecords, mockLeaveBalances } from '@/data/hrMockData';
import { Employee, LeaveRequest, AttendanceRecord } from '@/types/hr';

export default function HR() {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [attendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

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
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case 'on-leave':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">On Leave</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Terminated</Badge>;
    }
  };

  const getLeaveStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
    }
  };

  const getAttendanceStatusBadge = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Present</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Absent</Badge>;
      case 'late':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Late</Badge>;
      case 'half-day':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Half Day</Badge>;
    }
  };

  const getLeaveTypeBadge = (type: LeaveRequest['type']) => {
    const colors: Record<LeaveRequest['type'], string> = {
      vacation: 'bg-blue-100 text-blue-700',
      sick: 'bg-red-100 text-red-700',
      personal: 'bg-purple-100 text-purple-700',
      maternity: 'bg-pink-100 text-pink-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return <Badge className={`${colors[type]} hover:${colors[type]}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Management</h1>
          <p className="text-muted-foreground">Manage employees, leave requests, and attendance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
              <p className="text-xs text-muted-foreground">{employees.filter((e) => e.status === 'active').length} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{presentToday}</div>
              <p className="text-xs text-muted-foreground">Clocked in</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">On Leave</CardTitle>
              <CalendarOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onLeaveToday}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLeaves}</div>
              <p className="text-xs text-muted-foreground">Leave requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="employees">Employee Records</TabsTrigger>
            <TabsTrigger value="leave">Leave Management</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
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
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Request Leave
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Submit Leave Request</DialogTitle>
                      </DialogHeader>
                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const newLeave: LeaveRequest = {
                            id: `L${String(leaveRequests.length + 1).padStart(3, '0')}`,
                            employeeId: formData.get('employee') as string,
                            employeeName: employees.find((e) => e.id === formData.get('employee'))?.name || '',
                            type: formData.get('type') as LeaveRequest['type'],
                            startDate: formData.get('startDate') as string,
                            endDate: formData.get('endDate') as string,
                            reason: formData.get('reason') as string,
                            status: 'pending',
                            requestedAt: new Date().toISOString().split('T')[0],
                          };
                          setLeaveRequests((prev) => [...prev, newLeave]);
                          setIsAddLeaveOpen(false);
                        }}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="employee">Employee</Label>
                          <Select name="employee" required>
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
                          <Label htmlFor="type">Leave Type</Label>
                          <Select name="type" required>
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
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input type="date" name="startDate" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input type="date" name="endDate" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reason">Reason</Label>
                          <Textarea name="reason" placeholder="Reason for leave..." required />
                        </div>
                        <Button type="submit" className="w-full">
                          Submit Request
                        </Button>
                      </form>
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
                      <TableHead>Duration</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell className="font-medium">{leave.employeeName}</TableCell>
                        <TableCell>{getLeaveTypeBadge(leave.type)}</TableCell>
                        <TableCell>
                          {leave.startDate} — {leave.endDate}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{leave.reason}</TableCell>
                        <TableCell>{getLeaveStatusBadge(leave.status)}</TableCell>
                        <TableCell className="text-right">
                          {leave.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:bg-green-50 hover:text-green-700"
                                onClick={() => handleLeaveAction(leave.id, 'approved')}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleLeaveAction(leave.id, 'rejected')}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Today's Attendance</CardTitle>
                    <p className="text-sm text-muted-foreground">February 2, 2025</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span>Present: {attendanceRecords.filter((a) => a.status === 'present').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <span>Absent: {attendanceRecords.filter((a) => a.status === 'absent').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500" />
                      <span>Late: {attendanceRecords.filter((a) => a.status === 'late').length}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Hours Worked</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.employeeName}</TableCell>
                        <TableCell>{record.clockIn || '—'}</TableCell>
                        <TableCell>{record.clockOut || '—'}</TableCell>
                        <TableCell>{record.hoursWorked ? `${record.hoursWorked.toFixed(2)}h` : '—'}</TableCell>
                        <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
                        <TableCell className="text-muted-foreground">{record.notes || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
