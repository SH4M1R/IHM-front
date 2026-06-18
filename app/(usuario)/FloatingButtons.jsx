"use client"
import { useState, useRef, useEffect } from "react"
import { FaWhatsapp, FaTimes, FaPaperPlane } from "react-icons/fa"
import { BsRobot } from "react-icons/bs"

const WHATSAPP_NUMBER = "51907845855"
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

const BOT_REPLIES = [
    "¡Claro! ¿Qué producto estás buscando? Puedo ayudarte a encontrar el mejor precio.",
    "Tenemos ofertas increíbles esta semana. ¿Te interesa alguna categoría en especial?",
    "Puedes revisar nuestro catálogo completo aquí en la web. ¿Necesitas ayuda con algún producto?",
    "Para consultas sobre stock o precios exactos, también puedes contactarnos por WhatsApp.",
    "¡Con gusto! ¿Tienes alguna otra pregunta sobre nuestros productos o servicios?",
]

export default function FloatingButtons() {
    const [chatOpen, setChatOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            from: "bot",
            text: "¡Hola! Soy Karen la asistente virtual de Tienda Mass. Estoy aquí para orientarte sobre productos, precios y ofertas. ¿En qué puedo ayudarte hoy?",
        },
    ])
    const [input, setInput] = useState("")
    const [typing, setTyping] = useState(false)
    const bodyRef = useRef(null)
    const inputRef = useRef(null)
    const replyIndex = useRef(0)

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight
        }
    }, [messages, typing])

    useEffect(() => {
        if (chatOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [chatOpen])

    const sendMessage = () => {
        const txt = input.trim()
        if (!txt) return

        setMessages(prev => [...prev, { from: "user", text: txt }])
        setInput("")
        setTyping(true)

        setTimeout(() => {
            const reply = BOT_REPLIES[replyIndex.current % BOT_REPLIES.length]
            replyIndex.current++
            setTyping(false)
            setMessages(prev => [...prev, { from: "bot", text: reply }])
        }, 1000)
    }

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3">

            {/* Chat panel */}
            {chatOpen && (
                <div className="w-72 sm:w-80 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl flex flex-col">

                    {/* Header */}
                    <div className="bg-blue-950 px-4 py-3 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                            <BsRobot className="text-blue-950" size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-black leading-tight truncate">
                                Karen - Asistente Mass
                            </p>
                            <span className="flex items-center gap-1.5 text-xs text-blue-300 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                                En línea
                            </span>
                        </div>
                        <button
                            onClick={() => setChatOpen(false)}
                            className="text-blue-300 hover:text-white transition-colors p-1 cursor-pointer"
                            aria-label="Cerrar chat"
                        >
                            <FaTimes size={14} />
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div
                        ref={bodyRef}
                        className="flex flex-col gap-3 px-3 py-3 h-56 overflow-y-auto bg-gray-50"
                    >
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex flex-col max-w-[88%] ${msg.from === "user" ? "self-end items-end" : "self-start items-start"}`}
                            >
                                {msg.from === "bot" && (
                                    <span className="text-[10px] font-black text-yellow-600 mb-1 px-1">
                                        Asistente Mass
                                    </span>
                                )}
                                <div
                                    className={`px-3 py-2 text-xs leading-relaxed ${
                                        msg.from === "user"
                                            ? "bg-blue-950 text-white rounded-2xl rounded-br-sm"
                                            : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-sm"
                                    }`}
                                >
                                    {msg.text}
                                </div>
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
                            aria-label="Enviar mensaje"
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
                aria-label="Abrir asistente IA"
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
                aria-label="Contactar por WhatsApp"
                title="Escríbenos por WhatsApp"
            >
                <FaWhatsapp size={40} />
            </a>
        </div>
    )
}