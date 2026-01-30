export type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  insuranceId?: string;
  registeredDate: string;
  lastVisit?: string;
  assignedDoctor?: string;
  assignedNurse?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'doctor' | 'nurse';
  specialization?: string;
  department: string;
  phone: string;
  email: string;
  available: boolean;
  avatar?: string;
  schedule: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  total: number;
  status: 'paid' | 'pending' | 'overdue';
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingBills: number;
  availableBeds: number;
}
