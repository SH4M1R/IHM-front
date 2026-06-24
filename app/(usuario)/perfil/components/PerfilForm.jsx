"use client"

import { useEffect, useState } from "react"
import { HiMapPin } from "react-icons/hi2"

export default function PerfilForm({ api }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    direccion: "",
    correo: "",
    password: "",
  })

  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState("")
  const [cargandoUbicacion, setCargandoUbicacion] =
    useState(false)

  useEffect(() => {
    const usuario = JSON.parse(
      localStorage.getItem("usuario") || "{}"
    )

    setForm({
      nombre: usuario.nombre || "",
      apellido: usuario.apellido || "",
      dni: usuario.dni || "",
      telefono: usuario.telefono || "",
      direccion: usuario.direccion || "",
      correo: usuario.correo || "",
      password: "",
    })
  }, [])

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.")
      return
    }

    setCargandoUbicacion(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } =
            position.coords

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )

          const data = await res.json()

          setForm((prev) => ({
            ...prev,
            direccion: data.display_name || "",
          }))
        } catch (error) {
          console.error(error)
        } finally {
          setCargandoUbicacion(false)
        }
      },
      () => {
        alert("No se pudo obtener la ubicación.")
        setCargandoUbicacion(false)
      }
    )
  }

  const handleSave = async () => {
    setError("")

    const usuario = JSON.parse(
      localStorage.getItem("usuario") || "{}"
    )

    const body = {
      ...form,
      dni: parseInt(form.dni),
    }

    if (!body.password) {
      delete body.password
    }

    const res = await fetch(
      `${api}/usuarios/${usuario.idUsuario}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    if (res.ok) {
      const updated = await res.json()

      localStorage.setItem(
        "usuario",
        JSON.stringify(updated)
      )

      setGuardado(true)

      setTimeout(() => {
        setGuardado(false)
      }, 2500)
    } else {
      setError("Error al guardar los cambios.")
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <input
        placeholder="Nombre"
        value={form.nombre}
        onChange={(e) =>
          setForm({
            ...form,
            nombre: e.target.value,
          })
        }
        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5"
      />

      <input
        placeholder="Apellido"
        value={form.apellido}
        onChange={(e) =>
          setForm({
            ...form,
            apellido: e.target.value,
          })
        }
        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5"
      />

      <input
        placeholder="DNI"
        value={form.dni}
        onChange={(e) =>
          setForm({
            ...form,
            dni: e.target.value,
          })
        }
        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5"
      />

      <input
        placeholder="Teléfono"
        maxLength={9}
        value={form.telefono}
        onChange={(e) =>
          setForm({
            ...form,
            telefono: e.target.value.replace(
              /\D/g,
              ""
            ),
          })
        }
        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5"
      />

      <div>
        <div className="flex gap-2">
          <input
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) =>
              setForm({
                ...form,
                direccion: e.target.value,
              })
            }
            className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2.5"
          />

          <button
            type="button"
            onClick={obtenerUbicacion}
            className="px-4 rounded-xl bg-yellow-400 hover:bg-yellow-500 cursor-pointer"
          >
            <HiMapPin />
          </button>
        </div>

        {cargandoUbicacion && (
          <p className="text-xs text-blue-900 mt-1">
            Obteniendo ubicación...
          </p>
        )}
      </div>

      <input
        type="email"
        placeholder="Correo"
        value={form.correo}
        onChange={(e) =>
          setForm({
            ...form,
            correo: e.target.value,
          })
        }
        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5"
      />

      <input
        type="password"
        placeholder="Nueva contraseña"
        value={form.password}
        onChange={(e) =>
          setForm({
            ...form,
            password: e.target.value,
          })
        }
        className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5"
      />

      {guardado && (
        <p className="text-green-600 text-center text-sm">
          ✓ Cambios guardados
        </p>
      )}

      {error && (
        <p className="text-red-500 text-center text-sm">
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        className="bg-blue-950 text-white py-3 rounded-xl font-bold hover:bg-blue-900 cursor-pointer"
      >
        Guardar cambios
      </button>
    </div>
  )
}