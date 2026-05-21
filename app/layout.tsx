import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";



export const metadata: Metadata = {
  title: "Tieda Mass",
  description: "Precios mas bajos siempre",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        
            {children}
          
      </body>
    </html>
  );
}
