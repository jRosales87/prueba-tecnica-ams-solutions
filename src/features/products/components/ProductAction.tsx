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
        <div className="space-y-6">
            <div className="pb-6 border-b">
                <p className="text-sm text-muted-foreground mb-2">Precio</p>
                <p className="text-4xl font-bold text-primary">
                    {product.price ? `${product.price} €` : 'Precio no disponible'}
                </p>
            </div>


            <div className="space-y-3">
                <p className="text-sm font-medium">
                    Color
                </p>
                <div className="flex flex-wrap gap-2">
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
                            />
                            <label
                                htmlFor={`color-${color.code}`}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 peer-checked:bg-black peer-checked:text-white peer-checked:border-black peer-checked:hover:bg-gray-800 peer-checked:hover:border-gray-800 min-w-[80px]"
                            >
                                {color.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>


            <div className="space-y-3">
                <p className="text-sm font-medium">
                    Almacenamiento
                </p>
                <div className="flex flex-wrap gap-2">
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
                            />
                            <label
                                htmlFor={`storage-${storage.code}`}
                                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 peer-checked:bg-black peer-checked:text-white peer-checked:border-black peer-checked:hover:bg-gray-800 peer-checked:hover:border-gray-800 min-w-[100px]"
                            >
                                {storage.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>


            <button
                disabled={!canAddToCart}
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Añadiendo...
                    </>
                ) : showSuccessMessage ? (
                    <>
                        <Check className="mr-2 h-5 w-5" />
                        ¡Añadido al carrito!
                    </>
                ) : (
                    <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Añadir al carrito
                    </>
                )}
            </button>
            {/* Mensaje de error si falla */}
            {addToCartMutation.isError && (
                <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
                    Error: {addToCartMutation.error instanceof Error
                        ? addToCartMutation.error.message
                        : 'Error al añadir al carrito. Inténtalo de nuevo.'}
                </p>
            )}
        </div>
    )
}
