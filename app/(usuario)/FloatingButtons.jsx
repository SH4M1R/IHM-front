"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { FaWhatsapp, FaTimes, FaPaperPlane } from "react-icons/fa"
import { BsRobot } from "react-icons/bs"
import { HiPlus, HiCheck } from "react-icons/hi2"
import { FiTrash2 } from "react-icons/fi"

const WHATSAPP_NUMBER = "51907845855"
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
const API = process.env.NEXT_PUBLIC_API
const STORAGE_KEY = "karen_messages"

// ─── Prompt de Karen (sin IA externa) ────────────────────────────────────────
function respuestaKaren(texto) {
    const t = texto.toLowerCase().trim()
    if (t.match(/(gracias|genial|perfecto|excelente)/))
        return "¡Con gusto! Si necesitas algo más, aquí estoy."
    return "Ok, pero ¿qué consulta tienes sobre los productos?"
}

// ─── Helpers API ──────────────────────────────────────────────────────────────
async function obtenerProductosCarrito(idCarrito) {
    try {
        const res = await fetch(`${API}/carritos/${idCarrito}`)
        if (!res.ok) return []
        const data = await res.json()
        return data.items?.map(i => i.producto?.nombre).filter(Boolean) || []
    } catch { return [] }
}

async function obtenerRecomendaciones(idUsuario, productosEnCarrito) {
    try {
        const res = await fetch(`${API}/ia/recomendar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUsuario, productosEnCarrito }),
        })
        if (!res.ok) return null
        return await res.json()
    } catch { return null }
}

// ─── Tarjeta producto recomendado ─────────────────────────────────────────────
function ProductoRecomendado({ nombre, precio, idProducto }) {
    const [agregando, setAgregando] = useState(false)
    const [agregado, setAgregado] = useState(false)

    const agregarAlCarrito = async () => {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "null")
        if (!usuario?.idCarrito || !idProducto) return
        setAgregando(true)
        try {
            const res = await fetch(`${API}/carritos/${usuario.idCarrito}/agregar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    producto: { idProducto: Number(idProducto) },
                    cantidad: 1
                })
            })
            if (!res.ok) throw new Error(`Error ${res.status}`)
            window.dispatchEvent(new CustomEvent("carritoActualizado", {
                detail: { desdeChat: true }
            }))
            setAgregado(true)
            setTimeout(() => setAgregado(false), 1500)
        } catch (e) {
            console.error("Error agregando desde chat:", e)
        } finally {
            setAgregando(false)
        }
    }

    return (
        <div className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
            <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-blue-950 truncate">{nombre}</p>
                {precio != null && (
                    <p className="text-[10px] text-gray-400 font-medium">S/ {Number(precio).toFixed(2)}</p>
                )}
            </div>
            <button
                onClick={agregarAlCarrito}
                disabled={agregando || agregado || !idProducto}
                title="Agregar al carrito"
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all border shadow-sm active:translate-y-0.5 disabled:cursor-not-allowed cursor-pointer
                    ${agregado
                        ? "bg-green-400 border-green-500 text-white"
                        : !idProducto
                            ? "bg-gray-200 border-gray-300 text-gray-400"
                            : "bg-yellow-400 hover:bg-yellow-500 border-yellow-500 text-blue-950"
                    }`}
            >
                {agregado ? <HiCheck className="w-3.5 h-3.5" /> : <HiPlus className="w-3.5 h-3.5" />}
            </button>
        </div>
    )
}

// ─── Opciones iniciales como checkboxes ──────────────────────────────────────
const OPCIONES = [
    { id: "carrito", label: "¿Qué combina con mi carrito?" },
    { id: "historial", label: "¿Recomiendas según mis compras?" },
]

function OpcionesIniciales({ onSeleccionar }) {
    return (
        <div className="flex flex-col gap-2 mt-2 w-full">
            {OPCIONES.map(op => (
                <button
                    key={op.id}
                    onClick={() => onSeleccionar(op)}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl border border-blue-100 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all group cursor-pointer"
                >
                    <span className="w-4 h-4 rounded border-2 border-blue-300 group-hover:border-blue-500 flex-shrink-0 flex items-center justify-center transition-colors">
                        <span className="w-2 h-2 rounded-sm bg-transparent group-hover:bg-blue-400 transition-colors" />
                    </span>
                    <span className="text-xs font-semibold text-blue-950">{op.label}</span>
                </button>
            ))}
        </div>
    )
}

// ─── Notificación estilo Facebook ─────────────────────────────────────────────
function NotificacionChat({ nombre, onAbrir, onCerrar }) {
    return (
        <div className="flex items-start gap-3 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 w-64">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                <BsRobot className="text-blue-950" size={18} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-blue-950 leading-tight">Karen · Asistente Mass</p>
                <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                    ¡Agregaste <strong className="text-blue-950">{nombre}</strong>! ¿Quieres ver qué más combina?
                </p>
                <button
                    onClick={onAbrir}
                    className="mt-2 text-[10px] font-black text-white bg-blue-950 px-3 py-1 rounded-full hover:bg-blue-900 transition-colors cursor-pointer"
                >
                    Ver recomendaciones
                </button>
            </div>
            <button onClick={onCerrar} className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer flex-shrink-0 mt-0.5">
                <FaTimes size={11} />
            </button>
        </div>
    )
}

// ─── Mensaje inicial ──────────────────────────────────────────────────────────
const MENSAJE_INICIAL = {
    from: "bot",
    text: "¡Hola! Soy Karen, tu asistente de Tienda Mass. ¿En qué puedo ayudarte hoy?",
    opciones: true,
    productos: null,
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function FloatingButtons() {
    const [chatOpen, setChatOpen] = useState(false)
    const [messages, setMessages] = useState(() => {
        if (typeof window !== "undefined") {
            try {
                const g = sessionStorage.getItem(STORAGE_KEY)
                if (g) return JSON.parse(g)
            } catch { }
        }
        return [MENSAJE_INICIAL]
    })
    const [input, setInput] = useState("")
    const [typing, setTyping] = useState(false)
    const [usuario, setUsuario] = useState(null)
    const [notif, setNotif] = useState(null)
    const bodyRef = useRef(null)
    const inputRef = useRef(null)
    const notifTimer = useRef(null)

    useEffect(() => {
        const data = localStorage.getItem("usuario")
        const rol = localStorage.getItem("rol")
        if (data && rol === "usuario") setUsuario(JSON.parse(data))
    }, [])

    useEffect(() => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
        }
    }, [messages])

    useEffect(() => {
        if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }, [messages, typing])

    useEffect(() => {
        if (chatOpen) setTimeout(() => inputRef.current?.focus(), 100)
    }, [chatOpen])

    const handleCarritoActualizado = useCallback((e) => {
        const desdeChat = e?.detail?.desdeChat || false
        const nombreProducto = e?.detail?.nombre || null
        if (desdeChat || !nombreProducto) return
        clearTimeout(notifTimer.current)
        setNotif({ nombre: nombreProducto })
        notifTimer.current = setTimeout(() => setNotif(null), 5000)
    }, [])

    useEffect(() => {
        window.addEventListener("carritoActualizado", handleCarritoActualizado)
        return () => window.removeEventListener("carritoActualizado", handleCarritoActualizado)
    }, [handleCarritoActualizado])

    const abrirChatDesdeNotif = () => {
        setNotif(null)
        setChatOpen(true)
    }

    const borrarHistorial = () => {
        setMessages([MENSAJE_INICIAL])
        sessionStorage.removeItem(STORAGE_KEY)
    }

    const agregarMensajeBot = (texto, productos = null, opciones = false) => {
        setMessages(prev => [...prev, { from: "bot", text: texto, productos, opciones }])
    }

    // ─── Al seleccionar un checkbox ───────────────────────────────────────────
    const handleOpcion = async (opcion) => {
        // Agregar mensaje del usuario con el label del checkbox
        setMessages(prev => [...prev, { from: "user", text: opcion.label, productos: null, opciones: false }])
        setTyping(true)
        await new Promise(r => setTimeout(r, 600))

        try {
            if (opcion.id === "carrito") {
                if (!usuario) {
                    setTyping(false)
                    agregarMensajeBot("Necesitas iniciar sesión para ver recomendaciones de tu carrito.")
                    return
                }
                const productosCarrito = await obtenerProductosCarrito(usuario.idCarrito)
                if (productosCarrito.length === 0) {
                    setTyping(false)
                    agregarMensajeBot("Tu carrito está vacío. Agrega productos primero y te diré qué combina bien.")
                    return
                }
                const recomendaciones = await obtenerRecomendaciones(usuario.idUsuario, productosCarrito)
                const porCarrito = recomendaciones?.porCarrito || []
                setTyping(false)
                if (porCarrito.length === 0) {
                    agregarMensajeBot("No encontré productos que combinen con tu carrito. Prueba agregar más productos.")
                } else {
                    agregarMensajeBot(
                        "Esto combina bien con tu carrito:",
                        porCarrito.map(r => ({
                            nombre: r.producto,
                            precio: r.precio ?? null,
                            idProducto: r.idProducto ?? null,
                        }))
                    )
                }

            } else if (opcion.id === "historial") {
                if (!usuario) {
                    setTyping(false)
                    agregarMensajeBot("Necesitas iniciar sesión para ver recomendaciones personalizadas. 😊")
                    return
                }
                const recomendaciones = await obtenerRecomendaciones(usuario.idUsuario, [])
                const personalizadas = recomendaciones?.personalizadas || []
                setTyping(false)
                if (personalizadas.length === 0) {
                    agregarMensajeBot("Aún no tengo suficiente historial tuyo. ¡Sigue comprando y aprenderé tus gustos! 😊")
                } else {
                    agregarMensajeBot(
                        "⭐ Basado en tus compras anteriores:",
                        personalizadas.map(r => ({
                            nombre: r.nombreProducto,
                            precio: r.precio ?? null,
                            idProducto: r.idProducto ?? null,
                        }))
                    )
                }
            }
        } catch {
            setTyping(false)
            agregarMensajeBot("Ocurrió un error. Intenta de nuevo o contáctanos por WhatsApp.")
        }
    }

    // ─── Enviar mensaje de texto libre ───────────────────────────────────────
    const sendMessage = async () => {
        const txt = input.trim()
        if (!txt) return

        setMessages(prev => [...prev, { from: "user", text: txt, productos: null, opciones: false }])
        setInput("")
        setTyping(true)

        const t = txt.toLowerCase()

        const quiereCarrito =
            t.includes("combina") || t.includes("junto") ||
            t.includes("carrito") || t.includes("complement") ||
            t.includes("agreg")

        const quiereHistorial =
            t.includes("historial") || t.includes("anterior") ||
            t.includes("compras") || t.includes("personaliz") ||
            (t.includes("recomien") && !t.includes("combina")) ||
            t.includes("suger")

        await new Promise(r => setTimeout(r, 600))

        try {
            if (quiereCarrito) {
                await handleOpcion({ id: "carrito", label: txt })
                setTyping(false)
            } else if (quiereHistorial) {
                await handleOpcion({ id: "historial", label: txt })
                setTyping(false)
            } else {
                setTyping(false)
                agregarMensajeBot(respuestaKaren(txt))
            }
        } catch {
            setTyping(false)
            agregarMensajeBot("Ocurrió un error. Intenta de nuevo o contáctanos por WhatsApp.")
        }
    }

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const renderTexto = (texto) => {
        return texto.split("\n").map((linea, i, arr) => {
            const partes = linea.split(/\*\*(.*?)\*\*/)
            return (
                <span key={i}>
                    {partes.map((parte, j) =>
                        j % 2 === 1 ? <strong key={j}>{parte}</strong> : <span key={j}>{parte}</span>
                    )}
                    {i < arr.length - 1 && <br />}
                </span>
            )
        })
    }

    return (
        <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3">

            {/* Notificación estilo Facebook */}
            {notif && !chatOpen && (
                <NotificacionChat
                    nombre={notif.nombre}
                    onAbrir={abrirChatDesdeNotif}
                    onCerrar={() => setNotif(null)}
                />
            )}

            {/* Chat panel */}
            {chatOpen && (
                <div className="w-72 sm:w-80 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl flex flex-col">

                    {/* Header */}
                    <div className="bg-blue-950 px-4 py-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                            <BsRobot className="text-blue-950" size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-black leading-tight truncate">Karen - Asistente Mass</p>
                            <span className="flex items-center gap-1.5 text-xs text-blue-300 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                                En línea
                            </span>
                        </div>
                        <button onClick={borrarHistorial} className="text-blue-300 hover:text-red-400 transition-colors p-1 cursor-pointer" title="Borrar historial">
                            <FiTrash2 size={14} />
                        </button>
                        <button onClick={() => setChatOpen(false)} className="text-blue-300 hover:text-white transition-colors p-1 cursor-pointer">
                            <FaTimes size={14} />
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div ref={bodyRef} className="flex flex-col gap-3 px-3 py-3 h-64 overflow-y-auto bg-gray-50">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex flex-col max-w-[92%] ${msg.from === "user" ? "self-end items-end" : "self-start items-start"}`}
                            >
                                {msg.from === "bot" && (
                                    <span className="text-[10px] font-black text-yellow-600 mb-1 px-1">Asistente Mass</span>
                                )}
                                <div className={`px-3 py-2 text-xs leading-relaxed ${
                                    msg.from === "user"
                                        ? "bg-blue-950 text-white rounded-2xl rounded-br-sm"
                                        : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm"
                                }`}>
                                    {msg.from === "bot" ? renderTexto(msg.text) : msg.text}
                                </div>

                                {/* Checkboxes solo en el primer mensaje */}
                                {msg.opciones && (
                                    <OpcionesIniciales onSeleccionar={handleOpcion} />
                                )}

                                {/* Tarjetas de productos */}
                                {msg.productos && msg.productos.length > 0 && (
                                    <div className="mt-2 flex flex-col gap-1.5 w-full">
                                        {msg.productos.map((p, j) => (
                                            <ProductoRecomendado key={j} nombre={p.nombre} precio={p.precio} idProducto={p.idProducto} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {typing && (
                            <div className="self-start flex items-center gap-1 px-3 py-2 bg-white border border-gray-100 rounded-2xl rounded-bl-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 bg-white">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Escribe un mensaje..."
                            className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-2 outline-none focus:border-blue-300 transition-colors text-gray-800 placeholder-gray-400"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim()}
                            className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-blue-950 hover:bg-yellow-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer"
                        >
                            <FaPaperPlane size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* Botón Asistente IA */}
            <button
                onClick={() => setChatOpen(prev => !prev)}
                className="w-15 h-15 rounded-full bg-yellow-400 text-blue-950 flex items-center justify-center shadow-lg hover:bg-yellow-300 transition-colors cursor-pointer"
                title="Asistente virtual Mass"
            >
                {chatOpen ? <FaTimes size={35} /> : <BsRobot size={35} />}
            </button>

            {/* Botón WhatsApp */}
            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-15 h-15 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:bg-[#1ebe5d] transition-colors"
            >
                <FaWhatsapp size={40} />
            </a>
        </div>
    )
}