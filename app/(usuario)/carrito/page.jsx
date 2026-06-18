"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import {
    FiShoppingCart,
    FiTrash2,
    FiArrowLeft,
    FiPackage,
    FiPlus,
    FiMinus
} from "react-icons/fi"

export default function Carrito() {
    const [carrito, setCarrito] = useState(null)
    const [loading, setLoading] = useState(true)
    const [removiendo, setRemoving] = useState(null)
    const [actualizando, setActualizando] = useState(null) // Estado para bloquear botones mientras edita
    const router = useRouter()
    const api = process.env.NEXT_PUBLIC_API

    const getUsuario = () => JSON.parse(localStorage.getItem("usuario") || "null")

    const fetchCarrito = async () => {
        const usuario = getUsuario()
        if (!usuario?.idCarrito) { setLoading(false); return }
        try {
            const res = await fetch(`${api}/carritos/${usuario.idCarrito}`)
            if (!res.ok) throw new Error()
            const data = await res.json()
            // Filtrar items que tengan producto válido
            const carritoLimpio = {
                ...data,
                items: (data.items || []).filter(i => i?.producto != null)
            }
            setCarrito(carritoLimpio)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const rol = localStorage.getItem("rol")
        if (rol !== "usuario") { router.push("/login"); return }
        fetchCarrito()
    }, [])

    const actualizarCantidad = async (idItem, nuevaCantidad) => {
        if (nuevaCantidad < 1) {
            await remover(idItem)
            return
        }

        const usuario = getUsuario()
        setActualizando(idItem)
        try {
            // Apunta al nuevo método @PutMapping("/{id}/items/{idItem}") de tu backend
            const url = `${api}/carritos/${usuario.idCarrito}/items/${idItem}`

            const res = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cantidad: nuevaCantidad })
            })

            if (!res.ok) throw new Error(`Error en el servidor: ${res.status}`)
            
            window.dispatchEvent(new Event("carritoActualizado"))
            await fetchCarrito()
        } catch (e) {
            console.error("Error al actualizar la cantidad:", e)
        } finally {
            setActualizando(null)
        }
    }

    const remover = async (idItem) => {
        const usuario = getUsuario()
        setRemoving(idItem)
        try {
            await fetch(`${api}/carritos/${usuario.idCarrito}/remover/${idItem}`, { method: "DELETE" })
            window.dispatchEvent(new Event("carritoActualizado"))
            await fetchCarrito()
        } catch (e) {
            console.error(e)
        } finally {
            setRemoving(null)
        }
    }

    const limpiar = async () => {
        if (!confirm("¿Vaciar carrito?")) return
        const usuario = getUsuario()
        try {
            await fetch(`${api}/carritos/${usuario.idCarrito}/limpiar`, { method: "DELETE" })
            window.dispatchEvent(new Event("carritoActualizado"))
            fetchCarrito()
        } catch (e) {
            console.error(e)
        }
    }

    const items = carrito?.items || []
    const total = items.reduce((acc, i) => acc + (i.producto?.precio ?? 0) * i.cantidad, 0)
    const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0)

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <FiShoppingCart className="mx-auto text-gray-300 mb-3" size={40} />
                <p className="text-gray-400 font-medium text-sm">Cargando carrito...</p>
            </div>
        </div>
    )

    if (!items.length) return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="text-center max-w-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiShoppingCart className="text-gray-400" size={34} />
                </div>
                <h2 className="text-xl font-black text-blue-950 mb-2">Tu carrito está vacío</h2>
                <p className="text-gray-400 text-sm mb-6">Agrega productos desde el catálogo para comenzar.</p>
                <Link
                    href="/catalogo"
                    className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-sm px-6 py-3 rounded-xl transition-colors"
                >
                    <FiPackage size={16} />
                    Ir al catálogo
                </Link>
            </div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">

            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl text-blue-800 hover:bg-yellow-100 transition-colors cursor-pointer"
                >
                    <FiArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-blue-950 leading-none">Mi Carrito</h1>
                    <p className="text-sm text-gray-400 font-medium mt-0.5">
                        {totalItems} {totalItems === 1 ? "producto" : "productos"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 flex flex-col gap-3">
                    {items.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">

                            <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                                {item.producto?.imagen ? (
                                    <img
                                        src={item.producto.imagen}
                                        alt={item.producto.nombre}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FiPackage className="text-gray-300" size={24} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-blue-950 text-sm truncate">{item.producto?.nombre}</p>
                                <p className="text-xs text-gray-400 mb-2">{item.producto?.categoria || "General"}</p>
                                
                                <div className="flex items-center gap-4">
                                    <span className="text-yellow-500 font-black text-sm">
                                        S/ {item.producto?.precio?.toFixed(2)}
                                    </span>
                                    
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                                        <button
                                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                                            disabled={actualizando === item.id || removiendo === item.id}
                                            className="p-1.5 px-2.5 text-gray-500 hover:bg-gray-200 hover:text-blue-950 transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                            <FiMinus size={12} />
                                        </button>
                                        <span className="px-3 text-xs font-bold text-blue-950 min-w-[24px] text-center">
                                            {item.cantidad}
                                        </span>
                                        <button
                                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                                            disabled={actualizando === item.id || removiendo === item.id}
                                            className="p-1.5 px-2.5 text-gray-500 hover:bg-gray-200 hover:text-blue-950 transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                            <FiPlus size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                <p className="font-black text-blue-950 text-sm">
                                    S/ {((item.producto?.precio ?? 0) * item.cantidad).toFixed(2)}
                                </p>
                                <button
                                    onClick={() => remover(item.id)}
                                    disabled={removiendo === item.id}
                                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40 cursor-pointer"
                                >
                                    <FiTrash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={limpiar}
                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors mt-1 cursor-pointer self-start"
                    >
                        <FiTrash2 size={13} />
                        Vaciar carrito
                    </button>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
                        <h2 className="font-black text-blue-950 text-base mb-4">Resumen</h2>

                        <div className="flex flex-col gap-2 mb-4">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm text-gray-500">
                                    <span className="truncate max-w-[140px]">{item.producto?.nombre}</span>
                                    <span className="font-medium text-gray-700 ml-2">
                                        S/ {((item.producto?.precio ?? 0) * item.cantidad).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-3 mb-5">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-600 text-sm">Total</span>
                                <span className="font-black text-xl text-blue-950">S/ {total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push("/checkout")}
                            className="w-full bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black py-3 rounded-xl text-sm transition-colors cursor-pointer"
                        >
                            Proceder al pago
                        </button>
                        <button
                            onClick={() => router.push("/catalogo")}
                            className="w-full mt-2 border-2 border-gray-200 text-gray-500 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                            <FiArrowLeft size={14} />
                            Seguir comprando
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}