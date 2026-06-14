"use client";
import { HiXMark, HiCheck } from "react-icons/hi2";

interface Producto {
  idProducto?: number;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  activo: boolean;
}

interface ModalProductoProps {
  isOpen: boolean;
  onClose: () => void;
  editandoId: number | null;
  form: Producto;
  setForm: React.Dispatch<React.SetStateAction<Producto>>;
  onGuardar: (e: React.FormEvent) => void;
  categorias: string[]; // Recibe la lista de categorías disponibles
}

export default function ModalProducto({
  isOpen,
  onClose,
  editandoId,
  form,
  setForm,
  onGuardar,
  categorias,
}: ModalProductoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md overflow-hidden shadow-2xl">
        
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between border-b-4 border-yellow-400">
          <h3 className="font-black uppercase tracking-wider text-sm">
            {editandoId ? "Modificar Producto" : "Agregar Nuevo Producto"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl cursor-pointer">
            <HiXMark />
          </button>
        </div>

        <form onSubmit={onGuardar} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 tracking-wider mb-1">Nombre Comercial</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej. Leche Gloria Altramuz 1L"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-950 text-sm font-semibold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-400 tracking-wider mb-1">Categoría</label>
            <select
              required
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-950 text-sm font-semibold text-gray-800 bg-white"
            >
              <option value="">-- Selecciona una Categoría --</option>
              {categorias.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-400 tracking-wider mb-1">URL de la Imagen</label>
            <input
              type="url"
              value={form.imagen}
              onChange={(e) => setForm({ ...form, imagen: e.target.value })}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-950 text-sm font-semibold text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-400 tracking-wider mb-1">Precio Unitario (S/.)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.precio || ""}
              onChange={(e) => setForm({ ...form, precio: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-950 text-sm font-mono text-gray-800"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-xs font-black uppercase text-gray-500 tracking-wider">Habilitar en Venta</span>
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              className="w-4 h-4 accent-blue-950 cursor-pointer"
            />
          </div>

          <div className="flex gap-2 pt-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-xs font-black uppercase text-gray-500 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-blue-950 hover:bg-blue-900 text-white text-xs font-black uppercase rounded-xl border-b-2 border-yellow-400 cursor-pointer">
              <HiCheck /> Guardar
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}