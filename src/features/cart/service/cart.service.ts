import { apiClient } from "@/app/api/client";
import type { AddToCartPayload, AddToCartResponse } from "../interfaces";


export async function addToCart(payload: AddToCartPayload): Promise<AddToCartResponse> {
    return apiClient<AddToCartResponse>('/cart', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}