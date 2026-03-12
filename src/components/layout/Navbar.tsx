"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Settings, UserCircle, Menu, Wifi, ShieldAlert, ChevronDown, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useFirebase, useUser, useCurrentBusiness } from "@/firebase/provider";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { areServicesAvailable, firebaseApp } = useFirebase();
  const { user, isUserLoading } = useUser();
  const { currentBusinessId, setCurrentBusinessId } = useCurrentBusiness();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isConnected = areServicesAvailable && user && !isUserLoading;
  const config = firebaseApp?.options || {};
  const projectId = config.projectId || "Not Set";
  const hasKey = config.apiKey && config.apiKey !== "PASTE_YOUR_API_KEY_HERE";

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

  const mockBusinesses = [
    { id: 'default-business', name: 'Main Clinic' },
    { id: 'yoga-studio', name: 'Zen Yoga' },
    { id: 'tech-consult', name: 'Code Wizards' }
  ];

  const currentBusinessName = mockBusinesses.find(b => b.id === currentBusinessId)?.name || currentBusinessId;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
              F
            </div>
            <span className="font-headline font-bold text-2xl text-primary tracking-tight hidden sm:inline-block">FlexAgenda</span>
          </Link>
          
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3 gap-2 border border-border/50 bg-muted/30 hover:bg-muted/50 transition-all">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold truncate max-w-[120px]">{currentBusinessName}</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2">
                <DropdownMenuLabel className="text-xs text-muted-foreground uppercase font-bold px-2 py-1.5">Switch Client Business</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockBusinesses.map((biz) => (
                  <DropdownMenuItem 
                    key={biz.id} 
                    onClick={() => setCurrentBusinessId(biz.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg cursor-pointer px-3 py-2 my-1 transition-colors",
                      currentBusinessId === biz.id ? "bg-primary text-primary-foreground font-bold" : "hover:bg-accent"
                    )}
                  >
                    <Briefcase className={cn("w-4 h-4", currentBusinessId === biz.id ? "text-primary-foreground" : "text-muted-foreground")} />
                    {biz.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/businesses" className="flex items-center gap-2 text-primary font-semibold hover:bg-primary/5 rounded-lg w-full">
                    <Settings className="w-4 h-4" />
                    Manage All Businesses
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {mounted && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    variant={isConnected && hasKey ? "outline" : "destructive"} 
                    className={cn(
                      "hidden md:flex items-center gap-1.5 py-0.5 px-2 text-[10px] uppercase font-bold border-primary/20 bg-primary/5 cursor-help",
                      (!isConnected || !hasKey) && "animate-pulse"
                    )}
                  >
                    {isConnected && hasKey ? (
                      <>
                        <Wifi className="w-3 h-3 text-green-500" />
                        <span className="text-green-500">Live</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3 h-3" />
                        <span>Setup Required</span>
                      </>
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs" side="bottom">
                  <div className="space-y-3 p-1">
                    <p className="font-bold text-primary">Connection Debugger</p>
                    <div className="text-[10px] space-y-2">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Project ID:</span>
                        <code className="bg-muted px-1 rounded">{projectId}</code>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">API Key Set:</span>
                        <span className={hasKey ? "text-green-500" : "text-destructive"}>{hasKey ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Auth Session:</span>
                        <span className={user ? "text-green-500" : "text-destructive"}>{user ? "Active" : "Inactive"}</span>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

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

        <div className="md:hidden">
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
        </div>
      </div>
    </nav>
  );
}
