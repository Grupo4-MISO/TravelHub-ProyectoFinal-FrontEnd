export interface CheapRoom {
  id: string;
  code: string;
  descripcion: string;
  capacidad: number;
  precio: number;
  imageUrl: string;
}

export interface PopularAccommodation {
  id: string;
  providerId: string;
  nombre: string;
  descripcion: string;
  countryCode: string;
  pais: string;
  ciudad: string;
  direccion: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviews: number;
  imagenes: string[];
  habitacion_mas_economica: CheapRoom;
  created_at: string;
  updated_at: string;
}
