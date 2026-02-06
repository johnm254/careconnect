import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Building2, Bell, Shield, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { Spotlight } from '@/components/ui/spotlight';
import { TextReveal, GradientText } from '@/components/ui/text-reveal';
import { CardContainer, CardBody, CardItem } from '@/components/ui/card-3d';

export default function Settings() {
  const settingsCards = [
    {
      title: 'Hospital Information',
      description: 'Basic information about your hospital',
      icon: Building2,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hospitalName">Hospital Name</Label>
            <Input id="hospitalName" defaultValue="MedCare General Hospital" className="bg-background/50 border-border/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" defaultValue="123 Healthcare Boulevard, Springfield" className="bg-background/50 border-border/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" defaultValue="+1 (555) 000-0000" className="bg-background/50 border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="info@medcare.com" className="bg-background/50 border-border/50" />
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button>Save Changes</Button>
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
      title: 'Appearance',
      description: 'Customize the look and feel',
      icon: Palette,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/30 transition-colors">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Switch to dark theme</p>
            </div>
            <Switch />
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/30 transition-colors">
            <div>
              <p className="font-medium">Compact View</p>
              <p className="text-sm text-muted-foreground">Reduce spacing in tables</p>
            </div>
            <Switch />
          </div>
          <Separator className="bg-border/50" />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/30 transition-colors">
            <div>
              <p className="font-medium">Animations</p>
              <p className="text-sm text-muted-foreground">Enable UI animations</p>
            </div>
            <Switch defaultChecked />
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
            <h1 className="text-3xl font-bold tracking-tight">
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
                                className="p-2 rounded-xl bg-primary/10 border border-primary/30"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Icon className="h-5 w-5 text-primary" />
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

        {/* Demo Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Spotlight>
            <Card className="border-0 bg-transparent shadow-none border-dashed">
              <CardContent className="flex items-center justify-center py-6 text-center text-muted-foreground">
                <p>This is a demo application. Settings changes will not persist.</p>
              </CardContent>
            </Card>
          </Spotlight>
        </motion.div>
      </div>
    </Layout>
  );
}
