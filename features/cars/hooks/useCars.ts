import { useQuery } from '@tanstack/react-query';
import { fetchCarById, fetchCars } from '../../../services/cars.service';
import { useFilterStore } from '../../../stores/filter.store';

export function useCars() {
  const { filters } = useFilterStore();
  return useQuery({
    queryKey: ['cars', filters],
    queryFn: () => fetchCars(filters),
  });
}

export function useCar(id: string) {
  return useQuery({
    queryKey: ['car', id],
    queryFn: () => fetchCarById(id),
    enabled: !!id,
  });
}
