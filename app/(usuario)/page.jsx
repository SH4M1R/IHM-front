"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Utensils, Lightbulb, Heart } from "lucide-react"

export default function Home() {
    const [productos, setProductos] = useState([])
    const [currentImage, setCurrentImage] = useState(0)
    const api = process.env.NEXT_PUBLIC_API

    const carruselImagenes = ["/ofe1.webp", "/ofe2.webp", "/ofe3.webp"]

    useEffect(() => {
        // Fetch de productos
        fetch(`${api}/productos/activos`)
            .then(r => r.json())
            .then(d => setProductos(d.slice(0, 4)))
            .catch(console.error)

        // Intervalo para el carrusel de fondo
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % carruselImagenes.length)
        }, 4000)

        return () => clearInterval(timer)
    }, [api])

    return (
        <div>
            {/* Hero con Carrusel de Fondo */}
            <section className="relative py-20 px-4 text-center overflow-hidden min-h-[500px] flex flex-col justify-center items-center">
                {/* Imágenes del carrusel */}
                {carruselImagenes.map((img, index) => (
                    <div
                        key={img}
                        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 -z-20 ${
                            index === currentImage ? "opacity-100" : "opacity-0"
                        }`}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}
                <div className="absolute inset-0 bg-black/40 -z-10" />

                <div className="relative z-10 text-white max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black mb-3 drop-shadow-md text-yellow-400">
                        ¡Ahorro que rinde más!
                    </h1>
                    <p className="font-medium text-lg md:text-xl mb-8 max-w-md mx-auto drop-shadow-sm text-white">
                        Descubre ofertas exclusivas todos los días cerca de ti.
                    </p>
                    <Link href="/catalogo" className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-black px-8 py-3 rounded-xl text-sm transition-colors inline-block shadow-lg mb-16">
                        Ver catálogo →
                    </Link>

                    {/* Nueva sección con iconos estilizados */}
                    <div className="w-full">
                        <h2 className="text-xl md:text-2xl font-black mb-8 tracking-wide drop-shadow-sm uppercase">
                            Todo fácil, práctico y bien casero
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto px-4">
                            {/* Bloque 1 */}
                            <div className="flex flex-col items-center text-center bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-md">
                                    <Utensils size={32} />
                                </div>
                                <h3 className="font-black text-lg text-yellow-400 mb-1 uppercase tracking-wide">
                                    Recetas Mass Caseras
                                </h3>
                                <p className="text-sm text-gray-100 font-light">
                                    Recetas fáciles con ingredientes al precio Mass bajo.
                                </p>
                            </div>

                            {/* Bloque 2 */}
                            <div className="flex flex-col items-center text-center bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-md">
                                    <Lightbulb size={32} />
                                </div>
                                <h3 className="font-black text-lg text-yellow-400 mb-1 uppercase tracking-wide">
                                    El Tip Mass Útil
                                </h3>
                                <p className="text-sm text-gray-100 font-light">
                                    Secretitos para mantener tu hogar sin gastar de más.
                                </p>
                            </div>

                            {/* Bloque 3 */}
                            <div className="flex flex-col items-center text-center bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-md">
                                    <Heart size={32} />
                                </div>
                                <h3 className="font-black text-lg text-yellow-400 mb-1 uppercase tracking-wide">
                                    Cuídate Mass
                                </h3>
                                <p className="text-sm text-gray-100 font-light">
                                    Consejitos para verte y sentirte bien sin gastar una fortuna.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Destacados */}
            <section className="max-w-6xl mx-auto px-4 py-12">
                <h2 className="text-xl font-black text-blue-950 mb-6">Productos destacados</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {productos.map(p => (
                        <div key={p.idProducto} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-full aspect-square bg-gray-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                                {p.imagen
                                    ? <img src={p.imagen} alt={p.nombre} className="object-cover w-full h-full rounded-xl" />
                                    : <span className="text-3xl">🛍️</span>}
                            </div>
                            <p className="font-bold text-blue-950 text-sm truncate">{p.nombre}</p>
                            <p className="text-yellow-500 font-black text-base">S/ {p.precio?.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link href="/catalogo" className="border-2 border-blue-950 text-blue-950 font-black px-6 py-2.5 rounded-xl text-sm hover:bg-blue-950 hover:text-white transition-colors inline-block">
                        Ver todos los productos
                    </Link>
                </div>
            </section>
        </div>
    )
}