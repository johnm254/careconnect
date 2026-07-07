import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Plus, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { ApiStaff } from '@/hooks/api/useStaff';
import { ApiPayrollRecord, usePayroll, useCreatePayroll, useUpdatePayrollStatus } from '@/hooks/api/useHR';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/api';

interface PayrollSectionProps {
  staff: ApiStaff[];
}

const emptyForm = { staffId: '', periodMonth: new Date().toISOString().slice(0, 7), baseSalary: '', allowances: '', deductions: '', overtimeHours: '', overtimeRate: '' };

export function PayrollSection({ staff }: PayrollSectionProps) {
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [selectedPayroll, setSelectedPayroll] = useState<ApiPayrollRecord | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: payrollRecords, isLoading } = usePayroll(monthFilter !== 'all' ? monthFilter : undefined);
  const createPayroll = useCreatePayroll();
  const updateStatus = useUpdatePayrollStatus();

  const months = [...new Set((payrollRecords ?? []).map((p) => p.period_month))];

  const totalPayroll = (payrollRecords ?? []).reduce((sum, p) => sum + p.net_salary, 0);
  const pendingPayroll = (payrollRecords ?? []).filter((p) => p.status === 'pending').length;
  const processedPayroll = (payrollRecords ?? []).filter((p) => p.status === 'processed').length;
  const paidPayroll = (payrollRecords ?? []).filter((p) => p.status === 'paid').length;

  const getStatusBadge = (status: ApiPayrollRecord['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case 'processed':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Processed</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
    }
  };

  const formatMonth = (month: string) => {
    const [year, m] = month.split('-');
    return new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleCreate = async () => {
    if (!form.staffId || !form.baseSalary) {
      toast({ title: 'Missing information', description: 'Employee and base salary are required.', variant: 'destructive' });
      return;
    }
    try {
      await createPayroll.mutateAsync({
        staffId: Number(form.staffId),
        periodMonth: form.periodMonth,
        baseSalary: Number(form.baseSalary),
        allowances: form.allowances ? { total: Number(form.allowances) } : undefined,
        deductions: form.deductions ? { total: Number(form.deductions) } : undefined,
        overtimeHours: form.overtimeHours ? Number(form.overtimeHours) : undefined,
        overtimeRate: form.overtimeRate ? Number(form.overtimeRate) : undefined,
      });
      toast({ title: 'Payroll record created' });
      setIsAddOpen(false);
      setForm(emptyForm);
    } catch (err) {
      toast({ title: 'Failed to create payroll record', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
    } catch {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const parseTotal = (json: string) => {
    try {
      const obj = JSON.parse(json) as Record<string, number>;
      return Object.values(obj).reduce((s, v) => s + v, 0);
    } catch {
      return 0;
    }
  };

  if (isLoading) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPayroll.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayroll}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedPayroll}</div>
            <p className="text-xs text-muted-foreground">Ready for payment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidPayroll}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Salary Processing</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="All Months" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {months.map((month) => <SelectItem key={month} value={month}>{formatMonth(month)}</SelectItem>)}
                </SelectContent>
              </Select>
              <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) setForm(emptyForm); }}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Record</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Payroll Record</DialogTitle></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Employee</Label>
                      <Select value={form.staffId} onValueChange={(v) => setForm({ ...form, staffId: v })}>
                        <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                        <SelectContent>
                          {staff.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.full_name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Period (Month)</Label>
                        <Input type="month" value={form.periodMonth} onChange={(e) => setForm({ ...form, periodMonth: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Base Salary ($)</Label>
                        <Input type="number" value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Allowances ($)</Label>
                        <Input type="number" value={form.allowances} onChange={(e) => setForm({ ...form, allowances: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Deductions ($)</Label>
                        <Input type="number" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Overtime Hours</Label>
                        <Input type="number" value={form.overtimeHours} onChange={(e) => setForm({ ...form, overtimeHours: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label>Overtime Rate ($/hr)</Label>
                        <Input type="number" value={form.overtimeRate} onChange={(e) => setForm({ ...form, overtimeRate: e.target.value })} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={createPayroll.isPending}>{createPayroll.isPending ? 'Creating…' : 'Create Record'}</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Gross Salary</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(payrollRecords ?? []).map((payroll) => (
                <TableRow key={payroll.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
                        <span className="text-sm font-medium text-brand">{payroll.staff_name.split(' ').map((n) => n[0]).join('')}</span>
                      </div>
                      <div className="font-medium">{payroll.staff_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatMonth(payroll.period_month)}</TableCell>
                  <TableCell className="text-right">${payroll.gross_salary.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-red-600">-${parseTotal(payroll.deductions_json).toLocaleString()}</TableCell>
                  <TableCell className="text-right font-semibold">${payroll.net_salary.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedPayroll(payroll)}>View</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader><DialogTitle>Payroll Details</DialogTitle></DialogHeader>
                          {selectedPayroll && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
                                  <span className="font-medium text-brand">{selectedPayroll.staff_name.split(' ').map((n) => n[0]).join('')}</span>
                                </div>
                                <div>
                                  <h3 className="font-semibold">{selectedPayroll.staff_name}</h3>
                                  <p className="text-sm text-muted-foreground">{formatMonth(selectedPayroll.period_month)}</p>
                                </div>
                                {getStatusBadge(selectedPayroll.status)}
                              </div>
                              <Separator />
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span>Base Salary</span><span>${selectedPayroll.base_salary.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Allowances</span><span>${parseTotal(selectedPayroll.allowances_json).toLocaleString()}</span></div>
                                {selectedPayroll.overtime_hours > 0 && (
                                  <div className="flex justify-between"><span>Overtime ({selectedPayroll.overtime_hours}h)</span><span>${(selectedPayroll.overtime_hours * selectedPayroll.overtime_rate).toLocaleString()}</span></div>
                                )}
                                <div className="flex justify-between font-medium border-t pt-2"><span>Gross Salary</span><span>${selectedPayroll.gross_salary.toLocaleString()}</span></div>
                                <div className="flex justify-between text-red-600"><span>Deductions</span><span>-${parseTotal(selectedPayroll.deductions_json).toLocaleString()}</span></div>
                              </div>
                              <Separator />
                              <div className="flex justify-between text-lg font-semibold">
                                <span>Net Salary</span>
                                <span className="text-green-600">${selectedPayroll.net_salary.toLocaleString()}</span>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {payroll.status === 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(payroll.id, 'processed')}>Process</Button>
                      )}
                      {payroll.status === 'processed' && (
                        <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => handleStatusChange(payroll.id, 'paid')}>Mark Paid</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(payrollRecords ?? []).length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No payroll records yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
