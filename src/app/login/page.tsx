"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, initiateEmailSignIn, initiateEmailSignUp, useUser, useCurrentBusiness } from "@/firebase";
import { Loader2, Mail, Lock, UserPlus, LogIn, CheckCircle2, Wand2, Mountain, ShieldCheck, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<"client" | "grandclient">("client");
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { currentBusinessId } = useCurrentBusiness();

  // Handle redirection as a side effect after successful login
  useEffect(() => {
    if (user && !loading && !isUserLoading) {
      if (loginType === "client") {
        router.push("/admin/businesses");
      } else {
        router.push("/");
      }
    }
  }, [user, loading, isUserLoading, loginType, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      initiateEmailSignIn(auth, email, password);
      toast({ title: "Welcome back!", description: loginType === "client" ? "Accessing management dashboard..." : "Accessing your bookings..." });
    } catch (err) {
      toast({ title: "Error", description: "Invalid credentials.", variant: "destructive" });
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      initiateEmailSignUp(auth, email, password);
      toast({ title: "Account created!", description: "Success! You are now registered." });
    } catch (err) {
      toast({ title: "Error", description: "Could not create account.", variant: "destructive" });
      setLoading(false);
    }
  };

  const isElevated = currentBusinessId === "elevated-adventures";
  const isWands = currentBusinessId === "wands-ledgers";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative Background Elements */}
        {isElevated && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Mountain className="absolute -top-10 -left-10 w-64 h-64 text-primary" />
            <Mountain className="absolute bottom-10 right-10 w-96 h-96 text-primary rotate-12" />
          </div>
        )}
        {isWands && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <Wand2 className="absolute top-20 right-20 w-48 h-48 text-accent animate-pulse" />
            <div className="absolute top-1/2 left-10 w-2 h-2 bg-accent rounded-full animate-ping" />
          </div>
        )}

        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500 z-10">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl",
                isElevated ? "bg-primary text-white" : isWands ? "bg-primary text-accent" : "bg-muted"
              )}>
                {loginType === "client" ? <ShieldCheck className="w-10 h-10" /> : <User className="w-10 h-10" />}
              </div>
            </div>
            <h1 className="text-3xl font-headline font-bold">
              {loginType === "client" ? "Owner Portal" : "Customer Portal"}
            </h1>
            <p className="text-muted-foreground">
              {currentBusinessId ? `Accessing ${currentBusinessId.replace('-', ' ')}` : "Login to your account"}
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-8 bg-muted/20 p-1.5 rounded-2xl border">
            <Button 
              variant={loginType === "client" ? "default" : "ghost"} 
              onClick={() => setLoginType("client")}
              className={cn("flex-1 rounded-xl gap-2 font-bold h-11", loginType === "client" && "shadow-md")}
            >
              <ShieldCheck className="w-4 h-4" /> Client
            </Button>
            <Button 
              variant={loginType === "grandclient" ? "default" : "ghost"} 
              onClick={() => setLoginType("grandclient")}
              className={cn("flex-1 rounded-xl gap-2 font-bold h-11", loginType === "grandclient" && "shadow-md")}
            >
              <User className="w-4 h-4" /> Grandclient
            </Button>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="login" className="font-bold rounded-lg">Login</TabsTrigger>
              <TabsTrigger value="signup" className="font-bold rounded-lg">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-primary/20 shadow-2xl backdrop-blur-md bg-card/80">
                <form onSubmit={handleSignIn}>
                  <CardHeader>
                    <CardTitle>{loginType === "client" ? "Admin Access" : "Customer Access"}</CardTitle>
                    <CardDescription>
                      {loginType === "client" 
                        ? "Manage your business profiles and bookings." 
                        : "View your personal schedule and book new services."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@domain.com" 
                          className="pl-10 rounded-xl"
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
                          className="pl-10 rounded-xl"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full font-bold h-12 rounded-xl text-lg shadow-lg" disabled={loading}>
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5 mr-2" />}
                      Log In as {loginType === "client" ? "Owner" : "Customer"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="border-primary/20 shadow-2xl backdrop-blur-md bg-card/80">
                <form onSubmit={handleSignUp}>
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                      {loginType === "client" 
                        ? "Register as a business owner to start managing services." 
                        : "Register as a customer to track your personal appointments."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-signup">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="email-signup" 
                          type="email" 
                          placeholder="name@domain.com" 
                          className="pl-10 rounded-xl"
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
                          className="pl-10 rounded-xl"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full font-bold h-12 rounded-xl text-lg shadow-lg" disabled={loading}>
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5 mr-2" />}
                      Register {loginType === "client" ? "Owner" : "Customer"}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                      Multi-tenant data isolation active
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-bold">Privacy Guaranteed</p>
                <p className="text-xs text-muted-foreground">
                  Your data is securely isolated from other users and businesses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
