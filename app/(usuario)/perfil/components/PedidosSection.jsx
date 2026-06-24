"use client"

import { useEffect, useState } from "react"
import { HiShoppingBag } from "react-icons/hi2"
import BadgeEstado from "./BadgeEstado"
import BarraProgreso from "./BarraProgreso"

export default function PedidosSection({ api, idUsuario }) {
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [abierto, setAbierto] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${api}/ventas/usuario/${idUsuario}`)
        if (res.ok) {
          const data = await res.json()
          setVentas(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setCargando(false)
      }
    }

    if (idUsuario) {
      cargar()
    }
  }, [api, idUsuario])

  if (cargando) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (ventas.length === 0) {
    return (
      <div className="text-center py-16">
        <HiShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400 text-sm font-medium">
          Aún no tienes pedidos
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-full">
      {ventas.map((venta) => (
        <div
          key={venta.idVenta}
          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
        >
          {/* Encabezado del Pedido */}
          <button
            onClick={() =>
              setAbierto(abierto === venta.idVenta ? null : venta.idVenta)
            }
            className="w-full text-left px-4 sm:px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors"
          >
            <div className="space-y-1 w-[70%]">
              <p className="text-xs text-gray-400">
                Pedido #{venta.idVenta} ·{" "}
                {new Date(venta.fecha).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>

              <p className="font-black text-blue-950 text-base sm:text-lg">
                S/ {Number(venta.total || 0).toFixed(2)}
              </p>

              <div className="pt-1">
                <BarraProgreso estado={venta.estado} />
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 ml-2 shrink-0">
              <BadgeEstado estado={venta.estado} />
              <span className="text-gray-400 text-xs font-bold">
                {abierto === venta.idVenta ? "▲ Ocultar" : "▼ Detalles"}
              </span>
            </div>
          </button>

          {/* Contenido Desplegable (Detalles de Productos) */}
          {abierto === venta.idVenta && venta.detalles?.length > 0 && (
            <div className="border-t border-gray-100 px-4 sm:px-5 py-4 bg-gray-50/30">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Productos comprados
                </p>

                {venta.detalles.map((detalle, index) => {
                  const precio = Number(detalle.precioUnitario || detalle.precio || 0)
                  const cantidad = Number(detalle.cantidad || 0)
                  const subtotal = precio * cantidad

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-start sm:items-center text-sm py-2 border-b border-gray-100 last:border-0 gap-4"
                    >
                      <span className="text-blue-950 font-medium text-xs sm:text-sm">
                        {detalle.producto?.nombre || `Producto #${detalle.idProducto}`}
                      </span>

                      <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                        {/* Se muestra la cantidad y el subtotal calculado */}
                        x{cantidad} ·{" "}
                        <span className="font-bold text-blue-950">
                          S/ {subtotal.toFixed(2)}
                        </span>
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}