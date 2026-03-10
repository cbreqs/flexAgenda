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
  ArrowUpRight,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { AiRecommendations } from "@/components/admin/AiRecommendations";
import { useState } from "react";
import { useCollection, useMemoFirebase, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function AdminDashboard() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const firestore = useFirestore();

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Using a consistent business ID 'default-business' for the prototype
    return collection(firestore, 'clientBusinesses', 'default-business', 'bookingTypes');
  }, [firestore]);

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'clientBusinesses', 'default-business', 'bookings');
  }, [firestore]);

  const { data: services, isLoading: servicesLoading } = useCollection(servicesQuery);
  const { data: bookings, isLoading: bookingsLoading } = useCollection(bookingsQuery);

  const stats = [
    { 
      name: "Total Bookings", 
      value: bookingsLoading ? "..." : (bookings?.length || 0).toString(), 
      icon: CalendarCheck, 
      change: "Real-time", 
      trend: "neutral" 
    },
    { 
      name: "Active Services", 
      value: servicesLoading ? "..." : (services?.length || 0).toString(), 
      icon: Users, 
      change: "Active", 
      trend: "neutral" 
    },
    { 
      name: "Fill Rate", 
      value: "N/A", 
      icon: TrendingUp, 
      change: "No data", 
      trend: "neutral" 
    },
    { 
      name: "Avg Duration", 
      value: "45m", 
      icon: Clock, 
      change: "Default", 
      trend: "neutral" 
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your business operations in real-time.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 border-primary/20 hover:border-primary/50" onClick={() => setIsAiModalOpen(true)}>
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
                <div className="text-2xl font-bold text-foreground">
                  {stat.value === "..." ? <Loader2 className="w-4 h-4 animate-spin" /> : stat.value}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-xs font-medium flex items-center ${stat.trend === 'up' ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {stat.change} {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 ml-0.5" />}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-primary/20 shadow-md bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-32 h-32 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Sparkles className="w-5 h-5 text-primary" />
              Optimize Your Schedule
            </CardTitle>
            <CardDescription className="max-w-xl text-muted-foreground">
              Use AI to analyze your service descriptions and suggest the best slot durations, buffer times, and group capacities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsAiModalOpen(true)} className="rounded-xl shadow-lg">
              Get Recommendations
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-primary/10 shadow-sm h-full bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Recent Bookings</CardTitle>
                <CardDescription className="text-muted-foreground">Latest appointments from your project.</CardDescription>
              </div>
              <Button variant="link" asChild className="text-primary hover:text-primary/80">
                <Link href="/admin/bookings">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {bookingsLoading ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin" /></div>
                ) : bookings && bookings.length > 0 ? (
                  bookings.slice(0, 5).map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {booking.bookerName?.charAt(0) || "B"}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{booking.bookerName}</p>
                          <p className="text-xs text-muted-foreground">{booking.bookingStatus} • {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Just now'}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 capitalize">{booking.bookingStatus}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4 italic">No recent bookings found. They will appear here once customers start booking.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm h-full bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Active Services</CardTitle>
                <CardDescription className="text-muted-foreground">Services currently available for booking.</CardDescription>
              </div>
              <Button variant="link" asChild className="text-primary hover:text-primary/80">
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
                          <p className="font-semibold text-foreground">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.maxCapacity} pax • {service.defaultDurationMinutes}m</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary">
                        <Link href="/admin/services">Edit</Link>
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4 italic">No active services. Go to the Services tab to create your first one!</p>
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