import { Link } from "react-router-dom"
import { ShoppingCart } from "lucide-react"


export const Header = () => {
    const count = 0;
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto px-4">
                {/* Barra superior con título y carrito */}
                <div className="flex h-16 items-center justify-between">
                    {/* Título que enlaza a home */}
                    <Link
                        to="/"
                        className="flex items-center space-x-2 font-bold text-xl hover:text-primary transition-colors"
                    >
                        <span>E-Commerce</span>
                    </Link>

                    {/* Contador del carrito */}
                    <div className="flex items-center">
                        <Link
                            to="/cart"
                            className="relative flex items-center hover:text-primary transition-colors"
                        >
                            <ShoppingCart size={24} />
                            {count > 0 && (
                                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                    {count}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="pb-4">

                </div>
            </div>
        </header>
    )
}
