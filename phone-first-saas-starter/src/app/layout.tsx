import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export default function RootLayout({children}:{children:React.ReactNode}){return <ClerkProvider><html lang="en"><body><Header/><main className="mx-auto min-h-[calc(100vh-120px)] max-w-5xl px-4 py-6">{children}</main><Footer/></body></html></ClerkProvider>}
