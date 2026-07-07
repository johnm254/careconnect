import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { TrustBar } from '@/components/public/TrustBar';
import { ChatWidget } from '@/components/ChatWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { facilityFeatures } from '@/data/facilityFeatures';

const ABOUT_IMAGE = '';
const COMMUNITY_IMAGE = 'https://images.pexels.com/photos/33127835/pexels-photo-33127835.jpeg?auto=compress&cs=tinysrgb&w=900';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <ChatWidget />
      <PublicHeader />

      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">About Us</p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Outpatient Care, Rooted in the Mikindani Community
            </h1>
            <p className="mt-5 text-muted-foreground">
              La-tullah Medical Centre is a Level 2 outpatient healthcare facility along Mikindani Main Road,
              Mombasa. We provide consultations, minor surgery, on-site medication, and preventive care for the
              community we call home &mdash; no admission required.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button className="gap-2" onClick={() => navigate('/book-consultation')}>
                  Book a Consultation <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" onClick={() => navigate('/services')}>
                  View Our Services
                </Button>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="overflow-hidden rounded-2xl border border-border shadow-sm"
          >
            {ABOUT_IMAGE ? (
              <img src={ABOUT_IMAGE} alt="La-tullah Medical Centre facility" className="h-72 w-full object-cover sm:h-96" />
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-muted text-sm text-muted-foreground sm:h-96">
                Facility photo coming soon
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <TrustBar />

      {/* What is a Level 2 facility */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">What Is a Level 2 Facility?</h2>
        <p className="mt-4 text-muted-foreground">
          Kenya&rsquo;s healthcare system is organised into levels, from community health units up to national
          referral hospitals. As a Level 2 facility (dispensary), La-tullah Medical Centre focuses on outpatient
          care: consultations, basic curative treatment, minor procedures, maternal and child health, and
          preventive services like immunization and family planning.
        </p>
        <p className="mt-4 text-muted-foreground">
          We do not admit patients overnight. When a condition needs specialist care, surgery beyond a minor
          procedure, or inpatient admission, we refer you to an appropriate higher-level hospital and help you get
          there quickly.
        </p>
      </section>

      {/* Facility features */}
      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">What You Can Expect</h2>
            <p className="mt-3 text-muted-foreground">Practical, dependable care built around our patients.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {facilityFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              >
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
                    <h3 className="font-semibold text-foreground">{f.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community commitment */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Committed to Mikindani</h2>
            <p className="mt-4 text-muted-foreground">
              We are part of the community we serve. Our team is made up of registered healthcare professionals
              who prioritise accessible, respectful, and unhurried care for every patient who walks through our
              door &mdash; whether it is a routine check-up or an urgent concern.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-brand" />
              Along Mikindani Main Road, Next to Kwa Shee Junction, Mombasa
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-1 overflow-hidden rounded-2xl border border-border shadow-sm lg:order-2"
          >
            <img src={COMMUNITY_IMAGE} alt="Community health outreach" className="h-64 w-full object-cover sm:h-80" />
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
