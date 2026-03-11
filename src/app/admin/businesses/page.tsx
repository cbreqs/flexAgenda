"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowRight, CheckCircle2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useCurrentBusiness } from "@/firebase";
import { cn } from "@/lib/utils";

export default function BusinessSelectionPage() {
  const { currentBusinessId, setCurrentBusinessId } = useCurrentBusiness();

  const mockBusinesses = [
    { id: 'default-business', name: 'Main Clinic', description: 'Healthcare and appointment services.' },
    { id: 'yoga-studio', name: 'Zen Yoga', description: 'Wellness classes and group workshops.' },
    { id: 'tech-consult', name: 'Code Wizards', description: 'Software consulting and team strategy.' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-headline font-bold">Client Businesses</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Switch between different client profiles to manage their unique services, schedules, and reservations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockBusinesses.map((biz) => {
            const isActive = currentBusinessId === biz.id;
            return (
              <Card 
                key={biz.id} 
                className={cn(
                  "relative flex flex-col h-full transition-all duration-300 border-2 overflow-hidden",
                  isActive ? "border-primary shadow-2xl scale-105" : "border-border hover:border-primary/50"
                )}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 p-3">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                )}
                <CardHeader className="bg-muted/30">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{biz.name}</CardTitle>
                  <Badge variant="outline" className="w-fit font-mono text-[10px]">ID: {biz.id}</Badge>
                </CardHeader>
                <CardContent className="pt-6 flex-1">
                  <p className="text-sm text-muted-foreground">
                    {biz.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 pb-6 px-6">
                  {isActive ? (
                    <Button className="w-full rounded-xl gap-2 font-bold" asChild>
                      <Link href="/admin">
                        Go to Dashboard <LayoutDashboard className="w-4 h-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full rounded-xl border-primary text-primary hover:bg-primary/10"
                      onClick={() => setCurrentBusinessId(biz.id)}
                    >
                      Switch to Business
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div className="p-8 rounded-3xl bg-muted/50 border border-dashed text-center">
          <p className="text-sm text-muted-foreground italic">
            Looking to add a new client? New client businesses can be registered through the backend configuration.
          </p>
        </div>
      </main>
    </div>
  );
}
