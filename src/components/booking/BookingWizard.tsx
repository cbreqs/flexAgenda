
"use client";

import { useState, useEffect } from "react";
import { Service } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, User, Loader2 } from "lucide-react";
import { useFirestore, addDocumentNonBlocking, setDocumentNonBlocking, useCurrentBusiness } from "@/firebase";
import { collection, doc } from "firebase/firestore";

interface BookingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
}

export function BookingWizard({ open, onOpenChange, service }: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [attendees, setAttendees] = useState(1);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { toast } = useToast();
  const firestore = useFirestore();
  const { currentBusinessId } = useCurrentBusiness();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!firestore || !currentBusinessId) {
      toast({
        title: "Configuration Error",
        description: "No business is selected.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Single Source of Truth: Ensure grandclient record exists
      // Using email-based ID for lookup simplicity in this context
      const grandclientId = customer.email.toLowerCase().replace(/[^a-z0-9]/g, '');
      const grandclientRef = doc(firestore, 'grandclients', grandclientId);
      
      const [firstName, ...lastNameParts] = customer.name.split(' ');
      const lastName = lastNameParts.join(' ');

      setDocumentNonBlocking(grandclientRef, {
        "g-client_email": customer.email,
        "g-client_first": firstName || "Client",
        "g-client_last": lastName || "New",
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      // 2. Create the specific booking
      const bookingsCol = collection(firestore, 'businesses', currentBusinessId, 'bookings');
      
      const newBooking = {
        bookingTypeId: service.id,
        clientBusinessId: currentBusinessId,
        grandclientId: grandclientId,
        bookerName: customer.name,
        bookerEmail: customer.email,
        bookerPhoneNumber: customer.phone,
        numberOfAttendees: attendees,
        bookingStatus: 'confirmed',
        startTime: date ? `${format(date, 'yyyy-MM-dd')}T${time}:00` : new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addDocumentNonBlocking(bookingsCol, newBooking);
      
      toast({
        title: "Booking Confirmed!",
        description: `You're all set for ${service.name}.`,
      });
      setStep(4);
    } catch (error) {
      console.error("Booking submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setCustomer({ name: "", email: "", phone: "" });
      setTime("");
    }, 300);
  };

  const timeSlots = ["09:00", "10:30", "13:00", "14:30", "16:00"];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-none">
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="h-1.5 w-full bg-muted flex">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-full flex-1 transition-all duration-500 ${step >= s ? 'bg-primary' : 'bg-transparent'}`}
              />
            ))}
          </div>

          <div className="p-6 overflow-y-auto">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">
                {step < 4 ? `Book ${service.name}` : "Confirmation"}
              </DialogTitle>
            </DialogHeader>

            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-muted-foreground">Select Date</Label>
                  <div className="border rounded-xl p-2 bg-muted/10">
                    {mounted ? (
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      />
                    ) : (
                      <div className="h-[300px] flex items-center justify-center">
                        <Loader2 className="animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-muted-foreground">Select Time</Label>
                  <RadioGroup value={time} onValueChange={setTime} className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <div key={slot}>
                        <RadioGroupItem value={slot} id={slot} className="sr-only" />
                        <Label
                          htmlFor={slot}
                          className={`flex justify-center py-3 rounded-lg border cursor-pointer transition-all ${
                            time === slot ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted/30'
                          }`}
                        >
                          {slot}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="name" 
                      placeholder="Jane Doe" 
                      className="pl-10 h-11"
                      value={customer.name}
                      onChange={(e) => setCustomer({...customer, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="jane@example.com" 
                    className="h-11"
                    value={customer.email}
                    onChange={(e) => setCustomer({...customer, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Attendees</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <Button
                        key={num}
                        variant={attendees === num ? "default" : "outline"}
                        className={`h-11 ${num > service.maxCapacity ? 'opacity-20 cursor-not-allowed' : ''}`}
                        onClick={() => num <= service.maxCapacity && setAttendees(num)}
                        disabled={num > service.maxCapacity}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="rounded-xl border-2 border-primary/20 p-6 bg-primary/5 space-y-4">
                  <div>
                    <h4 className="font-bold text-lg text-primary">{service.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {date ? format(date, 'PPPP') : 'N/A'} at {time}
                    </p>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="font-bold">{customer.name}</p>
                    <p className="text-muted-foreground">{customer.email}</p>
                    <p className="pt-2 font-bold text-primary">{attendees} attendee{attendees > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="py-8 text-center space-y-4 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Booking Confirmed!</h3>
                  <p className="text-muted-foreground mt-2">
                    We've sent a confirmation to <span className="font-bold text-foreground">{customer.email}</span>.
                  </p>
                </div>
                <Button className="w-full h-12 mt-4" onClick={handleClose}>
                  Close
                </Button>
              </div>
            )}
          </div>

          {step < 4 && (
            <div className="p-6 bg-muted/10 border-t flex justify-between">
              {step > 1 ? (
                <Button variant="ghost" onClick={handleBack}>Back</Button>
              ) : (
                <div />
              )}
              {step < 3 ? (
                <Button 
                  onClick={handleNext} 
                  disabled={(step === 1 && !time) || (step === 2 && (!customer.name || !customer.email))}
                  className="px-8 rounded-xl font-bold"
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="px-8 rounded-xl font-bold"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Confirm Booking
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
