import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { TrustBar } from '@/components/public/TrustBar';
import { ChatWidget } from '@/components/ChatWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { publicServices } from '@/data/publicServices';

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <ChatWidget />
      <PublicHeader />

      {/* Hero */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand">Our Services</p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Full Outpatient Care, All in One Visit
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            From consultations to on-site medication, our Level 2 facility covers the everyday healthcare needs of
            the Mikindani community.
          </p>
        </div>
      </section>

      <TrustBar />

      {/* Services grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {publicServices.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: (i % 6) * 0.06 }}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
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

      {/* CTA */}
      <section className="border-t border-border bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Not Sure Which Service You Need?</h2>
          <p className="mt-3 text-muted-foreground">Book a general consultation and our team will guide you from there.</p>
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
