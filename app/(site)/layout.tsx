// app/(site)/layout.tsx
import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // Add this import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "1stRep | Performance Apparel",
        template: "%s | 1stRep",
    },
    description:
        "Discover premium performance wear designed for athletes who never settle for ordinary. Shop t-shirts, hoodies, sports bras, and more at 1stRep.",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-background text-foreground`}>
                <ThemeProvider>
                    <CartProvider>
                        <Header />
                        <main>
                            {children}
                        </main>
                        <Footer /> {/* Add this line */}
                    </CartProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}