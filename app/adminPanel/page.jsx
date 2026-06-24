"use client"
import { useEffect, useState } from "react"
import { FiDownload, FiTrendingUp, FiPackage, FiShoppingBag } from "react-icons/fi"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export default function Dashboard() {
    const [ventas, setVentas] = useState([])
    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)
    const [exportando, setExportando] = useState({ basket: false, historial: false })
    const api = process.env.NEXT_PUBLIC_API

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resV, resP] = await Promise.all([
                    fetch(`${api}/ventas`),
                    fetch(`${api}/productos`)
                ])
                setVentas(await resV.json())
                setProductos(await resP.json())
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const totalIngresos = ventas.reduce((acc, v) => acc + (v.total || 0), 0)

    // Agrupar ventas por día para el gráfico
    const ventasPorDia = Object.entries(
        ventas.reduce((acc, v) => {
            const dia = new Date(v.fecha).toLocaleDateString("es-PE", {
                day: "2-digit", month: "short"
            })
            acc[dia] = (acc[dia] || 0) + 1
            return acc
        }, {})
    )
        .map(([dia, cantidad]) => ({ dia, cantidad }))
        .slice(-10) // últimos 10 días con ventas

    // Tooltip personalizado del gráfico
    const TooltipPersonalizado = ({ active, payload, label }) => {
        if (active && payload?.length) {
            return (
                <div className="bg-blue-950 text-white text-xs px-3 py-2 rounded-xl shadow-lg">
                    <p className="font-bold">{label}</p>
                    <p className="text-yellow-400 font-black">{payload[0].value} venta{payload[0].value !== 1 ? "s" : ""}</p>
                </div>
            )
        }
        return null
    }

    // Exportar CSV directamente desde Spring Boot
    const exportarCSV = async (tipo) => {
        const key = tipo === "market-basket" ? "basket" : "historial"
        setExportando(prev => ({ ...prev, [key]: true }))
        try {
            const res = await fetch(`${api}/ventas/exportar/${tipo}`)
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = tipo === "market-basket" ? "market_basket.csv" : "historial_usuario.csv"
            a.click()
            URL.revokeObjectURL(url)
        } catch (e) {
            console.error("Error exportando CSV:", e)
        } finally {
            setExportando(prev => ({ ...prev, [key]: false }))
        }
    }

    const stats = [
        {
            label: "Ventas totales",
            value: ventas.length,
            icon: <FiShoppingBag size={18} />,
            accent: "bg-blue-950 text-white",
            sub: "órdenes registradas",
        },
        {
            label: "Ingresos",
            value: `S/ ${totalIngresos.toFixed(2)}`,
            icon: <FiTrendingUp size={18} />,
            accent: "bg-yellow-400 text-blue-950",
            sub: "ingresos acumulados",
        },
        {
            label: "Productos",
            value: productos.length,
            icon: <FiPackage size={18} />,
            accent: "bg-blue-950 text-white",
            sub: "en catálogo",
        },
    ]

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-blue-950 rounded-full animate-spin" />
                <p className="text-gray-400 text-sm font-medium">Cargando datos...</p>
            </div>
        </div>
    )

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1">Panel de control</p>
                    <h1 className="text-3xl font-black text-blue-950 leading-tight">Dashboard</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {new Date().toLocaleDateString("es-PE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </div>

                {/* Botones exportar CSV para IA */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={() => exportarCSV("market-basket")}
                        disabled={exportando.basket}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-950 text-white text-xs font-bold hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <FiDownload size={14} className={exportando.basket ? "animate-bounce" : ""} />
                        {exportando.basket ? "Exportando..." : "CSV Market Basket"}
                    </button>
                    <button
                        onClick={() => exportarCSV("historial-usuario")}
                        disabled={exportando.historial}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-400 text-blue-950 text-xs font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <FiDownload size={14} className={exportando.historial ? "animate-bounce" : ""} />
                        {exportando.historial ? "Exportando..." : "CSV Historial Usuarios"}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map(s => (
                    <div key={s.label} className={`${s.accent} rounded-2xl p-5 flex flex-col gap-3`}>
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold opacity-60 uppercase tracking-wide">{s.label}</p>
                            <span className="opacity-50">{s.icon}</span>
                        </div>
                        <p className="text-3xl font-black leading-none">{s.value}</p>
                        <p className="text-xs opacity-50 font-medium">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Gráfico de ventas por día */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="font-black text-blue-950">Ventas por día</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Últimos días con actividad</p>
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                        {ventasPorDia.length} días
                    </span>
                </div>

                {ventasPorDia.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 gap-2">
                        <FiTrendingUp size={28} className="text-gray-200" />
                        <p className="text-gray-400 text-sm">No hay datos suficientes para el gráfico.</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={ventasPorDia} barSize={32}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="dia"
                                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                                width={24}
                            />
                            <Tooltip content={<TooltipPersonalizado />} cursor={{ fill: "#f8fafc" }} />
                            <Bar dataKey="cantidad" fill="#1e3a5f" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Últimas ventas */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-black text-blue-950">Últimas ventas</h2>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                        últimas {Math.min(ventas.length, 5)}
                    </span>
                </div>

                {ventas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 gap-2">
                        <FiShoppingBag size={28} className="text-gray-200" />
                        <p className="text-gray-400 text-sm">No hay ventas registradas aún.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                                    <th className="pb-3 pr-4">#</th>
                                    <th className="pb-3 pr-4">Cliente</th>
                                    <th className="pb-3 pr-4">Total</th>
                                    <th className="pb-3">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {[...ventas].reverse().slice(0, 5).map(v => (
                                    <tr key={v.idVenta} className="text-gray-700 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 pr-4">
                                            <span className="font-black text-blue-950 bg-blue-50 px-2 py-0.5 rounded-lg text-xs">
                                                #{v.idVenta}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-4 font-medium">
                                            {v.usuario?.nombre} {v.usuario?.apellido}
                                        </td>
                                        <td className="py-3 pr-4">
                                            <span className="font-black text-blue-950">
                                                S/ {v.total?.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-400 text-xs font-medium">
                                            {new Date(v.fecha).toLocaleDateString("es-PE", {
                                                day: "2-digit", month: "short", year: "numeric"
                                            })}
                                        </td>
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