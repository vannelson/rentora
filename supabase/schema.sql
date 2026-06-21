-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Cars
create table if not exists public.cars (
  id uuid default uuid_generate_v4() primary key,
  make text not null,
  model text not null,
  year integer not null,
  category text not null check (category in ('economy','sedan','suv','luxury','van','sports')),
  transmission text not null check (transmission in ('automatic','manual')),
  fuel_type text not null check (fuel_type in ('petrol','diesel','electric','hybrid')),
  seats integer not null default 5,
  price_per_day numeric(10,2) not null,
  mileage_limit integer not null default 300,
  rating numeric(3,2) not null default 4.5,
  rating_count integer not null default 0,
  images text[] not null default '{}',
  pickup_lat float8,
  pickup_lng float8,
  pickup_address text not null default '',
  is_available boolean not null default true,
  description text,
  created_at timestamptz default now() not null
);

alter table public.cars enable row level security;
create policy "Cars are publicly readable" on public.cars for select using (true);

-- Bookings
create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  car_id uuid references public.cars(id) on delete restrict not null,
  start_date date not null,
  end_date date not null,
  pickup_location text not null,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  total_price numeric(10,2) not null,
  add_ons text[] not null default '{}',
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.bookings enable row level security;
create policy "Users can view own bookings" on public.bookings for select using (auth.uid() = user_id);
create policy "Users can create own bookings" on public.bookings for insert with check (auth.uid() = user_id);
create policy "Users can update own bookings" on public.bookings for update using (auth.uid() = user_id);

-- Sample seed data
insert into public.cars (make, model, year, category, transmission, fuel_type, seats, price_per_day, rating, rating_count, pickup_address, description, images)
values
  ('Toyota', 'Camry', 2023, 'sedan', 'automatic', 'petrol', 5, 59.00, 4.7, 142, '123 Main St, Downtown', 'Comfortable sedan perfect for city and highway driving.', ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800']),
  ('Tesla', 'Model 3', 2024, 'sedan', 'automatic', 'electric', 5, 89.00, 4.9, 87, '456 Tech Ave, Midtown', 'Premium electric sedan with autopilot and supercharging.', ARRAY['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800']),
  ('Ford', 'Explorer', 2023, 'suv', 'automatic', 'petrol', 7, 79.00, 4.6, 203, '789 Park Blvd, Uptown', 'Spacious 7-seat SUV ideal for family trips.', ARRAY['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800']),
  ('BMW', '5 Series', 2024, 'luxury', 'automatic', 'petrol', 5, 129.00, 4.8, 56, '321 Elite Dr, Harbor View', 'Luxurious performance sedan with premium interior.', ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800']),
  ('Honda', 'Civic', 2023, 'economy', 'manual', 'petrol', 5, 39.00, 4.5, 318, '654 Budget Lane, East Side', 'Economical and reliable for everyday drives.', ARRAY['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800']),
  ('Mercedes', 'Sprinter', 2023, 'van', 'automatic', 'diesel', 12, 149.00, 4.4, 29, '987 Commerce Rd, West End', 'Large van for group transport or cargo.', ARRAY['https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800']);
