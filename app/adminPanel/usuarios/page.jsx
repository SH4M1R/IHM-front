"use client"
import { useEffect, useState } from "react"
import { HiUser } from "react-icons/hi2"

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

    if (loading) return (
        <div className="flex items-center gap-2 text-gray-500 font-medium py-10 px-4 sm:px-0">
            <div className="w-4 h-4 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
            <span>Cargando usuarios...</span>
        </div>
    )

    return (
        <div className="p-4 sm:p-0">
            {/* Header adaptado */}
            <div className="mb-6">
                <h1 className="text-2xl font-black text-blue-950">Usuarios</h1>
                <p className="text-gray-500 text-sm">{usuarios.length} usuarios registrados</p>
            </div>

            {/* --- VISTA MÓVIL: Tarjetas (Card List) --- */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {usuarios.map(u => (
                    <div key={u.idUsuario} className="bg-white p-4 rounded-2xl shadow-xs border border-gray-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-950 rounded-xl flex items-center justify-center shrink-0">
                                <HiUser className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-blue-950 text-base">{u.nombre} {u.apellido}</h3>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">{u.correo}</p>
                                <p className="text-[11px] text-gray-400 font-mono mt-1">ID: #{u.idUsuario}</p>
                            </div>
                        </div>
                        {/* DNI flotando a la derecha como un tag discreto */}
                        <div className="text-right shrink-0">
                            <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                                DNI: {u.dni}
                            </span>
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
                            <th className="px-5 py-3.5">DNI</th>
                            <th className="px-5 py-3.5">Correo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.idUsuario} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors text-gray-700">
                                <td className="px-5 py-4 text-gray-400 font-mono text-xs">#{u.idUsuario}</td>
                                <td className="px-5 py-4 font-bold text-blue-950">{u.nombre} {u.apellido}</td>
                                <td className="px-5 py-4 font-medium text-gray-600">{u.dni}</td>
                                <td className="px-5 py-4 text-gray-400">{u.correo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}