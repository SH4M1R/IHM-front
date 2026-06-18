"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

const slides = [
    { src: "/img1.webp", alt: "Oferta 1" },
    { src: "/img2.webp", alt: "Oferta 2" },
    { src: "/img3.webp", alt: "Oferta 3" },
    { src: "/banner.webp", alt: "Oferta 4" },
]

export default function Inicio() {
    const [current, setCurrent] = useState(0)

    // Auto-avance cada 4 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    const prev = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length)
    const next = () => setCurrent(prev => (prev + 1) % slides.length)

    return (
        <div>
            {/* ── HERO ── */}
            <section className="bg-blue-800 min-h-[420px] flex items-center px-6 py-16">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-yellow-400 uppercase leading-tight mb-4">
                            ¡Los mejores precios del barrio!
                        </h1>
                        <p className="text-blue-100 text-base mb-2">
                            Caser@, a mí nadie me gana, yo tengo siempre los{" "}
                            <span className="text-yellow-400 font-bold">mejores precios</span>, y además,
                            estoy{" "}
                            <span className="text-yellow-400 font-bold">cerca a tu hogar</span>.
                        </p>
                        <p className="text-blue-100 text-base mb-8">
                            ¡No te pierdas los mejores precios del barrio aquí!
                        </p>
                        <Link
                            href="/catalogo"
                            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-sm uppercase tracking-widest px-7 py-3 rounded-full transition-colors"
                        >
                            Quiero ver
                        </Link>
                    </div>

                    {/* Carrusel */}
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl select-none">
                        {slides.map((slide, i) => (
                            <div
                                key={i}
                                className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                            >
                                <Image
                                    src={slide.src}
                                    alt={slide.alt}
                                    fill
                                    className="object-cover"
                                    priority={i === 0}
                                />
                            </div>
                        ))}

                        {/* Controles */}
                        <button
                            onClick={prev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors cursor-pointer"
                        >
                            <FiChevronLeft size={22} />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors cursor-pointer"
                        >
                            <FiChevronRight size={22} />
                        </button>

                        {/* Indicadores */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === current ? "bg-yellow-400 w-6" : "bg-white/60"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PRECIOS MÁS MASS ── */}
            <section className="bg-cyan-50 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-black text-blue-800 uppercase mb-10">
                        Precios más Mass
                    </h2>

                    {/* Grid de cards de productos destacados — placeholder visual */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-3 h-3 bg-blue-800 rounded-full" />
                        <Link
                            href="/catalogo"
                            className="inline-block border-2 border-yellow-400 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-sm uppercase tracking-widest px-8 py-3 rounded-full transition-colors"
                        >
                            Encuentra Mass ahorro aquí
                        </Link>
                        <p className="text-blue-700 text-sm font-medium">
                            Precios vigentes en tiendas Mass de Lima
                        </p>
                    </div>
                </div>
            </section>

            {/* ── SOBRE MASS ── */}
            <section className="relative min-h-[380px] flex items-stretch">
                {/* Imagen de fondo izquierda */}
                <div className="w-full md:w-1/2 relative min-h-[380px]">
                    <Image
                        src="/img1.webp"
                        alt="Tienda Mass"
                        fill
                        className="object-cover"
                    />
                    {/* Curva decorativa */}
                    <div className="hidden md:block absolute inset-y-0 right-0 w-24 bg-blue-800"
                        style={{ clipPath: "ellipse(100% 50% at 100% 50%)" }}
                    />
                </div>

                {/* Texto derecha */}
                <div className="w-full md:w-1/2 bg-blue-800 flex items-center px-10 py-14">
                    <div>
                        <p className="text-white text-xl md:text-2xl font-bold leading-relaxed mb-8">
                            Soy la tienda Mass, la más Mass de todos los barrios con productos de calidad
                            y a los mejores precios para que tú y tu familia siempre puedan ahorrar en
                            sus compras diarias, siempre cerca de mis caser@s.
                        </p>
                        <Link
                            href="/catalogo"
                            className="inline-block border-2 border-yellow-400 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black text-sm uppercase tracking-widest px-7 py-3 rounded-full transition-colors"
                        >
                            Ubica aquí tu tienda más cercana
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}