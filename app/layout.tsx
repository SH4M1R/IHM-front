import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tienda Mass",
  description: "Precios mas bajos siempre",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}