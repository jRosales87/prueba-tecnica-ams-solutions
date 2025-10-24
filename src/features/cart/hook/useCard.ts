import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "../store";
import type { AddToCartPayload } from "../interfaces";
import { addToCart } from "../service/cart.service";

export function useAddToCartMutation() {
    const queryClient = useQueryClient();
    const setCount = useCartStore((state) => state.setCount);
    const currentCount = useCartStore((state) => state.count);

    return useMutation({
        mutationFn: (payload: AddToCartPayload) => addToCart(payload),
        onSuccess: () => {
            // IMPLEMENTACIÓN ORIGINAL (comentada debido a limitaciones de la API de prueba)
            // La API siempre devuelve {count: 1} independientemente del estado real
            // setCount(data.count);

            // IMPLEMENTACIÓN ALTERNATIVA para demostrar funcionalidad
            // Incrementar el contador local cuando la petición sea exitosa
            setCount(currentCount + 1);

            // Invalidar queries relacionadas si es necesario (opcional)
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
        onError: (error) => {
            console.error('Error in mutation:', error);
        },
    });
}