"use client"

const FIELDS = [
    { label: "Nombre", key: "nombre", type: "text", placeholder: "Ej: Laptop HP 15" },
    { label: "Precio", key: "precio", type: "number", placeholder: "0.00" },
    { label: "Categoría", key: "categoria", type: "text", placeholder: "Ej: Electrónica" },
    { label: "URL de imagen", key: "imagen", type: "text", placeholder: "https://..." },
]

function IconX() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    )
}

function IconToggleOn() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="5" width="22" height="14" rx="7" />
            <circle cx="16" cy="12" r="4" fill="currentColor" stroke="none" />
        </svg>
    )
}

function IconToggleOff() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="5" width="22" height="14" rx="7" />
            <circle cx="8" cy="12" r="4" fill="currentColor" stroke="none" />
        </svg>
    )
}

export default function ProductoModal({ open, onClose, form, setForm, onSave, editId }) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-blue-950/50 backdrop-blur-sm" />

            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                    <div>
                        <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-0.5">
                            {editId ? "Modificar registro" : "Nuevo registro"}
                        </p>
                        <h2 className="text-xl font-black text-blue-950">
                            {editId ? "Editar producto" : "Crear producto"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-blue-950 hover:bg-gray-100 p-2 rounded-xl transition-colors cursor-pointer"
                    >
                        <IconX />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 flex flex-col gap-4">
                    {FIELDS.map(f => (
                        <div key={f.key}>
                            <label className="block text-xs font-bold text-blue-950 mb-1.5 uppercase tracking-wide">
                                {f.label}
                            </label>
                            <input
                                type={f.type}
                                value={form[f.key]}
                                placeholder={f.placeholder}
                                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                className="w-full rounded-xl px-3.5 py-2.5 border-2 border-gray-200 text-sm text-blue-950 placeholder-gray-300 focus:outline-none focus:border-blue-900 transition-colors"
                            />
                        </div>
                    ))}

                    {/* Toggle activo */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mt-1">
                        <div>
                            <p className="text-xs font-bold text-blue-950 uppercase tracking-wide">Estado</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {form.activo ? "Visible en el catálogo" : "Oculto del catálogo"}
                            </p>
                        </div>
                        <button
                            onClick={() => setForm({ ...form, activo: !form.activo })}
                            className={`transition-colors cursor-pointer ${form.activo ? "text-green-500" : "text-gray-300"}`}
                        >
                            {form.activo ? <IconToggleOn /> : <IconToggleOff />}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="flex-1 border-2 border-gray-200 text-gray-500 font-bold text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 bg-blue-950 text-white font-black text-sm py-2.5 rounded-xl hover:bg-blue-900 transition-colors cursor-pointer"
                    >
                        {editId ? "Guardar cambios" : "Crear producto"}
                    </button>
                </div>
            </div>
        </div>
    )
}