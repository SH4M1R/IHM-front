"use client"

import { HiTruck, HiCheckCircle, HiArchiveBox, HiCreditCard } from "react-icons/hi2"

const ESTADOS = {
  pagado: {
    label: "Pagado",
    color: "bg-blue-50 text-blue-700 border border-blue-200",
    icon: <HiCreditCard className="w-4 h-4" />,
  },
  alistando: {
    label: "Alistando",
    color: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: <HiArchiveBox className="w-4 h-4" />,
  },
  en_camino: {
    label: "En camino",
    color: "bg-orange-50 text-orange-700 border border-orange-200",
    icon: <HiTruck className="w-4 h-4" />,
  },
  entregado: {
    label: "Entregado",
    color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: <HiCheckCircle className="w-4 h-4" />,
  },
}

export default function BadgeEstado({ estado }) {
  const e = ESTADOS[estado]

  if (!e) {
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center bg-gray-100 text-gray-600">
        {estado}
      </span>
    )
  }

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex gap-1 items-center ${e.color}`}>
      {e.icon}
      {e.label}
    </span>
  )
}