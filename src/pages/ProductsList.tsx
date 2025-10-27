import { ProductCard } from "@/features/products/components/ProductCard";
import { useProductsQuery } from "@/features/products/hooks/useProduct";
import { SearchBar } from "@/features/shared/components/SearchBar";
import { ScrollToTop } from "@/features/shared/components/ScrollToTop";
import { useCallback, useMemo, useState } from "react";


export const ProductsList = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const { data: products, isLoading, isError, error, refetch } = useProductsQuery();

    const filteredProducts = useMemo(() => {
        if (!products) return [];

        if (!searchQuery.trim()) return products;

        const query = searchQuery.toLowerCase().trim();

        return products.filter((product) => {
            const brand = product.brand.toLowerCase();
            const model = product.model.toLowerCase();

            return brand.includes(query) || model.includes(query);
        });
    }, [products, searchQuery]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);


    if (isLoading) {
        return (
            <main className="container mx-auto px-4 py-8" role="main">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Productos</h1>
                </header>
                <SearchBar onSearch={handleSearch} />
                <div className="flex items-center justify-center py-8" role="status" aria-live="polite">
                    <p className="text-lg">Cargando productos...</p>
                </div>
            </main>
        );
    }

    if (isError) {
        return (
            <main className="container mx-auto px-4 py-8" role="main">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Productos</h1>
                </header>
                <div className="text-center py-8" role="alert" aria-live="assertive">
                    <p className="text-red-500 mb-4">
                        Error al cargar los productos: {(error as Error).message}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        aria-describedby="retry-help"
                    >
                        Reintentar
                    </button>
                    <p id="retry-help" className="sr-only">
                        Hacer clic para intentar cargar los productos nuevamente
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main role="main">
            <header className="mb-6">
                <SearchBar onSearch={handleSearch} />
                {searchQuery && (
                    <div className="mb-4" role="status" aria-live="polite">
                        <p className="text-sm text-gray-600">
                            {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} para "{searchQuery}"
                        </p>
                    </div>
                )}
            </header>

            <section aria-label="Lista de productos">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-8" role="status" aria-live="polite">
                        <p className="text-gray-600">No se encontraron productos.</p>
                        {searchQuery && (
                            <p className="text-sm text-gray-500 mt-2">
                                Intenta con una búsqueda diferente o explora todos los productos.
                            </p>
                        )}
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        role="grid"
                        aria-label={`${filteredProducts.length} productos disponibles`}
                    >
                        {filteredProducts.map((product) => (
                            <div key={product.id} role="gridcell">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <ScrollToTop />
        </main>
    )
}
