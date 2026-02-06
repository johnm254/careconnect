import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockPatients } from '@/data/mockData';
import { Patient } from '@/types/hospital';
import { useRole } from '@/contexts/RoleContext';
import { Search, UserPlus, Eye, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';

export default function Patients() {
  const { currentRole } = useRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  const canAddPatient = currentRole === 'admin' || currentRole === 'receptionist';

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
                <GradientText>Patients</GradientText>
              </h1>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="text-muted-foreground">Manage patient records and information</p>
            </TextReveal>
          </div>
          {canAddPatient && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                      <UserPlus className="h-4 w-4" />
                      Add Patient
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl border-border/50 bg-card/95 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle>Register New Patient</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter patient name" className="bg-background/50 border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" placeholder="Age" className="bg-background/50 border-border/50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select>
                          <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select>
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="+1 (555) 000-0000" className="bg-background/50 border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="patient@email.com" className="bg-background/50 border-border/50" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="Street address, city" className="bg-background/50 border-border/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergency">Emergency Contact</Label>
                        <Input id="emergency" placeholder="+1 (555) 000-0000" className="bg-background/50 border-border/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="insurance">Insurance ID (Optional)</Label>
                        <Input id="insurance" placeholder="INS-XXXX-XXX" className="bg-background/50 border-border/50" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-border/50">Cancel</Button>
                    <Button onClick={() => setIsAddDialogOpen(false)}>Register Patient</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, or phone..."
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader>
                <CardTitle>Patient Registry</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age/Gender</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Blood Group</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient, index) => (
                      <motion.tr
                        key={patient.id}
                        className="border-border/50 hover:bg-accent/30 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                      >
                        <TableCell className="font-medium">{patient.id}</TableCell>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.age} / {patient.gender}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>
                          <span className="rounded-lg bg-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-600 border border-red-500/30">
                            {patient.bloodGroup}
                          </span>
                        </TableCell>
                        <TableCell>{patient.lastVisit || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(patient)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </motion.div>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg border-border/50 bg-card/95 backdrop-blur-xl">
                              <DialogHeader>
                                <DialogTitle>Patient Details</DialogTitle>
                              </DialogHeader>
                              {selectedPatient && (
                                <div className="space-y-4 py-4">
                                  <div className="flex items-center gap-4">
                                    <motion.div 
                                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30 text-2xl font-bold text-primary"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 200 }}
                                    >
                                      {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                                    </motion.div>
                                    <div>
                                      <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
                                      <p className="text-muted-foreground">ID: {selectedPatient.id}</p>
                                    </div>
                                  </div>
                                  <div className="grid gap-3">
                                    <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                      <Phone className="h-4 w-4 text-primary" />
                                      {selectedPatient.phone}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                      <Mail className="h-4 w-4 text-primary" />
                                      {selectedPatient.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                      <MapPin className="h-4 w-4 text-primary" />
                                      {selectedPatient.address}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/50 border border-border/50 p-4">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Age</p>
                                      <p className="font-medium">{selectedPatient.age} years</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Gender</p>
                                      <p className="font-medium">{selectedPatient.gender}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Blood Group</p>
                                      <p className="font-medium">{selectedPatient.bloodGroup}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Registered</p>
                                      <p className="font-medium">{selectedPatient.registeredDate}</p>
                                    </div>
                                  </div>
                                  {selectedPatient.insuranceId && (
                                    <div className="rounded-xl border border-border/50 p-4">
                                      <p className="text-xs text-muted-foreground">Insurance ID</p>
                                      <p className="font-medium">{selectedPatient.insuranceId}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </motion.tr>
                    ))}
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
