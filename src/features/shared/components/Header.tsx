import { Link } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/features/cart/store";
import { Breadcrumb } from "./Breadcrumb";


export const Header = () => {
    const count = useCartStore((state) => state.count);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white" role="banner">
            <div className="container mx-auto px-4">
                {/* Barra superior con título y carrito */}
                <nav className="flex h-16 items-center justify-between" role="navigation" aria-label="Navegación principal">
                    {/* Título que enlaza a home */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 font-bold text-xl hover:text-primary transition-colors"
                        aria-label="Ir a la página principal de E-Commerce"
                    >
                        <span>E-Commerce</span>
                    </Link>

                    {/* Contador del carrito */}
                    <div className="flex items-center">
                        <button
                            className="relative flex items-center hover:text-primary transition-colors p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={count > 0 ? `Carrito de compras con ${count} ${count === 1 ? 'artículo' : 'artículos'}` : 'Carrito de compras vacío'}
                            aria-describedby="cart-count"
                        >
                            <ShoppingCart size={24} aria-hidden="true" />
                            {count > 0 && (
                                <span
                                    id="cart-count"
                                    className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full"
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    </div>
                </nav>

                {/* Breadcrumbs */}
                <Breadcrumb />
            </div>
        </header>
    )
}
