
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MoreHorizontal, Mail, Phone, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const bookings = [
  { id: "BK001", customer: "Alice Johnson", service: "Strategy Session", date: "2024-03-25", time: "02:00 PM", status: "confirmed", people: 1 },
  { id: "BK002", customer: "Bob Smith", service: "Design Workshop", date: "2024-03-26", time: "10:30 AM", status: "pending", people: 4 },
  { id: "BK003", customer: "Charlie Brown", service: "Wellness Assessment", date: "2024-03-27", time: "01:00 PM", status: "cancelled", people: 2 },
  { id: "BK004", customer: "Diana Prince", service: "Strategy Session", date: "2024-03-28", time: "04:00 PM", status: "confirmed", people: 1 },
];

export default function BookingsManagement() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold">Bookings</h1>
            <p className="text-muted-foreground">Manage and track your customer reservations.</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search bookings..." className="pl-10 h-10 rounded-lg bg-muted/50" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-lg h-10 px-4">All Statuses</Button>
                <Button variant="outline" size="sm" className="rounded-lg h-10 px-4">This Month</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id} className="group transition-colors">
                    <TableCell className="font-medium text-muted-foreground">{booking.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{booking.customer}</span>
                        <span className="text-xs text-muted-foreground">customer@example.com</span>
                      </div>
                    </TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{booking.date}</span>
                        <span className="text-xs text-muted-foreground">{booking.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1 font-medium">
                        {booking.people} pax
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={booking.status === 'confirmed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'secondary'}
                        className="capitalize"
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-muted">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="gap-2">
                            <Mail className="w-4 h-4" /> Email Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Phone className="w-4 h-4" /> Call Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                            <Calendar className="w-4 h-4" /> Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            Cancel Booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
