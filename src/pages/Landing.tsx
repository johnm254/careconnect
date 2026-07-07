import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, ArrowRight, MessageCircle, Stethoscope, HeartPulse, Thermometer, Baby, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TextReveal } from '@/components/ui/text-reveal';
import { ChatWidget } from '@/components/ChatWidget';
import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { TrustBar } from '@/components/public/TrustBar';
import { toast } from '@/hooks/use-toast';
import { usePersistedState } from '@/hooks/use-persisted-state';
import { publicServices } from '@/data/publicServices';
import { facilityFeatures } from '@/data/facilityFeatures';
import { careTeam } from '@/data/careTeam';

const WHATSAPP_NUMBER = '254759159881';

const HERO_IMAGE = 'https://images.pexels.com/photos/30677591/pexels-photo-30677591.jpeg?auto=compress&cs=tinysrgb&w=1600';
const ABOUT_TEASER_IMAGE = 'https://images.pexels.com/photos/18788957/pexels-photo-18788957.jpeg?auto=compress&cs=tinysrgb&w=900';

const healthTips = [
  { icon: HeartPulse, title: 'Managing Hypertension', desc: 'Take medication as prescribed, reduce salt intake, and keep regular check-up appointments.' },
  { icon: Thermometer, title: "A Child's Fever", desc: 'Seek care promptly for a fever lasting more than two days, or with difficulty breathing.' },
  { icon: Baby, title: 'Antenatal Visits', desc: 'Bring your antenatal card and attend all scheduled check-ups for you and your baby.' },
  { icon: Droplets, title: 'Staying Hydrated', desc: 'Drink water throughout the day and watch for signs of dehydration in hot weather.' },
];

const cardHover = { y: -6, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } };

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingForm, setBookingForm, clearBookingForm] = usePersistedState('ltm-booking-form', {
    name: '',
    phone: '',
    service: '',
    date: '',
    reason: '',
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [location]);

  const scrollToBook = () => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.phone.trim()) {
      toast({ title: 'Missing information', description: 'Please enter your name and phone number.', variant: 'destructive' });
      return;
    }
    setIsSending(true);

    const message = [
      'Hello La-tullah Medical Centre, I would like to book an appointment.',
      `Name: ${bookingForm.name}`,
      `Phone: ${bookingForm.phone}`,
      bookingForm.service && `Service: ${bookingForm.service}`,
      bookingForm.date && `Preferred Date: ${bookingForm.date}`,
      bookingForm.reason && `Reason: ${bookingForm.reason}`,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    setIsSending(false);
    clearBookingForm();
    toast({ title: 'Opening WhatsApp', description: "We'll confirm your appointment there." });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <ChatWidget />
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <motion.img
            src={HERO_IMAGE}
            alt="Doctor consulting with a patient at La-tullah Medical Centre"
            className="h-full w-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
          />
          <div className="absolute inset-0 bg-slate-950/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <TextReveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/80">Level 2 Outpatient Facility &middot; Mombasa</p>
          </TextReveal>
          <TextReveal delay={0.1}>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Outpatient Care, Close to Home
            </h1>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="mx-auto mt-6 max-w-lg text-lg text-white/90">
              Consultations, minor surgery, and on-site medication. Quality outpatient care for the Mikindani
              community, no admission required.
            </p>
          </TextReveal>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" className="gap-2" onClick={() => navigate('/book-consultation')}>
                Book a Consultation <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Our Services
              </Button>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> 0722 872147
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Mikindani, Mombasa
            </div>
          </motion.div>
        </div>
      </section>

      <TrustBar />

      {/* About */}
      <section id="about" className="scroll-mt-24 border-b border-border bg-muted/20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">About Us</p>
            <TextReveal>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Care That Doesn&rsquo;t Stop at Diagnosis</h2>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="mt-4 text-muted-foreground">
                La-tullah Medical Centre is a Level 2 outpatient facility along Mikindani Main Road, Mombasa. Our
                on-site pharmacy and laboratory mean most patients leave with a diagnosis, test results, and
                medication in a single visit &mdash; no admission required.
              </p>
            </TextReveal>
            <div className="mt-6 flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button asChild>
                  <Link to="/about" className="gap-2">
                    Learn More About Us <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="overflow-hidden rounded-2xl border border-border shadow-sm"
          >
            <img src={ABOUT_TEASER_IMAGE} alt="Healthcare professional at La-tullah Medical Centre" className="h-72 w-full object-cover sm:h-96" />
          </motion.div>
        </div>

        {/* Facility features */}
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-2xl text-center">
            <TextReveal>
              <h3 className="font-serif text-2xl font-bold tracking-tight text-foreground">What You Can Expect</h3>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="mt-3 text-muted-foreground">Practical, dependable care built around our patients.</p>
            </TextReveal>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {facilityFeatures.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.08 }} whileHover={cardHover}>
                <Card className="group h-full overflow-hidden border-border bg-background transition-shadow hover:shadow-lg">
                  {f.image ? (
                    <div className="h-32 w-full overflow-hidden">
                      <img src={f.image} alt={f.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center bg-muted">
                      <f.icon className="h-8 w-8 text-brand/60" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <h4 className="font-semibold text-foreground">{f.title}</h4>
                    <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Our Services</p>
          <TextReveal>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Full Outpatient Care, All in One Visit</h2>
          </TextReveal>
          <TextReveal delay={0.1}>
            <p className="mt-4 text-muted-foreground">From consultations to on-site medication, all in one visit.</p>
          </TextReveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publicServices.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: (i % 6) * 0.06 }}
              whileHover={cardHover}
            >
              <Link to={`/services/${service.slug}`}>
                <Card className="group h-full overflow-hidden border-border transition-shadow hover:shadow-lg">
                  {service.image ? (
                    <div className="h-40 w-full overflow-hidden">
                      <img src={service.image} alt={service.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-muted">
                      <service.icon className="h-10 w-10 text-brand/60" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2.5">
                      <service.icon className="h-5 w-5 text-brand" />
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{service.shortDesc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand">
                      Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Doctors / Team */}
      <section id="doctors" className="scroll-mt-24 border-y border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">Our Care Team</p>
            <TextReveal>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Doctors &amp; Staff You Can Trust</h2>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="mt-4 text-muted-foreground">Registered medical professionals giving you attentive, respectful care at every visit.</p>
            </TextReveal>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {careTeam.map((member, i) => (
              <motion.div key={member.role} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.06 }} whileHover={cardHover}>
                <Card className="group h-full overflow-hidden border-border transition-shadow hover:shadow-lg">
                  {member.image ? (
                    <div className="h-40 w-full overflow-hidden">
                      <img src={member.image} alt={member.role} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-muted">
                      <member.icon className="h-10 w-10 text-brand/60" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-foreground">{member.role}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{member.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Button variant="outline" asChild>
                <Link to="/doctors" className="gap-2">
                  Meet the Full Team <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Health tips */}
      <section id="health-tips" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Patient Resources</p>
          <TextReveal>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Health Tips &amp; FAQs</h2>
          </TextReveal>
          <TextReveal delay={0.1}>
            <p className="mt-4 text-muted-foreground">Simple guidance to help you and your family stay well.</p>
          </TextReveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {healthTips.map((tip, i) => (
            <motion.div key={tip.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.08 }} whileHover={cardHover}>
              <Card className="h-full border-border">
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 border border-brand/20">
                    <tip.icon className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{tip.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{tip.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Button variant="outline" asChild>
              <Link to="/health-education" className="gap-2">
                Read More Health Tips &amp; FAQs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 border-t border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <TextReveal>
                <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Visit or Reach Us</h2>
              </TextReveal>
              <TextReveal delay={0.1}>
                <p className="mt-4 text-muted-foreground">We&rsquo;re here for the Mikindani community, every day.</p>
              </TextReveal>

              <div className="mt-8 space-y-4">
                {[
                  { icon: MapPin, title: 'Along Mikindani Main Road', sub: 'Next to Kwa Shee Junction, Mikindani, Mombasa' },
                  { icon: Phone, title: '0722 872147 / 0105 361277', sub: 'Call for appointments and inquiries' },
                  { icon: Mail, title: 'latullahmedcentre@gmail.com', sub: 'Email us anytime' },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
                      <item.icon className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <Card className="border-border">
                <CardContent className="p-8 text-center">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20">
                    <Stethoscope className="h-7 w-7 text-brand" />
                  </motion.div>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-foreground">Ready when you are</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Book a consultation over WhatsApp and we&rsquo;ll confirm your appointment.</p>
                  <div className="mt-6 flex justify-center">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                      <Button className="gap-2" onClick={scrollToBook}>
                        Book a Consultation <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Booking via WhatsApp */}
      <section id="book" className="scroll-mt-24 bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-xl text-center">
            <TextReveal>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Book an Appointment</h2>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p className="mt-4 text-muted-foreground">Fill in your details and we&rsquo;ll confirm your appointment over WhatsApp.</p>
            </TextReveal>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10">
            <Card className="border-border">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="book-name">Full Name</Label>
                      <Input id="book-name" value={bookingForm.name} onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })} placeholder="Your full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="book-phone">Phone Number</Label>
                      <Input id="book-phone" value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} placeholder="+254 7XX XXX XXX" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Service</Label>
                      <Select value={bookingForm.service} onValueChange={(v) => setBookingForm({ ...bookingForm, service: v })}>
                        <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                        <SelectContent>
                          {publicServices.map((s) => (
                            <SelectItem key={s.slug} value={s.name}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="book-date">Preferred Date</Label>
                      <Input id="book-date" type="date" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="book-reason">Reason for Visit (Optional)</Label>
                    <Textarea id="book-reason" value={bookingForm.reason} onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })} placeholder="Briefly tell us why you'd like to visit..." />
                  </div>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" size="lg" className="w-full gap-2 bg-[#25D366] text-white border-[#1ebe57] hover:bg-[#1ebe57]" disabled={isSending}>
                      <MessageCircle className="h-5 w-5" /> {isSending ? 'Opening WhatsApp...' : 'Send via WhatsApp'}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
