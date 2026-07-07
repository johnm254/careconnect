import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRole } from '@/contexts/RoleContext';
import { Search, Phone, Mail, Clock, Building2, UserPlus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d';
import { PatientCardSkeleton } from '@/components/ui/skeleton-shimmer';
import { useDebounce } from '@/hooks/use-debounce';
import { usePagination, PaginationControls } from '@/components/ui/pagination-controls';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/api';
import { ApiStaff, StaffInput, useStaffList, useCreateStaff, useUpdateStaff, useDeleteStaff } from '@/hooks/api/useStaff';
import { useDepartments } from '@/hooks/api/useDepartments';

const emptyForm: StaffInput = {
  fullName: '',
  role: 'doctor',
  specialization: '',
  phone: '',
  email: '',
  password: '',
};

export default function StaffDirectory() {
  const { currentRole } = useRole();
  const isAdmin = currentRole === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedStaff, setSelectedStaff] = useState<ApiStaff | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<ApiStaff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<ApiStaff | null>(null);
  const [form, setForm] = useState<StaffInput>(emptyForm);

  const { data: departments } = useDepartments();
  const { data: staffList, isLoading } = useStaffList({
    search: debouncedSearch || undefined,
    role: filterRole !== 'all' ? filterRole : undefined,
    departmentId: filterDepartment !== 'all' ? Number(filterDepartment) : undefined,
  });
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();

  const activeStaff = (staffList ?? []).filter((s) => s.employment_status !== 'terminated');
  const { paginatedItems: paginatedStaff, currentPage, totalPages, pageSize, totalItems, setCurrentPage, setPageSize } =
    usePagination(activeStaff);

  const resetForm = () => setForm(emptyForm);

  const handleCreate = async () => {
    if (!form.fullName || !form.role) {
      toast({ title: 'Missing information', description: 'Full name and role are required.', variant: 'destructive' });
      return;
    }
    try {
      const created = await createStaff.mutateAsync(form);
      toast({ title: 'Staff member added', description: `Staff ID: ${created.staff_number}` });
      setIsAddOpen(false);
      resetForm();
    } catch (err) {
      toast({ title: 'Failed to add staff', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
    }
  };

  const openEdit = (s: ApiStaff) => {
    setEditingStaff(s);
    setForm({
      fullName: s.full_name,
      role: s.role,
      specialization: s.specialization ?? '',
      departmentId: s.department_id ?? undefined,
      phone: s.phone ?? '',
      email: s.email ?? '',
      contractType: s.contract_type ?? undefined,
    });
  };

  const handleUpdate = async () => {
    if (!editingStaff) return;
    try {
      await updateStaff.mutateAsync({ id: editingStaff.id, ...form });
      toast({ title: 'Staff member updated' });
      setEditingStaff(null);
      resetForm();
    } catch (err) {
      toast({ title: 'Failed to update', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
    }
  };

  const toggleAvailability = async (s: ApiStaff) => {
    try {
      await updateStaff.mutateAsync({ id: s.id, isAvailable: !s.is_available });
    } catch (err) {
      toast({ title: 'Failed to update availability', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deletingStaff) return;
    try {
      await deleteStaff.mutateAsync(deletingStaff.id);
      toast({ title: 'Staff member removed' });
      setDeletingStaff(null);
    } catch (err) {
      toast({ title: 'Failed to remove staff', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <PatientCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const renderForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Dr. Jane Smith" className="bg-background/50 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
            <SelectTrigger className="bg-background/50 border-border/50"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="nurse">Nurse</SelectItem>
              <SelectItem value="receptionist">Receptionist</SelectItem>
              <SelectItem value="pharmacist">Pharmacist</SelectItem>
              <SelectItem value="accountant">Accountant</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Specialization</Label>
          <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="Cardiology" className="bg-background/50 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label>Department</Label>
          <Select value={form.departmentId ? String(form.departmentId) : undefined} onValueChange={(v) => setForm({ ...form, departmentId: Number(v) })}>
            <SelectTrigger className="bg-background/50 border-border/50"><SelectValue placeholder="Select department" /></SelectTrigger>
            <SelectContent>
              {departments?.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="bg-background/50 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@careconnect.local" className="bg-background/50 border-border/50" />
        </div>
      </div>
      {!editingStaff && (
        <div className="space-y-2">
          <Label>Temporary Password (for login)</Label>
          <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Set an initial password" className="bg-background/50 border-border/50" />
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div>
            <TextReveal>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl"><GradientText>Staff</GradientText></h1>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="text-muted-foreground">Manage doctors, nurses, and hospital staff</p>
            </TextReveal>
          </div>
          {isAdmin && (
            <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-brand/20">
                  <UserPlus className="h-4 w-4" /> Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl border-border/50 bg-card/95 backdrop-blur-xl">
                <DialogHeader><DialogTitle>Add Staff Member</DialogTitle></DialogHeader>
                {renderForm()}
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddOpen(false)} className="border-border/50">Cancel</Button>
                  <Button onClick={handleCreate} disabled={createStaff.isPending}>
                    {createStaff.isPending ? 'Adding…' : 'Add Staff Member'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="flex flex-wrap gap-4 p-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-background/50 border-border/50" />
                </div>
                <div className="w-full sm:w-48">
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="bg-background/50 border-border/50"><SelectValue placeholder="Department" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments?.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-40">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="bg-background/50 border-border/50"><SelectValue placeholder="Role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="doctor">Doctors</SelectItem>
                      <SelectItem value="nurse">Nurses</SelectItem>
                      <SelectItem value="receptionist">Receptionists</SelectItem>
                      <SelectItem value="pharmacist">Pharmacists</SelectItem>
                      <SelectItem value="accountant">Accountants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </Spotlight>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedStaff.map((s, index) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.05 }}>
              <CardContainer containerClassName="w-full">
                <CardBody className="w-full">
                  <Spotlight className="w-full p-0">
                    <Card className="border-0 bg-transparent shadow-none overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative p-6">
                          <CardItem translateZ={30} className="absolute right-4 top-4">
                            <button
                              onClick={() => isAdmin && toggleAvailability(s)}
                              disabled={!isAdmin}
                              className={cn(
                                'rounded-lg px-2.5 py-1 text-xs font-semibold border',
                                s.is_available ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' : 'bg-muted text-muted-foreground border-border/50'
                              )}
                            >
                              {s.is_available ? 'Available' : 'Unavailable'}
                            </button>
                          </CardItem>

                          <CardItem translateZ={50} className="mb-4 flex justify-center">
                            <motion.div
                              className={cn(
                                'flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold border backdrop-blur-sm',
                                s.role === 'doctor' ? 'bg-blue-500/20 text-blue-600 border-blue-500/30' : 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
                              )}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              {s.full_name.split(' ').map((n) => n[0]).join('')}
                            </motion.div>
                          </CardItem>

                          <CardItem translateZ={20} className="text-center">
                            <h3 className="font-semibold">{s.full_name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{s.role}</p>
                            {s.specialization && <p className="mt-1 text-sm font-medium text-brand">{s.specialization}</p>}
                            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              {departments?.find((d) => d.id === s.department_id)?.name ?? 'Unassigned'}
                            </div>
                          </CardItem>

                          <CardItem translateZ={30} className="w-full space-y-2">
                            <Button variant="outline" className="mt-4 w-full border-border/50 hover:bg-brand/10 hover:border-brand/50" onClick={() => setSelectedStaff(s)}>
                              View Profile
                            </Button>
                            {isAdmin && (
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1 border-border/50" onClick={() => openEdit(s)}>
                                  <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 border-border/50 text-destructive hover:bg-destructive/10" onClick={() => setDeletingStaff(s)}>
                                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                                </Button>
                              </div>
                            )}
                          </CardItem>
                        </div>
                      </CardContent>
                    </Card>
                  </Spotlight>
                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>

        <PaginationControls currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} totalItems={totalItems} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
        {activeStaff.length === 0 && (
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="py-12 text-center text-muted-foreground">No staff members found matching your criteria</CardContent>
            </Card>
          </Spotlight>
        )}
      </div>

      <Dialog open={!!selectedStaff} onOpenChange={(open) => !open && setSelectedStaff(null)}>
        <DialogContent className="border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader><DialogTitle>Staff Profile</DialogTitle></DialogHeader>
          {selectedStaff && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className={cn('flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold border backdrop-blur-sm', selectedStaff.role === 'doctor' ? 'bg-blue-500/20 text-blue-600 border-blue-500/30' : 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30')}>
                  {selectedStaff.full_name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedStaff.full_name}</h3>
                  <p className="text-muted-foreground capitalize">{selectedStaff.role}</p>
                  <p className="text-xs text-muted-foreground">{selectedStaff.staff_number}</p>
                </div>
              </div>
              <div className="space-y-3 rounded-xl bg-muted/50 border border-border/50 p-4">
                <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <Building2 className="h-4 w-4 text-brand" />
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{departments?.find((d) => d.id === selectedStaff.department_id)?.name ?? 'Unassigned'}</span>
                </div>
                {selectedStaff.phone && (
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <Phone className="h-4 w-4 text-brand" />
                    <span className="font-medium">{selectedStaff.phone}</span>
                  </div>
                )}
                {selectedStaff.email && (
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <Mail className="h-4 w-4 text-brand" />
                    <span className="font-medium">{selectedStaff.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingStaff} onOpenChange={(open) => !open && (setEditingStaff(null), resetForm())}>
        <DialogContent className="max-w-2xl border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader><DialogTitle>Edit Staff Member</DialogTitle></DialogHeader>
          {renderForm()}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditingStaff(null)} className="border-border/50">Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateStaff.isPending}>{updateStaff.isPending ? 'Saving…' : 'Save Changes'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingStaff} onOpenChange={(open) => !open && setDeletingStaff(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove staff member?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingStaff?.full_name} will be marked as terminated and their login access revoked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
