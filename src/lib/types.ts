
export type BookingType = 'appointment' | 'event';

export interface Service {
  id: string;
  name: string;
  description: string;
  type: BookingType;
  durationMinutes: number;
  maxCapacity: number;
  price: number;
  imageKey: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  attendeesCount: number;
  startTime: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // ISO string or simple time
  available: boolean;
}
