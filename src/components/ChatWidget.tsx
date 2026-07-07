import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Sparkles, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const WHATSAPP_NUMBER = '254759159881';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

interface ChatMessage {
  id: number;
  from: 'bot' | 'user';
  text: string;
}

const QUICK_REPLIES = ['Our Services', 'Location & Hours', 'Book an Appointment', 'Talk to a Human'];

function answerFor(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('service') || q.includes('offer') || q.includes('treat')) {
    return "We're an outpatient clinic offering consultations, minor surgery, on-site pharmacy and medication, maternal and child health, laboratory tests, immunization, physiotherapy, family planning, and HIV testing and counselling.";
  }
  if (q.includes('location') || q.includes('where') || q.includes('address') || q.includes('hour') || q.includes('open') || q.includes('time')) {
    return "We're along Mikindani Main Road, next to Kwa Shee Junction, Mombasa. We're open daily. Call 0722 872147 for exact hours.";
  }
  if (q.includes('book') || q.includes('appointment') || q.includes('consult')) {
    return 'You can book an appointment right on this page, scroll down to the "Book an Appointment" form, or chat with us directly on WhatsApp.';
  }
  if (q.includes('human') || q.includes('call') || q.includes('phone') || q.includes('whatsapp')) {
    return 'Sure, tap below to continue this conversation with our reception team on WhatsApp.';
  }
  if (q.includes('price') || q.includes('cost') || q.includes('fee') || q.includes('pay')) {
    return 'Consultation fees vary by service. Message us on WhatsApp and our team will confirm pricing for what you need.';
  }
  if (q.includes('medic') || q.includes('drug') || q.includes('pharmacy')) {
    return 'Yes, we have an on-site pharmacy and dispense medication after every consultation.';
  }
  return "I can help with our services, location and hours, or booking an appointment. You can also chat with our reception team directly on WhatsApp for anything else.";
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: 'bot', text: "Hello! I'm the La-tullah Medical Centre assistant. Ask me about our services, hours, or how to book an appointment." },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now(), from: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    window.setTimeout(() => {
      const botMsg: ChatMessage = { id: Date.now() + 1, from: 'bot', text: answerFor(text) };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 550);
  };

  return (
    <>
      <motion.div className="fixed bottom-5 right-5 z-50" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}>
        <div className="relative">
          {!isOpen && (
            <motion.span
              className="absolute -right-0.5 -top-0.5 z-10 flex h-3.5 w-3.5"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background" />
            </motion.span>
          )}
          <Button
            size="icon"
            className={cn(
              'h-14 w-14 rounded-full bg-gradient-to-br from-brand to-blue-700 text-brand-foreground shadow-xl shadow-brand/40 border border-brand/50 hover:from-brand hover:to-blue-800',
              isOpen && 'from-foreground to-foreground/90'
            )}
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Chat with us"
          >
            {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-5 z-50 flex h-[28rem] max-h-[calc(100vh-8rem)] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl"
          >
            <div className="relative flex items-center gap-3 overflow-hidden bg-gradient-to-r from-brand via-blue-700 to-brand-red px-4 py-3.5 text-white">
              <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%)]" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div className="relative flex-1">
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  La-tullah Assistant <Sparkles className="h-3.5 w-3.5" />
                </p>
                <p className="flex items-center gap-1 text-xs text-white/80">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online now
                </p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div key={m.id} className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm',
                      m.from === 'user'
                        ? 'bg-gradient-to-br from-brand to-blue-700 text-white'
                        : 'border border-border/50 bg-muted text-foreground'
                    )}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl border border-border/50 bg-muted px-3.5 py-2.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-brand"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand transition-colors hover:bg-brand/20"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border/50 p-3">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Type your question..."
                  className="bg-background/50 border-border/50"
                />
                <Button size="icon" className="bg-gradient-to-br from-brand to-blue-700" onClick={() => sendMessage(input)} aria-label="Send">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-brand">
                Prefer WhatsApp? Chat with reception directly →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
