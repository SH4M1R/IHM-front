"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NavbarAdmin from "../components/SidebarAdmin"

export default function AdminPanel() {
    const router = useRouter()
    const [adminName, setAdminName] = useState("Administrador")
    
    const [counts, setCounts] = useState({
        usuarios: 3, 
        empleados: 1, 
        productos: 0  
    })

    useEffect(() => {
        const rol = localStorage.getItem("rol")
        const usuarioData = localStorage.getItem("usuario")
        
        if (rol !== "empleado") {
            router.push("/login")
        } else if (usuarioData) {
            const parsed = JSON.parse(usuarioData)
            setAdminName(parsed.nombre || "Administrador")
        }
    }, [router])

    const handleLogout = () => {
        localStorage.clear()
        router.push("/login")
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            
            {/* BARRA LATERAL (SIDEBAR) */}
            <aside className="w-full md:w-64 bg-blue-950 text-white p-6 flex flex-col justify-between">
                <NavbarAdmin />
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 p-6 md:p-10">
                {/* HEADER */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-blue-950">Bienvenido de vuelta</h1>
                        <p className="text-gray-500 font-medium text-sm">Gestiona el inventario y accesos de Tiendas Mass.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-700">{adminName} (Admin)</span>
                    </div>
                </header>

                {/* CONTENEDOR DE CARDS DE MÉTRICAS */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    
                    {/* Card: Productos */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-36 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Productos en Tienda</span>
                            <span className="p-2 bg-yellow-100 text-yellow-700 rounded-xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                            </span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-blue-950">{counts.productos}</h3>
                            <p className="text-xs text-gray-500 font-medium mt-1">Items registrados en catálogo</p>
                        </div>
                    </div>

                    {/* Card: Usuarios */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-36 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Clientes Registrados</span>
                            <span className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0-6a3.99 3.99 0 00-2.943 1.116M21 21v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                            </span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-blue-950">{counts.usuarios}</h3>
                            <p className="text-xs text-gray-500 font-medium mt-1">Usuarios con acceso a compras</p>
                        </div>
                    </div>

                    {/* Card: Empleados */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-36 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Staff / Empleados</span>
                            <span className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            </span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-blue-950">{counts.empleados}</h3>
                            <p className="text-xs text-gray-500 font-medium mt-1">Colaboradores con acceso al panel</p>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    )
}