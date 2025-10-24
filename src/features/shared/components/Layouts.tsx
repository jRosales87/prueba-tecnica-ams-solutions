import { Outlet } from "react-router-dom"
import { Header } from "./Header"


export const Layouts = () => {
    return (
        <div className="wrapper">
            {/* Skip to main content link for keyboard navigation */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
            >
                Saltar al contenido principal
            </a>

            <Header />

            <main id="main-content" className="p-4" role="main">
                <Outlet />
            </main>

            <footer className="mt-auto py-6 border-t bg-gray-50" role="contentinfo">
                <div className="wrapper px-4">
                    <p className="text-center text-sm text-gray-600">
                        © 2025 E-Commerce. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    )
}
