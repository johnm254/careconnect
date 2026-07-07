import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRole } from '@/contexts/RoleContext';
import { Search, UserPlus, Eye, Pencil, Trash2, Phone, MapPin, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { TableSkeleton, SkeletonShimmer } from '@/components/ui/skeleton-shimmer';
import { useDebounce } from '@/hooks/use-debounce';
import { usePagination, PaginationControls } from '@/components/ui/pagination-controls';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/api';
import {
  ApiPatient,
  PatientInput,
  usePatients,
  useCreatePatient,
  useUpdatePatient,
  useDeletePatient,
} from '@/hooks/api/usePatients';

const emptyForm: PatientInput = {
  fullName: '',
  idNumber: '',
  phone: '',
  age: undefined,
  gender: undefined,
  bloodGroup: undefined,
  address: '',
  emergencyContact: '',
  insuranceId: '',
};

export default function Patients() {
  const { currentRole } = useRole();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedPatient, setSelectedPatient] = useState<ApiPatient | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<ApiPatient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<ApiPatient | null>(null);
  const [form, setForm] = useState<PatientInput>(emptyForm);

  const { data: patients, isLoading } = usePatients(debouncedSearch);
  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const deletePatient = useDeletePatient();

  const canAddPatient = currentRole === 'admin' || currentRole === 'receptionist' || currentRole === 'nurse' || currentRole === 'doctor';
  const { paginatedItems: paginatedPatients, currentPage, totalPages, pageSize, totalItems, setCurrentPage, setPageSize } =
    usePagination(patients ?? []);

  const resetForm = () => setForm(emptyForm);

  const handleCreate = async () => {
    if (!form.fullName || !form.phone) {
      toast({ title: 'Missing information', description: 'Full name and phone are required.', variant: 'destructive' });
      return;
    }
    try {
      const created = await createPatient.mutateAsync(form);
      toast({ title: 'Patient registered', description: `Assigned Patient ID: ${created.patient_number}` });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      toast({ title: 'Failed to register patient', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
    }
  };

  const openEdit = (patient: ApiPatient) => {
    setEditingPatient(patient);
    setForm({
      fullName: patient.full_name,
      idNumber: patient.id_number ?? '',
      phone: patient.phone,
      age: patient.age ?? undefined,
      gender: patient.gender ?? undefined,
      bloodGroup: patient.blood_group ?? undefined,
      address: patient.address ?? '',
      emergencyContact: patient.emergency_contact ?? '',
      insuranceId: patient.insurance_id ?? '',
    });
  };

  const handleUpdate = async () => {
    if (!editingPatient) return;
    try {
      await updatePatient.mutateAsync({ id: editingPatient.id, ...form });
      toast({ title: 'Patient updated' });
      setEditingPatient(null);
      resetForm();
    } catch (err) {
      toast({ title: 'Failed to update patient', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deletingPatient) return;
    try {
      await deletePatient.mutateAsync(deletingPatient.id);
      toast({ title: 'Patient deleted' });
      setDeletingPatient(null);
    } catch (err) {
      toast({ title: 'Failed to delete patient', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="space-y-2">
            <SkeletonShimmer className="h-8 w-32" />
            <SkeletonShimmer className="h-4 w-64" />
          </div>
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="p-4">
                <SkeletonShimmer className="h-10 w-full" />
              </CardContent>
            </Card>
          </Spotlight>
          <TableSkeleton rows={6} />
        </div>
      </Layout>
    );
  }

  const renderPatientForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Enter patient name" className="bg-background/50 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" value={form.age ?? ''} onChange={(e) => setForm({ ...form, age: e.target.value ? Number(e.target.value) : undefined })} placeholder="Age" className="bg-background/50 border-border/50" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bloodGroup">Blood Group</Label>
          <Select value={form.bloodGroup} onValueChange={(v) => setForm({ ...form, bloodGroup: v })}>
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" className="bg-background/50 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="idNumber">ID Number</Label>
          <Input id="idNumber" value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} placeholder="National ID / Passport No." className="bg-background/50 border-border/50" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street address, city" className="bg-background/50 border-border/50" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="emergency">Emergency Contact</Label>
          <Input id="emergency" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} placeholder="+1 (555) 000-0000" className="bg-background/50 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insurance">Insurance ID (Optional)</Label>
          <Input id="insurance" value={form.insuranceId} onChange={(e) => setForm({ ...form, insuranceId: e.target.value })} placeholder="INS-XXXX-XXX" className="bg-background/50 border-border/50" />
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <TextReveal>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                <GradientText>Patients</GradientText>
              </h1>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="text-muted-foreground">Manage patient records, identified by unique Patient ID</p>
            </TextReveal>
          </div>
          {canAddPatient && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Dialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                  setIsAddDialogOpen(open);
                  if (!open) resetForm();
                }}
              >
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="gap-2 shadow-lg shadow-brand/20">
                      <UserPlus className="h-4 w-4" />
                      Add Patient
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl border-border/50 bg-card/95 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle>Register New Patient</DialogTitle>
                  </DialogHeader>
                  {renderPatientForm()}
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-border/50">Cancel</Button>
                    <Button onClick={handleCreate} disabled={createPatient.isPending}>
                      {createPatient.isPending ? 'Registering…' : 'Register Patient'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, Patient ID, ID number, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50"
                  />
                </div>
              </CardContent>
            </Card>
          </Spotlight>
        </motion.div>

        {/* Patients Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Patient Registry</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age/Gender</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPatients.map((patient, index) => (
                      <motion.tr
                        key={patient.id}
                        className="border-border/50 hover:bg-accent/30 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        <TableCell className="font-medium">{patient.patient_number}</TableCell>
                        <TableCell className="font-medium">{patient.full_name}</TableCell>
                        <TableCell>{patient.age ?? 'N/A'} / {patient.gender ?? 'N/A'}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>
                          {patient.blood_group ? (
                            <span className="rounded-lg bg-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-600 border border-red-500/30">
                              {patient.blood_group}
                            </span>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>{patient.last_visit_at || 'N/A'}</TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedPatient(patient)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canAddPatient && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => openEdit(patient)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              {currentRole === 'admin' && (
                                <Button variant="ghost" size="icon" onClick={() => setDeletingPatient(patient)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
                {paginatedPatients.length === 0 && (
                  <p className="py-8 text-center text-muted-foreground">No patients found.</p>
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
        </motion.div>
      </div>

      {/* View details */}
      <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <DialogContent className="max-w-lg border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/20 border border-brand/30 text-2xl font-bold text-brand">
                  {selectedPatient.full_name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{selectedPatient.full_name}</h3>
                  <p className="flex items-center gap-1 text-muted-foreground text-sm">
                    <BadgeCheck className="h-3.5 w-3.5 text-brand" /> {selectedPatient.patient_number}
                  </p>
                </div>
              </div>
              <div className="grid gap-3">
                <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-accent/50 transition-colors">
                  <Phone className="h-4 w-4 text-brand" />
                  {selectedPatient.phone}
                </div>
                {selectedPatient.address && (
                  <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <MapPin className="h-4 w-4 text-brand" />
                    {selectedPatient.address}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/50 border border-border/50 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p className="font-medium">{selectedPatient.age ?? 'N/A'} years</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="font-medium">{selectedPatient.gender ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Blood Group</p>
                  <p className="font-medium">{selectedPatient.blood_group ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Registered</p>
                  <p className="font-medium">{selectedPatient.registered_at.slice(0, 10)}</p>
                </div>
              </div>
              {selectedPatient.id_number && (
                <div className="rounded-xl border border-border/50 p-4">
                  <p className="text-xs text-muted-foreground">ID Number</p>
                  <p className="font-medium">{selectedPatient.id_number}</p>
                </div>
              )}
              {selectedPatient.insurance_id && (
                <div className="rounded-xl border border-border/50 p-4">
                  <p className="text-xs text-muted-foreground">Insurance ID</p>
                  <p className="font-medium">{selectedPatient.insurance_id}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={!!editingPatient} onOpenChange={(open) => !open && (setEditingPatient(null), resetForm())}>
        <DialogContent className="max-w-2xl border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          {renderPatientForm()}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditingPatient(null)} className="border-border/50">Cancel</Button>
            <Button onClick={handleUpdate} disabled={updatePatient.isPending}>
              {updatePatient.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deletingPatient} onOpenChange={(open) => !open && setDeletingPatient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete patient?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingPatient?.full_name} ({deletingPatient?.patient_number}). Patients
              with existing appointments or payments cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
