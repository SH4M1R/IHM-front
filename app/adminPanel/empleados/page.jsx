"use client"
import { useEffect, useState } from "react"

const empty = { nombre: "", username: "", password: "" }

export default function Empleados() {
    const [empleados, setEmpleados] = useState([])
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState(empty)
    const [editId, setEditId] = useState(null)
    const [loading, setLoading] = useState(true)
    const api = process.env.NEXT_PUBLIC_API

    const fetchEmpleados = async () => {
        const res = await fetch(`${api}/empleados`)
        const data = await res.json()
        setEmpleados(data)
        setLoading(false)
    }

    useEffect(() => { fetchEmpleados() }, [])

    const openCreate = () => { setForm(empty); setEditId(null); setModal(true) }
    const openEdit = (e) => {
        setForm({ nombre: e.nombre, username: e.username, password: "" })
        setEditId(e.idEmpleado)
        setModal(true)
    }

    const handleSave = async () => {
        const url = editId ? `${api}/empleados/${editId}` : `${api}/empleados`
        const method = editId ? "PUT" : "POST"
        await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
        setModal(false)
        fetchEmpleados()
    }

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar empleado?")) return
        await fetch(`${api}/empleados/${id}`, { method: "DELETE" })
        fetchEmpleados()
    }

    if (loading) return <p className="text-gray-500 font-medium">Cargando...</p>

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-blue-950">Empleados</h1>
                    <p className="text-gray-500 text-sm">{empleados.length} empleados registrados</p>
                </div>
                <button onClick={openCreate} className="bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer">
                    + Nuevo
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs font-bold text-gray-400 border-b">
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">Username</th>
                            <th className="px-4 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empleados.map(e => (
                            <tr key={e.idEmpleado} className="border-b last:border-0 text-gray-700">
                                <td className="px-4 py-3 text-gray-400">#{e.idEmpleado}</td>
                                <td className="px-4 py-3 font-bold text-blue-950">{e.nombre}</td>
                                <td className="px-4 py-3">{e.username}</td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button onClick={() => openEdit(e)} className="text-xs font-bold text-blue-900 hover:underline cursor-pointer">Editar</button>
                                    <button onClick={() => handleDelete(e.idEmpleado)} className="text-xs font-bold text-red-500 hover:underline cursor-pointer">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
                        <h2 className="font-black text-blue-950 text-lg mb-4">{editId ? "Editar" : "Nuevo"} Empleado</h2>
                        <div className="flex flex-col gap-3">
                            {[
                                { label: "Nombre", key: "nombre", type: "text" },
                                { label: "Username", key: "username", type: "text" },
                                { label: editId ? "Nueva contraseña (opcional)" : "Contraseña", key: "password", type: "password" },
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="text-xs font-bold text-blue-950">{f.label}</label>
                                    <input
                                        type={f.type}
                                        value={form[f.key]}
                                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                        className="w-full rounded-xl px-3 py-2 mt-1 border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-900"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setModal(false)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold text-sm py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer">Cancelar</button>
                            <button onClick={handleSave} className="flex-1 bg-blue-950 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-blue-900 cursor-pointer">Guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}