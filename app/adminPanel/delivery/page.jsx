"use client"
import { useEffect, useState } from "react"
import { HiTruck, HiCheckCircle, HiArchiveBox, HiCreditCard, HiUser, HiChevronDown } from "react-icons/hi2"

const ESTADOS = {
    pagado: { label: "Pagado", color: "bg-blue-100 text-blue-700", icon: <HiCreditCard className="w-3.5 h-3.5" /> },
    alistando: { label: "Alistando", color: "bg-yellow-100 text-yellow-700", icon: <HiArchiveBox className="w-3.5 h-3.5" /> },
    en_camino: { label: "En camino", color: "bg-orange-100 text-orange-700", icon: <HiTruck className="w-3.5 h-3.5" /> },
    entregado: { label: "Entregado", color: "bg-green-100 text-green-700", icon: <HiCheckCircle className="w-3.5 h-3.5" /> },
}

function BadgeEstado({ estado }) {
    const e = ESTADOS[estado] ?? { label: estado, color: "bg-gray-100 text-gray-600", icon: null }
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${e.color}`}>
            {e.icon}{e.label}
        </span>
    )
}

export default function DeliveryPanel() {
    const [ventas, setVentas] = useState([])
    const [empleados, setEmpleados] = useState([])
    const [cargando, setCargando] = useState(true)
    const [abierto, setAbierto] = useState(null)
    const [filtroEstado, setFiltroEstado] = useState("todos")
    const [guardando, setGuardando] = useState(null)
    const api = process.env.NEXT_PUBLIC_API

    useEffect(() => {
        const cargar = async () => {
            try {
                const [rVentas, rEmpleados] = await Promise.all([
                    fetch(`${api}/ventas`),
                    fetch(`${api}/empleados?rol=delivery`)
                ])
                if (rVentas.ok) setVentas(await rVentas.json())
                if (rEmpleados.ok) setEmpleados(await rEmpleados.json())
            } catch (e) {
                console.error(e)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [api])

    const asignarEmpleado = async (idVenta, idEmpleado) => {
        setGuardando(idVenta)
        try {
            const res = await fetch(`${api}/ventas/${idVenta}/asignar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idEmpleado: idEmpleado ? parseInt(idEmpleado) : null })
            })
            if (res.ok) {
                const actualizada = await res.json()
                // Reemplaza la venta vieja por la versión actualizada del servidor
                setVentas(prev => prev.map(v => v.idVenta === idVenta ? actualizada : v))
            }
        } catch (e) {
            console.error("Error asignando empleado:", e)
        } finally {
            setGuardando(null)
        }
    }

    const ventasFiltradas = filtroEstado === "todos"
        ? ventas
        : ventas.filter(v => v.estado === filtroEstado)

    const conteo = Object.fromEntries(
        Object.keys(ESTADOS).map(e => [e, ventas.filter(v => v.estado === e).length])
    )

    if (cargando) return (
        <div className="flex justify-center py-24">
            <div className="w-6 h-6 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-blue-950 mb-1">Panel de Delivery</h1>
                <p className="text-gray-500 text-sm">Asigna repartidores y gestiona el estado de los pedidos</p>
            </div>

            {/* Resumen de estados */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {Object.entries(ESTADOS).map(([key, val]) => (
                    <div key={key} className={`rounded-2xl p-4 border bg-white shadow-sm transition-all`}>
                        <p className="text-xs text-gray-400 font-medium mb-1">{val.label}</p>
                        <p className="text-2xl font-black text-blue-950">{conteo[key] ?? 0}</p>
                    </div>
                ))}
            </div>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap mb-5">
                {[{ key: "todos", label: "Todos" }, ...Object.entries(ESTADOS).map(([k, v]) => ({ key: k, label: v.label }))].map(f => (
                    <button
                        key={f.key}
                        onClick={() => setFiltroEstado(f.key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer
                            ${filtroEstado === f.key ? "bg-blue-950 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Lista de ventas */}
            <div className="flex flex-col gap-3">
                {ventasFiltradas.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                        <HiTruck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">No hay pedidos en este estado</p>
                    </div>
                )}

                {ventasFiltradas.map(venta => (
                    <div key={venta.idVenta} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                        <button
                            onClick={() => setAbierto(abierto === venta.idVenta ? null : venta.idVenta)}
                            className="w-full text-left px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">
                                    Pedido #{venta.idVenta} · {venta.fecha ? new Date(venta.fecha).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }) : "Sin fecha"}
                                </p>
                                <p className="font-black text-blue-950">
                                    {venta.usuario ? `${venta.usuario.nombre} ${venta.usuario.apellido ?? ""}` : "Usuario no registrado"}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">{venta.usuario?.correo}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 ml-4">
                                <BadgeEstado estado={venta.estado} />
                                <p className="text-blue-950 font-black text-sm">S/ {venta.total?.toFixed(2)}</p>
                                <HiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${abierto === venta.idVenta ? "rotate-180" : ""}`} />
                            </div>
                        </button>

                        {abierto === venta.idVenta && (
                            <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-4 bg-slate-50">

                                {/* Productos del pedido */}
                                {venta.detalles?.length > 0 && (
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Productos</p>
                                        <div className="flex flex-col gap-1.5">
                                            {venta.detalles.map((d, i) => {
                                                const precioUnitario = d.precioUnitario ?? d.producto?.precio ?? 0;
                                                return (
                                                    <div key={i} className="flex justify-between text-sm">
                                                        <span className="text-blue-950 font-medium">{d.producto?.nombre ?? `Producto #${d.idProducto}`}</span>
                                                        <span className="text-gray-500">x{d.cantidad} · <span className="font-bold text-blue-950">S/ {(precioUnitario * d.cantidad).toFixed(2)}</span></span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Selector para asignar el Empleado de Delivery */}
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Repartidor asignado</p>
                                    <div className="flex items-center gap-2">
                                        <HiUser className="w-4 h-4 text-gray-400" />
                                        <select
                                            value={venta.empleado?.idEmpleado ?? ""}
                                            onChange={e => asignarEmpleado(venta.idVenta, e.target.value)}
                                            className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-900 cursor-pointer"
                                            disabled={guardando === venta.idVenta}
                                        >
                                            <option value="">Sin asignar</option>
                                            {empleados.map(emp => (
                                                <option key={emp.idEmpleado} value={emp.idEmpleado}>
                                                    {emp.nombre} {emp.apellido ?? ""}
                                                </option>
                                            ))}
                                        </select>
                                        {guardando === venta.idVenta && (
                                            <div className="w-4 h-4 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
                                        )}
                                    </div>
                                    {venta.empleado && (
                                        <p className="text-xs text-gray-400 mt-1 ml-6">
                                            Asignado actual: <span className="font-bold text-blue-950">{venta.empleado.nombre} {venta.empleado.apellido ?? ""}</span>
                                        </p>
                                    )}
                                </div>

                                <p className="text-xs text-gray-400 italic">
                                    * Solo el repartidor asignado puede actualizar el estado del pedido desde su panel.
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}