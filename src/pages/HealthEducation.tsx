import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ChatWidget } from '@/components/ChatWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HeartPulse, Baby, Thermometer, Droplets } from 'lucide-react';

const faqs = [
  {
    q: 'Do I need an appointment to be seen?',
    a: 'No, we accept walk-ins daily. You can also book ahead over WhatsApp or through this website if you would rather avoid waiting.',
  },
  {
    q: 'Do you accept NHIF?',
    a: 'Yes, we accept NHIF for eligible services. Please bring your NHIF card or membership number when you visit.',
  },
  {
    q: 'What should I bring to my first visit?',
    a: 'A form of identification, your NHIF card if you have one, and any previous medical records or medication you are currently taking.',
  },
  {
    q: 'Do you treat children?',
    a: 'Yes, we see patients of all ages, including infants and children, for consultations, immunization, and growth monitoring.',
  },
  {
    q: 'What happens if my condition needs a hospital admission?',
    a: 'As a Level 2 outpatient facility, we do not admit patients overnight. If your condition needs admission or specialist surgery, we will refer and help arrange transfer to an appropriate hospital.',
  },
  {
    q: 'How do I get my lab test results?',
    a: 'Most on-site lab tests are processed the same day. Your doctor will review the results with you before you leave.',
  },
  {
    q: 'Can I get my prescription filled at your facility?',
    a: 'Yes, our on-site pharmacy dispenses prescribed medication immediately after your consultation.',
  },
];

const healthTips = [
  {
    icon: HeartPulse,
    title: 'Managing Hypertension',
    desc: 'Take medication as prescribed, reduce salt intake, stay active, and keep regular check-up appointments to monitor your blood pressure.',
  },
  {
    icon: Thermometer,
    title: "When to Seek Care for a Child's Fever",
    desc: 'Seek care promptly if a fever lasts more than two days, is very high, or comes with difficulty breathing, rash, or unusual drowsiness.',
  },
  {
    icon: Baby,
    title: 'Preparing for Your Antenatal Visit',
    desc: 'Bring your antenatal card if you have one, note any symptoms or concerns, and try to attend all scheduled check-ups for you and your baby.',
  },
  {
    icon: Droplets,
    title: 'Staying Hydrated in Hot Weather',
    desc: 'Drink water throughout the day, limit sugary drinks, and watch for signs of dehydration such as dizziness or dark urine.',
  },
];

export default function HealthEducation() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <ChatWidget />
      <PublicHeader />

      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Patient Resources</p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Health Education &amp; FAQs
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Answers to common questions and simple health tips to help you and your family stay well.
          </p>
        </div>
      </section>

      {/* Health tips */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Health Tips</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {healthTips.map((tip, i) => (
            <motion.div
              key={tip.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            >
              <Card className="h-full border-border transition-shadow hover:shadow-lg">
                <CardContent className="flex gap-4 p-6">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 border border-brand/20">
                    <tip.icon className="h-5 w-5 text-brand" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-foreground">{tip.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{tip.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          These tips are general guidance and do not replace a consultation. Please see a doctor for advice specific to your condition.
        </p>
      </section>

      {/* FAQs */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="mt-6">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Still Have Questions?</h2>
        <p className="mt-3 text-muted-foreground">Reach out to our team directly, or book a consultation.</p>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-6 inline-block">
          <Button className="gap-2" size="lg" onClick={() => navigate('/book-consultation')}>
            Book a Consultation <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </section>

      <PublicFooter />
    </div>
  );
}
