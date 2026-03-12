"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Plus, CheckCircle2, LayoutDashboard, Trash2, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCurrentBusiness, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

export default function BusinessSelectionPage() {
  const { currentBusinessId, setCurrentBusinessId } = useCurrentBusiness();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBiz, setNewBiz] = useState({ name: "", id: "", description: "", email: "" });

  const businessesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'clientBusinesses');
  }, [firestore]);

  const { data: businesses, isLoading } = useCollection(businessesQuery);

  const handleCreateBusiness = () => {
    if (!firestore || !newBiz.name || !newBiz.id) {
      toast({ title: "Validation Error", description: "Name and ID are required.", variant: "destructive" });
      return;
    }

    const docRef = doc(firestore, 'clientBusinesses', newBiz.id);
    const businessData = {
      id: newBiz.id,
      name: newBiz.name,
      description: newBiz.description,
      contactEmail: newBiz.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: { 'placeholder-uid': 'admin' } // Initial admin
    };

    setDocumentNonBlocking(docRef, businessData, { merge: true });
    toast({ title: "Business Registered", description: `${newBiz.name} is now available.` });
    setIsCreateOpen(false);
    setNewBiz({ name: "", id: "", description: "", email: "" });
  };

  const handleDeleteBusiness = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (!firestore) return;
    
    if (id === currentBusinessId) {
      toast({ title: "Cannot Delete", description: "Switch to another business before deleting this one.", variant: "destructive" });
      return;
    }

    const docRef = doc(firestore, 'clientBusinesses', id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Business Removed", description: `${name} has been deleted.` });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-headline font-bold">Client Businesses</h1>
            <p className="text-muted-foreground max-w-xl">
              Manage your client profiles. Switch between them to configure unique services and schedules.
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-xl gap-2 font-bold shadow-lg">
                <Plus className="w-5 h-5" /> Register New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle>New Client Business</DialogTitle>
                <DialogDescription>Enter the basic details to initialize a new business profile.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input 
                    placeholder="e.g. Acme Wellness" 
                    value={newBiz.name}
                    onChange={(e) => setNewBiz({...newBiz, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unique ID (slug)</Label>
                  <Input 
                    placeholder="e.g. acme-wellness" 
                    value={newBiz.id}
                    onChange={(e) => setNewBiz({...newBiz, id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  />
                  <p className="text-[10px] text-muted-foreground">This will be used in URLs and database paths.</p>
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input 
                    type="email"
                    placeholder="admin@acme.com" 
                    value={newBiz.email}
                    onChange={(e) => setNewBiz({...newBiz, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Brief overview of services..." 
                    value={newBiz.description}
                    onChange={(e) => setNewBiz({...newBiz, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateBusiness} className="font-bold">Initialize Business</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse font-medium">Loading your businesses...</p>
          </div>
        ) : businesses && businesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {businesses.map((biz: any) => {
              const isActive = currentBusinessId === biz.id;
              return (
                <Card 
                  key={biz.id} 
                  className={cn(
                    "relative flex flex-col h-full transition-all duration-300 border-2 overflow-hidden",
                    isActive ? "border-primary shadow-xl ring-2 ring-primary/20 scale-[1.02]" : "border-border hover:border-primary/40 hover:shadow-md"
                  )}
                >
                  {isActive && (
                    <div className="absolute top-0 right-0 p-3 z-10">
                      <CheckCircle2 className="w-6 h-6 text-primary fill-background" />
                    </div>
                  )}
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl truncate">{biz.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px] bg-background/50 uppercase">ID: {biz.id}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3 italic">
                      {biz.description || "No description provided."}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 pb-6 px-6 flex gap-2">
                    {isActive ? (
                      <Button className="flex-1 rounded-xl gap-2 font-bold shadow-md" asChild>
                        <Link href="/admin">
                          Dashboard <LayoutDashboard className="w-4 h-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="flex-1 rounded-xl border-primary/50 text-primary hover:bg-primary/10 font-bold"
                        onClick={() => setCurrentBusinessId(biz.id)}
                      >
                        Switch
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => handleDeleteBusiness(e, biz.id, biz.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="p-20 rounded-3xl bg-muted/20 border-2 border-dashed flex flex-col items-center gap-4 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground/50" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold">No Businesses Found</h3>
              <p className="text-muted-foreground">Get started by registering your first client business profile.</p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)} className="mt-4 rounded-xl font-bold">
              Register First Client
            </Button>
          </div>
        )}

        <Card className="border-none bg-gradient-to-r from-primary/10 to-accent/10 p-8 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold">Multi-Client Architecture</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                FlexAgenda is built to scale. Each business you add gets its own isolated subcollections in Firestore, ensuring data privacy and dedicated service configurations for every client you manage.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
