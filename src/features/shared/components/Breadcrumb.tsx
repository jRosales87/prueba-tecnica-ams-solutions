import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useBreadcrumbs, type BreadcrumbItem } from '../hooks/useBreadcrumbs';

export const Breadcrumb = () => {
    const breadcrumbs = useBreadcrumbs();

    // Siempre mostrar el breadcrumb, incluso con un solo elemento
    return (
        <nav
            role="navigation"
            aria-label="Breadcrumb"
            className="py-2 border-t border-gray-100"
        >
            <ol className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {/* Separador (no mostrar en el primer elemento) */}
                        {index > 0 && (
                            <ChevronRight
                                className="h-4 w-4 text-gray-400 mx-2"
                                aria-hidden="true"
                            />
                        )}

                        {/* Elemento del breadcrumb */}
                        <BreadcrumbLink item={item} isFirst={index === 0} />
                    </li>
                ))}
            </ol>
        </nav>
    );
};

interface BreadcrumbLinkProps {
    item: BreadcrumbItem;
    isFirst: boolean;
}

const BreadcrumbLink = ({ item, isFirst }: BreadcrumbLinkProps) => {
    const baseClasses = "flex items-center hover:text-gray-900 transition-colors";
    const linkClasses = `${baseClasses} text-gray-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded`;
    const currentClasses = `${baseClasses} text-gray-900 font-medium`;

    // Si es la página actual, renderizar como span
    if (item.isCurrentPage) {
        return (
            <span
                className={currentClasses}
                aria-current="page"
            >
                {isFirst && <Home className="h-4 w-4 mr-1" aria-hidden="true" />}
                {item.label}
            </span>
        );
    }

    // Si tiene href, renderizar como Link
    if (item.href) {
        return (
            <Link
                to={item.href}
                className={linkClasses}
                aria-label={isFirst ? `Ir a ${item.label}` : `Ir a ${item.label}`}
            >
                {isFirst && <Home className="h-4 w-4 mr-1" aria-hidden="true" />}
                {item.label}
            </Link>
        );
    }

    // Fallback: renderizar como span sin enlace
    return (
        <span className={currentClasses}>
            {isFirst && <Home className="h-4 w-4 mr-1" aria-hidden="true" />}
            {item.label}
        </span>
    );
};