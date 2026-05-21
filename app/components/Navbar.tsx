import Link from "next/link"
import { FaShoppingCart, FaUser } from "react-icons/fa"
import { MdLocationOn } from "react-icons/md"
import { FiSearch, FiChevronDown } from "react-icons/fi"
import Image from "next/image"
 
export default function Navbar() {
    return (
        <nav className="w-full fixed top-0 left-0 z-50 bg-white border-b border-gray-200">
            <div className="flex items-center gap-5 px-6 h-14 w-full">

                {/* Logo texto */}
                
                <Image
                    src="/mass_logo.webp"
                    alt="Tieda Mass Logo"
                    width={100}
                    height={50}
                />
                {/* Ubicación */}
                <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer flex-shrink-0">
                    <MdLocationOn className="text-blue-700 text-base" />
                    <span className="text-sm text-gray-700 whitespace-nowrap">
                        Recoger en: Tienda San Isidro
                    </span>
                    <FiChevronDown className="text-gray-400 text-sm" />
                </div>

                {/* Buscador */}
                <div className="flex items-center gap-2 flex-1 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 min-w-0">
                    <FiSearch className="text-gray-400 text-base flex-shrink-0" />
                    <input
                        type="text"
                        placeholder="¿Qué buscas hoy?"
                        className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                    />
                </div>

                {/* Links de navegación */}
                <ul className="flex items-center gap-5 flex-shrink-0">
                    <li><Link href="/" className="text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap">Inicio</Link></li>
                    <li><Link href="/productos" className="text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap">Productos</Link></li>
                    <li><Link href="/" className="text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap">Ofertas</Link></li>
                    <li><Link href="/" className="text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap">Tiendas</Link></li>
                </ul>

                {/* Acciones */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button className="p-1.5 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50">
                        <FaShoppingCart size={18} />
                    </button>
                    <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg">
                        <a href="/login">
                            <FaUser size={18} />
                        </a>
                    </button>
                </div>

            </div>
        </nav>
    )
}