"use client"

import { useEffect, useState } from "react"
import { HiUser, HiShoppingBag } from "react-icons/hi2"
import PerfilForm from "./components/PerfilForm"
import PedidosSection from "./components/PedidosSection"

export default function Perfil() {
  const [tab, setTab] = useState("perfil")
  const [idUsuario, setIdUsuario] = useState(null)

  const api = process.env.NEXT_PUBLIC_API

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}")
    const id = usuario?.idUsuario || usuario?.id || usuario?.idEmpleado
    setIdUsuario(id)
  }, [])

  const tabs = [
    {
      key: "perfil",
      label: "Mi perfil",
      icon: <HiUser className="w-5 h-5" />,
    },
    {
      key: "pedidos",
      label: "Mis pedidos",
      icon: <HiShoppingBag className="w-5 h-5" />,
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-[70vh]">
      {/* Título de la sección */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-blue-950 tracking-tight">
          Mi cuenta
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Gestiona tu perfil y revisa el historial de tus pedidos
        </p>
      </div>

      {/* Distribución en dos columnas adaptables (Estilo Escritorio E-commerce) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Barra lateral de navegación */}
        <div className="flex flex-col gap-1 bg-gray-50 rounded-2xl p-2 border border-gray-200/50 md:col-span-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                tab === t.key
                  ? "bg-blue-950 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200/50 hover:text-blue-950"
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Columna de contenido principal */}
        <div className="md:col-span-3 w-full">
          {tab === "perfil" && (
            <div className="bg-white border border-gray-150 rounded-2xl shadow-sm">
              <PerfilForm api={api} />
            </div>
          )}

          {tab === "pedidos" &&
            (idUsuario ? (
              <PedidosSection api={api} idUsuario={idUsuario} />
            ) : (
              <div className="bg-white border border-gray-150 rounded-2xl p-10 text-center">
                <p className="text-sm text-gray-400">
                  No se pudo validar el identificador de tu cuenta.
                </p>
              </div>
            ))}
        </div>

      </div>
    </div>
  )
}