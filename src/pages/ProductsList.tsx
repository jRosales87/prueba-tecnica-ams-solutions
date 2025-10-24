import { useProductsQuery } from "@/features/products/hooks/useProduct";
import { SearchBar } from "@/features/shared/components/SearchBar";
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
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Productos</h1>
                <SearchBar onSearch={handleSearch} />
                <p>Cargando productos...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Productos</h1>

                <p className="text-red-500">Error al cargar los productos: {(error as Error).message}</p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div>
            <SearchBar onSearch={handleSearch} />
            {searchQuery && (
                <p className="text-sm text-muted-foreground mb-4">
                    {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} para "{searchQuery}"
                </p>
            )}
            {/* Grid de productos */}
            {filteredProducts.length === 0 ? (
                <p>No se encontraron productos.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="border rounded-lg p-4 flex flex-col items-center"
                        >
                            <p>{product.model}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
