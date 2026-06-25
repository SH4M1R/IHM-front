"use client"

import { useState } from "react"

export default function EvidenciaModal({ open, onClose, onConfirm }) {
  const [foto, setFoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [cargando, setCargando] = useState(false)

  if (!open) return null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleConfirmar = async () => {
    if (!foto) return
    setCargando(true)
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result) // incluye el prefijo "data:image/...;base64,"
        reader.onerror = reject
        reader.readAsDataURL(foto)
      })
      await onConfirm(base64)
      setFoto(null)
      setPreview(null)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-end sm:items-center p-4 z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
        <h2 className="font-black text-xl text-blue-950 mb-2">Evidencia de entrega</h2>
        <p className="text-sm text-gray-500 mb-4">
          Toma una foto o selecciona una imagen del paquete entregado.
        </p>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-50 bg-gray-50/50 transition-colors">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview ? (
            <img src={preview} alt="Vista previa" className="max-h-40 object-contain rounded-lg" />
          ) : (
            <div className="text-center py-4">
              <span className="text-sm text-blue-600 font-bold">Subir foto o usar cámara</span>
            </div>
          )}
        </label>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => { setFoto(null); setPreview(null); onClose() }}
            className="flex-1 border border-gray-300 rounded-xl py-3 font-bold text-gray-700 text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={!foto || cargando}
            className="flex-1 bg-blue-950 disabled:bg-gray-300 text-white rounded-xl py-3 font-bold text-sm transition-colors"
          >
            {cargando ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  )
}