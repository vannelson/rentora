export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';
export type TransmissionType = 'automatic' | 'manual';
export type CarCategory = 'economy' | 'sedan' | 'suv' | 'luxury' | 'van' | 'sports';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  category: CarCategory;
  transmission: TransmissionType;
  fuel_type: FuelType;
  seats: number;
  price_per_day: number;
  mileage_limit: number;
  rating: number;
  rating_count: number;
  images: string[];
  pickup_lat: number;
  pickup_lng: number;
  pickup_address: string;
  is_available: boolean;
  description?: string;
  created_at: string;
}

export interface BookingAddOn {
  id: string;
  name: string;
  price_per_day: number;
  icon: string;
}

export interface Booking {
  id: string;
  user_id: string;
  car_id: string;
  car?: Car;
  start_date: string;
  end_date: string;
  pickup_location: string;
  status: BookingStatus;
  total_price: number;
  add_ons: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CarFilters {
  minPrice?: number;
  maxPrice?: number;
  category?: CarCategory;
  transmission?: TransmissionType;
  seats?: number;
  search?: string;
}
