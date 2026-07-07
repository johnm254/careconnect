import { Stethoscope, HeartPulse, Users, Pill, FlaskConical, Dumbbell, type LucideIcon } from 'lucide-react';

export interface CareTeamMember {
  role: string;
  icon: LucideIcon;
  desc: string;
  image: string;
}

export const careTeam: CareTeamMember[] = [
  {
    role: 'Medical Officer In-Charge',
    icon: Stethoscope,
    desc: 'Oversees general consultations, diagnosis, and treatment plans, and coordinates referrals to higher-level facilities when needed.',
    image: '',
  },
  {
    role: 'Clinical Officers',
    icon: HeartPulse,
    desc: 'Provide day-to-day outpatient consultations, minor procedures, and chronic disease follow-up.',
    image: '',
  },
  {
    role: 'Registered Nurses',
    icon: Users,
    desc: 'Lead maternal and child health services, immunization clinics, and patient care throughout every visit.',
    image: '',
  },
  {
    role: 'Pharmacist',
    icon: Pill,
    desc: 'Dispenses and explains prescribed medication on-site immediately after your consultation.',
    image: '',
  },
  {
    role: 'Laboratory Technician',
    icon: FlaskConical,
    desc: 'Runs on-site diagnostic tests so your treatment plan can start the same day, wherever possible.',
    image: '',
  },
  {
    role: 'Physiotherapist',
    icon: Dumbbell,
    desc: 'Guides rehabilitation and mobility recovery for patients managing injury or chronic conditions.',
    image: '',
  },
];
