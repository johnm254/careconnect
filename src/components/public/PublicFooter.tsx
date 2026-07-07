import { Link } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Instagram } from 'lucide-react';
import { publicServices } from '@/data/publicServices';

const WHATSAPP_NUMBER = '254759159881';

const quickLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Services', href: '/services' },
  { label: 'Our Doctors', href: '/doctors' },
  { label: 'Health Tips', href: '/health-education' },
  { label: 'Book an Appointment', href: '/book-consultation' },
];

export function PublicFooter() {
  return (
    <footer className="relative overflow-hidden border-t-4 border-transparent bg-slate-950 text-slate-300 [border-image:linear-gradient(to_right,hsl(var(--brand)),hsl(var(--brand-red)))_1]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_15%_20%,white,transparent_30%),radial-gradient(circle_at_85%_70%,white,transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="font-serif font-semibold text-white">La-tullah Medical Centre</span>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              A Level 2 outpatient facility serving the Mikindani community with consultations, minor surgery, and on-site medication.
            </p>
            <div className="mt-5 flex gap-3">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-brand hover:text-white">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-brand hover:text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-brand-red hover:text-white">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Quick Links</h4>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              {quickLinks.map((link) => (
                <Link key={link.href} to={link.href} className="text-slate-400 transition-colors hover:text-brand-red">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Services</h4>
            <div className="mt-4 flex flex-col gap-2.5 text-sm">
              {publicServices.slice(0, 5).map((s) => (
                <Link key={s.slug} to={`/services/${s.slug}`} className="text-slate-400 transition-colors hover:text-brand-red">
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Contact</h4>
            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
                <span>Along Mikindani Main Road, Next to Kwa Shee Junction, Mombasa</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-brand" />
                <span>0722 872147</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand" />
                <span>latullahmedcentre@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-brand-red" />
                <span>Open daily</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-sm text-slate-500">&copy; 2026 La-tullah Medical Centre, Mombasa. All rights reserved.</p>
          <p className="text-xs text-slate-600">Outpatient care with heart, in Mikindani.</p>
        </div>
      </div>
    </footer>
  );
}
