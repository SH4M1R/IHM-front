"use client"

import { useState } from "react"
import { HiMapPin, HiChevronRight, HiUser, HiPhone } from "react-icons/hi2"
import BadgeEstado from "./BadgeEstado"
import EvidenciaModal from "./EvidenciaModal"

const ESTADOS = ["pagado", "alistando", "en_camino", "entregado"]

export default function EntregaCard({ venta, api, recargar }) {
  const [actualizando, setActualizando] = useState(false)
  const [modal, setModal] = useState(false)

  const siguienteEstado = () => {
    const idx = ESTADOS.indexOf(venta.estado)
    if (idx === -1 || idx === ESTADOS.length - 1) return null
    return ESTADOS[idx + 1]
  }

  const iniciarTracking = (idVenta) => {
    if (!navigator.geolocation) {
      console.error("Geolocalización no soportada por este navegador.")
      return
    }

    navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          await fetch(`${api}/ventas/${idVenta}/ubicacion`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitud: latitude, longitud: longitude }),
          })
        } catch (error) {
          console.error("Error enviando coordenadas:", error)
        }
      },
      (error) => console.error("Error de geolocalización:", error),
      { enableHighAccuracy: true }
    )
  }

  const cambiarEstado = async () => {
    const siguiente = siguienteEstado()
    if (!siguiente) return

    if (siguiente === "entregado") {
      setModal(true)
      return
    }

    setActualizando(true)

    if (siguiente === "en_camino") {
      iniciarTracking(venta.idVenta)
    }

    try {
      const res = await fetch(`${api}/ventas/${venta.idVenta}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: siguiente }),
      })

      if (!res.ok) {
        const error = await res.text()
        console.error("Error al actualizar estado:", error)
      }

      await recargar()
    } catch (e) {
      console.error("Error de red:", e)
    } finally {
      setActualizando(false)
    }
  }

  const confirmarEntrega = async (base64) => {
    setActualizando(true)
    try {
      await fetch(`${api}/ventas/${venta.idVenta}/evidencia`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ evidencia: base64 }),
      })

      await fetch(`${api}/ventas/${venta.idVenta}/estado`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "entregado" }),
      })
    } catch (e) {
      console.error(e)
    } finally {
      setModal(false)
      await recargar()
      setActualizando(false)
    }
  }

  const verEnMaps = () => {
    const direccion = venta.usuario?.direccion
    if (!direccion) return
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`
    window.open(url, "_blank")
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-4 sm:p-5 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="space-y-1.5 w-full sm:max-w-[70%]">
            {/* ID de Pedido */}
            <p className="font-black text-blue-950 text-base sm:text-lg">
              Pedido #{venta.idVenta}
            </p>
            
            {/* Nombre del Cliente */}
            <div className="flex items-center gap-1.5 text-gray-800 font-bold text-sm sm:text-base">
              <HiUser className="text-gray-400 text-base shrink-0" />
              <span>{venta.usuario?.nombre || "Cliente no registrado"}</span>

              <HiPhone className="text-gray-400 text-base shrink-0" />
              <span>{venta.usuario?.telefono || "Número no registrado"}</span>
            </div>

            {/* Dirección */}
            <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed pl-5">
              {venta.usuario?.direccion || "Dirección no registrada"}
            </p>
          </div>

          {/* Badge del Estado */}
          <div className="self-start sm:self-auto shrink-0">
            <BadgeEstado estado={venta.estado} />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          <button
            onClick={verEnMaps}
            disabled={!venta.usuario?.direccion}
            className="w-full sm:flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl py-2.5 text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
          >
            <HiMapPin className="text-lg text-red-500" />
            Ver ubicación
          </button>

          {siguienteEstado() && (
            <button
              disabled={actualizando}
              onClick={cambiarEstado}
              className="w-full sm:flex-1 bg-blue-950 hover:bg-blue-900 text-white rounded-xl py-2.5 text-sm font-bold flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            >
              {actualizando ? "Procesando..." : "Avanzar"}
              <HiChevronRight />
            </button>
          )}
        </div>
      </div>

      <EvidenciaModal
        open={modal}
        onClose={() => setModal(false)}
        onConfirm={confirmarEntrega}
      />
    </>
  )
}