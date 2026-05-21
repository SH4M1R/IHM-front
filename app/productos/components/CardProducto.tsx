import Image from "next/image";
import { IoMdAddCircle } from "react-icons/io";

interface CardProductoProps {
    imagen: string,
    marca: string,
    nombre: string,
    precio: number
}

export default function CardProducto({ imagen, marca, nombre, precio }: CardProductoProps) {
    return (
        <div className="w-full bg-white rounded-lg border border-gray-200 p-3 flex flex-col gap-2">
            {/* Imagen */}
            <Image
                src={imagen}
                alt="Producto"
                width={200} height={150} className="w-full h-36 object-contain cursor-pointer"
            />
            

            {/* Marca */}
            <span className="text-xs font-bold text-gray-500 uppercase">{marca}</span>

            {/* Nombre */}
            <p className="text-sm text-gray-800">{nombre}</p>

            {/* Precio y botón */}
            <div className="flex justify-between items-center mt-auto">
                <span className="text-red-600 font-bold text-lg">S/ {precio}</span>
                <IoMdAddCircle  className="text-red-600 text-4xl cursor-pointer"/>

            </div>
        </div>
    )
}