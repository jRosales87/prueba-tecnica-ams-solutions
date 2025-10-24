import { Link } from "react-router-dom";
import type { Product } from "../interfaces";

interface Props {
    product: Product;
}

export const ProductCard = ({ product }: Props) => {
    return (
        <article className="border rounded-md p-4 border-gray-400 hover:shadow-lg transition-shadow duration-300">
            <Link
                to={`/product/${product.id}`}
                className="block group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                aria-label={`Ver detalles de ${product.model} de ${product.brand}, precio ${product.price ? `${product.price} €` : 'no disponible'}`}
            >
                <div className="mb-5">
                    <img
                        src={product.imgUrl}
                        alt={`Imagen del ${product.model} de ${product.brand}`}
                        className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                </div>
                <div className="mb-3">
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                        {product.model}
                    </h3>
                    <p className="text-sm text-gray-600" aria-label={`Marca: ${product.brand}`}>
                        {product.brand}
                    </p>
                </div>
                <div>
                    <p className="text-lg font-bold" aria-label={`Precio: ${product.price ? `${product.price} euros` : 'no disponible'}`}>
                        {product.price ? `${product.price} €` : 'Precio no disponible'}
                    </p>
                </div>
            </Link>
        </article>
    )
}
