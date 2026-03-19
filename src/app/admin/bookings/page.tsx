
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, Mail, Phone, Download, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCollection, useMemoFirebase, useFirestore, useCurrentBusiness } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export default function BookingsManagement() {
  const firestore = useFirestore();
  const { currentBusinessId } = useCurrentBusiness();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !currentBusinessId) return null;
    return query(
      collection(firestore, 'businesses', currentBusinessId, 'bookings'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, currentBusinessId]);

  const { data: bookings, isLoading } = useCollection(bookingsQuery);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">Bookings</h1>
            <p className="text-muted-foreground">Reservations for <span className="font-bold text-primary">{currentBusinessId}</span>.</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="border-b">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search bookings..." className="pl-10 h-10" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {!currentBusinessId ? (
              <div className="py-20 text-center text-muted-foreground">Select a business to view bookings.</div>
            ) : isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : bookings && bookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service ID</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking: any) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold">{booking.bookerName}</span>
                          <span className="text-xs text-muted-foreground">{booking.bookerEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground uppercase">{booking.bookingTypeId?.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{booking.startTime ? new Date(booking.startTime).toLocaleDateString() : 'N/A'}</span>
                          <span className="text-xs text-muted-foreground">{booking.startTime ? new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.bookingStatus === 'confirmed' ? 'default' : 'secondary'}>{booking.bookingStatus}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Mail className="w-4 h-4 mr-2" /> Email</DropdownMenuItem>
                            <DropdownMenuItem><Phone className="w-4 h-4 mr-2" /> Call</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-20 text-center text-muted-foreground">No bookings found.</div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
