import "./globals.css";

export const metadata = {
  title: "Tienda Mass",
  description: "Precios mas bajos siempre",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}