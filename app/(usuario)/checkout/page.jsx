"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Checkout() {
    const [carrito, setCarrito] = useState(null)
    const [loading, setLoading] = useState(true)
    const [procesando, setProcesando] = useState(false)
    const [exito, setExito] = useState(false)
    const router = useRouter()
    const api = process.env.NEXT_PUBLIC_API

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario"))
        fetch(`${api}/carritos/${usuario.idCarrito}`)
            .then(r => r.json())
            .then(d => { setCarrito(d); setLoading(false) })
    }, [])

    const confirmarPago = async () => {
        setProcesando(true)
        const usuario = JSON.parse(localStorage.getItem("usuario"))
        const total = carrito.items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0)

        const detalles = carrito.items.map(i => ({
            producto: { idProducto: i.producto.idProducto },
            cantidad: i.cantidad,
            subtotal: i.producto.precio * i.cantidad
        }))

        await fetch(`${api}/ventas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: { idUsuario: usuario.idUsuario },
                total,
                fecha: new Date().toISOString(),
                detalles
            })
        })

        await fetch(`${api}/carritos/${usuario.idCarrito}/limpiar`, { method: "DELETE" })
        setProcesando(false)
        setExito(true)
    }

    const total = carrito?.items?.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0) || 0

    if (loading) return <div className="text-center py-20 text-gray-400 font-medium">Cargando...</div>

    if (exito) return (
        <div className="text-center py-24 px-4">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-black text-blue-950 mb-2">¡Pago exitoso!</h2>
            <p className="text-gray-500 mb-6">Tu pedido ha sido registrado correctamente.</p>
            <button onClick={() => router.push("/")} className="bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black px-8 py-3 rounded-xl text-sm cursor-pointer">
                Volver al inicio
            </button>
        </div>
    )

    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <h1 className="text-2xl font-black text-blue-950 mb-6">Confirmar pedido</h1>

            <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
                <h2 className="font-bold text-blue-950 mb-3 text-sm">Resumen</h2>
                {carrito?.items?.map(i => (
                    <div key={i.id} className="flex justify-between text-sm py-1.5 border-b last:border-0 text-gray-600">
                        <span>{i.producto.nombre} <span className="text-gray-400">x{i.cantidad}</span></span>
                        <span className="font-bold">S/ {(i.producto.precio * i.cantidad).toFixed(2)}</span>
                    </div>
                ))}
                <div className="flex justify-between font-black text-blue-950 mt-3 text-base">
                    <span>Total</span>
                    <span>S/ {total.toFixed(2)}</span>
                </div>
            </div>

            {/* Pago ficticio */}
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
                <h2 className="font-bold text-blue-950 mb-3 text-sm">Datos de pago</h2>
                <div className="flex flex-col gap-3">
                    {[
                        { label: "Número de tarjeta", placeholder: "4242 4242 4242 4242" },
                        { label: "Nombre en la tarjeta", placeholder: "JOHN DOE" },
                    ].map(f => (
                        <div key={f.label}>
                            <label className="text-xs font-bold text-blue-950">{f.label}</label>
                            <input type="text" placeholder={f.placeholder}
                                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-900" />
                        </div>
                    ))}
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-blue-950">Vencimiento</label>
                            <input type="text" placeholder="MM/AA"
                                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-900" />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-blue-950">CVV</label>
                            <input type="text" placeholder="123"
                                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 mt-1 text-sm focus:outline-none focus:border-blue-900" />
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={confirmarPago} disabled={procesando}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-blue-950 font-black py-3.5 rounded-xl text-sm transition-colors cursor-pointer">
                {procesando ? "Procesando..." : `Pagar S/ ${total.toFixed(2)}`}
            </button>
        </div>
    )
}