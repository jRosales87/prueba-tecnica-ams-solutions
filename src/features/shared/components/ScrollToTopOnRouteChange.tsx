import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que restaura el scroll al top al cambiar de ruta
 * Se ejecuta automáticamente en cada cambio de navegación
 */
export const ScrollToTopOnRouteChange = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};