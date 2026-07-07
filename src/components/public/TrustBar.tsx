import { ShieldCheck, Clock, Stethoscope, Users } from 'lucide-react';

const badges = [
  { icon: ShieldCheck, label: 'NHIF Accepted' },
  { icon: Stethoscope, label: 'Level 2 Outpatient Facility' },
  { icon: Clock, label: 'Open Daily' },
  { icon: Users, label: 'Walk-ins Welcome' },
];

export function TrustBar({ className = '' }: { className?: string }) {
  return (
    <div className={`border-y border-border bg-muted/40 ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-4 sm:px-6 lg:px-8">
        {badges.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Icon className="h-4 w-4 text-brand" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
