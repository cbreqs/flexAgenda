
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
import { CheckCircle2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock, User } from "lucide-react";

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
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const { toast } = useToast();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = () => {
    // Mocking a successful booking
    toast({
      title: "Booking Confirmed!",
      description: `You're all set for ${service.name} on ${date ? format(date, 'PPP') : ''} at ${time}.`,
    });
    setStep(4); // Success step
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setCustomer({ name: "", email: "" });
      setTime("");
    }, 300);
  };

  const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-muted flex">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-full flex-1 transition-all duration-500 ${step >= s ? 'bg-primary' : 'bg-transparent'}`}
              />
            ))}
          </div>

          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {step < 4 ? `Book ${service.name}` : "Confirmation"}
              </DialogTitle>
              {step < 4 && (
                <DialogDescription>
                  Step {step} of 3: {step === 1 ? 'Date & Time' : step === 2 ? 'Details' : 'Review'}
                </DialogDescription>
              )}
            </DialogHeader>

            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">1. Select Date</Label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border shadow-sm"
                      disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">2. Select Time</Label>
                    <RadioGroup value={time} onValueChange={setTime} className="grid grid-cols-1 gap-2">
                      {timeSlots.map((slot) => (
                        <div key={slot} className="flex items-center space-x-2">
                          <RadioGroupItem value={slot} id={slot} className="sr-only" />
                          <Label
                            htmlFor={slot}
                            className={`flex-1 p-3 rounded-lg border cursor-pointer transition-all hover:border-primary text-center font-medium ${
                              time === slot ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-background hover:bg-muted'
                            }`}
                          >
                            {slot}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
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
                      placeholder="alice@example.com" 
                      className="h-11"
                      value={customer.email}
                      onChange={(e) => setCustomer({...customer, email: e.target.value})}
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
                          className={`h-11 ${num > service.maxCapacity ? 'opacity-30 cursor-not-allowed' : ''}`}
                          onClick={() => num <= service.maxCapacity && setAttendees(num)}
                          disabled={num > service.maxCapacity}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                    {service.maxCapacity < 6 && (
                      <p className="text-xs text-muted-foreground">This service has a max capacity of {service.maxCapacity}.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="rounded-xl border p-6 bg-muted/30 space-y-4">
                  <div className="flex justify-between items-start border-b pb-4">
                    <div>
                      <h4 className="font-bold text-lg">{service.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <CalendarIcon className="w-4 h-4" />
                        {date ? format(date, 'PPP') : 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Clock className="w-4 h-4" />
                        {time} ({service.durationMinutes} mins)
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Total</p>
                      <p className="text-2xl font-bold text-primary">${service.price}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Contact Info</p>
                    <div className="text-sm text-muted-foreground">
                      <p>{customer.name}</p>
                      <p>{customer.email}</p>
                      <p>{attendees} attendee{attendees > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  By clicking "Confirm Booking", you agree to our terms of service and cancellation policy.
                </p>
              </div>
            )}

            {step === 4 && (
              <div className="py-8 text-center space-y-4 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Great! You're Booked.</h3>
                  <p className="text-muted-foreground mt-2">
                    A confirmation email has been sent to <span className="font-semibold text-foreground">{customer.email}</span>.
                  </p>
                </div>
                <Button className="w-full h-12 rounded-xl mt-6" onClick={handleClose}>
                  Done
                </Button>
              </div>
            )}
          </div>

          {step < 4 && (
            <div className="p-6 bg-muted/20 border-t flex justify-between gap-4">
              {step > 1 ? (
                <Button variant="ghost" onClick={handleBack} className="gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              ) : (
                <div />
              )}
              {step < 3 ? (
                <Button 
                  onClick={handleNext} 
                  disabled={(step === 1 && !time) || (step === 2 && (!customer.name || !customer.email))}
                  className="px-8 rounded-xl shadow-lg gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="px-10 rounded-xl bg-accent hover:bg-accent/90 shadow-xl">
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
