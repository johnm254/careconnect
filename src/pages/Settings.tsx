import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Building2, Bell, Shield, Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ACCENT_COLORS as accentColors, applyAccentColor, applyAnimationSpeed } from '@/lib/preferences';

export default function Settings() {
  const { toast } = useToast();
  const [hospitalName, setHospitalName] = useState('La-tullah Medical Centre');
  const [address, setAddress] = useState('Along Mikindani Main Road, Next to Kwa Shee Junction, Mikindani, Mombasa');
  const [phone, setPhone] = useState('0722 872147 / 0105 361277');
  const [email, setEmail] = useState('latullahmedcentre@gmail.com');
  const [selectedAccent, setSelectedAccent] = useState(() => Number(localStorage.getItem('accentColor') ?? 0));
  const [splashEnabled, setSplashEnabled] = useState(() => localStorage.getItem('splashDisabled') !== 'true');
  const [animationSpeed, setAnimationSpeed] = useState<'normal' | 'fast' | 'off'>(
    () => (localStorage.getItem('animationSpeed') as 'normal' | 'fast' | 'off' | null) ?? 'normal'
  );

  const handleSaveHospitalInfo = () => {
    toast({ title: 'Settings saved', description: 'Hospital information has been updated.' });
  };

  const handleAccentChange = (index: number) => {
    setSelectedAccent(index);
    applyAccentColor(index);
    localStorage.setItem('accentColor', String(index));
  };

  const handleSplashToggle = (enabled: boolean) => {
    setSplashEnabled(enabled);
    localStorage.setItem('splashDisabled', String(!enabled));
  };

  const handleAnimationSpeed = (speed: 'normal' | 'fast' | 'off') => {
    setAnimationSpeed(speed);
    localStorage.setItem('animationSpeed', speed);
    applyAnimationSpeed(speed);
  };

  const settingsCards = [
    {
      title: 'Hospital Information',
      description: 'Basic information about your hospital',
      icon: Building2,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hospitalName">Hospital Name</Label>
            <Input id="hospitalName" value={hospitalName} onChange={e => setHospitalName(e.target.value)} className="bg-background/50 border-border/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={address} onChange={e => setAddress(e.target.value)} className="bg-background/50 border-border/50" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-background/50 border-border/50" />
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleSaveHospitalInfo}>Save Changes</Button>
          </motion.div>
        </div>
      ),
    },
    {
      title: 'Notifications',
      description: 'Configure system notification preferences',
      icon: Bell,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/30 transition-colors">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive email alerts for appointments</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/30 transition-colors">
            <div>
              <p className="font-medium">SMS Reminders</p>
              <p className="text-sm text-muted-foreground">Send SMS reminders to patients</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/30 transition-colors">
            <div>
              <p className="font-medium">Payment Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified for overdue payments</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      ),
    },
    {
      title: 'Security',
      description: 'Manage security and access settings',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/30 transition-colors">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add extra security to accounts</p>
            </div>
            <Switch />
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/30 transition-colors">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-muted-foreground">Auto logout after 30 minutes</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/30 transition-colors">
            <div>
              <p className="font-medium">Activity Logging</p>
              <p className="text-sm text-muted-foreground">Track all user actions</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      ),
    },
    {
      title: 'Preferences',
      description: 'Customize animations, splash screen, and accent color',
      icon: Sparkles,
      content: (
        <div className="space-y-5">
          {/* Splash Screen */}
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/30 transition-colors">
            <div>
              <p className="font-medium">Splash Screen</p>
              <p className="text-sm text-muted-foreground">Show animated intro on load</p>
            </div>
            <Switch checked={splashEnabled} onCheckedChange={handleSplashToggle} />
          </div>
          <Separator className="bg-border/50" />

          {/* Animation Speed */}
          <div className="space-y-3 p-3">
            <div>
              <p className="font-medium">Animation Speed</p>
              <p className="text-sm text-muted-foreground">Control UI animation speed</p>
            </div>
            <div className="flex gap-2">
              {(['normal', 'fast', 'off'] as const).map(speed => (
                <Button
                  key={speed}
                  variant={animationSpeed === speed ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAnimationSpeed(speed)}
                  className="capitalize"
                >
                  {speed}
                </Button>
              ))}
            </div>
          </div>
          <Separator className="bg-border/50" />

          {/* Accent Color */}
          <div className="space-y-3 p-3">
            <div>
              <p className="font-medium">Accent Color</p>
              <p className="text-sm text-muted-foreground">Choose a primary color theme</p>
            </div>
            <div className="flex gap-3">
              {accentColors.map((color, i) => (
                <button
                  key={color.name}
                  onClick={() => handleAccentChange(i)}
                  className={cn(
                    'relative h-8 w-8 rounded-full transition-all',
                    color.preview,
                    selectedAccent === i && 'ring-2 ring-offset-2 ring-offset-background ring-foreground'
                  )}
                  title={color.name}
                >
                  {selectedAccent === i && (
                    <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TextReveal>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <GradientText>Settings</GradientText>
            </h1>
          </TextReveal>
          <TextReveal delay={0.1}>
            <p className="text-muted-foreground">Manage system preferences and configurations</p>
          </TextReveal>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {settingsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <CardContainer containerClassName="w-full h-full">
                  <CardBody className="w-full h-full">
                    <Spotlight className="h-full">
                      <Card className="border-0 bg-transparent shadow-none h-full">
                        <CardHeader>
                          <CardItem translateZ={30}>
                            <CardTitle className="flex items-center gap-2">
                              <motion.div
                                className="p-2 rounded-xl bg-brand/10 border border-brand/30"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Icon className="h-5 w-5 text-brand" />
                              </motion.div>
                              {card.title}
                            </CardTitle>
                          </CardItem>
                          <CardItem translateZ={20}>
                            <CardDescription>{card.description}</CardDescription>
                          </CardItem>
                        </CardHeader>
                        <CardContent>
                          <CardItem translateZ={10} className="w-full">
                            {card.content}
                          </CardItem>
                        </CardContent>
                      </Card>
                    </Spotlight>
                  </CardBody>
                </CardContainer>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
