import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Separator } from '@/components/ui/separator';
import {
  DollarSign,
  FileText,
  Download,
  CheckCircle,
  Clock,
  CreditCard,
  Printer,
} from 'lucide-react';
import { PayrollRecord, PaySlip, Employee } from '@/types/hr';
import { mockPayrollRecords, mockPaySlips } from '@/data/hrMockData';

interface PayrollSectionProps {
  employees: Employee[];
}

export function PayrollSection({ employees }: PayrollSectionProps) {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords);
  const [paySlips, setPaySlips] = useState<PaySlip[]>(mockPaySlips);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [monthFilter, setMonthFilter] = useState<string>('all');

  const months = [...new Set(payrollRecords.map((p) => p.month))];

  const filteredPayroll = payrollRecords.filter(
    (record) => monthFilter === 'all' || record.month === monthFilter
  );

  const totalPayroll = filteredPayroll.reduce((sum, p) => sum + p.netSalary, 0);
  const pendingPayroll = filteredPayroll.filter((p) => p.status === 'pending').length;
  const processedPayroll = filteredPayroll.filter((p) => p.status === 'processed').length;
  const paidPayroll = filteredPayroll.filter((p) => p.status === 'paid').length;

  const getStatusBadge = (status: PayrollRecord['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case 'processed':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Processed</Badge>;
      case 'paid':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
    }
  };

  const handleProcessPayroll = (payrollId: string) => {
    setPayrollRecords((prev) =>
      prev.map((p) =>
        p.id === payrollId
          ? { ...p, status: 'processed' as const, processedAt: new Date().toISOString().split('T')[0] }
          : p
      )
    );
  };

  const handleMarkAsPaid = (payrollId: string) => {
    setPayrollRecords((prev) =>
      prev.map((p) =>
        p.id === payrollId
          ? { ...p, status: 'paid' as const, paidAt: new Date().toISOString().split('T')[0] }
          : p
      )
    );
  };

  const handleGeneratePaySlip = (payroll: PayrollRecord) => {
    const existingSlip = paySlips.find(
      (s) => s.payrollId === payroll.id
    );
    if (existingSlip) return;

    const newPaySlip: PaySlip = {
      id: `PS${String(paySlips.length + 1).padStart(3, '0')}`,
      payrollId: payroll.id,
      employeeId: payroll.employeeId,
      employeeName: payroll.employeeName,
      month: payroll.month,
      generatedAt: new Date().toISOString().split('T')[0],
    };
    setPaySlips((prev) => [...prev, newPaySlip]);
  };

  const formatMonth = (month: string) => {
    const [year, m] = month.split('-');
    const date = new Date(parseInt(year), parseInt(m) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Salary Processing</CardTitle>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {formatMonth(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {filteredPayroll.map((payroll) => {
                const totalDeductions =
                  payroll.deductions.tax +
                  payroll.deductions.insurance +
                  payroll.deductions.retirement +
                  payroll.deductions.other;
                const hasPaySlip = paySlips.some((s) => s.payrollId === payroll.id);

                return (
                  <TableRow key={payroll.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-medium text-primary">
                            {payroll.employeeName.split(' ').map((n) => n[0]).join('')}
                          </span>
                        </div>
                        <div className="font-medium">{payroll.employeeName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatMonth(payroll.month)}</TableCell>
                    <TableCell className="text-right">${payroll.grossSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-red-600">
                      -${totalDeductions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${payroll.netSalary.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(payroll.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedPayroll(payroll)}
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Payroll Details</DialogTitle>
                            </DialogHeader>
                            {selectedPayroll && (
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                    <span className="font-medium text-primary">
                                      {selectedPayroll.employeeName.split(' ').map((n) => n[0]).join('')}
                                    </span>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{selectedPayroll.employeeName}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {formatMonth(selectedPayroll.month)}
                                    </p>
                                  </div>
                                  {getStatusBadge(selectedPayroll.status)}
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                  <h4 className="font-medium">Earnings</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span>Base Salary</span>
                                      <span>${selectedPayroll.baseSalary.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Housing Allowance</span>
                                      <span>${selectedPayroll.allowances.housing.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Transport Allowance</span>
                                      <span>${selectedPayroll.allowances.transport.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Medical Allowance</span>
                                      <span>${selectedPayroll.allowances.medical.toLocaleString()}</span>
                                    </div>
                                    {selectedPayroll.overtime.hours > 0 && (
                                      <div className="flex justify-between">
                                        <span>Overtime ({selectedPayroll.overtime.hours}h)</span>
                                        <span>${selectedPayroll.overtime.amount.toLocaleString()}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between font-medium border-t pt-2">
                                      <span>Gross Salary</span>
                                      <span>${selectedPayroll.grossSalary.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <h4 className="font-medium">Deductions</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-red-600">
                                      <span>Tax</span>
                                      <span>-${selectedPayroll.deductions.tax.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-red-600">
                                      <span>Insurance</span>
                                      <span>-${selectedPayroll.deductions.insurance.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-red-600">
                                      <span>Retirement</span>
                                      <span>-${selectedPayroll.deductions.retirement.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-semibold">
                                  <span>Net Salary</span>
                                  <span className="text-green-600">
                                    ${selectedPayroll.netSalary.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {payroll.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleProcessPayroll(payroll.id)}
                          >
                            Process
                          </Button>
                        )}

                        {payroll.status === 'processed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleMarkAsPaid(payroll.id)}
                          >
                            Mark Paid
                          </Button>
                        )}

                        {payroll.status === 'paid' && !hasPaySlip && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGeneratePaySlip(payroll)}
                          >
                            <FileText className="mr-1 h-4 w-4" />
                            Generate Slip
                          </Button>
                        )}

                        {hasPaySlip && (
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pay Slips */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Pay Slips</CardTitle>
        </CardHeader>
        <CardContent>
          {paySlips.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No pay slips generated yet. Process and mark payroll as paid to generate pay slips.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Generated On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paySlips.map((slip) => (
                  <TableRow key={slip.id}>
                    <TableCell className="font-medium">{slip.employeeName}</TableCell>
                    <TableCell>{formatMonth(slip.month)}</TableCell>
                    <TableCell>{slip.generatedAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <Printer className="mr-1 h-4 w-4" />
                          Print
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="mr-1 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
