// app/(site)/layout.tsx
import type { Metadata } from "next";

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
    return children;
}