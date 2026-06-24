"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
    HiSquares2X2,
    HiShoppingBag,
    HiUsers,
    HiBriefcase,
    HiArrowLeftOnRectangle,
    HiTruck,
    HiIdentification
} from "react-icons/hi2"

const enlacesTotales = [
    { name: "Panel", href: "/adminPanel", icon: <HiSquares2X2 className="w-5 h-5" /> },
    { name: "Productos", href: "/adminPanel/productos", icon: <HiShoppingBag className="w-5 h-5" /> },
    { name: "Usuarios", href: "/adminPanel/usuarios", icon: <HiUsers className="w-5 h-5" /> },
    { name: "Empleados", href: "/adminPanel/empleados", icon: <HiBriefcase className="w-5 h-5" /> },
    { name: "Delibery", href: "/adminPanel/delivery", icon: <HiTruck className="w-5 h-5" /> },
    { name: "Repartidor", href: "/adminPanel/repartidor", icon: <HiIdentification className="w-5 h-5" /> },
]

export default function AdminLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [empleado, setEmpleado] = useState(null)
    const [rolUsuario, setRolUsuario] = useState("")
    const [enlacesFiltrados, setEnlacesFiltrados] = useState([])

    useEffect(() => {
        const rol = localStorage.getItem("rol")
        const data = localStorage.getItem("usuario")
        const rolesPermitidos = ["empleado", "administrador", "repartidor"]

        if (!data || !rolesPermitidos.includes(rol)) {
            router.push("/login")
            return
        }
        
        setEmpleado(JSON.parse(data))
        setRolUsuario(rol)

        if (rol === "repartidor") {
            const permitidosRepartidor = ["Panel", "Delibery", "Repartidor"]
            setEnlacesFiltrados(enlacesTotales.filter(e => permitidosRepartidor.includes(e.name)))
        } else {
            setEnlacesFiltrados(enlacesTotales)
        }
    }, [router])

    const handleCerrarSesion = () => {
        localStorage.clear()
        router.push("/login")
    }

    // Filtramos los enlaces para el navbar inferior móvil (todos menos el "Panel" que va arriba)
    const enlacesInferioresMovil = enlacesFiltrados.filter(e => e.name !== "Panel")

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* --- NAVBAR MÓVIL SUPERIOR --- */}
            <header className="fixed top-0 left-0 w-full bg-blue-950 text-white h-14 flex items-center justify-between px-4 md:hidden z-50 shadow-md">
                <Link 
                    href="/adminPanel" 
                    className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider py-1.5 px-3 rounded-lg border transition-all ${
                        pathname === "/adminPanel" 
                            ? "bg-yellow-400 text-blue-950 border-yellow-400" 
                            : "text-yellow-400 border-yellow-400/30"
                    }`}
                >
                    <HiSquares2X2 className="w-4 h-4" />
                    <span>Panel</span>
                </Link>

                <span className="text-sm font-black tracking-widest text-white uppercase">
                    Mass
                </span>

                <button
                    onClick={handleCerrarSesion}
                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-tight text-red-400 bg-red-950/40 px-2.5 py-1.5 rounded-lg border border-red-900/50 cursor-pointer"
                >
                    <HiArrowLeftOnRectangle className="w-4 h-4" />
                    <span>Salir</span>
                </button>
            </header>

            {/* --- NAVBAR MÓVIL INFERIOR --- */}
            <nav className="fixed bottom-0 left-0 w-full bg-white text-blue-950 border-t-2 border-yellow-400 h-16 flex items-center justify-around px-1 md:hidden z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.15)]">
                {enlacesInferioresMovil.map(enlace => {
                    const activo = pathname === enlace.href
                    return (
                        <Link
                            key={enlace.href}
                            href={enlace.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full py-1 px-0.5 transition-all text-[10px] font-bold uppercase tracking-tight ${
                                activo
                                    ? "text-yellow-400 font-black"
                                    : "text-gray-400 hover:text-blue-950"
                            }`}
                        >
                            <span className={`${activo ? "scale-110 text-yellow-400" : ""}`}>
                                {enlace.icon}
                            </span>
                            <span className="mt-0.5 truncate max-w-[65px]">{enlace.name}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* SIDEBAR DESKTOP (Permanece intacto) */}
            <aside className="hidden md:flex flex-col justify-between w-64 bg-blue-950 text-white h-screen border-r-4 border-yellow-400 p-6 fixed left-0 top-0 z-40 shadow-xl">
                <div>
                    <div className="mb-10 px-2">
                        <span className="text-2xl font-black tracking-wider text-yellow-400 uppercase block">
                            Mass
                            <span className="text-white text-sm font-bold block mt-0.5 tracking-normal">
                                PANEL CONTROL
                            </span>
                        </span>
                        {empleado && (
                            <p className="text-xs text-blue-400 mt-3 font-medium">
                                Sesión: <span className="text-white font-bold">{empleado.nombre}</span> ({rolUsuario})
                            </p>
                        )}
                    </div>
                    <nav className="space-y-2">
                        {enlacesFiltrados.map(enlace => {
                            const activo = pathname === enlace.href
                            return (
                                <Link
                                    key={enlace.href}
                                    href={enlace.href}
                                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-black uppercase tracking-wider transition-all text-xs ${
                                        activo
                                            ? "bg-yellow-400 text-blue-950 shadow-md scale-[1.02]"
                                            : "text-gray-300 hover:bg-blue-900 hover:text-white"
                                    }`}
                                >
                                    {enlace.icon}
                                    {enlace.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <button
                    onClick={handleCerrarSesion}
                    className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white text-xs font-black uppercase tracking-wider py-3 rounded-xl shadow-sm cursor-pointer transition-colors"
                >
                    <HiArrowLeftOnRectangle className="w-4 h-4" />
                    Cerrar Sesión
                </button>
            </aside>

            {/* CONTENIDO PRINCIPAL CON COMPENSACIÓN DE ALTURAS EN MÓVIL */}
            <div className="flex-1 md:ml-64 flex flex-col">
                <main className="flex-1 p-4 pt-20 pb-24 md:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}