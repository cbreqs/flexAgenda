
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { ArrowRight, Loader2, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCollection, useMemoFirebase, useFirestore, useCurrentBusiness } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const firestore = useFirestore();
  const { currentBusinessId } = useCurrentBusiness();

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore || !currentBusinessId) return null;
    return query(
      collection(firestore, 'clientBusinesses', currentBusinessId, 'bookingTypes'), 
      where('isActive', '==', true)
    );
  }, [firestore, currentBusinessId]);

  const { data: services, isLoading, error } = useCollection(servicesQuery);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 px-4 bg-gradient-to-b from-primary/10 via-background to-background overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-10 blur-3xl -z-10 bg-primary rounded-full" />
          <div className="max-w-5xl mx-auto text-center">
            {currentBusinessId && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20 animate-in fade-in slide-in-from-bottom-2">
                <Sparkles className="w-3 h-3" />
                Now Viewing: {currentBusinessId}
              </div>
            )}
            <h1 className="text-4xl md:text-7xl font-headline font-extrabold text-foreground mb-6 leading-tight tracking-tighter">
              Booking Made <span className="text-primary underline decoration-primary/30 underline-offset-8">Flexible</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience seamless scheduling for appointments or group events. FlexAgenda adapts to any business with intelligent duration and capacity controls.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-full px-8 shadow-2xl hover:scale-105 transition-all font-bold h-14 text-lg">
                Explore Services
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-primary/20 text-foreground hover:bg-primary/5 h-14 text-lg" asChild>
                <Link href="/admin/businesses">
                  Admin Portal <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section id="services" className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground">
                  {currentBusinessId ? `Services for ${currentBusinessId}` : 'Available Services'}
                </h2>
                <p className="text-muted-foreground max-w-md">Select a service below to begin your reservation process.</p>
              </div>
              {!currentBusinessId && (
                <Button variant="ghost" className="text-primary font-bold" asChild>
                  <Link href="/admin/businesses">Switch Business <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              )}
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-8 rounded-2xl border-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-bold">Connection Issue</AlertTitle>
                <AlertDescription>
                  There was a problem loading services. Please ensure your business ID is valid.
                </AlertDescription>
              </Alert>
            )}

            {!currentBusinessId ? (
              <div className="text-center py-24 border-2 border-dashed rounded-[2rem] bg-muted/5 border-primary/10 flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center">
                  <ArrowRight className="w-10 h-10 text-primary/40 rotate-45" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-bold">No Business Selected</p>
                  <p className="text-muted-foreground max-w-sm mx-auto">Select a business from the admin portal to view their specific service offerings.</p>
                </div>
                <Button variant="default" className="rounded-xl font-bold px-8 h-12 shadow-lg" asChild>
                  <Link href="/admin/businesses">Go to Admin Portal</Link>
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading services...</p>
              </div>
            ) : services && services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service: any) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border-2 border-dashed rounded-[2rem] bg-muted/5 border-primary/10">
                <p className="text-muted-foreground font-medium">No active services found for <span className="text-foreground font-bold">{currentBusinessId}</span>.</p>
                <Button variant="link" className="text-primary font-bold mt-2" asChild>
                  <Link href="/admin/services">Add a service</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t py-16 px-4 bg-muted/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg">F</div>
            <span className="font-bold text-2xl tracking-tighter">FlexAgenda</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 FlexAgenda. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-bold text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
