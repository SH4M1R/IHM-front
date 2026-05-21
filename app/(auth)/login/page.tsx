"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"
import { IoMdReturnLeft } from "react-icons/io"

export default function Login() {
    const router = useRouter()
    const [correo, setCorreo] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async () => {
        const res = await fetch("http://localhost:5000/api/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, password })
        })

        if (res.ok) {
            const usuario = await res.json()
            localStorage.setItem("usuario", JSON.stringify(usuario))
            router.push("/")
        } else if (res.status === 401) {
            setError("Correo o contraseña incorrectos. ¿No tienes cuenta?")
        } else {
            setError("Ocurrió un error, intenta de nuevo")
        }
    }

    return (
        <div className="flex min-h-screen">
            <div className="w-3/5 bg-amber-300 flex flex-col items-center justify-center gap-6 p-10">
                <Image src="/login/loginBanner.png" alt="Login Illustration" width={600} height={400} className="border-amber-400 border-10 rounded-3xl" />
                <h1 className="font-black text-4xl">¡Ahorro que rinde más!</h1>
                <p className="font-medium text-lg">Únete a la familia Mass y descubre ofertas exclusivas todos los días cerca de ti.</p>
            </div>

            <div className="w-2/5 bg-gray-50 px-20 py-30">
                <a href="/" className="flex gap-2 items-center cursor-pointer hover:text-red-700">
                    <IoMdReturnLeft />
                    <p>Regresar al inicio</p>
                </a>

                <h1 className="text-4xl font-bold">Bienvenido</h1>
                <p className="text-gray-600 pt-4 text-lg">Ingresa tus credenciales para continuar comprando.</p>

                <div className="pt-8">
                    <div>
                        <label className="block text-lg text-gray-500">Correo Electrónico</label>
                        <input type="email" placeholder="ejemplo@correo.com"
                            onChange={(e) => setCorreo(e.target.value)}
                            className="w-full rounded-lg px-4 py-3 mt-2 border-gray-500 border-2 focus:outline-none" />
                    </div>
                    <div className="mt-5">
                        <label className="block text-lg text-gray-500">Contraseña</label>
                        <input type="password" placeholder="*******"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg px-4 py-3 mt-2 border-gray-500 border-2 focus:outline-none" />
                    </div>

                    <a href="" className="text-red-700 hover:underline flex justify-end">¿Olvidaste tu contraseña?</a>

                    {error && (
                        <div className="mt-4 text-red-600 text-sm text-center">
                            <p>{error}</p>
                            <a href="/register" className="underline font-semibold">Regístrate aquí</a>
                        </div>
                    )}

                    <button onClick={handleLogin}
                        className="bg-red-700 text-white w-full py-3 mt-6 rounded-xl hover:bg-red-600 transition-colors duration-300 cursor-pointer">
                        Iniciar Sesión
                    </button>

                    <div className="flex items-center gap-4 mt-6">
                        <button className="flex justify-center items-center gap-2 border-2 border-gray-300 rounded-lg px-4 py-2 w-full cursor-pointer">
                            <FcGoogle />Google
                        </button>
                        <button className="w-full flex justify-center items-center gap-2 border-2 border-gray-300 rounded-lg px-4 py-2 cursor-pointer">
                            <FaFacebook />Facebook
                        </button>
                    </div>

                    <p className="text-center mt-9 text-gray-500">¿No tienes una cuenta? <a href="/register" className="text-red-700 hover:underline">Regístrate aquí</a></p>
                </div>
            </div>
        </div>
    )
}