import { useState } from "react";
import type { ProductDetails } from "../interfaces"
import { useAddToCartMutation } from "@/features/cart/hook/useCard";
import { Check, Loader2, ShoppingCart } from "lucide-react";

interface Props {
    product: ProductDetails
}

export const ProductAction = ({ product }: Props) => {

    const [selectedColor, setSelectedColor] = useState<number>(product.options.colors[0].code);
    const [selectedStorage, setSelectedStorage] = useState<number>(product.options.storages[0].code);
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

    const addToCartMutation = useAddToCartMutation();
    const isLoading = addToCartMutation.isPending;
    const canAddToCart = selectedColor !== null && selectedStorage !== null && !isLoading;

    const handleAddToCart = () => {
        const payload = {
            id: product.id,
            colorCode: selectedColor,
            storageCode: selectedStorage,
        };

        addToCartMutation.mutate(payload, {
            onSuccess: () => {
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 2000);
            },
            onError: (error) => {
                console.error("Error adding to cart:", error);
            }
        });
    };



    return (
        <aside className="space-y-6" role="complementary" aria-label="Opciones de compra del producto">
            <div>
                <h1 className="text-3xl font-bold">{product?.model}</h1>
                <p className="text-xl text-gray-600" aria-label={`Marca: ${product?.brand}`}>
                    Marca: {product?.brand}
                </p>
            </div>
            <div className="pb-6 border-b">
                <h2 className="text-sm text-gray-600 mb-2">Precio</h2>
                <p
                    className="text-4xl font-bold text-primary"
                    aria-label={product.price ? `Precio: ${product.price} euros` : 'Precio no disponible'}
                >
                    {product.price ? `${product.price} €` : 'No disponible'}
                </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }} role="form" aria-label="Configurar producto">
                <fieldset className="space-y-3 mb-6">
                    <legend className="text-sm font-medium">
                        Seleccionar color
                    </legend>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-required="true">
                        {product.options.colors.map((color, index) => (
                            <div key={color.code} className="relative">
                                <input
                                    type="radio"
                                    id={`color-${color.code}`}
                                    name="color"
                                    value={color.code}
                                    defaultChecked={index === 0}
                                    className="peer sr-only"
                                    onChange={() => setSelectedColor(color.code)}
                                    aria-describedby={`color-${color.code}-desc`}
                                />
                                <label
                                    htmlFor={`color-${color.code}`}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 peer-checked:bg-black peer-checked:text-white peer-checked:border-black peer-checked:hover:bg-gray-800 peer-checked:hover:border-gray-800 min-w-20 focus-within:ring-2 focus-within:ring-blue-500"
                                >
                                    {color.name}
                                </label>
                                <span id={`color-${color.code}-desc`} className="sr-only">
                                    Color {color.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="space-y-3 mb-6">
                    <legend className="text-sm font-medium">
                        Seleccionar almacenamiento
                    </legend>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-required="true">
                        {product.options.storages.map((storage, index) => (
                            <div key={storage.code} className="relative">
                                <input
                                    type="radio"
                                    id={`storage-${storage.code}`}
                                    name="storage"
                                    value={storage.code}
                                    defaultChecked={index === 0}
                                    className="peer sr-only"
                                    onChange={() => setSelectedStorage(storage.code)}
                                    aria-describedby={`storage-${storage.code}-desc`}
                                />
                                <label
                                    htmlFor={`storage-${storage.code}`}
                                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 peer-checked:bg-black peer-checked:text-white peer-checked:border-black peer-checked:hover:bg-gray-800 peer-checked:hover:border-gray-800 min-w-[100px] focus-within:ring-2 focus-within:ring-blue-500"
                                >
                                    {storage.name}
                                </label>
                                <span id={`storage-${storage.code}-desc`} className="sr-only">
                                    Almacenamiento {storage.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </fieldset>

                <button
                    type="submit"
                    disabled={!canAddToCart || !product.price}
                    className="flex w-full items-center justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-describedby="add-to-cart-status"
                    aria-live="polite"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                            Añadiendo...
                        </>
                    ) : showSuccessMessage ? (
                        <>
                            <Check className="mr-2 h-5 w-5" aria-hidden="true" />
                            ¡Añadido al carrito!
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="mr-2 h-5 w-5" aria-hidden="true" />
                            Añadir al carrito
                        </>
                    )}
                </button>
            </form>

            <div id="add-to-cart-status" className="sr-only" aria-live="polite" aria-atomic="true">
                {isLoading && "Añadiendo producto al carrito"}
                {showSuccessMessage && "Producto añadido exitosamente al carrito"}
                {addToCartMutation.isError && "Error al añadir el producto al carrito"}
            </div>

            {/* Mensaje de error si falla */}
            {addToCartMutation.isError && (
                <div
                    className="text-sm text-red-600 text-center bg-red-50 p-2 rounded border border-red-200"
                    role="alert"
                    aria-live="assertive"
                >
                    <strong>Error:</strong> {addToCartMutation.error instanceof Error
                        ? addToCartMutation.error.message
                        : 'Error al añadir al carrito. Inténtalo de nuevo.'}
                </div>
            )}
        </aside>
    )
}
