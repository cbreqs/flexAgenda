
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Settings, UserCircle, Menu, Wifi, ShieldAlert, ChevronDown, Building2, Briefcase, PlusCircle, ExternalLink, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useFirebase, useUser, useCurrentBusiness, useCollection, useMemoFirebase, useAuth } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { areServicesAvailable, firebaseApp, firestore } = useFirebase();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { currentBusinessId, setCurrentBusinessId } = useCurrentBusiness();

  useEffect(() => {
    setMounted(true);
  }, []);

  const businessesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'clientBusinesses'),
      where(`members.${user.uid}`, 'in', ['admin', 'editor', 'viewer'])
    );
  }, [firestore, user]);

  const { data: businesses } = useCollection(businessesQuery);

  const isConnected = areServicesAvailable && user && !isUserLoading;
  const config = firebaseApp?.options || {};
  const projectId = config.projectId || "Not Set";
  const hasKey = config.apiKey && config.apiKey !== "PASTE_YOUR_API_KEY_HERE";

  const handleSignOut = () => {
    if (auth) {
      signOut(auth);
      setCurrentBusinessId('');
    }
  };

  const navItems = isAdmin 
    ? [
        { name: "Businesses", href: "/admin/businesses", icon: Building2 },
        { name: "Services", href: "/admin/services", icon: Settings },
        { name: "Bookings", href: "/admin/bookings", icon: Calendar },
      ]
    : [
        { name: "Home", href: "/", icon: LayoutDashboard },
        { name: "Client Login", href: "/login", icon: UserCircle },
      ];

  const currentBusinessName = businesses?.find(b => b.id === currentBusinessId)?.name || "Select Business";

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
          
          {mounted && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(
                  "h-9 px-3 gap-2 border border-border/50 bg-muted/30 hover:bg-muted/50 transition-all",
                  !currentBusinessId && "border-primary/50 text-primary animate-pulse"
                )}>
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold truncate max-w-[120px]">{currentBusinessName}</span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2 shadow-2xl rounded-xl border-primary/10">
                <DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase font-black px-3 py-2 tracking-widest">Your Businesses</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {businesses && businesses.length > 0 ? (
                  businesses.map((biz: any) => (
                    <DropdownMenuItem 
                      key={biz.id} 
                      onClick={() => setCurrentBusinessId(biz.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-lg cursor-pointer px-3 py-2.5 my-1 transition-all",
                        currentBusinessId === biz.id ? "bg-primary text-primary-foreground font-bold shadow-md" : "hover:bg-accent/50"
                      )}
                    >
                      <Briefcase className={cn("w-4 h-4", currentBusinessId === biz.id ? "text-primary-foreground" : "text-primary-foreground/60")} />
                      <span className="truncate">{biz.name}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-muted-foreground italic">
                    No businesses found.
                  </div>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/businesses" className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 rounded-lg w-full px-3 py-2.5 mt-1">
                    <PlusCircle className="w-4 h-4" />
                    Manage Profiles
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
                      "hidden md:flex items-center gap-1.5 py-0.5 px-2 text-[10px] uppercase font-black border-primary/20 bg-primary/5 cursor-help tracking-wider",
                      (!isConnected || !hasKey) && "animate-pulse"
                    )}
                  >
                    {isConnected && hasKey ? (
                      <>
                        <Wifi className="w-3 h-3 text-green-500" />
                        <span className="text-green-500">Syncing</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3 h-3" />
                        <span>Disconnected</span>
                      </>
                    )}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-4 rounded-xl border-primary/10 shadow-2xl" side="bottom">
                  <div className="space-y-3">
                    <p className="font-black text-primary uppercase text-[10px] tracking-widest">Network Status</p>
                    <div className="text-[10px] space-y-2 font-mono">
                      <div className="flex justify-between gap-4 border-b border-border/50 pb-1">
                        <span className="text-muted-foreground">User:</span>
                        <span className="font-bold">{user?.email || 'Anonymous'}</span>
                      </div>
                      <div className="flex justify-between gap-4 border-b border-border/50 pb-1">
                        <span className="text-muted-foreground">Auth:</span>
                        <span className={user ? "text-green-500 font-bold" : "text-destructive font-bold"}>{user ? "Secure" : "Insecure"}</span>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="hidden md:flex items-center gap-8">
          {isAdmin && currentBusinessId && (
            <Link 
              href="/"
              className="flex items-center gap-2 text-sm font-bold text-accent transition-all hover:text-primary"
            >
              <ExternalLink className="w-4 h-4" />
              View Page
            </Link>
          )}
          {navItems.map((item) => {
            if (item.href === "/login" && user) return null;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-bold transition-all hover:text-primary relative group py-1",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
                <span className={cn(
                  "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300",
                  pathname === item.href ? "w-full" : "w-0 group-hover:w-1/2"
                )} />
              </Link>
            )
          })}
          {mounted && user && (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          )}
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="w-6 h-6 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l-primary/10">
              <div className="flex flex-col gap-6 mt-12">
                <div className="px-2 mb-4">
                  <h3 className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-4">Navigation</h3>
                  <div className="flex flex-col gap-2">
                    {navItems.map((item) => {
                      if (item.href === "/login" && user) return null;
                      return (
                        <Link 
                          key={item.href} 
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 text-base font-bold p-3 rounded-xl transition-all",
                            pathname === item.href ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <item.icon className="w-5 h-5" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
                
                <div className="px-2 border-t pt-6">
                  {user ? (
                    <Button variant="outline" className="w-full justify-start gap-3 rounded-xl h-12 border-primary/20 text-destructive font-bold" onClick={handleSignOut}>
                      <LogOut className="w-5 h-5" /> Sign Out
                    </Button>
                  ) : (
                    <Button variant="default" className="w-full justify-start gap-3 rounded-xl h-12 font-bold" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <LogIn className="w-5 h-5" /> Client Login
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
