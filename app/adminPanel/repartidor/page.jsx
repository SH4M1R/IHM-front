"use client"
import { useEffect, useState } from "react"
import { HiTruck, HiCheckCircle, HiArchiveBox, HiCreditCard, HiChevronRight, HiExclamationTriangle } from "react-icons/hi2"

const ESTADOS = ["pagado", "alistando", "en_camino", "entregado"]

const ESTADO_INFO = {
    pagado: { label: "Pagado", color: "bg-blue-100 text-blue-700", icon: <HiCreditCard className="w-3.5 h-3.5" /> },
    alistando: { label: "Alistando", color: "bg-yellow-100 text-yellow-700", icon: <HiArchiveBox className="w-3.5 h-3.5" /> },
    en_camino: { label: "En camino", color: "bg-orange-100 text-orange-700", icon: <HiTruck className="w-3.5 h-3.5" /> },
    entregado: { label: "Entregado", color: "bg-green-100 text-green-700", icon: <HiCheckCircle className="w-3.5 h-3.5" /> },
}

function BadgeEstado({ estado }) {
    const e = ESTADO_INFO[estado] ?? { label: estado, color: "bg-gray-100 text-gray-600", icon: null }
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${e.color}`}>
            {e.icon}{e.label}
        </span>
    )
}

function siguienteEstado(estado) {
    const idx = ESTADOS.indexOf(estado)
    return idx < ESTADOS.length - 1 ? ESTADOS[idx + 1] : null
}

export default function RepartidorPanel() {
    const [ventas, setVentas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [errorSesion, setErrorSesion] = useState(false)
    const [actualizando, setActualizando] = useState(null)
    const [confirmando, setConfirmando] = useState(null)
    const api = process.env.NEXT_PUBLIC_API

    useEffect(() => {
        const cargar = async () => {
            try {
                const empleadoStorage = localStorage.getItem("empleado")
                
                if (!empleadoStorage) {
                    setErrorSesion(true)
                    setCargando(false)
                    return
                }

                const empleado = JSON.parse(empleadoStorage)
                const res = await fetch(`${api}/ventas/empleado/${empleado.idEmpleado}`)
                
                if (res.ok) {
                    setVentas(await res.json())
                }
            } catch (e) {
                console.error("Error cargando entregas:", e)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [api])

    const avanzarEstado = async (venta) => {
        const siguiente = siguienteEstado(venta.estado)
        if (!siguiente) return

        setActualizando(venta.idVenta)
        try {
            const res = await fetch(`${api}/ventas/${venta.idVenta}/estado`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: siguiente })
            })
            if (res.ok) {
                const actualizada = await res.json()
                setVentas(prev => prev.map(v => v.idVenta === venta.idVenta ? actualizada : v))
            }
        } catch (e) {
            console.error(e)
        } finally {
            setActualizando(null)
            setConfirmando(null)
        }
    }

    const ventasActivas = ventas?.filter(v => v.estado !== "entregado") ?? []
    const ventasEntregadas = ventas?.filter(v => v.estado === "entregado") ?? []

    if (cargando) return (
        <div className="flex justify-center items-center h-[70vh] w-full">
            <div className="w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (errorSesion) return (
        <div className="max-w-md mx-auto my-20 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
            <HiExclamationTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-lg font-black text-blue-950 mb-1">Sesión no detectada</h2>
            <p className="text-gray-400 text-sm mb-4">No se encontró información del empleado en el navegador.</p>
        </div>
    )

    if (ventas.length === 0) return (
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
            <HiTruck className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-black text-blue-950 mb-1">Sin pedidos asignados</h2>
            <p className="text-gray-400 text-sm">Cuando el administrador te asigne un pedido desde la sección "Delibery", aparecerá en esta sección de inmediato.</p>
        </div>
    )

    // 4. VISTA PRINCIPAL CON DATOS
    return (
        <div className="max-w-xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-blue-950 mb-1">Mis entregas</h1>
                <p className="text-gray-500 text-sm">Gestiona la ruta y actualización de tus pedidos asignados</p>
            </div>

            {/* Pedidos activos */}
            {ventasActivas.length > 0 && (
                <div className="mb-8">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">En progreso ({ventasActivas.length})</p>
                    <div className="flex flex-col gap-4">
                        {ventasActivas.map(venta => {
                            const siguiente = siguienteEstado(venta.estado)
                            const siguienteInfo = siguiente ? ESTADO_INFO[siguiente] : null
                            const estaConfirmando = confirmando === venta.idVenta
                            const estaActualizando = actualizando === venta.idVenta

                            return (
                                <div key={venta.idVenta} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="px-5 py-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-0.5">Pedido #{venta.idVenta}</p>
                                                <p className="font-black text-blue-950">{venta.usuario?.nombre} {venta.usuario?.apellido ?? ""}</p>
                                                <p className="text-xs text-gray-500 font-medium mt-1 bg-slate-100 p-2 rounded-lg border border-slate-200">
                                                     {venta.usuario?.direccion ?? "Dirección no especificada"}
                                                </p>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-1">
                                                <BadgeEstado estado={venta.estado} />
                                                <p className="text-xs font-black text-blue-950 mt-1">S/ {venta.total?.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        {/* Barra de progreso visual */}
                                        <div className="flex items-center gap-1.5 mb-4 mt-2">
                                            {ESTADOS.map((paso, i) => {
                                                const idxActual = ESTADOS.indexOf(venta.estado)
                                                return (
                                                    <div key={paso} className="flex-1">
                                                        <div className={`h-1.5 rounded-full transition-colors ${i <= idxActual ? "bg-blue-950" : "bg-gray-200"}`} />
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Botonera de Transición de Estados */}
                                        {siguiente && (
                                            <div className="mt-2">
                                                {!estaConfirmando ? (
                                                    <button
                                                        onClick={() => setConfirmando(venta.idVenta)}
                                                        className="w-full flex items-center justify-center gap-2 bg-blue-950 hover:bg-blue-900 text-white font-black py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
                                                    >
                                                        Marcar como "{siguienteInfo?.label}"
                                                        <HiChevronRight className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setConfirmando(null)}
                                                            className="flex-1 border-2 border-gray-200 text-gray-500 font-bold py-2 rounded-xl text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                                                        >
                                                            Cancelar
                                                        </button>
                                                        <button
                                                            onClick={() => avanzarEstado(venta)}
                                                            disabled={estaActualizando}
                                                            className="flex-1 bg-blue-950 hover:bg-blue-900 text-white font-black py-2 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                                                        >
                                                            {estaActualizando ? (
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                `Confirmar`
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Pedidos entregados e Historial */}
            {ventasEntregadas.length > 0 && (
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Entregados recientemente</p>
                    <div className="flex flex-col gap-2">
                        {ventasEntregadas.map(venta => (
                            <div key={venta.idVenta} className="bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm flex justify-between items-center opacity-65">
                                <div>
                                    <p className="text-xs text-gray-400">Pedido #{venta.idVenta}</p>
                                    <p className="font-bold text-blue-950 text-sm">{venta.usuario?.nombre} {venta.usuario?.apellido ?? ""}</p>
                                </div>
                                <BadgeEstado estado={venta.estado} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}