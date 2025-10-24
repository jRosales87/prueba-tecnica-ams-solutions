import { apiClient } from "@/app/api/client";
import type { Product, ProductDetails } from "../interfaces";


export async function getProducts(): Promise<Product[]> {
  return apiClient<Product[]>('/product');
}


export async function getProductById(id: string): Promise<ProductDetails> {
  return apiClient<ProductDetails>(`/product/${id}`);
}
