export interface PropertyRoom {
  id: string;
  code: string;
  descripcion: string;
  capacidad: number;
  precio: number;
  imageUrl: string;
}

export interface PropertyImage {
  id: string;
  url: string;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  icon: string;
}

export interface PropertyDetail {
  id: string;
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
  habitaciones: PropertyRoom[];
  amenidades: PropertyAmenity[];
  imagenes: PropertyImage[];
  created_at: string;
  updated_at: string;
}