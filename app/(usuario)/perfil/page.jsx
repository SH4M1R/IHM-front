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

    const id =
      usuario?.idUsuario ||
      usuario?.id ||
      usuario?.idEmpleado

    setIdUsuario(id)
  }, [])

  const tabs = [
    {
      key: "perfil",
      label: "Mi perfil",
      icon: <HiUser className="w-4 h-4" />,
    },
    {
      key: "pedidos",
      label: "Mis pedidos",
      icon: <HiShoppingBag className="w-4 h-4" />,
    },
  ]

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-black text-blue-950 mb-1">
        Mi cuenta
      </h1>

      <p className="text-gray-500 text-sm mb-6">
        Gestiona tu perfil y revisa tus pedidos
      </p>

      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              tab === t.key
                ? "bg-white text-blue-950 shadow-sm"
                : "text-gray-500 hover:text-blue-950"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "perfil" && (
        <PerfilForm api={api} />
      )}

      {tab === "pedidos" &&
        (idUsuario ? (
          <PedidosSection
            api={api}
            idUsuario={idUsuario}
          />
        ) : (
          <p className="text-center py-10 text-xs text-gray-400">
            No se pudo validar el identificador de tu cuenta.
          </p>
        ))}
    </div>
  )
}