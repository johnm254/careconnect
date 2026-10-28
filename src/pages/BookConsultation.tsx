import { useState, useCallback } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { GradientOrb } from '@/components/ui/animated-gradient';
import { FloatingParticles } from '@/components/ui/floating-particles';
import { Spotlight } from '@/components/ui/spotlight';
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';

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

  const sendConfirmationEmail = useCallback(async (ref: string, doctor: typeof mockStaff[0] | undefined) => {
    if (!formData.email) return;

    try {
      const { data, error } = await supabase.functions.invoke('send-booking-confirmation', {
        body: {
          patientName: formData.name,
          patientEmail: formData.email,
          patientPhone: formData.phone,
          doctorName: doctor?.name || '',
          department: formData.department,
          date: formData.date ? format(formData.date, 'PPP') : '',
          time: formData.time,
          bookingRef: ref,
          reason: formData.reason,
        },
      });

      if (error) {
        console.error('Error sending confirmation:', error);
      } else {
        console.log('Confirmation sent:', data);
      }
    } catch (err) {
      console.error('Failed to send confirmation:', err);
    }
  }, [formData]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const ref = `CNS-${Date.now().toString().slice(-6)}`;
      setBookingRef(ref);
      setBookingComplete(true);
      sendConfirmationEmail(ref, selectedDoctor);
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
      <div className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0">
          <GradientOrb className="left-1/3 top-1/3" />
          <GradientOrb className="right-1/4 bottom-1/4 bg-green-500/10" />
        </div>
        <FloatingParticles className="z-0" quantity={20} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10"
        >
          <CardContainer>
            <CardBody>
              <Card className="w-full max-w-md text-center border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-4">
                  <CardItem translateZ={50}>
                    <motion.div 
                      className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </motion.div>
                  </CardItem>
                  <CardItem translateZ={30}>
                    <CardTitle className="text-2xl">
                      <GradientText>Booking Confirmed!</GradientText>
                    </CardTitle>
                  </CardItem>
                  <CardItem translateZ={20}>
                    <CardDescription>Your consultation has been scheduled successfully.</CardDescription>
                  </CardItem>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardItem translateZ={40} className="w-full">
                    <Spotlight className="rounded-lg p-4 space-y-2 text-left">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reference:</span>
                        <span className="font-semibold text-primary">{bookingRef}</span>
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
                    </Spotlight>
                  </CardItem>
                  
                  {formData.email && (
                    <motion.p 
                      className="text-sm text-primary flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Mail className="h-4 w-4" />
                      Confirmation sent to {formData.email}
                    </motion.p>
                  )}
                  
                  <p className="text-sm text-muted-foreground">
                    Please arrive 15 minutes before your appointment time.
                  </p>
                  
                  <CardItem translateZ={30} className="w-full">
                    <Button className="w-full" onClick={() => navigate('/patient/dashboard')}>
                      Back to Dashboard
                    </Button>
                  </CardItem>
                </CardContent>
              </Card>
            </CardBody>
          </CardContainer>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background p-4 md:p-8">
      <BackgroundBeams className="z-0" />
      <div className="absolute inset-0">
        <GradientOrb className="left-1/4 top-1/4" />
        <GradientOrb className="right-1/3 bottom-1/3 bg-primary/10" />
      </div>
      <FloatingParticles className="z-0" quantity={25} />
      
      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Header */}
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              className="absolute left-4 top-4 backdrop-blur-sm"
              onClick={() => navigate('/patient/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </motion.div>
          
          <motion.div 
            className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Stethoscope className="h-10 w-10 text-primary" />
          </motion.div>
          
          <TextReveal delay={0.3}>
            <h1 className="text-4xl font-bold tracking-tight">
              Book a <GradientText>Consultation</GradientText>
            </h1>
          </TextReveal>
          <TextReveal delay={0.4}>
            <p className="mt-2 text-muted-foreground">Schedule your visit in just a few steps</p>
          </TextReveal>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          className="mb-8 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <motion.div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all border-2',
                  step >= s
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                    : 'bg-muted/50 text-muted-foreground border-border/50 backdrop-blur-sm'
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + s * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
              >
                {s}
              </motion.div>
              {s < 3 && (
                <motion.div
                  className={cn(
                    'h-1 w-16 mx-2 rounded-full transition-all',
                    step > s ? 'bg-primary' : 'bg-border/50'
                  )}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7 + s * 0.1 }}
                />
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
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
              <AnimatePresence mode="wait">
                {/* Step 1: Patient Information */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          className="pl-10 bg-background/50 backdrop-blur-sm border-border/50"
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
                          className="pl-10 bg-background/50 backdrop-blur-sm border-border/50"
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
                          className="pl-10 bg-background/50 backdrop-blur-sm border-border/50"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Select Doctor */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label>Department *</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => {
                          updateFormData('department', value);
                          updateFormData('doctorId', '');
                        }}
                      >
                        <SelectTrigger className="bg-background/50 backdrop-blur-sm border-border/50">
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
                          {availableDoctors.map((doctor, index) => (
                            <motion.div
                              key={doctor.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Spotlight
                                className={cn(
                                  'flex items-center gap-4 p-4 cursor-pointer transition-all',
                                  formData.doctorId === doctor.id
                                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                                    : 'hover:bg-accent/50'
                                )}
                              >
                                <div 
                                  className="flex w-full items-center gap-4"
                                  onClick={() => updateFormData('doctorId', doctor.id)}
                                >
                                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
                                    <Stethoscope className="h-7 w-7 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold">{doctor.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {doctor.specialization} • {doctor.schedule}
                                    </p>
                                  </div>
                                  {formData.doctorId === doctor.id && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 300 }}
                                    >
                                      <CheckCircle2 className="h-6 w-6 text-primary" />
                                    </motion.div>
                                  )}
                                </div>
                              </Spotlight>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Date & Time */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label>Select Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm border-border/50',
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
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Select Time Slot *</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot, index) => (
                          <motion.div
                            key={slot}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Button
                              type="button"
                              variant={formData.time === slot ? 'default' : 'outline'}
                              size="sm"
                              className={cn(
                                'gap-1 w-full',
                                formData.time === slot && 'shadow-lg shadow-primary/30',
                                formData.time !== slot && 'bg-background/50 backdrop-blur-sm border-border/50'
                              )}
                              onClick={() => updateFormData('time', slot)}
                            >
                              <Clock className="h-3 w-3" />
                              {slot}
                            </Button>
                          </motion.div>
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
                        className="bg-background/50 backdrop-blur-sm border-border/50"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <motion.div 
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full border-border/50"
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </Button>
                  </motion.div>
                )}
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full relative overflow-hidden"
                    onClick={handleNext}
                    disabled={isSubmitting}
                  >
                    <span className="relative z-10">
                      {isSubmitting ? 'Booking...' : step === 3 ? 'Confirm Booking' : 'Next'}
                    </span>
                    {isSubmitting && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/30 to-primary/0"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
