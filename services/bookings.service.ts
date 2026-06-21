import type { Booking } from '../types';
import { MOCK_CARS, MOCK_BOOKINGS } from './mock-data';

const bookingsStore: Booking[] = [...MOCK_BOOKINGS];

export async function fetchBookings(_userId: string): Promise<Booking[]> {
  await delay(300);
  return [...bookingsStore].sort((a, b) => b.start_date.localeCompare(a.start_date));
}

export async function fetchBookingById(id: string): Promise<Booking> {
  await delay(200);
  const booking = bookingsStore.find((b) => b.id === id);
  if (!booking) throw new Error('Booking not found');
  return booking;
}

export interface CreateBookingPayload {
  car_id: string;
  start_date: string;
  end_date: string;
  pickup_location: string;
  add_ons: string[];
  total_price: number;
}

export async function createBooking(
  _userId: string,
  payload: CreateBookingPayload
): Promise<Booking> {
  await delay(500);
  const car = MOCK_CARS.find((c) => c.id === payload.car_id);
  const booking: Booking = {
    id: `booking-${Date.now()}`,
    user_id: 'mock-user',
    car,
    ...payload,
    status: 'confirmed',
    notes: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  bookingsStore.unshift(booking);
  return booking;
}

export async function cancelBooking(id: string): Promise<void> {
  await delay(400);
  const booking = bookingsStore.find((b) => b.id === id);
  if (booking) {
    booking.status = 'cancelled';
    booking.updated_at = new Date().toISOString();
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
