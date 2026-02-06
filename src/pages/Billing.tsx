import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockInvoices, mockPatients } from '@/data/mockData';
import { Invoice } from '@/types/hospital';
import { useRole } from '@/contexts/RoleContext';
import { Receipt, Plus, Eye, DollarSign, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d';

const statusColors = {
  paid: 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30',
  pending: 'bg-amber-500/20 text-amber-600 border border-amber-500/30',
  overdue: 'bg-red-500/20 text-red-600 border border-red-500/30',
};

const statusIcons = {
  paid: CheckCircle,
  pending: Clock,
  overdue: AlertCircle,
};

export default function Billing() {
  const { currentRole } = useRole();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredInvoices = mockInvoices.filter((inv) => {
    return filterStatus === 'all' || inv.status === filterStatus;
  });

  const stats = {
    total: mockInvoices.reduce((sum, inv) => sum + inv.total, 0),
    paid: mockInvoices.filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
    pending: mockInvoices.filter((inv) => inv.status === 'pending').reduce((sum, inv) => sum + inv.total, 0),
    overdue: mockInvoices.filter((inv) => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0),
  };

  const canManageBilling = currentRole === 'admin' || currentRole === 'receptionist';
  const canViewOnly = currentRole === 'doctor';

  const statCards = [
    { label: 'Total', value: stats.total, icon: DollarSign, gradient: 'from-blue-500/20 to-blue-600/5' },
    { label: 'Paid', value: stats.paid, icon: CheckCircle, gradient: 'from-emerald-500/20 to-emerald-600/5' },
    { label: 'Pending', value: stats.pending, icon: Clock, gradient: 'from-amber-500/20 to-amber-600/5' },
    { label: 'Overdue', value: stats.overdue, icon: AlertCircle, gradient: 'from-red-500/20 to-red-600/5' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <TextReveal>
              <h1 className="text-3xl font-bold tracking-tight">
                <GradientText>Billing & Invoices</GradientText>
              </h1>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="text-muted-foreground">
                {canViewOnly ? 'View invoice records' : 'Manage patient billing and payments'}
              </p>
            </TextReveal>
          </div>
          {canManageBilling && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                      <Plus className="h-4 w-4" />
                      Create Invoice
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-lg border-border/50 bg-card/95 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Patient</Label>
                      <Select>
                        <SelectTrigger className="bg-background/50 border-border/50">
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockPatients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name} ({patient.id})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Service Description</Label>
                      <Input placeholder="e.g., General Consultation" className="bg-background/50 border-border/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Amount ($)</Label>
                        <Input type="number" placeholder="0.00" className="bg-background/50 border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Input type="date" className="bg-background/50 border-border/50" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-border/50">Cancel</Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Create Invoice</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <CardContainer containerClassName="w-full">
                  <CardBody className="w-full">
                    <Spotlight className="w-full p-0">
                      <Card className="border-0 bg-transparent shadow-none">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <CardItem translateZ={30}>
                              <motion.div 
                                className={`rounded-xl p-3 bg-gradient-to-br ${stat.gradient} border border-border/30 backdrop-blur-sm`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Icon className="h-5 w-5 text-primary" />
                              </motion.div>
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="flex gap-4 p-4">
                <div className="w-48">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-background/50 border-border/50">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </Spotlight>
        </motion.div>

        {/* Invoices Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div
                    className="p-2 rounded-lg bg-primary/10"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Receipt className="h-5 w-5 text-primary" />
                  </motion.div>
                  Invoice List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice, index) => {
                      const StatusIcon = statusIcons[invoice.status];
                      return (
                        <motion.tr
                          key={invoice.id}
                          className="border-border/50 hover:bg-accent/30 transition-colors"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.05 }}
                        >
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.patientName}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{invoice.dueDate}</TableCell>
                          <TableCell className="font-semibold">${invoice.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={cn('inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold', statusColors[invoice.status])}>
                              <StatusIcon className="h-3 w-3" />
                              {invoice.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </motion.div>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg border-border/50 bg-card/95 backdrop-blur-xl">
                                  <DialogHeader>
                                    <DialogTitle>Invoice Details</DialogTitle>
                                  </DialogHeader>
                                  {selectedInvoice && (
                                    <div className="space-y-4 py-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm text-muted-foreground">Invoice #{selectedInvoice.id}</p>
                                          <h3 className="text-lg font-semibold">{selectedInvoice.patientName}</h3>
                                        </div>
                                        <span className={cn('rounded-lg px-3 py-1.5 text-sm font-semibold', statusColors[selectedInvoice.status])}>
                                          {selectedInvoice.status}
                                        </span>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <p className="text-muted-foreground">Issue Date</p>
                                          <p className="font-medium">{selectedInvoice.date}</p>
                                        </div>
                                        <div>
                                          <p className="text-muted-foreground">Due Date</p>
                                          <p className="font-medium">{selectedInvoice.dueDate}</p>
                                        </div>
                                      </div>

                                      <div className="rounded-xl border border-border/50 overflow-hidden">
                                        <Table>
                                          <TableHeader>
                                            <TableRow className="border-border/50">
                                              <TableHead>Description</TableHead>
                                              <TableHead className="text-right">Qty</TableHead>
                                              <TableHead className="text-right">Price</TableHead>
                                              <TableHead className="text-right">Total</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {selectedInvoice.items.map((item, idx) => (
                                              <TableRow key={idx} className="border-border/50">
                                                <TableCell>{item.description}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right">${item.unitPrice}</TableCell>
                                                <TableCell className="text-right">${item.total}</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>

                                      <div className="flex justify-between rounded-xl bg-muted/50 border border-border/50 p-4">
                                        <span className="font-semibold">Total Amount</span>
                                        <span className="text-xl font-bold">${selectedInvoice.total.toLocaleString()}</span>
                                      </div>

                                      {canManageBilling && selectedInvoice.status !== 'paid' && (
                                        <Button className="w-full">Mark as Paid</Button>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              {canManageBilling && invoice.status !== 'paid' && (
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                  <Button variant="outline" size="sm" className="border-border/50">Mark Paid</Button>
                                </motion.div>
                              )}
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Spotlight>
        </motion.div>
      </div>
    </Layout>
  );
}
