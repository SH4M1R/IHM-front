"use client";
import { useState } from "react";
import { HiXMark, HiPlus, HiTrash } from "react-icons/hi2";

interface ModalCategoriasProps {
  isOpen: boolean;
  onClose: () => void;
  categorias: string[];
  onAgregarCategoria: (nueva: string) => void;
  onEliminarCategoria: (categoria: string) => void;
}

export default function ModalCategorias({
  isOpen,
  onClose,
  categorias,
  onAgregarCategoria,
  onEliminarCategoria,
}: ModalCategoriasProps) {
  const [nuevaCat, setNuevaCat] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaCat.trim()) {
      onAgregarCategoria(nuevaCat.trim());
      setNuevaCat("");
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm overflow-hidden shadow-2xl">
        
        <div className="bg-blue-950 text-white px-6 py-4 flex items-center justify-between border-b-4 border-yellow-400">
          <h3 className="font-black uppercase tracking-wider text-sm">Gestionar Categorías</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-xl cursor-pointer">
            <HiXMark />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              required
              value={nuevaCat}
              onChange={(e) => setNuevaCat(e.target.value)}
              placeholder="Nueva categoría..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-950 text-sm font-semibold text-gray-800"
            />
            <button type="submit" className="bg-blue-950 text-white p-2.5 rounded-xl hover:bg-blue-900 border-b-2 border-yellow-400 flex items-center justify-center cursor-pointer">
              <HiPlus />
            </button>
          </form>

          <div className="border border-gray-100 rounded-xl max-h-48 overflow-y-auto divide-y divide-gray-50">
            {categorias.length === 0 ? (
              <p className="text-xs text-gray-400 p-4 text-center uppercase font-bold tracking-wider">No hay categorías</p>
            ) : (
              categorias.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50">
                  <span className="text-sm font-bold text-blue-950">{cat}</span>
                  <button
                    type="button"
                    onClick={() => onEliminarCategoria(cat)}
                    className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}