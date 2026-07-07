import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useRole } from '@/contexts/RoleContext';
import { Boxes, Plus, Search, AlertTriangle, Trash2, Pencil, PackagePlus, PackageMinus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d';
import { TableSkeleton, CardSkeleton } from '@/components/ui/skeleton-shimmer';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/lib/api';
import {
  ApiInventoryItem,
  InventoryItemInput,
  useInventory,
  useInventoryAlerts,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
  useInventoryTransaction,
} from '@/hooks/api/useInventory';

const CATEGORIES = ['drug', 'consumable', 'equipment', 'other'];
const emptyForm: InventoryItemInput = { sku: '', name: '', category: 'drug', unit: '', reorderLevel: 10, unitCost: 0 };

export default function Inventory() {
  const { currentRole } = useRole();
  const canManage = currentRole === 'admin' || currentRole === 'pharmacist' || currentRole === 'nurse';
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiInventoryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ApiInventoryItem | null>(null);
  const [txItem, setTxItem] = useState<ApiInventoryItem | null>(null);
  const [txForm, setTxForm] = useState({ type: 'restock', quantity: '', reason: '' });
  const [form, setForm] = useState<InventoryItemInput>(emptyForm);

  const { data: items, isLoading } = useInventory({
    category: filterCategory !== 'all' ? filterCategory : undefined,
    search: debouncedSearch || undefined,
  });
  const { data: alerts } = useInventoryAlerts();
  const createItem = useCreateInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();
  const runTransaction = useInventoryTransaction();

  const resetForm = () => setForm(emptyForm);

  const handleCreate = async () => {
    if (!form.sku || !form.name || !form.unit) {
      toast({ title: 'Missing information', description: 'SKU, name, and unit are required.', variant: 'destructive' });
      return;
    }
    try {
      await createItem.mutateAsync(form);
      toast({ title: 'Item added to inventory' });
      setIsAddOpen(false);
      resetForm();
    } catch (err) {
      toast({ title: 'Failed to add item', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
    }
  };

  const openEdit = (item: ApiInventoryItem) => {
    setEditingItem(item);
    setForm({
      sku: item.sku,
      name: item.name,
      category: item.category,
      unit: item.unit,
      reorderLevel: item.reorder_level,
      unitCost: item.unit_cost,
      supplier: item.supplier ?? '',
      batchNumber: item.batch_number ?? '',
      expiryDate: item.expiry_date ?? '',
      requiresExpiryTracking: !!item.requires_expiry_tracking,
    });
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      await updateItem.mutateAsync({ id: editingItem.id, ...form });
      toast({ title: 'Item updated' });
      setEditingItem(null);
      resetForm();
    } catch (err) {
      toast({ title: 'Failed to update item', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteItem.mutateAsync(deletingItem.id);
      toast({ title: 'Item removed from inventory' });
      setDeletingItem(null);
    } catch (err) {
      toast({ title: 'Failed to remove item', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
    }
  };

  const handleTransaction = async () => {
    if (!txItem || !txForm.quantity) return;
    try {
      await runTransaction.mutateAsync({ id: txItem.id, type: txForm.type, quantity: Number(txForm.quantity), reason: txForm.reason });
      toast({ title: 'Stock updated' });
      setTxItem(null);
      setTxForm({ type: 'restock', quantity: '', reason: '' });
    } catch (err) {
      toast({ title: 'Failed to update stock', description: err instanceof ApiError ? err.message : 'Please try again.', variant: 'destructive' });
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
          <div className="grid gap-4 md:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <TableSkeleton rows={6} />
        </div>
      </Layout>
    );
  }

  const renderForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>SKU</Label>
          <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="MED-0001" className="bg-background/50 border-border/50" disabled={!!editingItem} />
        </div>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Paracetamol 500mg" className="bg-background/50 border-border/50" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger className="bg-background/50 border-border/50"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="tablets, boxes, units..." className="bg-background/50 border-border/50" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Reorder Level</Label>
          <Input type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: Number(e.target.value) })} className="bg-background/50 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label>Unit Cost ($)</Label>
          <Input type="number" value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: Number(e.target.value) })} className="bg-background/50 border-border/50" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Supplier</Label>
          <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="Optional" className="bg-background/50 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label>Batch Number</Label>
          <Input value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} placeholder="Optional" className="bg-background/50 border-border/50" />
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
        <Label htmlFor="expiry-track">Track expiry date (drugs)</Label>
        <Switch id="expiry-track" checked={!!form.requiresExpiryTracking} onCheckedChange={(v) => setForm({ ...form, requiresExpiryTracking: v })} />
      </div>
      {form.requiresExpiryTracking && (
        <div className="space-y-2">
          <Label>Expiry Date</Label>
          <Input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="bg-background/50 border-border/50" />
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
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl"><GradientText>Inventory</GradientText></h1>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="text-muted-foreground">Track drugs and hospital supplies</p>
            </TextReveal>
          </div>
          {canManage && (
            <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-brand/20"><Plus className="h-4 w-4" /> Add Item</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl border-border/50 bg-card/95 backdrop-blur-xl">
                <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
                {renderForm()}
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddOpen(false)} className="border-border/50">Cancel</Button>
                  <Button onClick={handleCreate} disabled={createItem.isPending}>{createItem.isPending ? 'Adding…' : 'Add Item'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        {alerts && (alerts.lowStock.length > 0 || alerts.expiring.length > 0) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid gap-4 md:grid-cols-2">
            {alerts.lowStock.length > 0 && (
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  <p className="text-sm"><span className="font-semibold">{alerts.lowStock.length}</span> item(s) at or below reorder level</p>
                </CardContent>
              </Card>
            )}
            {alerts.expiring.length > 0 && (
              <Card className="border-red-500/30 bg-red-500/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                  <p className="text-sm"><span className="font-semibold">{alerts.expiring.length}</span> item(s) expiring within 30 days or expired</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="flex flex-wrap gap-4 p-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search by name or SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-background/50 border-border/50" />
                </div>
                <div className="w-full sm:w-48">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="bg-background/50 border-border/50"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </Spotlight>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-brand/10"><Boxes className="h-5 w-5 text-brand" /></div>
                  Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>SKU</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Qty on Hand</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Expiry</TableHead>
                      {canManage && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(items ?? []).map((item, index) => {
                      const isLow = item.quantity_on_hand <= item.reorder_level;
                      const isExpiring = item.expiry_date && new Date(item.expiry_date) <= new Date(Date.now() + 30 * 86400000);
                      return (
                        <motion.tr key={item.id} className="border-border/50 hover:bg-accent/30 transition-colors" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + index * 0.03 }}>
                          <TableCell className="font-medium">{item.sku}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="capitalize">{item.category}</TableCell>
                          <TableCell>
                            <span className={cn('rounded-lg px-2.5 py-1 text-xs font-semibold border', isLow ? 'bg-red-500/20 text-red-600 border-red-500/30' : 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30')}>
                              {item.quantity_on_hand} {item.unit}
                            </span>
                          </TableCell>
                          <TableCell>${item.unit_cost.toLocaleString()}</TableCell>
                          <TableCell>
                            {item.expiry_date ? (
                              <span className={cn(isExpiring && 'text-red-600 font-medium')}>{item.expiry_date}</span>
                            ) : 'N/A'}
                          </TableCell>
                          {canManage && (
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => setTxItem(item)} title="Restock/Consume">
                                  <PackagePlus className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                {currentRole === 'admin' && (
                                  <Button variant="ghost" size="icon" onClick={() => setDeletingItem(item)}>
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
                {(items ?? []).length === 0 && <p className="py-8 text-center text-muted-foreground">No inventory items found.</p>}
              </CardContent>
            </Card>
          </Spotlight>
        </motion.div>
      </div>

      {/* Edit */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && (setEditingItem(null), resetForm())}>
        <DialogContent className="max-w-2xl border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader><DialogTitle>Edit Item</DialogTitle></DialogHeader>
          {renderForm()}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditingItem(null)} className="border-border/50">Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateItem.isPending}>{updateItem.isPending ? 'Saving…' : 'Save Changes'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock transaction */}
      <Dialog open={!!txItem} onOpenChange={(open) => !open && setTxItem(null)}>
        <DialogContent className="max-w-md border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader><DialogTitle>Update Stock: {txItem?.name}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select value={txForm.type} onValueChange={(v) => setTxForm({ ...txForm, type: v })}>
                <SelectTrigger className="bg-background/50 border-border/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="restock">Restock (+)</SelectItem>
                  <SelectItem value="consumption">Consumption (-)</SelectItem>
                  <SelectItem value="adjustment">Adjustment (+)</SelectItem>
                  <SelectItem value="write_off">Write-off (-)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" value={txForm.quantity} onChange={(e) => setTxForm({ ...txForm, quantity: e.target.value })} className="bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>Reason (Optional)</Label>
              <Input value={txForm.reason} onChange={(e) => setTxForm({ ...txForm, reason: e.target.value })} className="bg-background/50 border-border/50" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setTxItem(null)} className="border-border/50">Cancel</Button>
            <Button onClick={handleTransaction} disabled={runTransaction.isPending} className="gap-2">
              <PackageMinus className="h-4 w-4" /> {runTransaction.isPending ? 'Updating…' : 'Update Stock'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <DialogContent className="max-w-sm border-border/50 bg-card/95 backdrop-blur-xl">
          <DialogHeader><DialogTitle>Remove {deletingItem?.name}?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This will permanently remove this item from inventory.</p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeletingItem(null)} className="border-border/50">Cancel</Button>
            <Button onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
