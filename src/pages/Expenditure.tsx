import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRole } from '@/contexts/RoleContext';
import { Wallet, Plus, TrendingDown, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d';
import { TableSkeleton, CardSkeleton } from '@/components/ui/skeleton-shimmer';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/api';
import {
  ApiExpenditure,
  useExpenditures,
  useCreateExpenditure,
  useUpdateExpenditure,
  useDeleteExpenditure,
} from '@/hooks/api/useExpenditures';

const CATEGORIES = ['supplies', 'utilities', 'maintenance', 'salaries', 'equipment', 'pharmacy_restock', 'other'];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-600 border border-amber-500/30',
  approved: 'bg-blue-500/20 text-blue-600 border border-blue-500/30',
  paid: 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30',
  rejected: 'bg-red-500/20 text-red-600 border border-red-500/30',
};

const statusIcons: Record<string, typeof CheckCircle> = {
  pending: Clock,
  approved: CheckCircle,
  paid: CheckCircle,
  rejected: XCircle,
};

const emptyForm = { category: 'supplies', description: '', amount: '', vendor: '', expenseDate: '' };

export default function Expenditure() {
  const { currentRole } = useRole();
  const canManage = currentRole === 'admin' || currentRole === 'accountant';
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: expenditures, isLoading } = useExpenditures({ status: filterStatus !== 'all' ? filterStatus : undefined });
  const createExpenditure = useCreateExpenditure();
  const updateExpenditure = useUpdateExpenditure();
  const deleteExpenditure = useDeleteExpenditure();

  const stats = {
    total: (expenditures ?? []).reduce((sum, e) => sum + e.amount, 0),
    pending: (expenditures ?? []).filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0),
    paid: (expenditures ?? []).filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0),
  };

  const handleCreate = async () => {
    if (!form.category || !form.description || !form.amount) {
      toast({ title: 'Missing information', description: 'Category, description, and amount are required.', variant: 'destructive' });
      return;
    }
    try {
      await createExpenditure.mutateAsync({
        category: form.category,
        description: form.description,
        amount: Number(form.amount),
        vendor: form.vendor || undefined,
        expenseDate: form.expenseDate || undefined,
      });
      toast({ title: 'Expenditure recorded' });
      setIsAddOpen(false);
      setForm(emptyForm);
    } catch (err) {
      toast({ title: 'Failed to record expenditure', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (e: ApiExpenditure, status: string) => {
    try {
      await updateExpenditure.mutateAsync({ id: e.id, status });
    } catch {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    try {
      await deleteExpenditure.mutateAsync(deletingId);
      toast({ title: 'Expenditure deleted' });
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    } finally {
      setDeletingId(null);
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
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
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
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl"><GradientText>Expenditure</GradientText></h1>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="text-muted-foreground">Track hospital operating expenses and outflows</p>
            </TextReveal>
          </div>
          {canManage && (
            <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) setForm(emptyForm); }}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-brand/20">
                  <Plus className="h-4 w-4" /> Record Expense
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg border-border/50 bg-card/95 backdrop-blur-xl">
                <DialogHeader><DialogTitle>Record New Expenditure</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger className="bg-background/50 border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat.replace('_', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What was this expense for?" className="bg-background/50 border-border/50" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Amount ($)</Label>
                      <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="bg-background/50 border-border/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" value={form.expenseDate} onChange={(e) => setForm({ ...form, expenseDate: e.target.value })} className="bg-background/50 border-border/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Vendor (Optional)</Label>
                    <Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} placeholder="Supplier or vendor name" className="bg-background/50 border-border/50" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddOpen(false)} className="border-border/50">Cancel</Button>
                  <Button onClick={handleCreate} disabled={createExpenditure.isPending}>
                    {createExpenditure.isPending ? 'Recording…' : 'Record Expense'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'Total Expenditure', value: stats.total, icon: Wallet, gradient: 'from-blue-500/20 to-blue-600/5' },
            { label: 'Pending Approval', value: stats.pending, icon: Clock, gradient: 'from-amber-500/20 to-amber-600/5' },
            { label: 'Paid Out', value: stats.paid, icon: TrendingDown, gradient: 'from-emerald-500/20 to-emerald-600/5' },
          ].map((stat, index) => {
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="flex gap-4 p-4">
                <div className="w-full sm:w-48">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-background/50 border-border/50"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </Spotlight>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-brand/10"><Wallet className="h-5 w-5 text-brand" /></div>
                  Expenditure Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Reference</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      {canManage && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(expenditures ?? []).map((e, index) => {
                      const StatusIcon = statusIcons[e.status] ?? Clock;
                      return (
                        <motion.tr
                          key={e.id}
                          className="border-border/50 hover:bg-accent/30 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                        >
                          <TableCell className="font-medium">{e.reference_number}</TableCell>
                          <TableCell className="capitalize">{e.category.replace('_', ' ')}</TableCell>
                          <TableCell className="max-w-[220px] truncate">{e.description}</TableCell>
                          <TableCell>{e.vendor ?? 'N/A'}</TableCell>
                          <TableCell>{e.expense_date}</TableCell>
                          <TableCell className="font-semibold">${e.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={cn('inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold', statusColors[e.status])}>
                              <StatusIcon className="h-3 w-3" />
                              {e.status}
                            </span>
                          </TableCell>
                          {canManage && (
                            <TableCell className="text-right">
                              <div className="flex justify-end items-center gap-2">
                                <Select value={e.status} onValueChange={(v) => handleStatusChange(e, v)}>
                                  <SelectTrigger className="w-32 bg-background/50 border-border/50"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approve</SelectItem>
                                    <SelectItem value="paid">Mark Paid</SelectItem>
                                    <SelectItem value="rejected">Reject</SelectItem>
                                  </SelectContent>
                                </Select>
                                {currentRole === 'admin' && (
                                  <Button variant="ghost" size="icon" onClick={() => setDeletingId(e.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          )}
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
                {(expenditures ?? []).length === 0 && (
                  <p className="py-8 text-center text-muted-foreground">No expenditure records found.</p>
                )}
              </CardContent>
            </Card>
          </Spotlight>
        </motion.div>
      </div>

      <Dialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="max-w-sm border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader><DialogTitle>Delete expenditure record?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeletingId(null)} className="border-border/50">Cancel</Button>
            <Button onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
