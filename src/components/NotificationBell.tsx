import { useState } from 'react';
import { Bell, AlertCircle, UserPlus, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'patient' | 'appointment' | 'billing';
}

const initialNotifications: Notification[] = [
  { id: '1', title: 'Low Stock Alert', message: 'Paracetamol 500mg is below reorder level', time: '2 min ago', read: false, type: 'alert' },
  { id: '2', title: 'New Patient', message: 'Sarah Johnson registered at reception', time: '15 min ago', read: false, type: 'patient' },
  { id: '3', title: 'Appointment Confirmed', message: 'Dr. Smith confirmed the 3:00 PM slot', time: '30 min ago', read: false, type: 'appointment' },
  { id: '4', title: 'Payment Received', message: 'Invoice #LTM-INV-2026-00089 paid, $1,250', time: '1 hr ago', read: true, type: 'billing' },
  { id: '5', title: 'Staff Update', message: 'Dr. Patel is now available for consults', time: '2 hr ago', read: true, type: 'patient' },
];

const typeIcons = {
  alert: AlertCircle,
  patient: UserPlus,
  appointment: Calendar,
  billing: CreditCard,
};

const typeColors = {
  alert: 'text-destructive',
  patient: 'text-brand',
  appointment: 'text-emerald-500',
  billing: 'text-amber-500',
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10">
          <Bell className="h-5 w-5" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-w-[calc(100vw-2rem)] bg-popover/95 backdrop-blur-xl border-border/50 p-0"
      >
        <div className="flex items-center justify-between border-b border-border/50 p-3">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-brand hover:text-brand"
              onClick={markAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type];
            return (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  'flex items-start gap-3 p-3 cursor-pointer focus:bg-accent/50',
                  !notification.read && 'bg-accent/30'
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className={cn('mt-0.5 shrink-0', typeColors[notification.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">{notification.title}</p>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-brand shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">{notification.message}</p>
                  <p className="text-[10px] text-muted-foreground/70">{notification.time}</p>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
