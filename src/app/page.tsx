
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { ArrowRight, Loader2, Sparkles, Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCollection, useMemoFirebase, useFirestore, useCurrentBusiness, useUser } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const firestore = useFirestore();
  const { currentBusinessId } = useCurrentBusiness();
  const { user } = useUser();

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore || !currentBusinessId) return null;
    return query(
      collection(firestore, 'businesses', currentBusinessId, 'bookingTypes'), 
      where('isActive', '==', true)
    );
  }, [firestore, currentBusinessId]);

  const userBookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user || !currentBusinessId) return null;
    return query(
      collection(firestore, 'businesses', currentBusinessId, 'bookings'),
      where('grandclientId', '==', user.uid),
      orderBy('startTime', 'asc')
    );
  }, [firestore, user, currentBusinessId]);

  const { data: services, isLoading: servicesLoading } = useCollection(servicesQuery);
  const { data: myBookings, isLoading: bookingsLoading } = useCollection(userBookingsQuery);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative py-24 px-4 bg-gradient-to-b from-primary/10 via-background to-background overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent blur-3xl animate-pulse delay-700" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            {currentBusinessId && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-black mb-8 border border-primary/20 shadow-sm animate-in fade-in slide-in-from-top-4">
                <Sparkles className="w-3.5 h-3.5" />
                WELCOME TO {currentBusinessId.replace('-', ' ').toUpperCase()}
              </div>
            )}
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
              Seamless <span className="text-primary decoration-primary/20 underline underline-offset-8">Booking</span> <br className="hidden md:block" /> For Every Day.
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Join our community and book your next appointment or event in seconds. Isolated, secure, and flexible.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Button size="lg" className="rounded-2xl px-10 font-bold h-16 text-lg shadow-2xl hover:scale-105 transition-transform" asChild>
                <a href="#services">Browse Services</a>
              </Button>
              {!user && (
                <Button size="lg" variant="outline" className="rounded-2xl px-10 h-16 text-lg font-bold border-primary/20 bg-background/50 backdrop-blur-sm" asChild>
                  <Link href="/login">
                    Client Access <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        {user && myBookings && myBookings.length > 0 && (
          <section className="py-12 px-4 bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-black tracking-tight">Your Upcoming Schedule</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBookings.map((booking: any) => (
                  <Card key={booking.id} className="border-primary/10 bg-card/50 backdrop-blur-sm overflow-hidden group">
                    <div className="h-1 bg-primary" />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] font-bold">CONFIRMED</Badge>
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors">{booking.bookerName}</CardTitle>
                      <CardDescription className="text-xs truncate">{booking.bookerEmail}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-semibold">{booking.startTime ? new Date(booking.startTime).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <span className="font-semibold">{booking.startTime ? new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        <section id="services" className="py-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tighter">
                  {currentBusinessId ? `${currentBusinessId.replace('-', ' ')} Offerings` : 'Available Services'}
                </h2>
                <p className="text-muted-foreground font-medium">Select a service below to begin your booking process.</p>
              </div>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-primary/20 to-transparent mb-4 hidden md:block" />
            </div>
            
            {!currentBusinessId ? (
              <div className="text-center py-32 border-4 border-dashed rounded-[3rem] bg-muted/5 flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-black mb-2">No Location Selected</p>
                  <p className="text-muted-foreground max-w-sm mx-auto">Please visit a specific business link or use the management portal to select a profile.</p>
                </div>
                <Button size="lg" className="rounded-xl font-bold" asChild><Link href="/admin/businesses">Select a Profile</Link></Button>
              </div>
            ) : servicesLoading ? (
              <div className="flex flex-col items-center py-40 gap-6">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="animate-pulse font-black text-primary tracking-widest uppercase text-xs">Synchronizing Services...</p>
              </div>
            ) : services && services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {services.map((service: any) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 border-4 border-dashed rounded-[3rem] bg-muted/5 flex flex-col items-center gap-6 opacity-50">
                <Sparkles className="w-12 h-12 text-muted-foreground" />
                <p className="text-xl font-bold italic">No active services currently listed for this business.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <footer className="py-12 px-4 border-t bg-muted/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">F</div>
            <span className="font-bold text-lg">FlexAgenda</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 FlexAgenda Multi-Tenant Solutions. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-bold text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="#" className="hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
