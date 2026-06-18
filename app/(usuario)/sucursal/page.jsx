import Image from "next/image"
import { FaMapMarkerAlt, FaClock, FaInfoCircle } from "react-icons/fa"

export const metadata = {
    title: "Sucursal — Tienda Mass",
    description: "Encuéntranos en Los Olivos, Lima. Horario de atención y ubicación.",
}

export default function SucursalPage() {
    return (
        <div className="min-h-screen bg-white">

            {/* Hero — imagen de fondo */}
            <div className="relative w-full h-56 sm:h-72 md:h-80 overflow-hidden">
                <Image
                    src="/fondo.webp"
                    alt="Tienda Mass — Encuéntrame en estas ciudades"
                    fill
                    className="object-cover object-center"
                    priority
                />
            </div>

            {/* Contenido principal */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Título de sección */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-black text-blue-950 uppercase tracking-tight">
                        Nuestra Sucursal
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 font-medium">
                        Tienda Mass — Los Olivos, Lima
                    </p>
                    <div className="mt-3 h-1 w-16 rounded-full bg-yellow-400" />
                </div>

                {/* Grid: info + mapa */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                    {/* Info de la tienda */}
                    <div className="space-y-4">

                        {/* Ubicación */}
                        <div className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                                <FaMapMarkerAlt className="text-blue-950" size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-blue-950 uppercase tracking-wider mb-1">
                                    Dirección
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    Av. Universitaria Norte, Los Olivos
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Referencia: detrás de la UTP, Lima
                                </p>
                            </div>
                        </div>

                        {/* Referencia */}
                        <div className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                                <FaInfoCircle className="text-blue-950" size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-black text-blue-950 uppercase tracking-wider mb-1">
                                    Referencia
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    A una cuadra del cruce con Av. Carlos Izaguirre
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Frente al paradero Los Olivos — fácil acceso en bus y mototaxi
                                </p>
                            </div>
                        </div>

                        {/* Horario */}
                        <div className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50">
                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                                <FaClock className="text-blue-950" size={18} />
                            </div>
                            <div className="w-full">
                                <p className="text-xs font-black text-blue-950 uppercase tracking-wider mb-2">
                                    Horario de atención
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-gray-800">
                                        Lunes — Domingo
                                    </p>
                                    <span className="text-sm font-black text-blue-950 bg-yellow-400 px-3 py-0.5 rounded-full">
                                        8:00 am – 10:00 pm
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                                    <p className="text-xs text-green-700 font-semibold">
                                        Abierto todos los días, incluidos feriados
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Mapa */}
                    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-80 lg:h-full min-h-72">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d690.0094479408309!2d-77.0733742269934!3d-11.954906210475272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105cf1d9c70cca1%3A0xdceee71720b65ffe!2sTienda%20Mass!5e0!3m2!1ses-419!2spe!4v1781786589753!5m2!1ses-419!2spe"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                </div>

                {/* Link a Google Maps */}
                <div className="mt-6 text-center">
                    <a
                        href="https://maps.google.com/?q=Tienda+Mass+Los+Olivos+Lima"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-950 text-yellow-400 text-sm font-black uppercase tracking-wide rounded-full hover:bg-blue-900 transition-colors"
                    >
                        <FaMapMarkerAlt size={14} />
                        Abrir en Google Maps
                    </a>
                </div>

            </div>
        </div>
    )
}