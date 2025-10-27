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


    const productId = params.id;
    const { data: product } = useProductQuery(productId || '');

    const generateBreadcrumbs = (): BreadcrumbItem[] => {
        const breadcrumbs: BreadcrumbItem[] = [];


        const isHome = location.pathname === '/';
        breadcrumbs.push({
            label: 'Inicio',
            href: isHome ? undefined : '/',
            isCurrentPage: isHome
        });


        if (!isHome) {

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