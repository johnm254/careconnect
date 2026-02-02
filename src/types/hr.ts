export interface Employee {
  id: string;
  staffId: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  contractType: 'full-time' | 'part-time' | 'contract';
  status: 'active' | 'on-leave' | 'terminated';
  salary: number;
  emergencyContact: string;
  address: string;
  avatar?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  hoursWorked?: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
  notes?: string;
}

export interface LeaveBalance {
  employeeId: string;
  vacation: number;
  sick: number;
  personal: number;
  used: {
    vacation: number;
    sick: number;
    personal: number;
  };
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string; // YYYY-MM format
  baseSalary: number;
  allowances: {
    housing: number;
    transport: number;
    medical: number;
    other: number;
  };
  deductions: {
    tax: number;
    insurance: number;
    retirement: number;
    other: number;
  };
  overtime: {
    hours: number;
    rate: number;
    amount: number;
  };
  grossSalary: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
  processedAt?: string;
  paidAt?: string;
}

export interface PaySlip {
  id: string;
  payrollId: string;
  employeeId: string;
  employeeName: string;
  month: string;
  generatedAt: string;
  downloadUrl?: string;
}
