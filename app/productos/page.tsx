import CardProducto from "./components/CardProducto"

const subcategorias = [
    { label: "Arroz y menestra", count: 124 },
    { label: "Aceites", count: 45 },
    { label: "Fideos", count: 89 },
    { label: "Conservas", count: 67 },
]

const marcas = [
    "Primor",
    "Costeño",
    "Anita",
    "Gloria",
    "Faro"
]

const productos = [
    {
        imagen: "/products/primor.webp",
        marca: "PRIMOR",
        nombre: "Aceite Vegetal Botella 1L",
        precio: 9.20
    },
    {
        imagen: "/products/costeño.webp",
        marca: "COSTEÑO",
        nombre: "Arroz Costeño Bolsa 1kg",
        precio: 4.50

    },
    {
        imagen: "/products/anita.webp",
        marca: "ANITA",
        nombre: "Fideos Anita Bolsa 500g",
        precio: 2.20
    },
    {
        imagen: "/products/gloria.webp",
        marca: "GLORIA",
        nombre: "Leche Gloria Bolsa 400g",
        precio: 3.80
    },
    {
        imagen: "/products/florida.webp",
        marca: "FLORIDA",
        nombre: "Trozos de Atun Lata 170g",
        precio: 5.50
        
    },
    {
        imagen: "/products/kikko.webp",
        marca: "KIKKO",
        nombre: "Sillao Botella 500ml",
        precio: 4.90,
        
    }
]

export default function Productos() {
    return (
        <div className="flex gap-6">
            <div className="w-64 shrink-0">
                {/* Sidebar de categorías */}
                <div className="bg-white py-4 px-6 rounded-lg border border-gray-300">
                    <h2 className="text-xl font-black border-b border-red-800 pb-3">Categorías</h2>

                    <div className="flex justify-between items-center px-2 py-2 mt-4 hover:bg-gray-100 rounded-md cursor-pointer">
                        <h3 className="text-red-800 font-semibold">Abarrotes</h3>
                        <span className="text-red-800">›</span>
                    </div>

                    <div className="flex flex-col">
                        {subcategorias.map((sub) => (
                            <div key={sub.label} className="flex justify-between items-center px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                <span className="text-gray-700 text-sm">{sub.label}</span>
                                <span className="text-gray-400 text-sm">{sub.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Precio */}
                <div className="bg-white py-4 px-6 rounded-lg border border-gray-300 mt-6">
                    <h2 className="text-xl font-black border-b border-red-800 pb-3">Rango de Precio</h2>
                    <div className="flex justify-center items-center gap-4">
                        <div className="mt-4">
                            <label htmlFor="min-price" className="block text-sm font-medium text-red-800">
                                Min (S/)
                            </label>
                            <input
                                type="number"
                                id="min-price"
                                placeholder="0"
                                className="mt-1 block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            />
                        </div>

                        <h1 className="text-2xl">-</h1>

                        <div className="mt-4">
                            <label htmlFor="max-price" className="block text-sm font-medium text-red-800">
                                Max (S/)
                            </label>
                            <input
                                type="number"
                                id="max-price"
                                placeholder="100"
                                className="mt-1 block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            />
                        </div>
                    </div>
                    <button className=" w-full mt-4 bg-red-800 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        Aplicar Filtros
                    </button>
                </div>

                {/* Marcas */}
                <div className="bg-white py-4 px-6 rounded-lg border border-gray-300 mt-6">
                    <h2 className="text-xl font-black border-b border-red-800 pb-3">Marcas</h2>
                    {marcas.map((marca) => (
                        <label key={marca} className="flex items-center gap-2 cursor-pointer pt-2">
                            <input type="checkbox" className="accent-red-600" />
                            <span>{marca}</span>
                        </label>
                    ))}
                </div>

            </div>

            {/* Contenido productos */}
            <div className="flex-1">
                <h2 className="text-2xl font-bold">Abarrotes</h2>
                <div className="grid grid-cols-5 gap-4">
                    {productos.map((prod, index) => (
                        <CardProducto 
                            key={index}
                            imagen={prod.imagen}
                            marca={prod.marca}
                            nombre={prod.nombre}
                            precio={prod.precio}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}