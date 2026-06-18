"use client"
import { useState } from "react"
import { HiPlus, HiCheck } from "react-icons/hi2"

export default function CardProducto({ producto }) {
    const [agregando, setAgregando] = useState(false)
    const [agregado, setAgregado] = useState(false)
    const api = process.env.NEXT_PUBLIC_API

    const agregarAlCarrito = async () => {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "null")
        if (!usuario?.idCarrito) {
            window.location.href = "/login"
            return
        }

        setAgregando(true)
        try {
            await fetch(`${api}/carritos/${usuario.idCarrito}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    producto: { idProducto: producto.idProducto },
                    cantidad: 1
                })
            })
            window.dispatchEvent(new Event("carritoActualizado"))
            setAgregado(true)
            setTimeout(() => setAgregado(false), 1500)
        } catch (e) {
            console.error(e)
        } finally {
            setAgregando(false)
        }
    }

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 p-3 flex flex-col gap-2 hover:shadow-md transition-shadow duration-200">

            <div className="w-full h-36 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-gray-100">
                {producto.imagen ? (
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-full object-contain mix-blend-multiply"
                        loading="lazy"
                    />
                ) : (
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sin imagen</span>
                )}
            </div>

            {producto.categoria && (
                <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider bg-blue-50 self-start px-2 py-0.5 rounded">
                    {producto.categoria}
                </span>
            )}

            <p className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] leading-tight">
                {producto.nombre}
            </p>

            <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-50">
                <span className="text-blue-950 font-black text-base font-mono">
                    S/ {producto.precio.toFixed(2)}
                </span>
                <button
                    onClick={agregarAlCarrito}
                    disabled={agregando || agregado}
                    title="Agregar al carrito"
                    className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all border shadow-sm active:translate-y-0.5 disabled:cursor-default
                        ${agregado
                            ? "bg-green-400 border-green-500 text-white"
                            : "bg-yellow-400 hover:bg-yellow-500 border-yellow-500 text-blue-950"
                        }`}
                >
                    {agregado ? <HiCheck className="w-4 h-4" /> : <HiPlus className="w-4 h-4" />}
                </button>
            </div>
        </div>
    )
}