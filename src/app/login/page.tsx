"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Chrome, Loader2, Mail } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const logo = PlaceHolderImages.find(img => img.id === 'neu-logo');
  const roleHint = searchParams.get('role');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email.endsWith('@neu.edu.ph')) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Only institutional emails (@neu.edu.ph) are allowed.",
      });
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check user profile in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.blocked) {
          toast({
            variant: "destructive",
            title: "Account Blocked",
            description: "Your account has been restricted by the administrator.",
          });
          setLoading(false);
          return;
        }

        toast({
          title: "Welcome Back",
          description: `Logged in as ${userData.fullName}`,
        });
        
        router.push(userData.role === 'Admin' ? '/admin' : '/visitor');
      } else {
        // If profile doesn't exist, create it as a visitor by default
        router.push('/visitor');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid credentials or user does not exist.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md animate-in zoom-in-95 duration-300 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-white border-2 border-primary p-1 rounded-full w-fit overflow-hidden shadow-sm">
            {logo && (
              <Image 
                src={logo.imageUrl} 
                alt={logo.description} 
                width={60} 
                height={60} 
                data-ai-hint={logo.imageHint}
                className="object-contain"
              />
            )}
          </div>
          <div>
            <CardTitle className="text-3xl font-headline font-bold">Institutional Login</CardTitle>
            <CardDescription>Sign in with your NEU institutional account</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="username@neu.edu.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 text-lg gap-2 mt-2" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Mail className="h-5 w-5" />
              )}
              {loading ? "Authenticating..." : "Sign in"}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline"
              className="w-full h-11 text-lg gap-2" 
              disabled={loading}
              onClick={() => toast({ title: "Feature coming soon", description: "Google SSO is being configured." })}
            >
              <Chrome className="h-5 w-5" />
              Sign in with Google
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-xs text-center text-muted-foreground italic">
            * Authorized access only. Your activity is logged.
          </p>
          {roleHint === 'admin' && (
            <div className="text-sm text-center">
              New Admin? <Link href="/admin/register" className="text-primary hover:underline font-bold">Register here</Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
