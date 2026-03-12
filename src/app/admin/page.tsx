"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Clock, 
  Plus, 
  Sparkles,
  Loader2,
  Building2,
  ArrowRight,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { AiRecommendations } from "@/components/admin/AiRecommendations";
import { useState } from "react";
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useCurrentBusiness, useMemoFirebase } from '@/firebase/provider';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export default function AdminDashboard() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const firestore = useFirestore();
  const { currentBusinessId } = useCurrentBusiness();

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore || !currentBusinessId) return null;
    return collection(firestore, 'clientBusinesses', currentBusinessId, 'bookingTypes');
  }, [firestore, currentBusinessId]);

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !currentBusinessId) return null;
    return query(
      collection(firestore, 'clientBusinesses', currentBusinessId, 'bookings'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [firestore, currentBusinessId]);

  const { data: services, isLoading: servicesLoading } = useCollection(servicesQuery);
  const { data: bookings, isLoading: bookingsLoading } = useCollection(bookingsQuery);

  if (!currentBusinessId) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-primary/20 shadow-2xl bg-card/50 backdrop-blur-md p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-headline font-bold">Admin Portal</h1>
              <p className="text-muted-foreground">
                To manage services and track bookings, please select a client business from your dashboard.
              </p>
            </div>
            <Button size="lg" className="w-full rounded-xl font-bold shadow-lg" asChild>
              <Link href="/admin/businesses">
                Select a Business <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground italic">
              Each business maintains its own isolated database of services and customers.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  const stats = [
    { 
      name: "Total Bookings", 
      value: bookingsLoading ? "..." : (bookings?.length || 0).toString(), 
      icon: CalendarCheck, 
      change: "Current Business", 
      trend: "neutral" 
    },
    { 
      name: "Active Services", 
      value: servicesLoading ? "..." : (services?.length || 0).toString(), 
      icon: Users, 
      change: "Available Now", 
      trend: "neutral" 
    },
    { 
      name: "Fill Rate", 
      value: "N/A", 
      icon: TrendingUp, 
      change: "Tracking...", 
      trend: "neutral" 
    },
    { 
      name: "Avg Duration", 
      value: "45m", 
      icon: Clock, 
      change: "System Avg", 
      trend: "neutral" 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{currentBusinessId} Dashboard</h2>
            </div>
            <h1 className="text-3xl font-headline font-bold">Business Overview</h1>
            <p className="text-muted-foreground">Manage operations and bookings for your client profile.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 border-primary/20" onClick={() => setIsAiModalOpen(true)}>
              <Sparkles className="w-4 h-4 text-primary" />
              AI Insights
            </Button>
            <Button className="gap-2 rounded-xl" asChild>
              <Link href="/admin/services">
                <Plus className="w-4 h-4" />
                New Service
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-primary/10 shadow-sm hover:shadow-md transition-all bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <stat.icon className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.value === "..." ? <Loader2 className="w-4 h-4 animate-spin" /> : stat.value}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/20 shadow-md bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden relative border-2">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-32 h-32 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Scheduling Recommendations
            </CardTitle>
            <CardDescription className="max-w-xl">
              Optimize {currentBusinessId}&apos;s schedule using our advanced AI to find the perfect slot balance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsAiModalOpen(true)} className="rounded-xl shadow-lg font-bold">
              Run AI Analysis
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-primary/10 shadow-sm h-full bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest appointments for this client.</CardDescription>
              </div>
              <Button variant="link" asChild className="text-primary">
                <Link href="/admin/bookings">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {bookingsLoading ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin" /></div>
                ) : bookings && bookings.length > 0 ? (
                  bookings.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {booking.bookerName?.charAt(0) || "B"}
                        </div>
                        <div>
                          <p className="font-semibold">{booking.bookerName}</p>
                          <p className="text-xs text-muted-foreground text-ellipsis overflow-hidden max-w-[150px] whitespace-nowrap">
                            {booking.bookingStatus} • {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 capitalize">{booking.bookingStatus}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8 italic">No bookings found for {currentBusinessId}.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm h-full bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Services</CardTitle>
                <CardDescription>Configuration for current booking types.</CardDescription>
              </div>
              <Button variant="link" asChild className="text-primary">
                <Link href="/admin/services">Manage</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {servicesLoading ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin" /></div>
                ) : services && services.length > 0 ? (
                  services.slice(0, 5).map((service: any) => (
                    <div key={service.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-semibold">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.maxCapacity} pax • {service.defaultDurationMinutes}m</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary">
                        <Link href="/admin/services">Edit</Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8 italic">No services configured for {currentBusinessId}.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <AiRecommendations 
        open={isAiModalOpen} 
        onOpenChange={setIsAiModalOpen} 
      />
    </div>
  );
}
