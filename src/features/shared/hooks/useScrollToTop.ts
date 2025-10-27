import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar cuando el usuario ha hecho scroll hacia abajo
 * @param threshold - Píxeles desde el top para mostrar el botón (por defecto 300px)
 * @returns boolean - true si se debe mostrar el botón de scroll to top
 */
export const useScrollToTop = (threshold: number = 300): boolean => {
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setShowScrollToTop(scrollPosition > threshold);
        };

        // Agregar el event listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup: remover el event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [threshold]);

    return showScrollToTop;
};