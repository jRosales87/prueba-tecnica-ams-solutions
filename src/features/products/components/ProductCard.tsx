import { Link } from "react-router-dom";
import type { Product } from "../interfaces";

interface Props {
    product: Product;
}

export const ProductCard = ({ product }: Props) => {
    return (
        <Link to={`/product/${product.id}`}>
            <div className="border rounded-md p-4 border-gray-400">
                <div className="mb-5">
                    <img src={product.imgUrl} alt={product.model} className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="mb-3">
                    <h2 className="text-xl font-semibold">{product.model}</h2>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                </div>
                <div>
                    <p className="text-lg font-bold">{product.price ? `${product.price} €` : 'Precio no disponible'}</p>
                </div>
            </div>
        </Link>
    )
}
