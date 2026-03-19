
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
      collection(firestore, 'businesses', currentBusinessId, 'bookingTypes'), 
      where('isActive', '==', true)
    );
  }, [firestore, currentBusinessId]);

  const { data: services, isLoading, error } = useCollection(servicesQuery);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative py-24 px-4 bg-gradient-to-b from-primary/10 via-background to-background">
          <div className="max-w-5xl mx-auto text-center">
            {currentBusinessId && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
                <Sparkles className="w-3 h-3" />
                Viewing: {currentBusinessId}
              </div>
            )}
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tighter">
              Booking Made <span className="text-primary underline decoration-primary/30">Flexible</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Multi-tenant scheduling platform for businesses and their grandclients.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="rounded-full px-8 font-bold h-14 text-lg">
                Book a Service
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg" asChild>
                <Link href="/admin/businesses">
                  Management <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="services" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              {currentBusinessId ? `Services for ${currentBusinessId}` : 'Available Services'}
            </h2>
            
            {!currentBusinessId ? (
              <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-muted/5">
                <p className="text-xl font-bold mb-4">No Business Selected</p>
                <Button asChild><Link href="/admin/businesses">Select a Profile</Link></Button>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center py-32 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="animate-pulse">Syncing services...</p>
              </div>
            ) : services && services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service: any) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border-2 border-dashed rounded-3xl">
                <p className="text-muted-foreground">No active services found.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
