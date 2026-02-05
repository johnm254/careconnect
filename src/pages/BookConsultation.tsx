 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { Textarea } from '@/components/ui/textarea';
 import { Calendar } from '@/components/ui/calendar';
 import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
 import { mockStaff } from '@/data/mockData';
 import { toast } from '@/hooks/use-toast';
 import { CalendarIcon, Stethoscope, User, Phone, Mail, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';
 import { cn } from '@/lib/utils';
 import { format } from 'date-fns';
 
 const timeSlots = [
   '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
   '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
 ];
 
 const departments = ['Cardiology', 'Pediatrics', 'General Medicine', 'Orthopedics'];
 
 export default function BookConsultation() {
   const navigate = useNavigate();
   const [step, setStep] = useState(1);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [bookingComplete, setBookingComplete] = useState(false);
   const [bookingRef, setBookingRef] = useState('');
   
   const [formData, setFormData] = useState({
     name: '',
     phone: '',
     email: '',
     department: '',
     doctorId: '',
     date: undefined as Date | undefined,
     time: '',
     reason: '',
   });
 
   const doctors = mockStaff.filter(
     (s) => s.role === 'doctor' && (formData.department === '' || s.department === formData.department)
   );
 
   const availableDoctors = doctors.filter((d) => d.available);
 
   const updateFormData = (field: string, value: string | Date | undefined) => {
     setFormData((prev) => ({ ...prev, [field]: value }));
   };
 
   const validateStep1 = () => {
     if (!formData.name.trim() || !formData.phone.trim()) {
       toast({
         title: 'Missing Information',
         description: 'Please enter your name and phone number.',
         variant: 'destructive',
       });
       return false;
     }
     return true;
   };
 
   const validateStep2 = () => {
     if (!formData.department || !formData.doctorId) {
       toast({
         title: 'Missing Information',
         description: 'Please select a department and doctor.',
         variant: 'destructive',
       });
       return false;
     }
     return true;
   };
 
   const validateStep3 = () => {
     if (!formData.date || !formData.time) {
       toast({
         title: 'Missing Information',
         description: 'Please select a date and time for your consultation.',
         variant: 'destructive',
       });
       return false;
     }
     return true;
   };
 
   const handleNext = () => {
     if (step === 1 && validateStep1()) setStep(2);
     else if (step === 2 && validateStep2()) setStep(3);
     else if (step === 3 && validateStep3()) handleSubmit();
   };
 
   const handleSubmit = () => {
     setIsSubmitting(true);
     // Simulate API call
     setTimeout(() => {
       const ref = `CNS-${Date.now().toString().slice(-6)}`;
       setBookingRef(ref);
       setBookingComplete(true);
       setIsSubmitting(false);
       toast({
         title: 'Booking Confirmed!',
         description: `Your consultation has been booked. Reference: ${ref}`,
       });
     }, 1500);
   };
 
   const selectedDoctor = mockStaff.find((d) => d.id === formData.doctorId);
 
   if (bookingComplete) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
         <Card className="w-full max-w-md text-center">
           <CardHeader className="pb-4">
             <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
               <CheckCircle2 className="h-8 w-8 text-primary" />
             </div>
             <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
             <CardDescription>Your consultation has been scheduled successfully.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="rounded-lg bg-muted p-4 space-y-2 text-left">
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Reference:</span>
                 <span className="font-semibold">{bookingRef}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Doctor:</span>
                 <span className="font-medium">{selectedDoctor?.name}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Date:</span>
                 <span className="font-medium">{formData.date && format(formData.date, 'PPP')}</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Time:</span>
                 <span className="font-medium">{formData.time}</span>
               </div>
             </div>
             <p className="text-sm text-muted-foreground">
               Please arrive 15 minutes before your appointment time. Bring any relevant medical records.
             </p>
             <Button className="w-full" onClick={() => navigate('/')}>
               Return to Home
             </Button>
           </CardContent>
         </Card>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
       <div className="mx-auto max-w-2xl">
         {/* Header */}
         <div className="mb-8 text-center">
           <Button
             variant="ghost"
             className="absolute left-4 top-4"
             onClick={() => navigate('/')}
           >
             <ArrowLeft className="mr-2 h-4 w-4" />
             Back to Login
           </Button>
           <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
             <Stethoscope className="h-8 w-8 text-primary" />
           </div>
           <h1 className="text-3xl font-bold tracking-tight">Book a Consultation</h1>
           <p className="mt-2 text-muted-foreground">Schedule your visit in just a few steps</p>
         </div>
 
         {/* Progress Steps */}
         <div className="mb-8 flex items-center justify-center gap-2">
           {[1, 2, 3].map((s) => (
             <div key={s} className="flex items-center">
               <div
                 className={cn(
                   'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                   step >= s
                     ? 'bg-primary text-primary-foreground'
                     : 'bg-muted text-muted-foreground'
                 )}
               >
                 {s}
               </div>
               {s < 3 && (
                 <div
                   className={cn(
                     'h-1 w-12 mx-2 rounded transition-colors',
                     step > s ? 'bg-primary' : 'bg-muted'
                   )}
                 />
               )}
             </div>
           ))}
         </div>
 
         <Card>
           <CardHeader>
             <CardTitle>
               {step === 1 && 'Your Information'}
               {step === 2 && 'Select Doctor'}
               {step === 3 && 'Choose Date & Time'}
             </CardTitle>
             <CardDescription>
               {step === 1 && 'Please provide your contact details'}
               {step === 2 && 'Choose your preferred department and doctor'}
               {step === 3 && 'Pick a convenient appointment slot'}
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             {/* Step 1: Patient Information */}
             {step === 1 && (
               <>
                 <div className="space-y-2">
                   <Label htmlFor="name">Full Name *</Label>
                   <div className="relative">
                     <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="name"
                       placeholder="Enter your full name"
                       className="pl-10"
                       value={formData.name}
                       onChange={(e) => updateFormData('name', e.target.value)}
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="phone">Phone Number *</Label>
                   <div className="relative">
                     <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="phone"
                       placeholder="Enter your phone number"
                       className="pl-10"
                       value={formData.phone}
                       onChange={(e) => updateFormData('phone', e.target.value)}
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="email">Email (Optional)</Label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <Input
                       id="email"
                       type="email"
                       placeholder="Enter your email address"
                       className="pl-10"
                       value={formData.email}
                       onChange={(e) => updateFormData('email', e.target.value)}
                     />
                   </div>
                 </div>
               </>
             )}
 
             {/* Step 2: Select Doctor */}
             {step === 2 && (
               <>
                 <div className="space-y-2">
                   <Label>Department *</Label>
                   <Select
                     value={formData.department}
                     onValueChange={(value) => {
                       updateFormData('department', value);
                       updateFormData('doctorId', '');
                     }}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Select a department" />
                     </SelectTrigger>
                     <SelectContent>
                       {departments.map((dept) => (
                         <SelectItem key={dept} value={dept}>
                           {dept}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label>Doctor *</Label>
                   {formData.department && availableDoctors.length === 0 ? (
                     <p className="text-sm text-muted-foreground py-2">
                       No doctors available in this department. Please select another department.
                     </p>
                   ) : (
                     <div className="grid gap-3">
                       {availableDoctors.map((doctor) => (
                         <div
                           key={doctor.id}
                           className={cn(
                             'flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors',
                             formData.doctorId === doctor.id
                               ? 'border-primary bg-primary/5'
                               : 'hover:border-primary/50'
                           )}
                           onClick={() => updateFormData('doctorId', doctor.id)}
                         >
                           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                             <Stethoscope className="h-6 w-6 text-primary" />
                           </div>
                           <div className="flex-1">
                             <p className="font-medium">{doctor.name}</p>
                             <p className="text-sm text-muted-foreground">
                               {doctor.specialization} • {doctor.schedule}
                             </p>
                           </div>
                           {formData.doctorId === doctor.id && (
                             <CheckCircle2 className="h-5 w-5 text-primary" />
                           )}
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               </>
             )}
 
             {/* Step 3: Date & Time */}
             {step === 3 && (
               <>
                 <div className="space-y-2">
                   <Label>Select Date *</Label>
                   <Popover>
                     <PopoverTrigger asChild>
                       <Button
                         variant="outline"
                         className={cn(
                           'w-full justify-start text-left font-normal',
                           !formData.date && 'text-muted-foreground'
                         )}
                       >
                         <CalendarIcon className="mr-2 h-4 w-4" />
                         {formData.date ? format(formData.date, 'PPP') : 'Pick a date'}
                       </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0" align="start">
                       <Calendar
                         mode="single"
                         selected={formData.date}
                         onSelect={(date) => updateFormData('date', date)}
                         disabled={(date) => date < new Date() || date.getDay() === 0}
                         initialFocus
                       />
                     </PopoverContent>
                   </Popover>
                 </div>
                 <div className="space-y-2">
                   <Label>Select Time Slot *</Label>
                   <div className="grid grid-cols-3 gap-2">
                     {timeSlots.map((slot) => (
                       <Button
                         key={slot}
                         type="button"
                         variant={formData.time === slot ? 'default' : 'outline'}
                         size="sm"
                         className="gap-1"
                         onClick={() => updateFormData('time', slot)}
                       >
                         <Clock className="h-3 w-3" />
                         {slot}
                       </Button>
                     ))}
                   </div>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="reason">Reason for Visit (Optional)</Label>
                   <Textarea
                     id="reason"
                     placeholder="Briefly describe your symptoms or reason for visit..."
                     value={formData.reason}
                     onChange={(e) => updateFormData('reason', e.target.value)}
                   />
                 </div>
               </>
             )}
 
             {/* Navigation Buttons */}
             <div className="flex gap-3 pt-4">
               {step > 1 && (
                 <Button
                   variant="outline"
                   className="flex-1"
                   onClick={() => setStep(step - 1)}
                 >
                   Back
                 </Button>
               )}
               <Button
                 className="flex-1"
                 onClick={handleNext}
                 disabled={isSubmitting}
               >
                 {isSubmitting ? 'Booking...' : step === 3 ? 'Confirm Booking' : 'Next'}
               </Button>
             </div>
           </CardContent>
         </Card>
       </div>
     </div>
   );
 }