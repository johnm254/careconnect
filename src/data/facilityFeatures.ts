import { Pill, FlaskConical, Fingerprint, MessageCircle, type LucideIcon } from 'lucide-react';

export interface FacilityFeature {
  title: string;
  desc: string;
  icon: LucideIcon;
  image: string;
}

export const facilityFeatures: FacilityFeature[] = [
  {
    icon: Pill,
    title: 'On-Site Pharmacy',
    desc: 'Prescriptions filled the same visit, no need to travel elsewhere.',
    image: 'https://images.pexels.com/photos/30678215/pexels-photo-30678215.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    icon: FlaskConical,
    title: 'On-Site Laboratory',
    desc: 'Common diagnostic tests processed on-site to support same-visit treatment.',
    image: 'https://images.pexels.com/photos/29941469/pexels-photo-29941469.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    icon: Fingerprint,
    title: 'Unique Patient ID',
    desc: 'Every patient is registered with a unique Patient ID for secure, organised records.',
    image: 'https://images.pexels.com/photos/17846111/pexels-photo-17846111.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Booking',
    desc: 'Book an appointment without waiting in a phone queue.',
    image: 'https://images.pexels.com/photos/15697342/pexels-photo-15697342.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
];
