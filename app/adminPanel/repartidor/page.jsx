"use client"

import { useEffect, useState } from "react"
import { HiExclamationTriangle } from "react-icons/hi2"

import FiltroEstados from "./components/FiltroEstados"
import EntregaCard from "./components/EntregaCard"

export default function RepartidorPanel() {
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorSesion, setErrorSesion] = useState(false)
  const [filtro, setFiltro] = useState("todos")

  const api = process.env.NEXT_PUBLIC_API

  const cargarVentas = async () => {
    try {
      const empleadoStorage = localStorage.getItem("empleado")

      if (!empleadoStorage) {
        setErrorSesion(true)
        return
      }

      const empleado = JSON.parse(empleadoStorage)

      const res = await fetch(
        `${api}/ventas/empleado/${empleado.idEmpleado}`
      )

      if (res.ok) {
        setVentas(await res.json())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarVentas()
  }, [])

  const ventasFiltradas =
    filtro === "todos"
      ? ventas
      : ventas.filter((v) => v.estado === filtro)

  if (cargando)
    return (
      <div className="flex justify-center items-center h-[70vh] px-4">
        <div className="w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin" />
      </div>
    )

  if (errorSesion)
    return (
      <div className="max-w-md mx-4 sm:mx-auto my-10 sm:my-20 p-6 bg-white rounded-2xl shadow text-center">
        <HiExclamationTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="font-black text-blue-950 text-xl sm:text-2xl">
          Sesión no detectada
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Por favor, inicia sesión para ver tus entregas.
        </p>
      </div>
    )

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      {/* Título adaptable */}
      <h1 className="text-2xl md:text-3xl font-black text-blue-950 mb-4 md:mb-6">
        Mis entregas
      </h1>

      {/* Contenedor de filtros (asegúrate de que dentro de FiltroEstados manejes flex-wrap u overflow-x-auto si son muchos botones) */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
        <FiltroEstados filtro={filtro} setFiltro={setFiltro} />
      </div>

      {/* Lista de tarjetas responsiva */}
      {ventasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 w-full">
          {ventasFiltradas.map((venta) => (
            <EntregaCard
              key={venta.idVenta}
              venta={venta}
              api={api}
              recargar={cargarVentas}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 my-8">
          No hay entregas en este estado.
        </p>
      )}
    </div>
  )
}