import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "../store";
import type { AddToCartPayload } from "../interfaces";
import { addToCart } from "../service/cart.service";

export function useAddToCartMutation() {
    const queryClient = useQueryClient();
    const setCount = useCartStore((state) => state.setCount);

    return useMutation({
        mutationFn: (payload: AddToCartPayload) => addToCart(payload),
        onSuccess: (data) => {
            // Actualizar el contador del carrito con la respuesta del servidor
            setCount(data.count);

            // Invalidar queries relacionadas si es necesario (opcional)
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
}