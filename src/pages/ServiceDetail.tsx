import { PublicHeader } from '@/components/public/PublicHeader';
import { PublicFooter } from '@/components/public/PublicFooter';
import { ChatWidget } from '@/components/ChatWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { getServiceBySlug, publicServices } from '@/data/publicServices';

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const related = publicServices.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <ChatWidget />
      <PublicHeader />

      {/* Breadcrumb */}
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <Link to="/services" className="hover:text-brand">Services</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{service.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 border border-brand/20">
              <service.icon className="h-6 w-6 text-brand" />
            </div>
            <h1 className="mt-5 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{service.name}</h1>
            <p className="mt-4 text-muted-foreground">{service.longDesc}</p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-7 inline-block">
              <Button className="gap-2" size="lg" onClick={() => navigate('/book-consultation')}>
                Book This Service <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="overflow-hidden rounded-2xl border border-border shadow-sm"
          >
            {service.image ? (
              <img src={service.image} alt={service.name} className="h-72 w-full object-cover sm:h-96" />
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-muted sm:h-96">
                <service.icon className="h-16 w-16 text-brand/40" />
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* What's included */}
      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">What&rsquo;s Included</h2>
          <div className="mt-6 space-y-3">
            {service.bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <p className="text-sm text-foreground">{bullet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl font-bold tracking-tight text-foreground">Other Services</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {related.map((s) => (
            <motion.div key={s.slug} whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}>
              <Link to={`/services/${s.slug}`}>
                <Card className="h-full overflow-hidden border-border transition-shadow hover:shadow-lg">
                  {s.image ? (
                    <div className="h-28 w-full overflow-hidden">
                      <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
                    </div>
                  ) : null}
                  <CardContent className="p-5">
                    <s.icon className="h-5 w-5 text-brand" />
                    <h3 className="mt-3 font-semibold text-foreground">{s.name}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{s.shortDesc}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
