"use client"
import { useEffect, useState } from "react"

export default function Perfil() {
    const [form, setForm] = useState({ nombre: "", apellido: "", dni: "", correo: "", password: "" })
    const [guardado, setGuardado] = useState(false)
    const [error, setError] = useState("")
    const api = process.env.NEXT_PUBLIC_API

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario"))
        setForm({ nombre: usuario.nombre, apellido: usuario.apellido, dni: usuario.dni, correo: usuario.correo, password: "" })
    }, [])

    const handleSave = async () => {
        const usuario = JSON.parse(localStorage.getItem("usuario"))
        const body = { ...form, dni: parseInt(form.dni) }
        if (!form.password) delete body.password

        const res = await fetch(`${api}/usuarios/${usuario.idUsuario}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })

        if (res.ok) {
            const updated = await res.json()
            localStorage.setItem("usuario", JSON.stringify(updated))
            setGuardado(true)
            setTimeout(() => setGuardado(false), 2500)
        } else {
            setError("Error al guardar los cambios.")
        }
    }

    return (
        <div className="max-w-md mx-auto px-4 py-10">
            <h1 className="text-2xl font-black text-blue-950 mb-1">Mi Perfil</h1>
            <p className="text-gray-500 text-sm mb-6">Actualiza tus datos personales</p>

            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                {[
                    { label: "Nombre", key: "nombre", type: "text" },
                    { label: "Apellido", key: "apellido", type: "text" },
                    { label: "DNI", key: "dni", type: "text" },
                    { label: "Correo", key: "correo", type: "email" },
                    { label: "Nueva contraseña (opcional)", key: "password", type: "password" },
                ].map(f => (
                    <div key={f.key}>
                        <label className="text-xs font-bold text-blue-950">{f.label}</label>
                        <input
                            type={f.type}
                            value={form[f.key]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 mt-1 text-sm focus:outline-none focus:border-blue-900"
                        />
                    </div>
                ))}

                {guardado && <p className="text-green-600 text-xs font-bold text-center">✓ Cambios guardados</p>}
                {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}

                <button onClick={handleSave}
                    className="bg-blue-950 hover:bg-blue-900 text-white font-black py-3 rounded-xl text-sm transition-colors cursor-pointer mt-1">
                    Guardar cambios
                </button>
            </div>
        </div>
    )
}