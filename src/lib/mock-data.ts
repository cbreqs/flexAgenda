
import { Service, Booking } from './types';

export const mockServices: Service[] = [
  {
    id: '1',
    name: '1-on-1 Strategy Session',
    description: 'A focused session to discuss business growth and digital presence.',
    type: 'appointment',
    durationMinutes: 45,
    maxCapacity: 1,
    price: 150,
    imageKey: 'consultation'
  },
  {
    id: '2',
    name: 'Web Design Workshop',
    description: 'Interactive group session for small teams to brainstorm their new website structure.',
    type: 'event',
    durationMinutes: 120,
    maxCapacity: 6,
    price: 300,
    imageKey: 'workshop'
  },
  {
    id: '3',
    name: 'Wellness Consultation',
    description: 'Personalized health and wellness assessment.',
    type: 'appointment',
    durationMinutes: 60,
    maxCapacity: 2,
    price: 80,
    imageKey: 'health'
  }
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    serviceId: '1',
    customerName: 'Alice Johnson',
    customerEmail: 'alice@example.com',
    attendeesCount: 1,
    startTime: new Date(Date.now() + 86400000), // tomorrow
    status: 'confirmed'
  },
  {
    id: 'b2',
    serviceId: '2',
    customerName: 'Bob Smith',
    customerEmail: 'bob@techcorp.com',
    attendeesCount: 4,
    startTime: new Date(Date.now() + 172800000), // day after tomorrow
    status: 'pending'
  }
];
