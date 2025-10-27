import { useLocation, useParams } from 'react-router-dom';
import { useProductQuery } from '@/features/products/hooks/useProduct';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    isCurrentPage: boolean;
}

export const useBreadcrumbs = (): BreadcrumbItem[] => {
    const location = useLocation();
    const params = useParams();

    // Obtener información del producto si estamos en una página de producto
    const productId = params.id;
    const { data: product } = useProductQuery(productId || '');

    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const breadcrumbs: BreadcrumbItem[] = [];

        // Siempre añadir "Inicio" como primer elemento
        const isHome = location.pathname === '/';
        breadcrumbs.push({
            label: 'Inicio',
            href: isHome ? undefined : '/',
            isCurrentPage: isHome
        });

        // Si no estamos en home, añadir elementos específicos según la ruta
        if (!isHome) {
            // Ruta de producto individual
            if (location.pathname.startsWith('/product/') && productId) {
                const productLabel = product
                    ? `${product.brand} ${product.model}`
                    : 'Cargando producto...';

                breadcrumbs.push({
                    label: productLabel,
                    href: undefined,
                    isCurrentPage: true
                });
            }
        }

        return breadcrumbs;
    };

    return generateBreadcrumbs();
};