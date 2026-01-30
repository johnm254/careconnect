import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockStaff } from '@/data/mockData';
import { Staff } from '@/types/hospital';
import { Search, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const departments = ['All', 'Cardiology', 'Pediatrics', 'General Medicine', 'Orthopedics'];

export default function StaffDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const filteredStaff = mockStaff.filter((staff) => {
    const searchMatch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       staff.department.toLowerCase().includes(searchTerm.toLowerCase());
    const deptMatch = filterDepartment === 'All' || staff.department === filterDepartment;
    const roleMatch = filterRole === 'all' || staff.role === filterRole;
    return searchMatch && deptMatch && roleMatch;
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Directory</h1>
          <p className="text-muted-foreground">View doctors, nurses, and their availability</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="flex flex-wrap gap-4 p-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-48">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="doctor">Doctors</SelectItem>
                  <SelectItem value="nurse">Nurses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Staff Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStaff.map((staff) => (
            <Card key={staff.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative p-6">
                  {/* Availability Badge */}
                  <div className="absolute right-4 top-4">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        staff.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      )}
                    >
                      {staff.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div className="mb-4 flex justify-center">
                    <div
                      className={cn(
                        'flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold',
                        staff.role === 'doctor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      )}
                    >
                      {staff.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="font-semibold">{staff.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{staff.role}</p>
                    {staff.specialization && (
                      <p className="mt-1 text-sm font-medium text-primary">{staff.specialization}</p>
                    )}
                    <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" />
                      {staff.department}
                    </div>
                  </div>

                  {/* Actions */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="mt-4 w-full"
                        onClick={() => setSelectedStaff(staff)}
                      >
                        View Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Staff Profile</DialogTitle>
                      </DialogHeader>
                      {selectedStaff && (
                        <div className="space-y-4 py-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                'flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold',
                                selectedStaff.role === 'doctor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                              )}
                            >
                              {selectedStaff.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">{selectedStaff.name}</h3>
                              <p className="text-muted-foreground capitalize">{selectedStaff.role}</p>
                              {selectedStaff.specialization && (
                                <p className="text-sm font-medium text-primary">{selectedStaff.specialization}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-3 rounded-lg bg-muted p-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Department:</span>
                              <span className="font-medium">{selectedStaff.department}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Schedule:</span>
                              <span className="font-medium">{selectedStaff.schedule}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{selectedStaff.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{selectedStaff.email}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between rounded-lg border p-3">
                            <span className="text-sm">Availability Status</span>
                            <span
                              className={cn(
                                'rounded-full px-3 py-1 text-sm font-medium',
                                selectedStaff.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                              )}
                            >
                              {selectedStaff.available ? 'Available Today' : 'Not Available'}
                            </span>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No staff members found matching your criteria
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
