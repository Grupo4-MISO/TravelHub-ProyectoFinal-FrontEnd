export class SearchBar {
    habitacion_id: string;
    hospedaje_id: string;
    nombre: string;
    pais: string;
    ciudad: string;
    direccion: string;
    rating: number;
    capacidad: number;
    precio: number;

    public constructor(
        habitacion_id: string,
        hospedaje_id: string,
        nombre: string,
        pais: string,
        ciudad: string,
        direccion: string,
        rating: number,
        capacidad: number,
        precio: number,
    ) {
        this.habitacion_id = habitacion_id;
        this.hospedaje_id = hospedaje_id;
        this.nombre = nombre;
        this.pais = pais;
        this.ciudad = ciudad;
        this.direccion = direccion;
        this.rating = rating;
        this.capacidad = capacidad;
        this.precio = precio;
    }
}