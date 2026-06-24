"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginEmpleados() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const api = process.env.NEXT_PUBLIC_API

    const handleLogin = async () => {
        if (!api) { setError("Error de configuración"); return }
        setError("")
        setLoading(true)

        try {
            const resEmpleado = await fetch(`${api}/empleados/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })

            if (resEmpleado.ok) {
                const empleado = await resEmpleado.json()
                
                // Seteamos las claves necesarias para tus paneles internos
                localStorage.setItem("empleado", JSON.stringify(empleado))
                localStorage.setItem("usuario", JSON.stringify(empleado))
                localStorage.setItem("rol", empleado.rol ?? "repartidor")

                // Redirección por Rol de Personal
                if (empleado.rol === "administrador") {
                    router.push("/adminPanel")
                } else {
                    router.push("/adminPanel/repartidor")
                }
                return
            }

            setError("Usuario o contraseña de personal incorrectos.")
        } catch (err) {
            setError("Error de conexión con el servidor")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-950 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl">
                <h1 className="text-2xl font-black text-blue-950 text-center">Portal de Empleados</h1>
                <p className="text-gray-500 text-center text-sm mt-1">Ingresa para gestionar la plataforma</p>
                
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-blue-950">Usuario Corporativo</label>
                        <input
                            type="text"
                            placeholder="Ej. admin o rep_juan"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full rounded-xl px-4 py-3 mt-1 border-gray-300 border-2 bg-white text-gray-800 focus:outline-none focus:border-blue-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-blue-950">Contraseña</label>
                        <input
                            type="password"
                            placeholder="*******"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full rounded-xl px-4 py-3 mt-1 border-gray-300 border-2 bg-white text-gray-800 focus:outline-none focus:border-blue-900"
                        />
                    </div>

                    {error && <p className="text-red-500 text-xs font-semibold text-center">{error}</p>}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="bg-yellow-400 hover:bg-yellow-500 text-blue-950 w-full py-3.5 mt-4 rounded-xl font-black uppercase text-xs tracking-wider transition-colors disabled:opacity-60"
                    >
                        {loading ? "Verificando..." : "Acceder al Sistema"}
                    </button>
                </div>
            </div>
        </div>
    )
}