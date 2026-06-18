"use client"
import { useEffect, useState } from "react"

export default function Dashboard() {
    const [ventas, setVentas] = useState([])
    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)
    const api = process.env.NEXT_PUBLIC_API

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resV, resP] = await Promise.all([
                    fetch(`${api}/ventas`),
                    fetch(`${api}/productos`)
                ])
                const v = await resV.json()
                const p = await resP.json()
                setVentas(v)
                setProductos(p)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const totalIngresos = ventas.reduce((acc, v) => acc + (v.total || 0), 0)
    const sinStock = productos.filter(p => p.stock === 0).length

    const stats = [
        { label: "Ventas totales", value: ventas.length, color: "bg-blue-950", text: "text-white" },
        { label: "Ingresos", value: `S/ ${totalIngresos.toFixed(2)}`, color: "bg-yellow-400", text: "text-blue-950" },
        { label: "Productos", value: productos.length, color: "bg-blue-950", text: "text-white" },
        { label: "Sin stock", value: sinStock, color: "bg-yellow-400", text: "text-blue-950" },
    ]

    if (loading) return <p className="text-gray-500 font-medium">Cargando...</p>

    return (
        <div>
            <h1 className="text-2xl font-black text-blue-950 mb-1">Dashboard</h1>
            <p className="text-gray-500 text-sm mb-6">Resumen general del sistema</p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map(s => (
                    <div key={s.label} className={`${s.color} ${s.text} rounded-2xl p-5`}>
                        <p className="text-xs font-bold opacity-70 mb-1">{s.label}</p>
                        <p className="text-2xl font-black">{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Últimas ventas */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-black text-blue-950 mb-4">Últimas ventas</h2>
                {ventas.length === 0 ? (
                    <p className="text-gray-400 text-sm">No hay ventas registradas.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-bold text-gray-400 border-b">
                                    <th className="pb-2"># Venta</th>
                                    <th className="pb-2">Usuario</th>
                                    <th className="pb-2">Total</th>
                                    <th className="pb-2">Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas.slice(-5).reverse().map(v => (
                                    <tr key={v.idVenta} className="border-b last:border-0 text-gray-700">
                                        <td className="py-2.5 font-bold text-blue-950">#{v.idVenta}</td>
                                        <td className="py-2.5">{v.usuario?.nombre} {v.usuario?.apellido}</td>
                                        <td className="py-2.5 font-bold">S/ {v.total?.toFixed(2)}</td>
                                        <td className="py-2.5 text-gray-400">{new Date(v.fecha).toLocaleDateString("es-PE")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}