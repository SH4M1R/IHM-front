"use client"
import { useEffect, useState } from "react"
import ProductoModal from "./components/ProductoModal"

const empty = { nombre: "", precio: "", categoria: "", imagen: "", activo: true }

function IconPlus() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    )
}

function IconEdit() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    )
}

function IconTrash() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
    )
}

function IconToggleOn() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="5" width="22" height="14" rx="7" />
            <circle cx="16" cy="12" r="4" fill="currentColor" stroke="none" />
        </svg>
    )
}

function IconToggleOff() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="5" width="22" height="14" rx="7" />
            <circle cx="8" cy="12" r="4" fill="currentColor" stroke="none" />
        </svg>
    )
}

function IconPackage() {
    return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
    )
}

export default function Productos() {
    const [productos, setProductos] = useState([])
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(empty)
    const [editId, setEditId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [togglingId, setTogglingId] = useState(null)
    const api = process.env.NEXT_PUBLIC_API

    const fetchProductos = async () => {
        const res = await fetch(`${api}/productos`)
        const data = await res.json()
        setProductos(data)
        setLoading(false)
    }

    useEffect(() => { fetchProductos() }, [])

    const openCreate = () => { setForm(empty); setEditId(null); setModal(true) }
    const openEdit = (p) => {
        setForm({ nombre: p.nombre, precio: p.precio, categoria: p.categoria || "", imagen: p.imagen || "", activo: p.activo })
        setEditId(p.idProducto)
        setModal(true)
    }

    const handleSave = async () => {
        const body = { ...form, precio: parseFloat(form.precio) }
        const url = editId ? `${api}/productos/${editId}` : `${api}/productos`
        const method = editId ? "PUT" : "POST"
        await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        setModal(false)
        fetchProductos()
    }

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return
        await fetch(`${api}/productos/${id}`, { method: "DELETE" })
        fetchProductos()
    }

    const handleToggleActivo = async (p) => {
        setTogglingId(p.idProducto)
        await fetch(`${api}/productos/${p.idProducto}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...p, activo: !p.activo })
        })
        await fetchProductos()
        setTogglingId(null)
    }

    if (loading) return (
        <div className="flex items-center gap-3 text-gray-400 font-medium py-8">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Cargando productos...
        </div>
    )

    const activos = productos.filter(p => p.activo).length

    return (
        <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-blue-950">Productos</h1>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-gray-400 text-sm">{productos.length} en total</p>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <p className="text-green-600 text-sm font-semibold">{activos} activos</p>
                        {productos.length - activos > 0 && (
                            <>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <p className="text-gray-400 text-sm">{productos.length - activos} inactivos</p>
                            </>
                        )}
                    </div>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                    <IconPlus />
                    Nuevo producto
                </button>
            </div>

            {/* Tabla */}
            {productos.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 text-gray-300">
                    <IconPackage />
                    <p className="mt-4 font-bold text-gray-400">Sin productos registrados</p>
                    <p className="text-sm text-gray-300 mt-1">Crea el primero con el botón de arriba</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-bold text-gray-400 border-b border-gray-100">
                                <th className="px-5 py-3.5">Nombre</th>
                                <th className="px-5 py-3.5">Precio</th>
                                <th className="px-5 py-3.5">Categoría</th>
                                <th className="px-5 py-3.5">Estado</th>
                                <th className="px-5 py-3.5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map(p => (
                                <tr key={p.idProducto} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            {p.imagen ? (
                                                <img src={p.imagen} alt={p.nombre} className="w-9 h-9 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-300">
                                                    <IconPackage />
                                                </div>
                                            )}
                                            <span className="font-bold text-blue-950">{p.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-700 font-medium">
                                        S/ {p.precio?.toFixed(2)}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {p.categoria
                                            ? <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">{p.categoria}</span>
                                            : <span className="text-gray-300">—</span>
                                        }
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button
                                            onClick={() => handleToggleActivo(p)}
                                            disabled={togglingId === p.idProducto}
                                            title={p.activo ? "Desactivar producto" : "Activar producto"}
                                            className={`flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 ${p.activo ? "text-green-500 hover:text-green-700" : "text-gray-300 hover:text-gray-500"}`}
                                        >
                                            {p.activo ? <IconToggleOn /> : <IconToggleOff />}
                                            {p.activo ? "Activo" : "Inactivo"}
                                        </button>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => openEdit(p)}
                                                title="Editar producto"
                                                className="p-2 rounded-lg text-gray-400 hover:text-blue-900 hover:bg-blue-50 transition-colors cursor-pointer"
                                            >
                                                <IconEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.idProducto)}
                                                title="Eliminar producto"
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                            >
                                                <IconTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ProductoModal
                open={modal}
                onClose={() => setModal(false)}
                form={form}
                setForm={setForm}
                onSave={handleSave}
                editId={editId}
            />
        </div>
    )
}