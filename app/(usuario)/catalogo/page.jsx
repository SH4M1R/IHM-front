"use client"

import { useEffect, useState } from "react"
import CardProducto from "./components/CardProducto"
import { HiFunnel, HiSquares2X2, HiChevronRight, HiArrowPath } from "react-icons/hi2"

export default function CatalogoPage() {
    const [productos, setProductos] = useState([])
    const [productosFiltrados, setProductosFiltrados] = useState([])
    const [loading, setLoading] = useState(true)
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")

    useEffect(() => {
        const fetchProductos = async () => {
            const api = process.env.NEXT_PUBLIC_API
            try {
                const res = await fetch(`${api}/productos/activos`)
                if (res.ok) {
                    const data = await res.json()
                    setProductos(data)
                    setProductosFiltrados(data)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchProductos()
    }, [])

    const conteoCategorias = productos.reduce((acc, p) => {
        const cat = p.categoria || "Otros"
        acc[cat] = (acc[cat] || 0) + 1
        return acc
    }, {})

    const aplicarFiltros = () => {
        let resultado = [...productos]
        if (minPrice) resultado = resultado.filter(p => p.precio >= parseFloat(minPrice))
        if (maxPrice) resultado = resultado.filter(p => p.precio <= parseFloat(maxPrice))
        if (categoriaSeleccionada) resultado = resultado.filter(p => (p.categoria || "Otros") === categoriaSeleccionada)
        setProductosFiltrados(resultado)
    }

    const limpiarFiltros = () => {
        setMinPrice("")
        setMaxPrice("")
        setCategoriaSeleccionada("")
        setProductosFiltrados(productos)
    }

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 gap-2">
                <HiArrowPath className="w-6 h-6 text-blue-950 animate-spin" />
                <p className="text-xs font-bold text-blue-950 uppercase tracking-widest">Cargando...</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="max-w-[95%] w-full mx-auto p-4 md:p-6 pt-6 flex flex-col md:flex-row gap-6">

                {/* Sidebar filtros */}
                <aside className="w-full md:w-72 shrink-0 flex flex-col gap-4">

                    {/* Categorías */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-3">
                            <HiSquares2X2 className="text-blue-950 w-4 h-4" />
                            <h2 className="text-xs font-black text-blue-950 uppercase tracking-wider">Categorías</h2>
                        </div>

                        <button
                            onClick={limpiarFiltros}
                            className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-xs uppercase font-bold transition-all cursor-pointer ${
                                categoriaSeleccionada === ""
                                    ? "bg-blue-950 text-white"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            <span>Ver Todo</span>
                            <HiChevronRight className="w-3 h-3" />
                        </button>

                        <div className="flex flex-col mt-2 gap-1 max-h-48 md:max-h-none overflow-y-auto">
                            {Object.keys(conteoCategorias).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => {
                                        setCategoriaSeleccionada(cat)
                                        setProductosFiltrados(productos.filter(p => (p.categoria || "Otros") === cat))
                                    }}
                                    className={`flex justify-between items-center px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all ${
                                        categoriaSeleccionada === cat
                                            ? "bg-yellow-400 text-blue-950 font-bold"
                                            : "text-gray-600 hover:bg-gray-50 font-medium"
                                    }`}
                                >
                                    <span className="truncate">{cat}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                                        categoriaSeleccionada === cat
                                            ? "bg-blue-950/10 text-blue-950 font-bold"
                                            : "bg-gray-100 text-gray-400"
                                    }`}>
                                        {conteoCategorias[cat]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Precios */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2 mb-3">
                            <HiFunnel className="text-blue-950 w-4 h-4" />
                            <h2 className="text-xs font-black text-blue-950 uppercase tracking-wider">Precios</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="number"
                                placeholder="Mínimo"
                                value={minPrice}
                                onChange={e => setMinPrice(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-950"
                            />
                            <input
                                type="number"
                                placeholder="Máximo"
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-950"
                            />
                        </div>

                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={limpiarFiltros}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg font-bold text-xs uppercase cursor-pointer transition-colors"
                            >
                                Limpiar
                            </button>
                            <button
                                onClick={aplicarFiltros}
                                className="flex-1 bg-blue-950 hover:bg-blue-900 text-white py-2 rounded-lg font-black text-xs uppercase border-b-2 border-yellow-400 cursor-pointer transition-colors"
                            >
                                Filtrar
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Grid productos */}
                <section className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {productosFiltrados.length} productos
                        </p>
                    </div>

                    {productosFiltrados.length === 0 ? (
                        <div className="bg-white text-center py-16 rounded-xl border border-gray-200">
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Sin resultados</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                            {productosFiltrados.map(prod => (
                                <CardProducto key={prod.idProducto} producto={prod} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}