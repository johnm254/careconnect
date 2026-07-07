import {
  Stethoscope,
  Scissors,
  Pill,
  HeartPulse,
  Activity,
  FlaskConical,
  Syringe,
  Dumbbell,
  Users,
  ShieldPlus,
  type LucideIcon,
} from 'lucide-react';

export interface PublicService {
  slug: string;
  name: string;
  icon: LucideIcon;
  shortDesc: string;
  longDesc: string;
  bullets: string[];
  /** Filled in with a sourced photo URL; falls back to a neutral placeholder if empty. */
  image: string;
}

export const publicServices: PublicService[] = [
  {
    slug: 'outpatient-consultation',
    name: 'Outpatient Consultation',
    icon: Stethoscope,
    shortDesc: 'Walk-in and scheduled consultations for everyday illness.',
    longDesc:
      "Our clinical officers and doctors see patients daily for general illness, check-ups, and referrals, with no admission required. Most visits are same-day, and you leave with a diagnosis, treatment plan, and any medication you need.",
    bullets: ['Walk-in and appointment slots available', 'General and follow-up consultations', 'Same-day referral for specialist care when needed'],
    image: 'https://images.pexels.com/photos/30688589/pexels-photo-30688589.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    slug: 'minor-surgery',
    name: 'Minor Surgery',
    icon: Scissors,
    shortDesc: 'Suturing, wound care, and other minor procedures.',
    longDesc:
      'For cuts, wounds, abscesses, and other conditions that need a minor procedure rather than a hospital admission, our team provides sterile, same-visit care including suturing and dressing.',
    bullets: ['Wound cleaning and suturing', 'Abscess drainage and dressing', 'Follow-up wound care'],
    image: 'https://images.pexels.com/photos/5721552/pexels-photo-5721552.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    slug: 'pharmacy',
    name: 'Pharmacy & Medication',
    icon: Pill,
    shortDesc: 'On-site pharmacy dispensing after every consultation.',
    longDesc:
      'Our on-site pharmacy dispenses prescribed medication right after your consultation, so you do not need to travel elsewhere to fill a prescription.',
    bullets: ['Prescriptions filled on-site', 'Guidance on dosage and usage', 'Common over-the-counter medication available'],
    image: 'https://images.pexels.com/photos/30678215/pexels-photo-30678215.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    slug: 'maternal-child-health',
    name: 'Maternal & Child Health',
    icon: HeartPulse,
    shortDesc: 'Antenatal, postnatal, and child growth monitoring.',
    longDesc:
      'We support mothers and children through pregnancy and early childhood with antenatal check-ups, postnatal care, and growth monitoring clinics.',
    bullets: ['Antenatal check-ups', 'Postnatal follow-up care', 'Child growth and nutrition monitoring'],
    image: 'https://images.unsplash.com/photo-1677682693111-c7c6a60c362a?auto=format&fit=crop&w=700&q=80',
  },
  {
    slug: 'chronic-disease-care',
    name: 'Chronic Disease Care',
    icon: Activity,
    shortDesc: 'Ongoing management for hypertension, diabetes, and more.',
    longDesc:
      'Patients living with hypertension, diabetes, and other long-term conditions can get regular monitoring, medication refills, and lifestyle guidance from our team.',
    bullets: ['Blood pressure and blood sugar monitoring', 'Medication management and refills', 'Lifestyle and diet guidance'],
    image: 'https://images.pexels.com/photos/30678208/pexels-photo-30678208.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    slug: 'laboratory-services',
    name: 'Laboratory Services',
    icon: FlaskConical,
    shortDesc: 'On-site diagnostic testing for fast, accurate treatment.',
    longDesc:
      'Our on-site lab runs common diagnostic tests so your doctor can confirm a diagnosis and start treatment during the same visit wherever possible.',
    bullets: ['Malaria, typhoid, and general blood tests', 'Urinalysis and stool tests', 'Rapid results to support same-visit treatment'],
    image: 'https://images.pexels.com/photos/18712504/pexels-photo-18712504.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    slug: 'immunization',
    name: 'Immunization',
    icon: Syringe,
    shortDesc: 'Routine childhood and adult vaccination services.',
    longDesc:
      'We offer routine immunization for infants and children following the Kenya EPI schedule, along with vaccination services for adults.',
    bullets: ['Infant and childhood immunization', 'Adult vaccinations', 'Vaccination record keeping'],
    image: 'https://images.pexels.com/photos/10794860/pexels-photo-10794860.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    slug: 'physiotherapy',
    name: 'Physiotherapy',
    icon: Dumbbell,
    shortDesc: 'Rehabilitation for injury and mobility recovery.',
    longDesc:
      'For patients recovering from injury or managing mobility conditions, we provide guided physiotherapy sessions to support recovery and function.',
    bullets: ['Injury rehabilitation', 'Mobility and strength exercises', 'Ongoing recovery plans'],
    image: 'https://images.pexels.com/photos/13538710/pexels-photo-13538710.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    slug: 'family-planning',
    name: 'Family Planning',
    icon: Users,
    shortDesc: 'Confidential counselling and family planning services.',
    longDesc:
      'Our team provides confidential, judgement-free family planning counselling and services tailored to each patient’s needs.',
    bullets: ['Confidential one-on-one counselling', 'A range of family planning methods', 'Follow-up care'],
    image: 'https://images.pexels.com/photos/30677597/pexels-photo-30677597.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    slug: 'hiv-testing-counselling',
    name: 'HIV Testing & Counselling',
    icon: ShieldPlus,
    shortDesc: 'Confidential voluntary counselling and testing (VCT).',
    longDesc:
      'We offer confidential voluntary counselling and testing (VCT) in a private, respectful setting, with support and referral for further care where needed.',
    bullets: ['Confidential testing', 'Pre- and post-test counselling', 'Referral for ongoing care and support'],
    image: 'https://images.pexels.com/photos/8248290/pexels-photo-8248290.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
];

export function getServiceBySlug(slug: string): PublicService | undefined {
  return publicServices.find((s) => s.slug === slug);
}
