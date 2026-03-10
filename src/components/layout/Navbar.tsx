"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Settings, UserCircle, Menu, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useFirebase, useUser } from "@/firebase";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { areServicesAvailable, firebaseApp } = useFirebase();
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isConnected = areServicesAvailable && user;
  const projectId = firebaseApp?.options.projectId || "reqs-tech";

  const navItems = isAdmin 
    ? [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Services", href: "/admin/services", icon: Settings },
        { name: "Bookings", href: "/admin/bookings", icon: Calendar },
      ]
    : [
        { name: "Home", href: "/", icon: LayoutDashboard },
        { name: "Admin Portal", href: "/admin", icon: UserCircle },
      ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
              F
            </div>
            <span className="font-headline font-bold text-2xl text-primary tracking-tight">FlexAgenda</span>
          </Link>
          
          {mounted && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant={isConnected ? "outline" : "destructive"} 
                    className={cn(
                      "hidden sm:flex items-center gap-1.5 py-0.5 px-2 text-[10px] uppercase font-bold border-primary/20 bg-primary/5 cursor-help",
                      !isConnected && "animate-pulse"
                    )}
                  >
                    {isConnected ? (
                      <>
                        <Wifi className="w-3 h-3 text-green-500" />
                        <span className="text-green-500">Live</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3 text-destructive" />
                        <span>Setup Required</span>
                      </>
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-bold flex items-center gap-1 text-primary">
                      {isConnected ? "Connection Status: Active" : "Action Required"}
                    </p>
                    <p className="text-xs">
                      The app is trying to connect to project ID: <code className="bg-muted px-1 rounded">{projectId}</code>
                    </p>
                    {!isConnected && (
                      <p className="text-xs">
                        1. Click <b>"Get started"</b> in your Firebase Console.<br />
                        2. Enable <b>Anonymous</b> sign-in.<br />
                        3. Verify the Project ID in your browser URL matches the one above.
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          {!mounted ? (
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          ) : (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 text-lg font-medium p-2 rounded-md",
                        pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
}
