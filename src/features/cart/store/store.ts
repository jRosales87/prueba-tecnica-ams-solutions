import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Estado del carrito de compras
 * - count: número de items en el carrito
 * - selectedColor: código del color seleccionado en PDP
 * - selectedStorage: código del almacenamiento seleccionado en PDP
 */
interface CartState {
    count: number;
    selectedColor: string | null;
    selectedStorage: string | null;
    setCount: (count: number) => void;
    setSelectedColor: (color: string | null) => void;
    setSelectedStorage: (storage: string | null) => void;
    resetSelections: () => void;
}

/**
 * Store de Zustand para gestionar el carrito
 * Persistido en localStorage con la key 'cart-storage'
 */
export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            count: 0,
            selectedColor: null,
            selectedStorage: null,

            setCount: (count: number) => set({ count }),

            setSelectedColor: (color: string | null) => set({ selectedColor: color }),

            setSelectedStorage: (storage: string | null) => set({ selectedStorage: storage }),

            resetSelections: () => set({
                selectedColor: null,
                selectedStorage: null
            }),
        }),
        {
            name: 'cart-storage', // Key en localStorage
        }
    )
);
