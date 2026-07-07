import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="La-tullah Medical Centre"
      className={cn('rounded-lg object-contain shadow-sm', className)}
    />
  );
}
