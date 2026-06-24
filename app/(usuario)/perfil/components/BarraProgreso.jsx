"use client"

const PASOS = [
  "pagado",
  "alistando",
  "en_camino",
  "entregado",
]

export default function BarraProgreso({ estado }) {
  const idx = PASOS.indexOf(estado)

  return (
    <div className="flex items-center gap-1 mt-3">
      {PASOS.map((paso, i) => (
        <div
          key={paso}
          className={`h-1.5 w-full rounded-full ${
            i <= idx
              ? "bg-blue-950"
              : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  )
}