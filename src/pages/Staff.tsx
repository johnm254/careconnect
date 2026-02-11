import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockStaff } from '@/data/mockData';
import { Staff } from '@/types/hospital';
import { Search, Phone, Mail, Clock, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d';
import { useLoading } from '@/hooks/use-loading';
import { PatientCardSkeleton } from '@/components/ui/skeleton-shimmer';
import { useDebounce } from '@/hooks/use-debounce';

const departments = ['All', 'Cardiology', 'Pediatrics', 'General Medicine', 'Orthopedics'];

export default function StaffDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const isLoading = useLoading(800);

  const filteredStaff = mockStaff.filter((staff) => {
    const searchMatch = staff.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                       staff.department.toLowerCase().includes(debouncedSearch.toLowerCase());
    const deptMatch = filterDepartment === 'All' || staff.department === filterDepartment;
    const roleMatch = filterRole === 'all' || staff.role === filterRole;
    return searchMatch && deptMatch && roleMatch;
  });

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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TextReveal>
            <h1 className="text-3xl font-bold tracking-tight">
              <GradientText>Staff Directory</GradientText>
            </h1>
          </TextReveal>
          <TextReveal delay={0.1}>
            <p className="text-muted-foreground">View doctors, nurses, and their availability</p>
          </TextReveal>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="flex flex-wrap gap-4 p-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50"
                  />
                </div>
                <div className="w-48">
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="bg-background/50 border-border/50">
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
                    <SelectTrigger className="bg-background/50 border-border/50">
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
          </Spotlight>
        </motion.div>

        {/* Staff Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStaff.map((staff, index) => (
            <motion.div
              key={staff.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <CardContainer containerClassName="w-full">
                <CardBody className="w-full">
                  <Spotlight className="w-full p-0">
                    <Card className="border-0 bg-transparent shadow-none overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative p-6">
                          {/* Availability Badge */}
                          <CardItem translateZ={30} className="absolute right-4 top-4">
                            <span
                              className={cn(
                                'rounded-lg px-2.5 py-1 text-xs font-semibold border',
                                staff.available 
                                  ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' 
                                  : 'bg-muted text-muted-foreground border-border/50'
                              )}
                            >
                              {staff.available ? 'Available' : 'Unavailable'}
                            </span>
                          </CardItem>

                          {/* Avatar */}
                          <CardItem translateZ={50} className="mb-4 flex justify-center">
                            <motion.div
                              className={cn(
                                'flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-bold border backdrop-blur-sm',
                                staff.role === 'doctor' 
                                  ? 'bg-blue-500/20 text-blue-600 border-blue-500/30' 
                                  : 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
                              )}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {staff.name.split(' ').map((n) => n[0]).join('')}
                            </motion.div>
                          </CardItem>

                          {/* Info */}
                          <CardItem translateZ={20} className="text-center">
                            <h3 className="font-semibold">{staff.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{staff.role}</p>
                            {staff.specialization && (
                              <p className="mt-1 text-sm font-medium text-primary">{staff.specialization}</p>
                            )}
                            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              {staff.department}
                            </div>
                          </CardItem>

                          {/* Actions */}
                          <CardItem translateZ={30} className="w-full">
                            <Dialog>
                              <DialogTrigger asChild>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                  <Button
                                    variant="outline"
                                    className="mt-4 w-full border-border/50 hover:bg-primary/10 hover:border-primary/50"
                                    onClick={() => setSelectedStaff(staff)}
                                  >
                                    View Profile
                                  </Button>
                                </motion.div>
                              </DialogTrigger>
                              <DialogContent className="border-border/50 bg-card/95 backdrop-blur-xl">
                                <DialogHeader>
                                  <DialogTitle>Staff Profile</DialogTitle>
                                </DialogHeader>
                                {selectedStaff && (
                                  <div className="space-y-4 py-4">
                                    <div className="flex items-center gap-4">
                                      <motion.div
                                        className={cn(
                                          'flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold border backdrop-blur-sm',
                                          selectedStaff.role === 'doctor' 
                                            ? 'bg-blue-500/20 text-blue-600 border-blue-500/30' 
                                            : 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
                                        )}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                      >
                                        {selectedStaff.name.split(' ').map((n) => n[0]).join('')}
                                      </motion.div>
                                      <div>
                                        <h3 className="text-xl font-semibold">{selectedStaff.name}</h3>
                                        <p className="text-muted-foreground capitalize">{selectedStaff.role}</p>
                                        {selectedStaff.specialization && (
                                          <p className="text-sm font-medium text-primary">{selectedStaff.specialization}</p>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-3 rounded-xl bg-muted/50 border border-border/50 p-4">
                                      <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                        <Building2 className="h-4 w-4 text-primary" />
                                        <span className="text-muted-foreground">Department:</span>
                                        <span className="font-medium">{selectedStaff.department}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span className="text-muted-foreground">Schedule:</span>
                                        <span className="font-medium">{selectedStaff.schedule}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                        <Phone className="h-4 w-4 text-primary" />
                                        <span className="font-medium">{selectedStaff.phone}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                        <Mail className="h-4 w-4 text-primary" />
                                        <span className="font-medium">{selectedStaff.email}</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center justify-between rounded-xl border border-border/50 p-4">
                                      <span className="text-sm">Availability Status</span>
                                      <span
                                        className={cn(
                                          'rounded-lg px-3 py-1.5 text-sm font-semibold border',
                                          selectedStaff.available 
                                            ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' 
                                            : 'bg-muted text-muted-foreground border-border/50'
                                        )}
                                      >
                                        {selectedStaff.available ? 'Available Today' : 'Not Available'}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
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

        {filteredStaff.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Spotlight>
              <Card className="border-0 bg-transparent shadow-none">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No staff members found matching your criteria
                </CardContent>
              </Card>
            </Spotlight>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
