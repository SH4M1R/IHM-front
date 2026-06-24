"use client"
import { useEffect, useState } from "react"
import { HiUser, HiShoppingBag, HiCheckCircle, HiTruck, HiArchiveBox, HiCreditCard } from "react-icons/hi2"

const ESTADOS = {
    pagado: { label: "Pagado", color: "bg-blue-100 text-blue-700", icon: <HiCreditCard className="w-3.5 h-3.5" /> },
    alistando: { label: "Alistando", color: "bg-yellow-100 text-yellow-700", icon: <HiArchiveBox className="w-3.5 h-3.5" /> },
    en_camino: { label: "En camino", color: "bg-orange-100 text-orange-700", icon: <HiTruck className="w-3.5 h-3.5" /> },
    entregado: { label: "Entregado", color: "bg-green-100 text-green-700", icon: <HiCheckCircle className="w-3.5 h-3.5" /> },
}

const PASOS = ["pagado", "alistando", "en_camino", "entregado"]

function BadgeEstado({ estado }) {
    const e = ESTADOS[estado] ?? { label: estado, color: "bg-gray-100 text-gray-600", icon: null }
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${e.color}`}>
            {e.icon}{e.label}
        </span>
    )
}

function BarraProgreso({ estado }) {
    const idx = PASOS.indexOf(estado)
    return (
        <div className="flex items-center gap-1 mt-3">
            {PASOS.map((paso, i) => (
                <div key={paso} className="flex items-center gap-1 flex-1">
                    <div className={`h-1.5 w-full rounded-full transition-colors ${i <= idx ? "bg-blue-950" : "bg-gray-200"}`} />
                    {i < PASOS.length - 1 && null}
                </div>
            ))}
        </div>
    )
}

function SeccionPedidos({ api, idUsuario }) {
    const [ventas, setVentas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [abierto, setAbierto] = useState(null)

    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await fetch(`${api}/ventas/usuario/${idUsuario}`)
                if (res.ok) {
                    const data = await res.json()
                    setVentas(data)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [api, idUsuario])

    if (cargando) return (
        <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (ventas.length === 0) return (
        <div className="text-center py-16">
            <HiShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">Aún no tienes pedidos</p>
        </div>
    )

    return (
        <div className="flex flex-col gap-3">
            {ventas.map(venta => (
                <div key={venta.idVenta} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <button
                        onClick={() => setAbierto(abierto === venta.idVenta ? null : venta.idVenta)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between cursor-pointer"
                    >
                        <div>
                            <p className="text-xs text-gray-400 mb-1">
                                Pedido #{venta.idVenta} · {new Date(venta.fecha).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                            <p className="font-black text-blue-950 text-base">S/ {venta.total?.toFixed(2)}</p>
                            <BarraProgreso estado={venta.estado} />
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                            <BadgeEstado estado={venta.estado} />
                            <span className="text-gray-400 text-xs">{abierto === venta.idVenta ? "▲" : "▼"}</span>
                        </div>
                    </button>

                    {abierto === venta.idVenta && venta.detalles?.length > 0 && (
                        <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-2">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Productos</p>
                            {venta.detalles.map((d, i) => (
                                <div key={i} className="flex justify-between items-center text-sm">
                                    <span className="text-blue-950 font-medium">{d.producto?.nombre ?? `Producto #${d.idProducto}`}</span>
                                    <span className="text-gray-500">x{d.cantidad} · <span className="font-bold text-blue-950">S/ {(d.precioUnitario * d.cantidad).toFixed(2)}</span></span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

function SeccionPerfil({ api }) {
    const [form, setForm] = useState({ nombre: "", apellido: "", dni: "", correo: "", password: "" })
    const [guardado, setGuardado] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario"))
        setForm({ nombre: usuario.nombre, apellido: usuario.apellido, dni: usuario.dni, correo: usuario.correo, password: "" })
    }, [])

    const handleSave = async () => {
        setError("")
        const usuario = JSON.parse(localStorage.getItem("usuario"))
        const body = { ...form, dni: parseInt(form.dni) }
        if (!form.password) delete body.password

        const res = await fetch(`${api}/usuarios/${usuario.idUsuario}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })

        if (res.ok) {
            const updated = await res.json()
            localStorage.setItem("usuario", JSON.stringify(updated))
            setGuardado(true)
            setTimeout(() => setGuardado(false), 2500)
        } else {
            setError("Error al guardar los cambios.")
        }
    }

    const campos = [
        { label: "Nombre", key: "nombre", type: "text" },
        { label: "Apellido", key: "apellido", type: "text" },
        { label: "DNI", key: "dni", type: "text" },
        { label: "Correo", key: "correo", type: "email" },
        { label: "Nueva contraseña (opcional)", key: "password", type: "password" },
    ]

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            {campos.map(f => (
                <div key={f.key}>
                    <label className="text-xs font-bold text-blue-950">{f.label}</label>
                    <input
                        type={f.type}
                        value={form[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-blue-900"
                    />
                </div>
            ))}
            {guardado && <p className="text-green-600 text-xs font-bold text-center">✓ Cambios guardados</p>}
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <button onClick={handleSave}
                className="bg-blue-950 hover:bg-blue-900 text-white font-black py-3 rounded-xl text-sm transition-colors cursor-pointer mt-1">
                Guardar cambios
            </button>
        </div>
    )
}

export default function Perfil() {
    const [tab, setTab] = useState("perfil")
    const [idUsuario, setIdUsuario] = useState(null)
    const api = process.env.NEXT_PUBLIC_API

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario"))
        
        // CORREGIDO: Busca cualquier variante válida del ID que use tu sesión local
        const idDetectado = usuario?.idUsuario || usuario?.id || usuario?.idEmpleado
        setIdUsuario(idDetectado)
    }, [])

    const tabs = [
        { key: "perfil", label: "Mi perfil", icon: <HiUser className="w-4 h-4" /> },
        { key: "pedidos", label: "Mis pedidos", icon: <HiShoppingBag className="w-4 h-4" /> },
    ]

    return (
        <div className="max-w-lg mx-auto px-4 py-10">
            <h1 className="text-2xl font-black text-blue-950 mb-1">Mi cuenta</h1>
            <p className="text-gray-500 text-sm mb-6">Gestiona tu perfil y revisa tus pedidos</p>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-6">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer
                            ${tab === t.key ? "bg-white text-blue-950 shadow-sm" : "text-gray-500 hover:text-blue-950"}`}
                    >
                        {t.icon}{t.label}
                    </button>
                ))}
            </div>

            {tab === "perfil" && <SeccionPerfil api={api} />}
            
            {/* Si no carga, te mostrará un aviso en lugar de quedarse oculto */}
            {tab === "pedidos" && (
                idUsuario ? (
                    <SeccionPedidos api={api} idUsuario={idUsuario} />
                ) : (
                    <p className="text-center py-10 text-xs text-gray-400">No se pudo validar el identificador de tu cuenta.</p>
                )
            )}
        </div>
    )
}