"use client";
import { Producto } from "../types/producto";
import { HiPlus } from "react-icons/hi2";

interface CardProductoProps {
  producto: Producto;
}

export default function CardProducto({ producto }: CardProductoProps) {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-3 flex flex-col gap-2 hover:shadow-md transition-shadow duration-200">
      
      {/* Contenedor de Imagen Nativa (Soluciona el error 404 del config) */}
      <div className="w-full h-36 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-gray-100">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-contain mix-blend-multiply"
            loading="lazy"
          />
        ) : (
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sin Imagen</span>
        )}
      </div>

      {/* Categoría */}
      {producto.categoria && (
        <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider bg-blue-50 self-start px-2 py-0.5 rounded">
          {producto.categoria}
        </span>
      )}

      {/* Título del producto */}
      <p className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] leading-tight">
        {producto.nombre}
      </p>

      {/* Precio y Botón */}
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
        <span className="text-blue-950 font-black text-base font-mono">
          S/ {producto.precio.toFixed(2)}
        </span>
        <button 
          title="Agregar al carrito"
          className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors border border-yellow-500 shadow-sm active:translate-y-0.5"
        >
          <HiPlus className="w-4 h-4 stroke-[1px]" />
        </button>
      </div>
    </div>
  );
}