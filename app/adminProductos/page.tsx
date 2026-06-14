"use client";
import { useEffect, useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import ModalProducto from "./components/ModalProducto";
import ModalCategorias from "./components/ModalCategorias";
import { HiPlus, HiPencilSquare, HiTrash, HiArrowPath, HiTag } from "react-icons/hi2";

interface Producto {
  idProducto?: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  activo: boolean;
}

export default function AdminProductos() {
  const [error, setError] = useState("");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [categorias, setCategorias] = useState<string[]>(["Lácteos", "Bebidas", "Abarrotes", "Limpieza"]);
  
  const [modalProdAbierto, setModalProdAbierto] = useState(false);
  const [modalCatAbierto, setModalCatAbierto] = useState(false);
  
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState<Producto>({
    nombre: "",
    precio: 0,
    categoria: "",
    imagen: "",
    activo: true
  });

  const apiBase = process.env.NEXT_PUBLIC_API + "/productos";

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiBase);
      if (res.ok) {
        const data = await res.json();
        setProductos(data);
      } else {
        if (res.status === 404) setError("Ruta de API no encontrada (404). Verifica el endpoint en el Backend.");
      }
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const abrirModalProducto = (producto?: Producto) => {
    if (producto && producto.idProducto) {
      setEditandoId(producto.idProducto);
      setForm({ ...producto });
    } else {
      setEditandoId(null);
      setForm({ nombre: "", precio: 0, categoria: "", imagen: "", activo: true });
    }
    setModalProdAbierto(true);
  };

  const handleGuardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editandoId ? `${apiBase}/${editandoId}` : apiBase;
    const method = editandoId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setModalProdAbierto(false);
        cargarProductos();
      } else {
        alert("Error al procesar el producto.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEliminarProducto = async (id: number) => {
    if (!confirm("¿Deseas eliminar este producto?")) return;
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      if (res.ok || res.status === 204) cargarProductos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <SidebarAdmin />

      <div className="flex-1 md:pl-64 flex flex-col">
        <main className="p-6 md:p-10">
          
          {error && <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-xl mb-6 font-semibold text-sm">{error}</div>}

          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black text-blue-950 uppercase tracking-tight">Catálogo de Productos</h1>
              <p className="text-gray-500 text-sm font-medium">Gestión comercial para puntos de venta Mass.</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={cargarProductos}
                className="bg-white hover:bg-gray-50 text-blue-950 p-3 rounded-xl border border-gray-200 transition-colors shadow-sm flex items-center justify-center cursor-pointer"
                title="Sincronizar"
              >
                <HiArrowPath className={loading ? "animate-spin" : ""} />
              </button>
              
              <button
                onClick={() => setModalCatAbierto(true)}
                className="bg-white hover:bg-gray-50 text-blue-950 font-black text-xs uppercase tracking-wider px-4 py-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <HiTag className="text-sm text-yellow-500" /> Categorías
              </button>

              <button
                onClick={() => abrirModalProducto()}
                className="bg-blue-950 hover:bg-blue-900 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer border-b-2 border-yellow-400"
              >
                <HiPlus className="text-sm" /> Nuevo Producto
              </button>
            </div>
          </header>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-950 text-white text-[11px] font-black uppercase tracking-wider">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Imagen</th>
                    <th className="py-4 px-6">Descripción / Nombre</th>
                    <th className="py-4 px-6">Categoría</th>
                    <th className="py-4 px-6">Precio de Venta</th>
                    <th className="py-4 px-6 text-center">Estado Catálogo</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-gray-400 uppercase font-black tracking-widest text-xs">Cargando...</td>
                    </tr>
                  ) : productos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-gray-400 uppercase font-black tracking-widest text-xs">No hay productos</td>
                    </tr>
                  ) : (
                    productos.map((prod) => (
                      <tr key={prod.idProducto} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-4 px-6 text-xs font-bold text-gray-400">#{prod.idProducto}</td>
                        <td className="py-4 px-6">
                          {prod.imagen ? (
                            <img src={prod.imagen} alt={prod.nombre} className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400">Sin foto</div>
                          )}
                        </td>
                        <td className="py-4 px-6 font-black text-blue-950 text-base">{prod.nombre}</td>
                        <td className="py-4 px-6"><span className="bg-blue-50 text-blue-950 px-2.5 py-1 rounded-lg text-xs font-bold">{prod.categoria || "General"}</span></td>
                        <td className="py-4 px-6 font-mono text-gray-900 font-bold">S/. {prod.precio.toFixed(2)}</td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${prod.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {prod.activo ? "Disponible" : "Deshabilitado"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => abrirModalProducto(prod)} className="p-2 bg-gray-100 hover:bg-yellow-400 hover:text-blue-950 text-gray-600 rounded-lg transition-all cursor-pointer"><HiPencilSquare className="w-4 h-4" /></button>
                            <button onClick={() => prod.idProducto && handleEliminarProducto(prod.idProducto)} className="p-2 bg-gray-100 hover:bg-red-600 hover:text-white text-gray-600 rounded-lg transition-all cursor-pointer"><HiTrash className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal de Productos */}
          <ModalProducto 
            isOpen={modalProdAbierto}
            onClose={() => setModalProdAbierto(false)}
            editandoId={editandoId}
            form={form}
            setForm={setForm}
            onGuardar={handleGuardarProducto}
            categorias={categorias}
          />

          {/* Modal de Gestión de Categorías */}
          <ModalCategorias 
            isOpen={modalCatAbierto}
            onClose={() => setModalCatAbierto(false)}
            categorias={categorias}
            onAgregarCategoria={(nueva) => setCategorias([...categorias, nueva])}
            onEliminarCategoria={(cat) => setCategorias(categorias.filter(c => c !== cat))}
          />

        </main>
      </div>
    </div>
  );
}