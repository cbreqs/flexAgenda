
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Settings, Trash2, Clock, Users, DollarSign, Sparkles } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ServicesManagement() {
  const { toast } = useToast();
  const [services, setServices] = useState([
    { id: '1', name: 'Strategy Session', type: 'appointment', duration: 45, capacity: 1, price: 150 },
    { id: '2', name: 'Group Workshop', type: 'event', duration: 120, capacity: 6, price: 300 },
  ]);

  const handleAdd = () => {
    toast({ title: "Service Created", description: "Your new service is now live." });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">Services</h1>
            <p className="text-muted-foreground">Configure your booking types and parameters.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Editor Form */}
          <Card className="lg:col-span-1 border-none shadow-md h-fit sticky top-24">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
              <CardTitle className="text-lg">Create New Service</CardTitle>
              <CardDescription className="text-primary-foreground/80">Add a new appointment or event type.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input placeholder="e.g. 1-on-1 Consultation" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select defaultValue="appointment">
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appointment">Appointment (Sequential)</SelectItem>
                    <SelectItem value="event">Event (Specific Slot)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Duration (min)
                  </Label>
                  <Input type="number" defaultValue={60} className="h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="w-3 h-3" /> Max Capacity
                  </Label>
                  <Input type="number" defaultValue={1} min={1} max={6} className="h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <DollarSign className="w-3 h-3" /> Price ($)
                </Label>
                <Input type="number" defaultValue={0} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="What is this service about?" className="min-h-[100px]" />
              </div>
              <Button className="w-full h-11 rounded-xl shadow-lg mt-2" onClick={handleAdd}>
                Create Service
              </Button>
            </CardContent>
          </Card>

          {/* Service List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-lg mb-2">Existing Services</h3>
            {services.map((service) => (
              <Card key={service.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
                <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Settings className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xl">{service.name}</h4>
                      <Badge variant="outline" className="capitalize text-[10px] py-0">{service.type}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration} mins
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Max {service.capacity} people
                      </div>
                      <div className="font-bold text-primary">
                        ${service.price}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="hover:bg-muted text-muted-foreground">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="rounded-lg">
                      Configure Slots
                    </Button>
                  </div>
                </div>
              </Card>
            ))}

            {/* AI Recommendation Banner */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Not sure about parameters?</h4>
                  <p className="text-sm text-muted-foreground">Let our AI help you optimize your service flow.</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-xl border-accent text-accent hover:bg-accent/10 whitespace-nowrap" asChild>
                <Link href="/admin">
                  Get AI Advice
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
