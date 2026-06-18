"use client"
import { useEffect, useState } from "react"

export default function Usuarios() {
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const api = process.env.NEXT_PUBLIC_API

    useEffect(() => {
        fetch(`${api}/usuarios`)
            .then(r => r.json())
            .then(d => { setUsuarios(d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-gray-500 font-medium">Cargando...</p>

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-black text-blue-950">Usuarios</h1>
                <p className="text-gray-500 text-sm">{usuarios.length} usuarios registrados</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs font-bold text-gray-400 border-b">
                            <th className="px-4 py-3">ID</th>
                            <th className="px-4 py-3">Nombre</th>
                            <th className="px-4 py-3">DNI</th>
                            <th className="px-4 py-3">Correo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.idUsuario} className="border-b last:border-0 text-gray-700">
                                <td className="px-4 py-3 text-gray-400">#{u.idUsuario}</td>
                                <td className="px-4 py-3 font-bold text-blue-950">{u.nombre} {u.apellido}</td>
                                <td className="px-4 py-3">{u.dni}</td>
                                <td className="px-4 py-3 text-gray-400">{u.correo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}