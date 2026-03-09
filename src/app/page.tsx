
import { Navbar } from "@/components/layout/Navbar";
import { ServiceCard } from "@/components/booking/ServiceCard";
import { mockServices } from "@/lib/mock-data";
import { CalendarDays, Clock, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-foreground mb-6 leading-tight">
              Booking Made <span className="text-primary underline decoration-accent/30">Flexible</span> for Everyone
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Schedule appointments or group events with ease. FlexAgenda adapts to your business needs with custom durations and capacity controls.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-full px-8 shadow-xl hover:scale-105 transition-transform">
                Explore Services
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 border-primary text-primary" asChild>
                <Link href="/admin">
                  Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits/Quick Stats */}
        <section className="py-12 border-y bg-white/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Real-time Booking</h3>
                  <p className="text-sm text-muted-foreground">Always see latest availability.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Group Support</h3>
                  <p className="text-sm text-muted-foreground">Up to 6 people per slot.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Custom Durations</h3>
                  <p className="text-sm text-muted-foreground">Tailored to your service flow.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-headline font-bold text-foreground">Available Services</h2>
                <p className="text-muted-foreground">Select a service to begin your reservation</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold">F</div>
            <span className="font-bold text-lg">FlexAgenda</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 FlexAgenda. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary">Terms</Link>
            <Link href="#" className="hover:text-primary">Privacy</Link>
            <Link href="#" className="hover:text-primary">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
