export interface Producto {
  idProducto: number;
  nombre: string;
  precio: number;
  imagen?: string;
  stock?: number;
  categoria?: string;
  activo: boolean;
}