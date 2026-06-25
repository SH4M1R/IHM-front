"use client"

import { useEffect, useState } from "react"
import { HiShoppingBag, HiOutlineArchiveBox, HiChevronDown, HiChevronUp } from "react-icons/hi2"
import BadgeEstado from "./BadgeEstado"
import BarraProgreso from "./BarraProgreso"

export default function PedidosSection({ api, idUsuario }) {
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [pedidoAbierto, setPedidoAbierto] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await fetch(`${api}/ventas/usuario/${idUsuario}`)
        if (res.ok) {
            const data = await res.json()
          console.log("detalles muestra:", data[0]?.detalles)
          setVentas(data.reverse())
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

  const toggleDetalles = (idVenta) => {
    setPedidoAbierto(pedidoAbierto === idVenta ? null : idVenta)
  }

  if (cargando) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (ventas.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-150 shadow-sm">
        <HiShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm font-medium">Aún no tienes pedidos registrados</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {ventas.map((venta) => {
        const esAbierto = pedidoAbierto === venta.idVenta

        return (
          <div
            key={venta.idVenta}
            className="bg-white rounded-xl overflow-hidden border border-gray-200/80 shadow-sm flex flex-col transition-all"
          >
            {/* Cabecera superior resumen del pedido */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                <span className="text-blue-950 font-black">Pedido #{venta.idVenta}</span>
                <span>•</span>
                <span>
                  {new Date(venta.fecha).toLocaleDateString("es-PE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </span>
              </div>
              <BadgeEstado estado={venta.estado} />
            </div>

            {/* Vista colapsable de productos */}
            {esAbierto && (
              <div className="p-5 flex flex-col gap-4 bg-white border-b border-gray-100 animate-fadeIn">
                <div className="flex flex-col gap-3.5">
                  {venta.detalles?.map((detalle, index) => {
                    const cantidad = Number(detalle.cantidad || 0)
                    const subtotal = Number(detalle.subtotal || 0)
                    const precio = cantidad > 0 ? subtotal / cantidad : 0

                    return (
                      <div key={index} className="flex gap-4 items-center justify-between py-1 border-b border-gray-50 last:border-none">
                        <div className="flex gap-3 items-center min-w-0">
                          <div className="w-10 h-10 bg-gray-150/60 rounded-lg shrink-0 flex items-center justify-center border border-gray-200/40">
                            <HiOutlineArchiveBox className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-gray-950 text-xs sm:text-sm font-bold truncate">
                              {detalle.producto?.nombre || `Producto #${detalle.idProducto}`}
                            </h4>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">Cantidad: {cantidad}</p>
                          </div>
                        </div>
                        <span className="text-sm font-black text-blue-950 shrink-0">
                          S/ {subtotal.toFixed(2)}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Barra de Progreso Interna */}
                <div className="mt-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <BarraProgreso estado={venta.estado} />
                </div>

                {venta.estado?.toLowerCase() === "entregado" && venta.evidencia && (
                  <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-xs font-black text-yellow-700 uppercase tracking-wide mb-2">
                      Foto de entrega
                    </p>
                    <img
                      src={venta.evidencia}
                      alt="Evidencia de entrega"
                      className="w-full max-h-56 object-contain rounded-lg border border-yellow-300"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Fila de control inferior */}
            <div className="px-5 py-3.5 bg-white flex items-center justify-between gap-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total:</span>
                <span className="text-lg font-black text-blue-950">
                  S/ {Number(venta.total || 0).toFixed(2)}
                </span>
              </div>

              {/* Botón único de alternancia */}
              <button
                onClick={() => toggleDetalles(venta.idVenta)}
                className="px-5 py-2 border-2 border-gray-200 hover:border-blue-950 hover:bg-gray-50 text-blue-950 text-xs font-black rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {esAbierto ? (
                  <>
                    Ocultar detalles
                    <HiChevronUp className="w-3.5 h-3.5 stroke-[2]" />
                  </>
                ) : (
                  <>
                    Ver detalles
                    <HiChevronDown className="w-3.5 h-3.5 stroke-[2]" />
                  </>
                )}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}