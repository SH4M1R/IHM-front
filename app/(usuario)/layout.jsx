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
            <nav className="fixed top-0 left-0 w-full z-50 bg-yellow-400/95 backdrop-blur-md shadow-md">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
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

                        {/* Desktop */}
                        <div className="hidden sm:flex items-center gap-8">
                            {links.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={`font-semibold transition-all duration-200 ${
                                        pathname === l.href
                                            ? "text-blue-950"
                                            : "text-blue-800 hover:text-blue-950"
                                    }`}
                                >
                                    {l.label}
                                </Link>
                            ))}

                            <Link
                                href="/sucursal"
                                className="flex items-center gap-2 text-blue-800 font-semibold hover:text-blue-950"
                            >
                                <FaMapMarkerAlt />
                                Sucursal
                            </Link>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-2">

                            {/* Carrito */}
                            <Link
                                href={usuario ? "/carrito" : "/login"}
                                className="relative p-2 rounded-full hover:bg-yellow-500 transition"
                            >
                                <FaShoppingCart
                                    size={20}
                                    className="text-blue-800"
                                />

                                {usuario && cantidadCarrito > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {cantidadCarrito > 99 ? "99+" : cantidadCarrito}
                                    </span>
                                )}
                            </Link>

                            {/* Usuario Desktop */}
                            {usuario ? (
                                <div
                                    className="relative hidden lg:block"
                                    ref={dropdownRef}
                                >
                                    <button
                                        onClick={() =>
                                            setDropdownOpen(!dropdownOpen)
                                        }
                                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-yellow-500 transition"
                                    >
                                        <FaUser className="text-blue-800" />
                                        <span className="font-semibold text-blue-800">
                                            {usuario.nombre}
                                        </span>

                                        <FaChevronDown
                                            className={`text-blue-800 transition-transform ${
                                                dropdownOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl overflow-hidden">
                                            <Link
                                                href="/perfil"
                                                className="block px-4 py-3 hover:bg-gray-100"
                                            >
                                                Ver perfil
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                                            >
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="hidden sm:flex p-2 rounded-full hover:bg-yellow-500"
                                >
                                    <FaUser
                                        size={19}
                                        className="text-blue-800"
                                    />
                                </Link>
                            )}

                            {/* Botón hamburguesa */}
                            <button
                                onClick={() => setIsOpen(true)}
                                className="sm:hidden p-2 rounded-lg hover:bg-yellow-500 transition"
                            >
                                <FiMenu
                                    size={24}
                                    className="text-blue-800"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
                    isOpen
                        ? "opacity-100 visible"
                        : "opacity-0 invisible"
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-yellow-500 shadow-2xl z-50 transform transition-transform duration-300 lg:hidden ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between p-5 border-b">
                    <Image
                        src="/mass_logo.webp"
                        alt="Mass"
                        width={90}
                        height={45}
                    />

                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-full hover:bg-yellow-400"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {usuario && (
                    <div className="p-5 border-b">
                        <p className="text-gray-500 text-sm">
                            Bienvenido
                        </p>

                        <p className="font-bold text-blue-950">
                            {usuario.nombre}
                        </p>
                    </div>
                )}

                <div className="flex flex-col p-4 gap-2">

                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setIsOpen(false)}
                            className={`px-4 py-3 rounded-xl font-semibold transition ${
                                pathname === l.href
                                    ? "bg-yellow-400 text-blue-950"
                                    : "text-gray-700 hover:bg-yellow-300"
                            }`}
                        >
                            {l.label}
                        </Link>
                    ))}

                    <Link
                        href="/sucursal"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-yellow-300 font-semibold"
                    >
                        <FaMapMarkerAlt />
                        Sucursal
                    </Link>

                    {usuario ? (
                        <>
                            <Link
                                href="/perfil"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-3 rounded-xl text-gray-700 hover:bg-yellow-300 font-semibold"
                            >
                                Mi perfil
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="text-left px-4 py-3 rounded-xl text-red-600 hover:bg-yellow-300 font-semibold"
                            >
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-3 rounded-xl bg-blue-950 text-white text-center font-semibold"
                        >
                            Iniciar sesión
                        </Link>
                    )}
                </div>
            </aside>

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