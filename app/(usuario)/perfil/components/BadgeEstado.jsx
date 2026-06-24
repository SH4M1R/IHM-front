"use client"

import {
  HiArchiveBox,
  HiCheckCircle,
  HiCreditCard,
  HiTruck,
} from "react-icons/hi2"

const ESTADOS = {
  pagado: {
    label: "Pagado",
    color: "bg-blue-100 text-blue-700",
    icon: <HiCreditCard className="w-3.5 h-3.5" />,
  },
  alistando: {
    label: "Alistando",
    color: "bg-yellow-100 text-yellow-700",
    icon: <HiArchiveBox className="w-3.5 h-3.5" />,
  },
  en_camino: {
    label: "En camino",
    color: "bg-orange-100 text-orange-700",
    icon: <HiTruck className="w-3.5 h-3.5" />,
  },
  entregado: {
    label: "Entregado",
    color: "bg-green-100 text-green-700",
    icon: <HiCheckCircle className="w-3.5 h-3.5" />,
  },
}

export default function BadgeEstado({ estado }) {
  const e =
    ESTADOS[estado] || {
      label: estado,
      color: "bg-gray-100 text-gray-600",
      icon: null,
    }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${e.color}`}
    >
      {e.icon}
      {e.label}
    </span>
  )
}