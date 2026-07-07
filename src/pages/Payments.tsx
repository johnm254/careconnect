import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePatients } from '@/hooks/api/usePatients';
import { useRole } from '@/contexts/RoleContext';
import { Receipt, Plus, Eye, DollarSign, Clock, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d';
import { CardSkeleton, TableSkeleton } from '@/components/ui/skeleton-shimmer';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/api';
import { ApiPayment, usePayments, useCreatePayment, useMarkPaymentPaid, useVoidPayment } from '@/hooks/api/usePayments';

const statusColors: Record<string, string> = {
  paid: 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30',
  pending: 'bg-amber-500/20 text-amber-600 border border-amber-500/30',
  partially_paid: 'bg-blue-500/20 text-blue-600 border border-blue-500/30',
  overdue: 'bg-red-500/20 text-red-600 border border-red-500/30',
  cancelled: 'bg-slate-500/20 text-slate-600 border border-slate-500/30',
};

const statusIcons: Record<string, typeof CheckCircle> = {
  paid: CheckCircle,
  pending: Clock,
  partially_paid: Clock,
  overdue: AlertCircle,
  cancelled: AlertCircle,
};

export default function Payments() {
  const { currentRole } = useRole();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<ApiPayment | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [form, setForm] = useState({ patientId: '', description: '', amount: '', dueDate: '' });

  const { data: patients } = usePatients();
  const { data: payments, isLoading } = usePayments(filterStatus !== 'all' ? filterStatus : undefined);
  const createPayment = useCreatePayment();
  const markPaid = useMarkPaymentPaid();
  const voidPayment = useVoidPayment();

  const stats = {
    total: (payments ?? []).reduce((sum, p) => sum + p.total, 0),
    paid: (payments ?? []).filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.total, 0),
    pending: (payments ?? []).filter((p) => p.status === 'pending' || p.status === 'partially_paid').reduce((sum, p) => sum + p.total, 0),
    overdue: (payments ?? []).filter((p) => p.status === 'overdue').reduce((sum, p) => sum + p.total, 0),
  };

  const canManagePayments = currentRole === 'admin' || currentRole === 'receptionist' || currentRole === 'accountant';
  const canViewOnly = currentRole === 'doctor';

  const statCards = [
    { label: 'Total', value: stats.total, icon: DollarSign, gradient: 'from-blue-500/20 to-blue-600/5' },
    { label: 'Paid', value: stats.paid, icon: CheckCircle, gradient: 'from-emerald-500/20 to-emerald-600/5' },
    { label: 'Pending', value: stats.pending, icon: Clock, gradient: 'from-amber-500/20 to-amber-600/5' },
    { label: 'Overdue', value: stats.overdue, icon: AlertCircle, gradient: 'from-red-500/20 to-red-600/5' },
  ];

  const handleCreate = async () => {
    if (!form.patientId || !form.description || !form.amount) {
      toast({ title: 'Missing information', description: 'Patient, description, and amount are required.', variant: 'destructive' });
      return;
    }
    try {
      await createPayment.mutateAsync({
        patientId: Number(form.patientId),
        dueDate: form.dueDate || undefined,
        items: [{ description: form.description, quantity: 1, unitPrice: Number(form.amount) }],
      });
      toast({ title: 'Invoice created' });
      setIsAddDialogOpen(false);
      setForm({ patientId: '', description: '', amount: '', dueDate: '' });
    } catch (err) {
      toast({ title: 'Failed to create invoice', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
    }
  };

  const handleMarkPaid = async (id: number) => {
    try {
      await markPaid.mutateAsync(id);
      toast({ title: 'Invoice marked as paid' });
      setSelectedPayment(null);
    } catch (err) {
      toast({ title: 'Failed to update invoice', variant: 'destructive' });
    }
  };

  const handleVoid = async (id: number) => {
    try {
      await voidPayment.mutateAsync(id);
      toast({ title: 'Invoice voided' });
    } catch (err) {
      toast({ title: 'Failed to void invoice', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
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
        <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div>
            <TextReveal>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl"><GradientText>Payments</GradientText></h1>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="text-muted-foreground">{canViewOnly ? 'View invoice records' : 'Manage patient billing and payments'}</p>
            </TextReveal>
          </div>
          {canManagePayments && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-brand/20">
                  <Plus className="h-4 w-4" /> Create Invoice
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg border-border/50 bg-card/95 backdrop-blur-xl">
                <DialogHeader><DialogTitle>Create New Invoice</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Patient</Label>
                    <Select value={form.patientId} onValueChange={(v) => setForm({ ...form, patientId: v })}>
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
                    <Label>Service Description</Label>
                    <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g., General Consultation" className="bg-background/50 border-border/50" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Amount ($)</Label>
                      <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="bg-background/50 border-border/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="bg-background/50 border-border/50" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-border/50">Cancel</Button>
                  <Button onClick={handleCreate} disabled={createPayment.isPending}>
                    {createPayment.isPending ? 'Creating…' : 'Create Invoice'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }}>
                <CardContainer containerClassName="w-full">
                  <CardBody className="w-full">
                    <Spotlight className="w-full p-0">
                      <Card className="border-0 bg-transparent shadow-none">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <CardItem translateZ={30}>
                              <div className={`rounded-xl p-3 bg-gradient-to-br ${stat.gradient} border border-border/30 backdrop-blur-sm`}>
                                <Icon className="h-5 w-5 text-brand" />
                              </div>
                            </CardItem>
                            <CardItem translateZ={20}>
                              <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-xl font-bold">${stat.value.toLocaleString()}</p>
                              </div>
                            </CardItem>
                          </div>
                        </CardContent>
                      </Card>
                    </Spotlight>
                  </CardBody>
                </CardContainer>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="flex gap-4 p-4">
                <div className="w-full sm:w-48">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-background/50 border-border/50"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="partially_paid">Partially Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </Spotlight>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-brand/10"><Receipt className="h-5 w-5 text-brand" /></div>
                  Invoice List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(payments ?? []).map((payment, index) => {
                      const StatusIcon = statusIcons[payment.status] ?? Clock;
                      return (
                        <motion.tr
                          key={payment.id}
                          className="border-border/50 hover:bg-accent/30 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.05 }}
                        >
                          <TableCell className="font-medium">{payment.invoice_number}</TableCell>
                          <TableCell>{payment.patient_name}</TableCell>
                          <TableCell>{payment.issued_date}</TableCell>
                          <TableCell>{payment.due_date ?? 'N/A'}</TableCell>
                          <TableCell className="font-semibold">${payment.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={cn('inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold', statusColors[payment.status])}>
                              <StatusIcon className="h-3 w-3" />
                              {payment.status.replace('_', ' ')}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => setSelectedPayment(payment)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {canManagePayments && payment.status !== 'paid' && payment.status !== 'cancelled' && (
                                <Button variant="outline" size="sm" className="border-border/50" onClick={() => handleMarkPaid(payment.id)}>
                                  Mark Paid
                                </Button>
                              )}
                              {currentRole === 'admin' && payment.status !== 'paid' && payment.status !== 'cancelled' && (
                                <Button variant="ghost" size="icon" onClick={() => handleVoid(payment.id)}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
                {(payments ?? []).length === 0 && (
                  <p className="py-8 text-center text-muted-foreground">No invoices found.</p>
                )}
              </CardContent>
            </Card>
          </Spotlight>
        </motion.div>
      </div>

      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="max-w-lg border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader><DialogTitle>Invoice Details</DialogTitle></DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Invoice {selectedPayment.invoice_number}</p>
                  <h3 className="text-lg font-semibold">{selectedPayment.patient_name}</h3>
                </div>
                <span className={cn('rounded-lg px-3 py-1.5 text-sm font-semibold', statusColors[selectedPayment.status])}>
                  {selectedPayment.status.replace('_', ' ')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{selectedPayment.issued_date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-medium">{selectedPayment.due_date ?? 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/50 border border-border/50 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Subtotal</p>
                  <p className="font-medium">${selectedPayment.subtotal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tax</p>
                  <p className="font-medium">${selectedPayment.tax.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Paid</p>
                  <p className="font-medium">${selectedPayment.amount_paid.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-bold text-lg">${selectedPayment.total.toLocaleString()}</p>
                </div>
              </div>
              {canManagePayments && selectedPayment.status !== 'paid' && selectedPayment.status !== 'cancelled' && (
                <Button className="w-full" onClick={() => handleMarkPaid(selectedPayment.id)} disabled={markPaid.isPending}>
                  {markPaid.isPending ? 'Updating…' : 'Mark as Paid'}
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
