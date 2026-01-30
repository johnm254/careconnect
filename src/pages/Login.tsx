import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { UserRole } from '@/types/hospital';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, Shield, UserCog, Heart, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles: { role: UserRole; label: string; description: string; icon: typeof Shield }[] = [
  { role: 'admin', label: 'Administrator', description: 'Full system access', icon: Shield },
  { role: 'doctor', label: 'Doctor', description: 'Patient care & records', icon: Heart },
  { role: 'nurse', label: 'Nurse', description: 'Patient assistance', icon: UserCog },
  { role: 'receptionist', label: 'Receptionist', description: 'Scheduling & billing', icon: ClipboardList },
];

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentRole, setIsLoggedIn } = useRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentRole(selectedRole);
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden w-1/2 bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/20">
            <Stethoscope className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-primary-foreground">MedCare HMS</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight text-primary-foreground">
            Hospital Management
            <br />
            Made Simple
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Streamline patient care, appointments, and billing with our modern healthcare management system.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/60">© 2025 MedCare HMS. All rights reserved.</p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <Card className="w-full max-w-md border-0 shadow-none lg:border lg:shadow-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mb-4 flex justify-center lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Stethoscope className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Select your role and sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label>Select Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map(({ role, label, description, icon: Icon }) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={cn(
                        'flex flex-col items-start gap-1 rounded-lg border-2 p-3 text-left transition-all',
                        selectedRole === role
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-accent'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={cn('h-4 w-4', selectedRole === role ? 'text-primary' : 'text-muted-foreground')} />
                        <span className={cn('text-sm font-medium', selectedRole === role && 'text-primary')}>{label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Demo Notice */}
              <p className="text-center text-xs text-muted-foreground">
                This is a demo. Enter any credentials to continue.
              </p>

              {/* Submit */}
              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
