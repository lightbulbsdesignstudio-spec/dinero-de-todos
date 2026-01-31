import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import { Navbar, Footer, AccessibilityProvider } from "@/components/layout";
import FiscalAssistant from "@/components/ui/FiscalAssistant";

// Títulos - Montserrat Bold
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

// Cuerpo y datos - Inter
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dinero de Todos | Nuestro Dinero, Nuestro Derecho a Saber",
  description: "Plataforma ciudadana para el seguimiento del gasto público y presupuesto federal de México. Visualiza cómo se usan nuestros impuestos con transparencia.",
  keywords: ["transparencia", "presupuesto", "México", "gasto público", "rendición de cuentas", "datos abiertos", "dinero de todos"],
  authors: [{ name: "Dinero de Todos" }],
  openGraph: {
    title: "Dinero de Todos | Nuestro Dinero, Nuestro Derecho a Saber",
    description: "Visualiza cómo se usa el presupuesto federal mexicano. Nuestro dinero, nuestro derecho a saber.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${inter.variable} antialiased min-h-screen flex flex-col font-sans`}
        suppressHydrationWarning
      >
        <AccessibilityProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
