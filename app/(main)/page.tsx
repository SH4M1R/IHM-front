import { RiShoppingBasket2Line, RiWaterPercentLine } from "react-icons/ri";
import { MdCleaningServices, MdFaceRetouchingNatural } from "react-icons/md";

import CardCategoriaHome from "../components/CardCategoriaHome";

const categorias = [
  { icon: RiShoppingBasket2Line, label: "Abarrotes", bgColor: "bg-red-100", iconColor: "text-red-800" },
  { icon: RiWaterPercentLine, label: "Bebidas", bgColor: "bg-blue-100", iconColor: "text-blue-800" },
  { icon: MdCleaningServices, label: "Limpieza", bgColor: "bg-blue-100", iconColor: "text-blue-800" },
  { icon: MdFaceRetouchingNatural, label: "Cuidado Personal", bgColor: "bg-grey-100", iconColor: "text-grey-800" },
]
export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-6">

      {/* Hero banner */}
      <section
        className="relative w-full h-96 rounded-2xl overflow-hidden"
        style={{
          backgroundImage: "url('/banner.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center 50%"
        }}
      >
        <div className="absolute inset-0 bg-black/50 rounded-2xl" />
        <div className="relative z-10 flex flex-col justify-center h-full px-10 gap-3">
          <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full w-fit">
            OFERTA EXCLUSIVA
          </span>
          <h1 className="text-white text-4xl font-bold">Combo Mass Dog</h1>
          <p className="text-white/80 text-sm max-w-sm">
            Lleva 2 Hot Dogs + Gaseosa 500ml por solo S/ 5.90. ¡Ideal para tu antojo rápido!
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-6 py-3 rounded-lg w-fit tracking-widest">
            APROVECHAR OFERTA →
          </button>
        </div>
      </section>

      {/* Categorias */}
      <div className="mt-5">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-3xl">Explorar por categorias</h2>
          <a href="/" className="text-blue-500 hover:underline">Ver todas</a>
        </div>
        <div className="grid grid-cols-4 gap-4 items-start mt-4">
          {categorias.map((cat) => (
            <CardCategoriaHome
              key={cat.label}
              icon={cat.icon}
              label={cat.label}
              bgColor={cat.bgColor}
              iconColor={cat.iconColor}
            />
          ))}
        </div>
      </div>

    </div>
  )
}