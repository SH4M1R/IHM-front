"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { HiLockClosed, HiCheckCircle } from "react-icons/hi2"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

// ── Formulario interno (necesita el contexto de Elements) ──
function FormularioPago({ carrito, total, onExito }) {
    const stripe   = useStripe()
    const elements = useElements()
    const [procesando, setProcesando] = useState(false)
    const [error, setError]           = useState("")
    const api = process.env.NEXT_PUBLIC_API

    const confirmarPago = async () => {
        setError("")
        if (!stripe || !elements) return

        setProcesando(true)
        try {
            const usuario = JSON.parse(localStorage.getItem("usuario"))
            const montoEnCentimos = Math.round(total * 100)

            // 1. Pedir PaymentIntent al backend
            const resIntent = await fetch(`${api}/pagos/crear-intent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ monto: montoEnCentimos }),
            })

            if (!resIntent.ok) throw new Error("No se pudo iniciar el pago")
            const { clientSecret } = await resIntent.json()

            // 2. Confirmar el pago con Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                        billing_details: { email: usuario?.correo },
                    },
                }
            )

            if (stripeError) throw new Error(stripeError.message)
            if (paymentIntent.status !== "succeeded") throw new Error("El pago no fue aprobado")

            // 3. Registrar venta en tu backend
            const detalles = carrito.items.map(i => ({
                producto: { idProducto: Number(i.producto.idProducto) },
                cantidad: i.cantidad,
                subtotal: i.producto.precio * i.cantidad,
            }))

            const resVenta = await fetch(`${api}/ventas`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario: { idUsuario: Number(usuario?.idUsuario) },
                    total,
                    fecha:   new Date().toISOString(),
                    estado:  "pagado",
                    detalles,
                }),
            })

            if (!resVenta.ok) throw new Error("Error al registrar la venta")

            // 4. Limpiar carrito
            await fetch(`${api}/carritos/${usuario.idCarrito}/limpiar`, { method: "DELETE" })

            onExito()

        } catch (e) {
            setError(e.message || "Error al procesar el pago")
        } finally {
            setProcesando(false)
        }
    }

    return (
        <div className="space-y-4">
            {/* Card Element de Stripe */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-blue-950 text-sm">Datos de pago</h2>
                    <div className="flex gap-1.5">
                        <span className="bg-blue-700 text-white text-[10px] font-black px-2 py-0.5 rounded">VISA</span>
                        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded">MC</span>
                        <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded">AMEX</span>
                    </div>
                </div>

                {/* Stripe monta aquí su input seguro */}
                <div className="border-2 border-gray-300 focus-within:border-blue-900 rounded-xl px-4 py-3 transition-colors">
                    <CardElement options={{
                        style: {
                            base: {
                                fontSize: "15px",
                                color: "#1e1b4b",
                                fontFamily: "sans-serif",
                                "::placeholder": { color: "#9ca3af" },
                            },
                            invalid: { color: "#dc2626" },
                        },
                        hidePostalCode: true,
                    }} />
                </div>

                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                    <HiLockClosed className="w-3.5 h-3.5 shrink-0" />
                    <span>Pago seguro con Stripe. No almacenamos tus datos de tarjeta.</span>
                </div>
            </div>

            {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
                    {error}
                </div>
            )}

            <button
                onClick={confirmarPago}
                disabled={procesando || !stripe}
                className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-blue-950 font-black py-4 rounded-2xl text-sm transition-colors shadow-md shadow-yellow-200"
            >
                {procesando
                    ? <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-blue-950 border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </span>
                    : `Pagar S/ ${total.toFixed(2)}`
                }
            </button>
        </div>
    )
}

// ── Componente principal ──
export default function Checkout() {
    const [carrito, setCarrito] = useState(null)
    const [loading, setLoading] = useState(true)
    const [exito, setExito]     = useState(false)
    const router = useRouter()
    const api = process.env.NEXT_PUBLIC_API

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario"))
        if (usuario?.idCarrito) {
            fetch(`${api}/carritos/${usuario.idCarrito}`)
                .then(r => r.json())
                .then(d => { setCarrito(d); setLoading(false) })
                .catch(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [api])

    const total = carrito?.items?.reduce(
        (acc, i) => acc + i.producto.precio * i.cantidad, 0
    ) || 0

    if (loading) return (
        <div className="flex justify-center items-center h-[70vh]">
            <div className="w-8 h-8 border-4 border-blue-950 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    if (exito) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="bg-white rounded-3xl shadow-lg p-10 max-w-sm w-full">
                <HiCheckCircle className="text-emerald-500 w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-blue-950 mb-2">¡Pago exitoso!</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Tu pedido ha sido registrado. Te notificaremos cuando esté en camino.
                </p>
                <button onClick={() => router.push("/")}
                    className="bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-black px-8 py-3 rounded-xl text-sm w-full">
                    Volver al inicio
                </button>
            </div>
        </div>
    )

    return (
        <div className="max-w-md mx-auto px-4 py-10 space-y-4">
            <h1 className="text-2xl font-black text-blue-950">Confirmar pedido</h1>

            {/* Resumen */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-blue-950 mb-3 text-sm">Resumen</h2>
                {carrito?.items?.map(i => (
                    <div key={i.producto.idProducto}
                        className="flex justify-between text-sm py-1.5 border-b last:border-0 text-gray-600">
                        <span>{i.producto.nombre} <span className="text-gray-400">x{i.cantidad}</span></span>
                        <span className="font-bold">S/ {(i.producto.precio * i.cantidad).toFixed(2)}</span>
                    </div>
                ))}
                <div className="flex justify-between font-black text-blue-950 mt-3 text-base">
                    <span>Total</span>
                    <span>S/ {total.toFixed(2)}</span>
                </div>
            </div>

            {/* Stripe Elements envuelve el formulario */}
            <Elements stripe={stripePromise}>
                <FormularioPago
                    carrito={carrito}
                    total={total}
                    onExito={() => setExito(true)}
                />
            </Elements>
        </div>
    )
}