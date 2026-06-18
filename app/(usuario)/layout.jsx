"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { FaShoppingCart, FaUser, FaChevronDown, FaMapMarkerAlt } from "react-icons/fa"
import FloatingButtons from "./FloatingButtons"
import { FiMenu, FiX } from "react-icons/fi"

export default function UsuarioLayout({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [usuario, setUsuario] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [cantidadCarrito, setCantidadCarrito] = useState(0)
    const dropdownRef = useRef(null)
    const api = process.env.NEXT_PUBLIC_API

    const fetchCantidadCarrito = async (u) => {
        if (!u?.idCarrito) return
        try {
            const res = await fetch(`${api}/carritos/${u.idCarrito}`)
            if (!res.ok) return
            const data = await res.json()
            const total = data.items?.reduce((acc, i) => acc + i.cantidad, 0) || 0
            setCantidadCarrito(total)
        } catch { }
    }

    useEffect(() => {
        const data = localStorage.getItem("usuario")
        const rol = localStorage.getItem("rol")
        if (data && rol === "usuario") {
            const u = JSON.parse(data)
            setUsuario(u)
            fetchCantidadCarrito(u)
        }
    }, [])

    useEffect(() => {
        const data = localStorage.getItem("usuario")
        const rol = localStorage.getItem("rol")
        if (data && rol === "usuario") {
            fetchCantidadCarrito(JSON.parse(data))
        }
    }, [pathname])

    useEffect(() => {
        const onCarritoActualizado = () => {
            const data = localStorage.getItem("usuario")
            if (data) fetchCantidadCarrito(JSON.parse(data))
        }
        window.addEventListener("carritoActualizado", onCarritoActualizado)
        return () => window.removeEventListener("carritoActualizado", onCarritoActualizado)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = () => {
        localStorage.clear()
        setUsuario(null)
        setCantidadCarrito(0)
        router.push("/mass")
    }

    const links = [
        { href: "/", label: "Inicio" },
        { href: "/catalogo", label: "Catálogo" },
    ]

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="w-full fixed top-0 left-0 z-50 bg-yellow-400 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">

                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/mass">
                                <Image
                                    src="/mass_logo.webp"
                                    alt="Tienda Mass"
                                    width={90}
                                    height={45}
                                    className="object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Links desktop */}
                        <div className="hidden lg:flex items-center space-x-6">
                            {links.map(l => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={`text-sm font-semibold transition-colors ${pathname === l.href
                                        ? "text-blue-950"
                                        : "text-blue-800 hover:text-blue-950"
                                        }`}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-1">

                            {/* Sucursal — navega a /sucursal */}
                            <Link
                                href="/sucursal"
                                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-blue-800 hover:bg-yellow-500 transition-colors font-semibold text-sm"
                            >
                                <FaMapMarkerAlt size={15} />
                                <span>Sucursal</span>
                            </Link>

                            {/* Carrito con badge */}
                            <Link
                                href={usuario ? "/carrito" : "/login"}
                                className="p-2 rounded-full text-blue-800 hover:bg-yellow-500 transition-colors relative"
                            >
                                <FaShoppingCart size={20} />
                                {usuario && cantidadCarrito > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                                        {cantidadCarrito > 99 ? "99+" : cantidadCarrito}
                                    </span>
                                )}
                            </Link>

                            {/* Usuario */}
                            {usuario ? (
                                <div className="relative hidden lg:block" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-blue-800 hover:bg-yellow-500 transition-colors font-semibold text-sm cursor-pointer"
                                    >
                                        <FaUser size={16} />
                                        <span>{usuario.nombre}</span>
                                        <FaChevronDown
                                            size={11}
                                            className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                                            <Link
                                                href="/perfil"
                                                onClick={() => setDropdownOpen(false)}
                                                className="flex items-center px-4 py-3 text-sm font-semibold text-blue-950 hover:bg-yellow-50 transition-colors"
                                            >
                                                Editar perfil
                                            </Link>
                                            <div className="border-t border-gray-100" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                            >
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="hidden lg:flex p-2 rounded-full text-blue-800 hover:bg-yellow-500 transition-colors"
                                >
                                    <FaUser size={19} />
                                </Link>
                            )}

                            {/* Hamburger móvil */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="lg:hidden p-2 rounded-full text-blue-800 hover:bg-yellow-500 transition-colors focus:outline-none"
                            >
                                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Menú móvil */}
                <div className={`lg:hidden transition-all duration-300 ease-in-out bg-yellow-400 border-t border-yellow-500 ${isOpen ? "max-h-screen opacity-100 py-3" : "max-h-0 opacity-0 overflow-hidden"}`}>
                    <div className="px-4 pt-2 pb-4 space-y-1 flex flex-col">
                        {usuario && (
                            <div className="px-3 py-2 text-sm font-bold text-blue-950 border-b border-yellow-500 mb-1">
                                Hola, {usuario.nombre}
                            </div>
                        )}
                        {links.map(l => (
                            <Link
                                key={l.href}
                                href={l.href}
                                onClick={() => setIsOpen(false)}
                                className="text-base font-medium text-blue-800 hover:bg-yellow-500 px-3 py-2 rounded-md transition-colors"
                            >
                                {l.label}
                            </Link>
                        ))}

                        {/* Sucursal en móvil */}
                        <Link
                            href="/sucursal"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 text-base font-medium text-blue-800 hover:bg-yellow-500 px-3 py-2 rounded-md transition-colors"
                        >
                            <FaMapMarkerAlt size={14} />
                            Sucursal
                        </Link>

                        {usuario ? (
                            <>
                                <Link
                                    href="/perfil"
                                    onClick={() => setIsOpen(false)}
                                    className="text-base font-medium text-blue-800 hover:bg-yellow-500 px-3 py-2 rounded-md transition-colors"
                                >
                                    Editar perfil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-left text-base font-medium text-red-700 hover:bg-yellow-500 px-3 py-2 rounded-md transition-colors cursor-pointer"
                                >
                                    Cerrar sesión
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="text-base font-medium text-blue-800 hover:bg-yellow-500 px-3 py-2 rounded-md transition-colors"
                            >
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-1 pt-16">
                {children}
            </main>

            <footer className="bg-blue-950 text-blue-300 text-center text-xs py-4 font-medium">
                2026 Tienda Mass — Precios más bajos siempre
            </footer>
            <FloatingButtons /> 
        </div>
    )
}