import Navbar from "../components/Navbar";

export default function CategoriasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar /> 
      {/* Barra full width pero contenido alineado */}
      <div className="w-full border-b border-gray-200 bg-white py-3 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex gap-3">
          <button className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer">Abarrotes</button>
          <button className="text-gray-600 px-4 py-1.5 rounded-full text-sm border border-gray-200 cursor-pointer">Bebidas</button>
          <button className="text-gray-600 px-4 py-1.5 rounded-full text-sm border border-gray-200 cursor-pointer">Limpieza</button>
          <button className="text-gray-600 px-4 py-1.5 rounded-full text-sm border border-gray-200 cursor-pointer">Cuidado Personal</button>
          <button className="text-gray-600 px-4 py-1.5 rounded-full text-sm border border-gray-200 cursor-pointer">Mascotas</button>
          <button className="text-gray-600 px-4 py-1.5 rounded-full text-sm border border-gray-200 cursor-pointer">Lácteos</button>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-6">
        {children}
      </div>
    </div>
  )
}