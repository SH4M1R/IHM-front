"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FaShoppingCart, FaUser } from "react-icons/fa"
import { FiSearch, FiMenu, FiX } from "react-icons/fi"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="w-full fixed top-0 left-0 z-50 bg-yellow-500 shadow-md">
            {/* Contenedor Principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    
                    {/* Logo */}
                    <div className=" flex items-center">
                        <Link href="/">
                            <Image
                                src="/mass_logo.webp"
                                alt="Tienda Mass Logo"
                                width={90}
                                height={45}
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center space-x-6">
                        <Link href="/" className="text-sm font-semibold text-blue-800 hover:text-blue-950 transition-colors">Inicio</Link>
                        <Link href="/productos" className="text-sm font-semibold text-blue-800 hover:text-blue-950 transition-colors">Productos</Link>
                        <Link href="/ofertas" className="text-sm font-semibold text-blue-800 hover:text-blue-950 transition-colors">Ofertas</Link>
                        <Link href="/tiendas" className="text-sm font-semibold text-blue-800 hover:text-blue-950 transition-colors">Tiendas</Link>
                    </div>


                    <div className="flex items-center gap-2">
                        <Link href="/carrito" className="p-2 rounded-full text-blue-800 hover:bg-yellow-600 transition-colors relative">
                            <FaShoppingCart size={20} />
                            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
                        </Link>
                        
                        <Link href="/login" className="p-2 rounded-full text-blue-800 hover:bg-yellow-600 transition-colors">
                            <FaUser size={19} />
                        </Link>

                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 rounded-full text-blue-800 hover:bg-yellow-600 transition-colors focus:outline-none"
                            aria-label="Toggle menu">
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>

                </div>
            </div>

            {/* Menú Desplegable Móvil */}
            <div className={`lg:hidden transition-all duration-300 ease-in-out bg-yellow-500 border-t border-yellow-600 ${isOpen ? "max-h-64 opacity-100 py-3" : "max-h-0 opacity-0 overflow-hidden"}`}>
                <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
                    <Link 
                        href="/" 
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-blue-800 hover:bg-yellow-600 px-3 py-2 rounded-md transition-colors"
                    >
                        Inicio
                    </Link>
                    <Link 
                        href="/productos" 
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-blue-800 hover:bg-yellow-600 px-3 py-2 rounded-md transition-colors"
                    >
                        Productos
                    </Link>
                    <Link 
                        href="/ofertas" 
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-blue-800 hover:bg-yellow-600 px-3 py-2 rounded-md transition-colors"
                    >
                        Ofertas
                    </Link>
                    <Link 
                        href="/tiendas" 
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-blue-800 hover:bg-yellow-600 px-3 py-2 rounded-md transition-colors"
                    >
                        Tiendas
                    </Link>
                </div>
            </div>
        </nav>
    )
}