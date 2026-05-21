"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { IoMdReturnLeft } from "react-icons/io"

export default function Register() {
    const router = useRouter()
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [dni, setDni] = useState("")
    const [correo, setCorreo] = useState("")
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")

    const handleRegistro = async () => {
        const res = await fetch("http://localhost:5000/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, apellido, dni, correo, password })
        })

        if (res.ok) {
            router.push("/login")
        } else {
            setError("Error al registrar, intenta de nuevo")
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

                <h1 className="text-4xl font-bold">Crea una cuenta</h1>
                <p className="text-gray-600 pt-4 text-lg">Regístrate para empezar a comprar y ahorrar.</p>

                <div className="pt-8">
                    <div>
                        <label className="block text-lg text-gray-500">Nombre</label>
                        <input type="text" onChange={(e) => setNombre(e.target.value)}
                            className="w-full rounded-lg px-4 py-3 mt-2 border-gray-500 border-2 focus:outline-none" />
                    </div>
                    <div className="mt-5">
                        <label className="block text-lg text-gray-500">Apellido</label>
                        <input type="text" onChange={(e) => setApellido(e.target.value)}
                            className="w-full rounded-lg px-4 py-3 mt-2 border-gray-500 border-2 focus:outline-none" />
                    </div>
                    <div className="mt-5">
                        <label className="block text-lg text-gray-500">DNI</label>
                        <input type="text" onChange={(e) => setDni(e.target.value)}
                            className="w-full rounded-lg px-4 py-3 mt-2 border-gray-500 border-2 focus:outline-none" />
                    </div>
                    <div className="mt-5">
                        <label className="block text-lg text-gray-500">Correo Electrónico</label>
                        <input type="email" placeholder="ejemplo@correo.com" onChange={(e) => setCorreo(e.target.value)}
                            className="w-full rounded-lg px-4 py-3 mt-2 border-gray-500 border-2 focus:outline-none" />
                    </div>
                    <div className="mt-5">
                        <label className="block text-lg text-gray-500">Contraseña</label>
                        <input type="password" placeholder="*******" onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg px-4 py-3 mt-2 border-gray-500 border-2 focus:outline-none" />
                    </div>

                    {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}

                    <button onClick={handleRegistro}
                        className="bg-red-700 text-white w-full py-3 mt-8 rounded-xl hover:bg-red-600 transition-colors duration-300 cursor-pointer">
                        Crear Cuenta
                    </button>

                    <p className="text-center mt-9 text-gray-500">¿Ya tienes una cuenta? <a href="/login" className="text-red-700 hover:underline">Inicia Sesión</a></p>
                </div>
            </div>
        </div>
    )
}