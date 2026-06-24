"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Login() {
    const router = useRouter()
    const [identificador, setIdentificador] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const api = process.env.NEXT_PUBLIC_API

    const handleLogin = async () => {
        if (!api) { setError("Error de configuración en el servidor"); return }
        setError("")
        setLoading(true)

        try {
            // FLUJO PÚBLICO EXCLUSIVO PARA CLIENTES (CORREO ELECTRÓNICO)
            const resUsuario = await fetch(`${api}/usuarios/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: identificador, password })
            })

            if (resUsuario.ok) {
                const usuario = await resUsuario.json()

                // Buscar carrito existente
                let idCarrito = null
                const resCarrito = await fetch(`${api}/carritos/usuario/${usuario.idUsuario}`)

                if (resCarrito.ok) {
                    const carrito = await resCarrito.json()
                    idCarrito = carrito.idCarrito
                } else {
                    // No tiene carrito, crear uno nuevo
                    const resCrear = await fetch(`${api}/carritos/usuario/${usuario.idUsuario}/crear`, {
                        method: "POST"
                    })
                    if (resCrear.ok) {
                        const carritoNuevo = await resCrear.json()
                        idCarrito = carritoNuevo.idCarrito
                    }
                }

                localStorage.setItem("usuario", JSON.stringify({ ...usuario, idCarrito }))
                localStorage.setItem("rol", "usuario")
                router.push("/")
                return
            }

            setError("Credenciales incorrectas. Verifica tu correo o contraseña.")

        } catch (err) {
            setError("No se pudo establecer conexión con el servidor")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin()
    }

    return (
        <div className="flex min-h-screen">
            {/* Panel Izquierdo Lateral con Imagen e Historial de Marca */}
            <div className="hidden md:flex w-3/5 bg-yellow-400 flex-col items-center justify-center gap-6 p-10 text-center">
                <div className="relative w-full max-w-xl aspect-[3/2]">
                    <Image
                        src="/login.webp"
                        alt="Login Illustration"
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        priority
                        className="border-yellow-500 border-8 rounded-3xl object-cover"
                    />
                </div>
                {/* ACCESO OCULTO PARA EL PERSONAL DE LA EMPRESA */}
                <h1 className="font-black text-4xl text-blue-800">
                    ¡Ahorro que rinde MASS!
                </h1>
                <p className="font-medium text-lg text-blue-900 max-w-md">Únete a la familia Mass y descubre ofertas exclusivas todos los días cerca de ti.</p>
            </div>

            {/* Panel Derecho del Formulario Clientes */}
            <div className="w-full md:w-2/5 bg-gray-50 px-6 py-10 md:px-16 md:py-20 flex flex-col justify-center">
                <a href="/" className="flex gap-2 items-center cursor-pointer text-blue-900 hover:text-blue-950 font-bold text-sm mb-6">
                    <span className="font-mono text-lg">‹</span> Regresar al inicio
                </a>
                <h1 className="font-black text-4xl text-blue-800">
                    Tiendas {" "}
                    <span 
                        onClick={() => router.push("/loginEmpleado")}
                        className="cursor-default select-none active:text-blue-800 transition-colors hover:text-blue-950"
                        title="Portal Interno"
                    >
                        MASS
                    </span>
                </h1>
                <p className="text-gray-600 pt-2 text-base md:text-lg">Ingresa tus credenciales para continuar comprando.</p>

                <div className="pt-6">
                    <div>
                        <label className="block text-sm font-bold text-blue-950">Correo Electrónico</label>
                        <input
                            type="text"
                            placeholder="ejemplo@correo.com"
                            value={identificador}
                            onChange={e => setIdentificador(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full rounded-xl px-4 py-3 mt-2 border-gray-300 border-2 bg-white text-gray-800 focus:outline-none focus:border-blue-900"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-bold text-blue-950">Contraseña</label>
                        <input
                            type="password"
                            placeholder="*******"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full rounded-xl px-4 py-3 mt-2 border-gray-300 border-2 bg-white text-gray-800 focus:outline-none focus:border-blue-900"
                        />
                    </div>

                    <div className="flex justify-end mt-2">
                        <a href="#" className="text-xs font-bold text-blue-900 hover:underline">¿Olvidaste tu contraseña?</a>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs text-center">
                            <p className="font-medium">{error}</p>
                            <a href="/register" className="underline font-bold block mt-1">Regístrate aquí</a>
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="bg-blue-900 hover:bg-blue-950 text-white w-full py-3.5 mt-6 rounded-xl font-black uppercase tracking-wider text-xs shadow-md transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-default"
                    >
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </button>

                    <p className="text-center mt-8 text-sm text-gray-500 font-medium">
                        ¿No tienes una cuenta? <a href="/register" className="text-blue-900 font-bold hover:underline">Regístrate aquí</a>
                    </p>
                </div>
            </div>
        </div>
    )
}