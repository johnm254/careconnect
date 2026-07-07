export const ACCENT_COLORS = [
  { name: 'Blue', value: '210 70% 45%', darkValue: '210 65% 55%', preview: 'bg-blue-500' },
  { name: 'Violet', value: '262 70% 50%', darkValue: '262 65% 60%', preview: 'bg-violet-500' },
  { name: 'Emerald', value: '160 70% 40%', darkValue: '160 65% 50%', preview: 'bg-emerald-500' },
  { name: 'Rose', value: '350 70% 50%', darkValue: '350 65% 55%', preview: 'bg-rose-500' },
  { name: 'Amber', value: '38 90% 50%', darkValue: '38 85% 55%', preview: 'bg-amber-500' },
];

export function applyAccentColor(index: number) {
  const color = ACCENT_COLORS[index];
  if (!color) return;
  document.documentElement.style.setProperty('--primary', color.value);
  document.documentElement.style.setProperty('--ring', color.value);
  document.documentElement.style.setProperty('--sidebar-primary', color.value);
}

export function applyAnimationSpeed(speed: 'normal' | 'fast' | 'off') {
  if (speed === 'off') {
    document.documentElement.style.setProperty('--animation-duration', '0s');
  } else if (speed === 'fast') {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
  } else {
    document.documentElement.style.removeProperty('--animation-duration');
  }
}

export function applyStoredPreferences() {
  const storedAccent = localStorage.getItem('accentColor');
  if (storedAccent !== null) applyAccentColor(Number(storedAccent));

  const storedSpeed = localStorage.getItem('animationSpeed') as 'normal' | 'fast' | 'off' | null;
  if (storedSpeed) applyAnimationSpeed(storedSpeed);
}
