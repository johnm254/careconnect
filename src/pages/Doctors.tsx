import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { TrustBar } from '@/components/public/TrustBar';
import { ChatWidget } from '@/components/ChatWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { careTeam } from '@/data/careTeam';

const TEAM_IMAGE = 'https://images.pexels.com/photos/37285163/pexels-photo-37285163.jpeg?auto=compress&cs=tinysrgb&w=1200';

export default function Doctors() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <ChatWidget />
      <PublicHeader />

      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Our Care Team</p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Doctors &amp; Staff You Can Trust
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Our team of registered medical officers, clinical officers, nurses, and support staff are here to give
            you attentive, respectful care at every visit.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-1 max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="overflow-hidden rounded-2xl border border-border shadow-sm">
          <img src={TEAM_IMAGE} alt="La-tullah Medical Centre care team" className="h-64 w-full object-cover sm:h-80" />
        </motion.div>
      </div>

      <TrustBar className="mt-12" />

      {/* Care team roles */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Meet the Team Behind Your Care</h2>
          <p className="mt-3 text-muted-foreground">
            All our clinical staff are qualified, registered healthcare professionals under their respective
            professional councils.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {careTeam.map((member, i) => (
            <motion.div
              key={member.role}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            >
              <Card className="group h-full overflow-hidden border-border transition-shadow hover:shadow-lg">
                {member.image ? (
                  <div className="h-44 w-full overflow-hidden">
                    <img src={member.image} alt={member.role} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                ) : (
                  <div className="flex h-44 w-full items-center justify-center bg-muted">
                    <member.icon className="h-10 w-10 text-brand/60" />
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground">{member.role}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{member.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
          Individual staff names, photos, and credentials are available on request at the facility.
        </p>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Ready to See Our Team?</h2>
          <p className="mt-3 text-muted-foreground">Book a consultation and meet the people who will care for you.</p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-6 inline-block">
            <Button className="gap-2" size="lg" onClick={() => navigate('/book-consultation')}>
              Book a Consultation <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
