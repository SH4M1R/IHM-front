"use client"
import { useEffect, useState } from "react"
import { HiPencil, HiTrash, HiUserCircle } from "react-icons/hi2"

// Modificamos el objeto vacío para incluir el rol por defecto (repartidor)
const empty = { nombre: "", username: "", password: "", rol: "repartidor" }

export default function Empleados() {
    const [empleados, setEmpleados] = useState([])
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(empty)
    const [editId, setEditId] = useState(null)
    const [loading, setLoading] = useState(true)
    const api = process.env.NEXT_PUBLIC_API

    const fetchEmpleados = async () => {
        try {
            const res = await fetch(`${api}/empleados`)
            if (res.ok) {
                const data = await res.json()
                setEmpleados(data)
            }
        } catch (e) {
            console.error("Error al traer empleados:", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchEmpleados() }, [])

    const openCreate = () => { setForm(empty); setEditId(null); setModal(true) }
    
    const openEdit = (e) => {
        setForm({ 
            nombre: e.nombre, 
            username: e.username, 
            password: "", 
            rol: e.rol ?? "repartidor" 
        })
        setEditId(e.idEmpleado)
        setModal(true)
    }

    const handleSave = async () => {
        const url = editId ? `${api}/empleados/${editId}` : `${api}/empleados`
        const method = editId ? "PUT" : "POST"
        
        try {
            const res = await fetch(url, { 
                method, 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(form) 
            })
            if (res.ok) {
                setModal(false)
                fetchEmpleados()
            }
        } catch (e) {
            console.error("Error al guardar:", e)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar empleado?")) return
        try {
            await fetch(`${api}/empleados/${id}`, { method: "DELETE" })
            fetchEmpleados()
        } catch (e) {
            console.error("Error al eliminar:", e)
        }
    }

    if (loading) return (
        <div className="flex items-center gap-2 text-gray-500 font-medium py-10">
            <div className="w-4 h-4 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
            <span>Cargando empleados...</span>
        </div>
    )

    return (
        <div className="p-4 sm:p-0">
            {/* Header adaptado para móvil (cambia a columna si falta espacio) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-blue-950">Empleados</h1>
                    <p className="text-gray-500 text-sm">{empleados.length} empleados registrados</p>
                </div>
                <button onClick={openCreate} className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer text-center">
                    + Nuevo Empleado
                </button>
            </div>

            {/* --- VISTA MÓVIL: Tarjetas (Card List) --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {empleados.map(e => (
                    <div key={e.idEmpleado} className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <HiUserCircle className="w-8 h-8 text-gray-400" />
                                <div>
                                    <h3 className="font-bold text-blue-950 text-base">{e.nombre}</h3>
                                    <p className="text-xs text-gray-400 font-mono">#{e.idEmpleado} • @{e.username}</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                                ${e.rol === "administrador" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"}`}
                            >
                                {e.rol === "administrador" ? "Admin" : "Repartidor"}
                            </span>
                        </div>
                        
                        <div className="border-t border-gray-50 pt-2 flex justify-end gap-2">
                            <button onClick={() => openEdit(e)} className="flex items-center gap-1 px-3 py-1.5 text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                                <HiPencil className="w-3.5 h-3.5"/> Editar
                            </button>
                            <button onClick={() => handleDelete(e.idEmpleado)} className="flex items-center gap-1 px-3 py-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                                <HiTrash className="w-3.5 h-3.5"/> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- VISTA DESKTOP: Tabla Tradicional --- */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs font-bold text-gray-400 border-b bg-gray-50/50">
                            <th className="px-5 py-3.5">ID</th>
                            <th className="px-5 py-3.5">Nombre</th>
                            <th className="px-5 py-3.5">Username</th>
                            <th className="px-5 py-3.5">Rol</th>
                            <th className="px-5 py-3.5 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empleados.map(e => (
                            <tr key={e.idEmpleado} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors text-gray-700">
                                <td className="px-5 py-4 text-gray-400 font-mono text-xs">#{e.idEmpleado}</td>
                                <td className="px-5 py-4 font-bold text-blue-950">{e.nombre}</td>
                                <td className="px-5 py-4 font-medium text-gray-500">{e.username}</td>
                                <td className="px-5 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                                        ${e.rol === "administrador" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"}`}
                                    >
                                        {e.rol === "administrador" ? "Administrador" : "Repartidor"}
                                    </span>
                                </td>
                                <td className="px-5 py-4 flex gap-3 justify-center">
                                    <button onClick={() => openEdit(e)} className="p-1 text-blue-900 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" title="Editar"><HiPencil className="w-4 h-4"/></button>
                                    <button onClick={() => handleDelete(e.idEmpleado)} className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="Eliminar"><HiTrash className="w-4 h-4"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL OPTIMIZADO --- */}
            {modal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-100">
                        <h2 className="font-black text-blue-950 text-lg mb-4">{editId ? "Editar" : "Nuevo"} Empleado</h2>
                        <div className="flex flex-col gap-3.5">
                            {[
                                { label: "Nombre Completo", key: "nombre", type: "text" },
                                { label: "Username (Usuario)", key: "username", type: "text" },
                                { label: editId ? "Nueva contraseña (opcional)" : "Contraseña", key: "password", type: "password" },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-bold text-blue-950">{f.label}</label>
                                    <input
                                        type={f.type}
                                        value={form[f.key]}
                                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                        className="w-full rounded-xl px-3 py-2 mt-1 border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-900 bg-white"
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="text-xs font-bold text-blue-950">Asignar Rol</label>
                                <select
                                    value={form.rol}
                                    onChange={e => setForm({ ...form, rol: e.target.value })}
                                    className="w-full rounded-xl px-3 py-2 mt-1 border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-900 bg-white cursor-pointer font-medium text-gray-700"
                                >
                                    <option value="repartidor">Repartidor (Delivery)</option>
                                    <option value="administrador">Administrador Central</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Botones del modal flexibles para pantallas muy angostas */}
                        <div className="flex flex-row gap-3 mt-6">
                            <button onClick={() => setModal(false)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer text-center">Cancelar</button>
                            <button onClick={handleSave} className="flex-1 bg-blue-950 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-blue-900 cursor-pointer text-center">Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}