
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
import { useCollection, useMemoFirebase, useFirestore, addDocumentNonBlocking, deleteDocumentNonBlocking, useCurrentBusiness } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { generateServiceDescription } from "@/ai/flows/ai-service-description-generator";

export default function ServicesManagement() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { currentBusinessId } = useCurrentBusiness();
  
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceType, setNewServiceType] = useState("appointment");
  const [newServiceDuration, setNewServiceDuration] = useState(45);
  const [newServiceCapacity, setNewServiceCapacity] = useState(1);
  const [newServicePrice, setNewServicePrice] = useState(0);
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const servicesQuery = useMemoFirebase(() => {
    if (!firestore || !currentBusinessId) return null;
    return collection(firestore, 'businesses', currentBusinessId, 'bookingTypes');
  }, [firestore, currentBusinessId]);

  const { data: services, isLoading } = useCollection(servicesQuery);

  const handleAiGenerate = async () => {
    if (!newServiceName) return;
    setIsAiGenerating(true);
    try {
      const { description } = await generateServiceDescription({ serviceInput: newServiceName });
      setNewServiceDescription(description);
    } catch (err) {
      toast({ title: "AI Error", variant: "destructive" });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleAdd = () => {
    if (!firestore || !newServiceName || !currentBusinessId) return;

    const colRef = collection(firestore, 'businesses', currentBusinessId, 'bookingTypes');
    const newService = {
      name: newServiceName,
      type: newServiceType,
      defaultDurationMinutes: newServiceDuration || 45,
      maxCapacity: newServiceCapacity || 1,
      price: newServicePrice || 0,
      description: newServiceDescription,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    addDocumentNonBlocking(colRef, newService);
    toast({ title: "Service Created" });
    setNewServiceName("");
    setNewServiceDescription("");
  };

  const handleDelete = (id: string) => {
    if (!firestore || !currentBusinessId) return;
    const docRef = doc(firestore, 'businesses', currentBusinessId, 'bookingTypes', id);
    deleteDocumentNonBlocking(docRef);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        <h1 className="text-3xl font-bold">Services</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 h-fit bg-card/50">
            <CardHeader>
              <CardTitle>New Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} disabled={!currentBusinessId} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input type="number" value={newServiceDuration} onChange={(e) => setNewServiceDuration(parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Max Pax</Label>
                  <Input type="number" value={newServiceCapacity} onChange={(e) => setNewServiceCapacity(parseInt(e.target.value))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={newServiceDescription} onChange={(e) => setNewServiceDescription(e.target.value)} />
              </div>
              <Button className="w-full font-bold" onClick={handleAdd} disabled={!currentBusinessId || !newServiceName}>
                Create Service
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            {!currentBusinessId ? (
              <div className="text-center py-10">Select a business profile first.</div>
            ) : isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
            ) : services && services.length > 0 ? (
              services.map((service: any) => (
                <Card key={service.id} className="bg-card/30">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg">{service.name}</h4>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{service.defaultDurationMinutes}m</span>
                        <span>Max {service.maxCapacity}</span>
                        <span className="text-primary font-bold">${service.price}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 border-2 border-dashed rounded-xl">No services found.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
