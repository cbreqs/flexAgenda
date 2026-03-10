"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Settings, Trash2, Clock, Users, DollarSign, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useCollection, useMemoFirebase, useFirestore, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';

export default function ServicesManagement() {
  const { toast } = useToast();
  const firestore = useFirestore();
  
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceType, setNewServiceType] = useState("appointment");
  const [newServiceDuration, setNewServiceDuration] = useState(45);
  const [newServiceCapacity, setNewServiceCapacity] = useState(1);
  const [newServicePrice, setNewServicePrice] = useState(0);
  const [newServiceDescription, setNewServiceDescription] = useState("");

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'clientBusinesses', 'default-business', 'bookingTypes');
  }, [firestore]);

  const { data: services, isLoading } = useCollection(servicesQuery);

  const handleAdd = () => {
    if (!firestore || !newServiceName) return;

    const colRef = collection(firestore, 'clientBusinesses', 'default-business', 'bookingTypes');
    const newService = {
      name: newServiceName,
      type: newServiceType,
      defaultDurationMinutes: newServiceDuration,
      maxCapacity: newServiceCapacity,
      price: newServicePrice,
      description: newServiceDescription,
      isActive: true,
      requiresApproval: false,
      clientBusinessId: 'default-business',
      clientBusinessMembers: { 'placeholder-uid': 'admin' }, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDocumentNonBlocking(colRef, newService);
    
    toast({ title: "Service Created", description: "Your new service is now live." });
    
    setNewServiceName("");
    setNewServiceDescription("");
  };

  const handleDelete = (id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'clientBusinesses', 'default-business', 'bookingTypes', id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Service Deleted", description: "The service has been removed." });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">Services</h1>
            <p className="text-muted-foreground">Configure your booking types and parameters.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 border shadow-md h-fit sticky top-24 bg-card/50">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
              <CardTitle className="text-lg">Create New Service</CardTitle>
              <CardDescription className="text-primary-foreground/80">Add a new appointment or event type.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Service Name</Label>
                <Input 
                  placeholder="e.g. 1-on-1 Consultation" 
                  className="h-10 bg-muted/20" 
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newServiceType} onValueChange={setNewServiceType}>
                  <SelectTrigger className="h-10 bg-muted/20">
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
                  <Label className="flex items-center gap-2 text-xs">
                    <Clock className="w-3 h-3" /> Duration (min)
                  </Label>
                  <Input 
                    type="number" 
                    value={newServiceDuration} 
                    className="h-10 bg-muted/20"
                    onChange={(e) => setNewServiceDuration(parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs">
                    <Users className="w-3 h-3" /> Max Capacity
                  </Label>
                  <Input 
                    type="number" 
                    value={newServiceCapacity} 
                    min={1} 
                    max={6} 
                    className="h-10 bg-muted/20"
                    onChange={(e) => setNewServiceCapacity(parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs">
                  <DollarSign className="w-3 h-3" /> Price ($)
                </Label>
                <Input 
                  type="number" 
                  value={newServicePrice} 
                  className="h-10 bg-muted/20"
                  onChange={(e) => setNewServicePrice(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  placeholder="What is this service about?" 
                  className="min-h-[100px] bg-muted/20" 
                  value={newServiceDescription}
                  onChange={(e) => setNewServiceDescription(e.target.value)}
                />
              </div>
              <Button className="w-full h-11 rounded-xl shadow-lg mt-2 font-bold" onClick={handleAdd}>
                Create Service
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-lg mb-2">Existing Services</h3>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : services && services.length > 0 ? (
              services.map((service: any) => (
                <Card key={service.id} className="border shadow-sm hover:shadow-md transition-all overflow-hidden bg-card/30">
                  <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
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
                          {service.defaultDurationMinutes} mins
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Max {service.maxCapacity} people
                        </div>
                        <div className="font-bold text-primary">
                          ${service.price || 0}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" className="rounded-lg">
                        Configure Slots
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-2xl">No services configured yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
