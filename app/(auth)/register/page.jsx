"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

const PASO = { DATOS: 1, OTP: 2 }

export default function Register() {
    const router = useRouter()
    const [paso, setPaso] = useState(PASO.DATOS)

    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [dni, setDni] = useState("")
    const [correo, setCorreo] = useState("")
    const [telefono, setTelefono] = useState("")
    const [direccion, setDireccion] = useState("")
    const [password, setPassword] = useState("")

    const [otp, setOtp] = useState("")
    const [error, setError] = useState("")
    const [cargando, setCargando] = useState(false)
    const [mensajeOtp, setMensajeOtp] = useState("")

    const api = process.env.NEXT_PUBLIC_API

    // PASO 1: Valida campos y envía OTP al correo
    const handleEnviarOtp = async () => {
        setError("")

        if (!nombre || !apellido || !dni || !correo || !password || !telefono) {
            setError("Por favor, completa todos los campos obligatorios")
            return
        }
        if (isNaN(parseInt(dni)) || isNaN(parseInt(telefono))) {
            setError("El DNI y el Teléfono deben ser números válidos")
            return
        }

        setCargando(true)
        try {
            const res = await fetch(`${api}/usuarios/enviar-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo }),
            })

            if (res.ok) {
                setPaso(PASO.OTP)
                setMensajeOtp(`Enviamos un código de 6 dígitos a ${correo}`)
            } else if (res.status === 409) {
                setError("Este correo ya está registrado")
            } else {
                setError("No pudimos verificar ese correo. ¿Existe realmente?")
            }
        } catch {
            setError("No se pudo conectar con el servidor")
        } finally {
            setCargando(false)
        }
    }

    // PASO 2: Verifica OTP y crea la cuenta
    const handleVerificarYRegistrar = async () => {
        setError("")

        if (otp.length !== 6) {
            setError("El código debe tener 6 dígitos")
            return
        }

        setCargando(true)
        try {
            // Verificar OTP
            const resOtp = await fetch(`${api}/usuarios/verificar-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, otp }),
            })

            if (!resOtp.ok) {
                const status = resOtp.status
                if (status === 410) setError("El código expiró. Vuelve atrás y solicita uno nuevo.")
                else setError("Código incorrecto. Inténtalo de nuevo.")
                setCargando(false)
                return
            }

            // OTP válido → crear cuenta
            const resReg = await fetch(`${api}/usuarios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    apellido,
                    dni: parseInt(dni, 10),
                    telefono: parseInt(telefono, 10),
                    direccion: direccion.trim() === "" ? null : direccion,
                    correo,
                    password,
                }),
            })

            if (resReg.ok) {
                router.push("/login")
            } else {
                const data = await resReg.json().catch(() => null)
                setError(data?.message || "Error al crear la cuenta")
            }
        } catch {
            setError("No se pudo conectar con el servidor")
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Panel izquierdo */}
            <div className="w-full md:w-3/5 bg-yellow-400 flex flex-col items-center justify-center gap-6 p-6 md:p-10 text-center">
                <div className="relative w-full max-w-md md:max-w-xl aspect-[3/2]">
                    <Image
                        src="/login.webp"
                        alt="Login Illustration"
                        fill
                        className="border-yellow-500 border-4 md:border-8 rounded-3xl object-cover"
                    />
                </div>
                <h1 className="font-black text-3xl md:text-4xl text-blue-950">¡Ahorro que rinde más!</h1>
                <p className="font-medium text-base md:text-lg text-blue-900 max-w-md">
                    Únete a la familia Mass y descubre ofertas exclusivas todos los días cerca de ti.
                </p>
            </div>

            {/* Panel derecho */}
            <div className="w-full md:w-2/5 bg-gray-50 px-6 py-10 md:px-16 md:py-12 flex flex-col justify-center">

                {/* ── PASO 1: Formulario ── */}
                {paso === PASO.DATOS && (
                    <>
                        <a href="/" className="flex gap-2 items-center cursor-pointer text-blue-900 hover:text-blue-950 font-bold text-sm mb-4">
                            <span className="font-mono text-lg">‹</span> Regresar al inicio
                        </a>

                        <h1 className="text-3xl md:text-4xl font-black text-blue-950">Crea una cuenta</h1>
                        <p className="text-gray-600 pt-1 text-base">Regístrate para empezar a comprar y ahorrar.</p>

                        <div className="pt-4 flex flex-col gap-3">
                            <div>
                                <label className="block text-xs font-bold text-blue-950">Nombre</label>
                                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                                    className="w-full rounded-xl px-4 py-2.5 mt-1 border-gray-300 border-2 bg-white text-gray-800 focus:outline-none focus:border-blue-900 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-950">Apellido</label>
                                <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}
                                    className="w-full rounded-xl px-4 py-2.5 mt-1 border-gray-300 border-2 bg-white text-gray-800 focus:outline-none focus:border-blue-900 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-950">Número de Teléfono</label>
                                <input type="text" maxLength={9} placeholder="987654321" value={telefono}
                                    onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
                                    className="w-full rounded-xl px-4 py-2.5 mt-1 border-gray-300 border-2 bg-white text-gray-800 focus:outline-none focus:border-blue-900 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-950">Dirección (Opcional)</label>
                                <input type="text" placeholder="Av. Ejemplo 123" value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    className="w-full rounded-xl px-4 py-2.5 mt-1 border-gray-300 border-2 bg-white text-gray-800 focus:outline-none focus:border-blue-900 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-950">DNI</label>
                                <input type="text" maxLength={8} value={dni}
                                    onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                                    className="w-full rounded-xl px-4 py-2.5 mt-1 border-gray-300 border-2 bg-white text-gray-800 focus:outline-none focus:border-blue-900 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-950">Correo Electrónico</label>
                                <input type="email" placeholder="ejemplo@correo.com" value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    className="w-full rounded-xl px-4 py-2.5 mt-1 border-gray-300 border-2 bg-white text-gray-800 focus:outline-none focus:border-blue-900 text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-950">Contraseña</label>
                                <input type="password" placeholder="*******" value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl px-4 py-2.5 mt-1 border-gray-300 border-2 bg-white text-gray-800 focus:outline-none focus:border-blue-900 text-sm" />
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
                                    {error}
                                </div>
                            )}

                            <button onClick={handleEnviarOtp} disabled={cargando}
                                className="bg-blue-900 hover:bg-blue-950 disabled:bg-blue-300 text-white w-full py-3 mt-4 rounded-xl font-black uppercase tracking-wider text-xs shadow-md transition-colors cursor-pointer">
                                {cargando ? "Enviando código..." : "Verificar correo y continuar"}
                            </button>

                            <p className="text-center mt-6 text-sm text-gray-500 font-medium">
                                ¿Ya tienes una cuenta?{" "}
                                <a href="/login" className="text-blue-900 font-bold hover:underline">Inicia Sesión</a>
                            </p>
                        </div>
                    </>
                )}

                {/* ── PASO 2: Verificación OTP ── */}
                {paso === PASO.OTP && (
                    <>
                        <button onClick={() => { setPaso(PASO.DATOS); setError(""); setOtp("") }}
                            className="flex gap-2 items-center cursor-pointer text-blue-900 hover:text-blue-950 font-bold text-sm mb-6">
                            <span className="font-mono text-lg">‹</span> Cambiar correo
                        </button>

                        <h1 className="text-3xl font-black text-blue-950">Verifica tu correo</h1>
                        <p className="text-gray-500 text-sm mt-2 leading-relaxed">{mensajeOtp}</p>

                        <div className="pt-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold text-blue-950 mb-1">
                                    Código de verificación
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    className="w-full rounded-xl px-4 py-3 border-gray-300 border-2 bg-white text-gray-800 focus:outline-none focus:border-blue-900 text-center text-2xl font-black tracking-[0.5em]"
                                />
                                <p className="text-xs text-gray-400 mt-2 text-center">
                                    Revisa tu bandeja de entrada y carpeta de spam. Expira en 5 minutos.
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
                                    {error}
                                </div>
                            )}

                            <button onClick={handleVerificarYRegistrar} disabled={cargando || otp.length !== 6}
                                className="bg-blue-900 hover:bg-blue-950 disabled:bg-blue-300 text-white w-full py-3 mt-2 rounded-xl font-black uppercase tracking-wider text-xs shadow-md transition-colors">
                                {cargando ? "Creando cuenta..." : "Confirmar y crear cuenta"}
                            </button>

                            <button onClick={handleEnviarOtp} disabled={cargando}
                                className="text-blue-900 hover:underline text-xs font-bold text-center disabled:opacity-50">
                                ¿No llegó el código? Reenviar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}