
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, initiateEmailSignIn, initiateEmailSignUp, useUser } from "@/firebase";
import { Loader2, Mail, Lock, UserPlus, LogIn, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  if (user) {
    router.push("/admin/businesses");
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      initiateEmailSignIn(auth, email, password);
      toast({ title: "Welcome back!", description: "Logging you in..." });
    } catch (err) {
      toast({ title: "Error", description: "Invalid credentials.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      initiateEmailSignUp(auth, email, password);
      toast({ title: "Account created!", description: "You can now register your business." });
    } catch (err) {
      toast({ title: "Error", description: "Could not create account.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-headline font-bold">Client Portal</h1>
            <p className="text-muted-foreground">Log in to manage your services and bookings.</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="font-bold">Login</TabsTrigger>
              <TabsTrigger value="signup" className="font-bold">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-primary/20 shadow-xl">
                <form onSubmit={handleSignIn}>
                  <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Enter your email to access your business dashboard.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@business.com" 
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full font-bold h-11" disabled={loading}>
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5 mr-2" />}
                      Log In
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-primary/20 shadow-xl">
                <form onSubmit={handleSignUp}>
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>Start managing your business on FlexAgenda today.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="email-signup" 
                          type="email" 
                          placeholder="name@business.com" 
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup">Create Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="password-signup" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full font-bold h-11" disabled={loading}>
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5 mr-2" />}
                      Create Account
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground">
                      By signing up, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-bold">Isolated Environments</p>
                <p className="text-xs text-muted-foreground">Each business account gets a dedicated space for its own services and client data.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
