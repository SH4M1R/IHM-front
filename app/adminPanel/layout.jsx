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
    HiBars3,
    HiXMark
} from "react-icons/hi2"

const enlaces = [
    { name: "Panel", href: "/adminPanel", icon: <HiSquares2X2 className="w-5 h-5" /> },
    { name: "Productos", href: "/adminPanel/productos", icon: <HiShoppingBag className="w-5 h-5" /> },
    { name: "Usuarios", href: "/adminPanel/usuarios", icon: <HiUsers className="w-5 h-5" /> },
    { name: "Empleados", href: "/adminPanel/empleados", icon: <HiBriefcase className="w-5 h-5" /> },
]

export default function AdminLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [empleado, setEmpleado] = useState(null)
    const [menuAbierto, setMenuAbierto] = useState(false)

    useEffect(() => {
        const rol = localStorage.getItem("rol")
        const data = localStorage.getItem("usuario")
        if (rol !== "empleado" || !data) {
            router.push("/login")
            return
        }
        setEmpleado(JSON.parse(data))
    }, [])

    const handleCerrarSesion = () => {
        localStorage.clear()
        router.push("/login")
    }

    const RenderEnlaces = ({ esMovil = false }) => (
        <>
            {enlaces.map(enlace => {
                const activo = pathname === enlace.href
                return (
                    <Link
                        key={enlace.href}
                        href={enlace.href}
                        onClick={() => esMovil && setMenuAbierto(false)}
                        className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-black uppercase tracking-wider transition-all ${
                            esMovil ? "text-sm" : "text-xs"
                        } ${
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
        </>
    )

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Header móvil */}
            <header className="fixed top-0 left-0 w-full bg-blue-950 text-white border-b-4 border-yellow-400 h-16 flex items-center justify-between px-6 md:hidden z-50 shadow-md">
                <span className="text-xl font-black tracking-wider text-yellow-400 uppercase">
                    Mass<span className="text-white text-xs font-bold ml-1">ADMIN</span>
                </span>
                <button
                    onClick={() => setMenuAbierto(!menuAbierto)}
                    className="text-gray-300 hover:text-white text-2xl p-2 rounded-lg bg-blue-900/40 border border-blue-800 focus:outline-none"
                >
                    {menuAbierto ? <HiXMark /> : <HiBars3 />}
                </button>

                {/* Menú móvil desplegable */}
                {menuAbierto && (
                    <div className="absolute top-16 left-0 w-full bg-blue-950 border-b-4 border-yellow-400 shadow-2xl z-50">
                        <nav className="p-4 space-y-1 bg-blue-900/60 backdrop-blur-md">
                            <RenderEnlaces esMovil={true} />
                            <div className="pt-2 border-t border-blue-800 mt-2">
                                <button
                                    onClick={handleCerrarSesion}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-wider text-red-400 hover:bg-red-950/50 cursor-pointer"
                                >
                                    <HiArrowLeftOnRectangle className="w-5 h-5" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Sidebar desktop */}
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
                                Sesión: <span className="text-white font-bold">{empleado.nombre}</span>
                            </p>
                        )}
                    </div>
                    <nav className="space-y-2">
                        <RenderEnlaces />
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

            {/* Contenido */}
            <div className="flex-1 md:ml-64 flex flex-col">
                <main className="flex-1 p-6 pt-20 md:pt-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}