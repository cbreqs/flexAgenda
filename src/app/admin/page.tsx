
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  Clock, 
  Plus, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { AiRecommendations } from "@/components/admin/AiRecommendations";
import { useState } from "react";

export default function AdminDashboard() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const stats = [
    { name: "Total Bookings", value: "128", icon: CalendarCheck, change: "+12%", trend: "up" },
    { name: "Total Customers", value: "84", icon: Users, change: "+5%", trend: "up" },
    { name: "Avg. Fill Rate", value: "72%", icon: TrendingUp, change: "+8%", trend: "up" },
    { name: "Peak Duration", value: "45m", icon: Clock, change: "0%", trend: "neutral" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of your bookings and services.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-white" onClick={() => setIsAiModalOpen(true)}>
              <Sparkles className="w-4 h-4 text-accent" />
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-none shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <stat.icon className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-xs font-medium flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-gray-500'}`}>
                    {stat.change} {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 ml-0.5" />}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Recommendations Section */}
        <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-32 h-32 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Optimize Your Schedule
            </CardTitle>
            <CardDescription className="max-w-xl">
              Use AI to analyze your service descriptions and suggest the best slot durations, buffer times, and group capacities for maximum efficiency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsAiModalOpen(true)} className="rounded-xl shadow-lg">
              Get Recommendations
            </Button>
          </CardContent>
        </Card>

        {/* Quick Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm h-full bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest appointments made by clients.</CardDescription>
              </div>
              <Button variant="link" asChild>
                <Link href="/admin/bookings">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {String.fromCharCode(64 + i)}
                      </div>
                      <div>
                        <p className="font-semibold">Customer {i}</p>
                        <p className="text-xs text-muted-foreground">Strategy Session • Today, 2:00 PM</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Confirmed</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm h-full bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Active Services</CardTitle>
                <CardDescription>Services currently available for booking.</CardDescription>
              </div>
              <Button variant="link" asChild>
                <Link href="/admin/services">Manage</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { name: "Strategy Session", users: 1, time: "45m" },
                  { name: "Group Workshop", users: 6, time: "120m" },
                  { name: "Quick Consultation", users: 1, time: "15m" },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <CalendarCheck className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.users} max capacity • {s.time}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                ))}
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
