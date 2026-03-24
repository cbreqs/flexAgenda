
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Settings, UserCircle, Menu, Building2, Briefcase, PlusCircle, ExternalLink, LogOut, LogIn, ChevronDown, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser, useCurrentBusiness, useCollection, useMemoFirebase, useAuth, useFirestore } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const isAdminView = pathname.startsWith("/admin");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  const { currentBusinessId, setCurrentBusinessId } = useCurrentBusiness();

  useEffect(() => {
    setMounted(true);
  }, []);

  const businessesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'businesses'),
      where(`members.${user.uid}`, 'in', ['admin', 'editor', 'viewer'])
    );
  }, [firestore, user]);

  const { data: businesses } = useCollection(businessesQuery);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      setCurrentBusinessId('');
      router.push('/login');
    }
  };

  const navItems = isAdminView 
    ? [
        { name: "Businesses", href: "/admin/businesses", icon: Building2 },
        { name: "Services", href: "/admin/services", icon: Settings },
        { name: "Bookings", href: "/admin/bookings", icon: Calendar },
      ]
    : [
        { name: "Home", href: "/", icon: User },
        { name: "Owner Portal", href: "/admin/businesses", icon: ShieldCheck },
      ];

  const currentBusinessName = businesses?.find(b => b.id === currentBusinessId)?.name || "Select Business";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">F</div>
            <span className="font-bold text-2xl text-primary tracking-tight hidden sm:inline-block">FlexAgenda</span>
          </Link>
          
          {mounted && user && (isAdminView || businesses && businesses.length > 0) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-2 border bg-muted/30">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold truncate max-w-[120px]">{currentBusinessName}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 p-2 shadow-2xl">
                <DropdownMenuLabel className="text-[10px] uppercase font-black px-3 py-2 tracking-widest text-muted-foreground">Switch Profile</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {businesses?.map((biz: any) => (
                  <DropdownMenuItem key={biz.id} onClick={() => setCurrentBusinessId(biz.id)} className={cn(currentBusinessId === biz.id && "bg-primary text-primary-foreground")}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span className="truncate">{biz.name}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/businesses" className="text-primary font-bold">
                    <PlusCircle className="w-4 h-4 mr-2" /> Manage All Profiles
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="hidden md:flex items-center gap-8">
          {isAdminView && currentBusinessId && (
            <Link href="/" className="flex items-center gap-2 text-sm font-bold text-accent hover:text-primary transition-colors">
              <ExternalLink className="w-4 h-4" /> View Customer Page
            </Link>
          )}
          {navItems.map((item) => {
            if (item.href === "/login" && user) return null;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-bold transition-all hover:text-primary",
                  pathname === item.href ? "text-primary underline underline-offset-4 decoration-2" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            )
          })}
          {mounted && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full gap-2 font-bold bg-muted/50">
                  <UserCircle className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 shadow-2xl">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="text-sm font-bold">My Account</span>
                  <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs">
                  Role: <span className="ml-auto font-black uppercase text-primary">{isAdminView ? "Owner" : "Customer"}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive font-bold cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-full font-bold shadow-lg">
              <Link href="/login">Portal Access</Link>
            </Button>
          )}
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="w-6 h-6" /></Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6 mt-12">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-bold">
                    <item.icon className="w-5 h-5" /> {item.name}
                  </Link>
                ))}
                {user ? (
                  <Button variant="outline" className="justify-start text-destructive" onClick={handleSignOut}>
                    <LogOut className="w-5 h-5 mr-2" /> Sign Out
                  </Button>
                ) : (
                  <Button asChild><Link href="/login"><LogIn className="w-5 h-5 mr-2" /> Owner Portal</Link></Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
