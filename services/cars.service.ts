import type { Car, CarFilters } from '../types';
import { MOCK_CARS } from './mock-data';

export async function fetchCars(filters: CarFilters = {}): Promise<Car[]> {
  await delay(300);
  let result = MOCK_CARS.filter((c) => c.is_available);

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }
  if (filters.category) result = result.filter((c) => c.category === filters.category);
  if (filters.transmission) result = result.filter((c) => c.transmission === filters.transmission);
  if (filters.seats) result = result.filter((c) => c.seats >= filters.seats!);
  if (filters.minPrice != null) result = result.filter((c) => c.price_per_day >= filters.minPrice!);
  if (filters.maxPrice != null) result = result.filter((c) => c.price_per_day <= filters.maxPrice!);

  return result;
}

export async function fetchCarById(id: string): Promise<Car> {
  await delay(200);
  const car = MOCK_CARS.find((c) => c.id === id);
  if (!car) throw new Error('Car not found');
  return car;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
