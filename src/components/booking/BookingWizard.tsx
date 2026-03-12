
"use client";

import { useState } from "react";
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
import { useFirestore, addDocumentNonBlocking, useCurrentBusiness } from "@/firebase";
import { collection } from "firebase/firestore";

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
  
  const { toast } = useToast();
  const firestore = useFirestore();
  const { currentBusinessId } = useCurrentBusiness();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (!firestore || !currentBusinessId) {
      toast({
        title: "Configuration Error",
        description: "No business is selected. Please select a business from the menu first.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingsCol = collection(firestore, 'clientBusinesses', currentBusinessId, 'bookings');
      
      const newBooking = {
        bookingTypeId: service.id,
        clientBusinessId: currentBusinessId,
        availabilitySlotId: "manual-slot",
        bookerName: customer.name,
        bookerEmail: customer.email,
        bookerPhoneNumber: customer.phone,
        numberOfAttendees: attendees,
        bookingStatus: 'confirmed',
        confirmationSent: true,
        reminderSent: false,
        startTime: date ? `${format(date, 'yyyy-MM-dd')}T${time}:00` : new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clientBusinessMembers: { 'placeholder-uid': 'admin' }
      };

      await addDocumentNonBlocking(bookingsCol, newBooking);
      
      toast({
        title: "Booking Confirmed!",
        description: `You're all set for ${service.name} at ${currentBusinessId}.`,
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
              {step < 4 && (
                <DialogDescription>
                  Step {step} of 3: {step === 1 ? 'Schedule' : step === 2 ? 'Your Details' : 'Review'}
                </DialogDescription>
              )}
            </DialogHeader>

            {step === 1 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="space-y-4">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-black">1. Select Date</Label>
                  <div className="flex justify-center border rounded-xl p-2 bg-muted/10">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="w-full"
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-black">2. Select Time</Label>
                  <RadioGroup value={time} onValueChange={setTime} className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <div key={slot} className="flex items-center space-x-2">
                        <RadioGroupItem value={slot} id={slot} className="sr-only" />
                        <Label
                          htmlFor={slot}
                          className={`flex-1 py-3 rounded-lg border cursor-pointer transition-all text-center font-bold text-sm ${
                            time === slot ? 'bg-primary text-primary-foreground border-primary shadow-lg ring-2 ring-primary/20' : 'bg-muted/30 hover:bg-muted/50 border-border/50'
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
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="name" 
                        placeholder="Alice Johnson" 
                        className="pl-10 h-11 rounded-xl"
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
                      placeholder="alice@example.com" 
                      className="h-11 rounded-xl"
                      value={customer.email}
                      onChange={(e) => setCustomer({...customer, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input 
                      id="phone" 
                      placeholder="+1 (555) 000-0000" 
                      className="h-11 rounded-xl"
                      value={customer.phone}
                      onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Attendees</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <Button
                          key={num}
                          type="button"
                          variant={attendees === num ? "default" : "outline"}
                          className={`h-11 rounded-lg ${num > service.maxCapacity ? 'opacity-20 cursor-not-allowed' : ''}`}
                          onClick={() => num <= service.maxCapacity && setAttendees(num)}
                          disabled={num > service.maxCapacity}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="rounded-2xl border-2 border-primary/20 p-6 bg-primary/5 space-y-4">
                  <div className="flex justify-between items-start border-b border-primary/10 pb-4">
                    <div>
                      <h4 className="font-black text-xl text-primary">{service.name}</h4>
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-primary" />
                          {date ? format(date, 'PPPP') : 'N/A'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          {time} ({service.durationMinutes} mins)
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Total Price</p>
                      <p className="text-3xl font-black text-primary">${service.price}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Customer</p>
                    <div className="text-sm">
                      <p className="font-bold">{customer.name}</p>
                      <p className="text-muted-foreground">{customer.email}</p>
                      <p className="mt-2 text-primary font-bold">{attendees} attendee{attendees > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="py-8 text-center space-y-4 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <CheckCircle2 className="w-14 h-14" />
                </div>
                <div>
                  <h3 className="text-3xl font-black">Booking Confirmed!</h3>
                  <p className="text-muted-foreground mt-2 px-4 leading-relaxed">
                    We've sent a confirmation email to <span className="font-bold text-foreground">{customer.email}</span>.
                  </p>
                </div>
                <Button className="w-full h-14 rounded-2xl mt-8 text-lg font-bold shadow-xl" onClick={handleClose}>
                  Back to Services
                </Button>
              </div>
            )}
          </div>

          {step < 4 && (
            <div className="p-6 bg-muted/10 border-t flex justify-between gap-4">
              {step > 1 ? (
                <Button variant="ghost" onClick={handleBack} className="gap-2 font-bold">
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              ) : (
                <Button variant="ghost" onClick={handleClose} className="font-bold text-muted-foreground">
                  Cancel
                </Button>
              )}
              {step < 3 ? (
                <Button 
                  onClick={handleNext} 
                  disabled={(step === 1 && !time) || (step === 2 && (!customer.name || !customer.email))}
                  className="px-8 rounded-xl shadow-lg gap-2 font-bold"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="px-10 rounded-xl bg-primary hover:bg-primary/90 shadow-xl gap-2 font-bold text-lg"
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  Confirm Reservation
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
