import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import LayoutShell from "@/components/LayoutShell/LayoutShell";
import WhatsAppButton from "@/components/WhatsAppButton/WhatsAppButton";
import { getSession } from "@/lib/auth";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["300", "400", "500", "600"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", weight: ["300", "400", "500", "600"], style: ["normal", "italic"] });

export const metadata = {
  title: "MuraHomes | Muebles de Lujo y Diseño de Interiores",
  description: "Curadores de muebles mediterráneos excepcionales y diseño de interiores atemporal.",
};

export default async function RootLayout({ children }) {
  const session = await getSession();
  const dbRole = session?.role || 'USER';
  const serverUserId = session?.userId || null;

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script src="/polyfill-listener.js" async={false} />
      </head>
      <body suppressHydrationWarning className={`${dmSans.variable} ${cormorant.variable} antialiased selection:bg-primary selection:text-white`}>
        <AuthProvider>
          <CartProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              <LayoutShell dbRole={dbRole} serverUserId={serverUserId}>
                {children}
              </LayoutShell>
              <WhatsAppButton />
              <Toaster position="bottom-right" richColors />
            </ThemeProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
