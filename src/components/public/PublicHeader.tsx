import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const navLinks = [
  { label: 'Home', section: null },
  { label: 'About Us', section: 'about' },
  { label: 'Services', section: 'services' },
  { label: 'Our Doctors', section: 'doctors' },
  { label: 'Health Tips', section: 'health-tips' },
];

export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const goBook = () => {
    setMobileOpen(false);
    navigate('/book-consultation');
  };

  const goToSection = (section: string | null) => {
    setMobileOpen(false);
    if (location.pathname === '/') {
      if (!section) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(section ? `/#${section}` : '/');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <motion.div whileHover={{ rotate: -6, scale: 1.06 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Logo className="h-9 w-9" />
          </motion.div>
          <span className="font-serif text-lg font-semibold tracking-tight text-foreground">La-tullah Medical Centre</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => goToSection(link.section)}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-brand transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button className="gap-2" onClick={goBook}>
              Book Consultation <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button key={link.label} onClick={() => goToSection(link.section)} className="text-left text-sm font-medium text-muted-foreground">
                {link.label}
              </button>
            ))}
            <Button onClick={goBook}>Book Consultation</Button>
          </div>
        </motion.div>
      )}
    </header>
  );
}
