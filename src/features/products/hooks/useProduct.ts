import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts } from "../service/product.service";

export function useProductsQuery() {
    return useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    });
}


export function useProductQuery(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => getProductById(id),
        enabled: !!id,
    });
}