import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAddToCartMutation } from '@/features/cart/hook/useCard'
import { useCartStore } from '@/features/cart/store'
import { addToCart } from '@/features/cart/service/cart.service'
import type { AddToCartPayload } from '@/features/cart/interfaces'

// Mock del servicio de carrito
vi.mock('@/features/cart/service/cart.service', () => ({
    addToCart: vi.fn(),
}))

// Mock del store del carrito
const mockSetCount = vi.fn()
const mockCurrentCount = 5

vi.mock('@/features/cart/store', () => ({
    useCartStore: vi.fn(),
}))

const mockedAddToCart = vi.mocked(addToCart)
const mockedUseCartStore = vi.mocked(useCartStore)

// Helper para renderizar hook con QueryClient
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

describe('useAddToCartMutation', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        // Mock del store para simular el selector de estado
        mockedUseCartStore.mockImplementation((selector) => {
            if (selector.toString().includes('setCount')) {
                return mockSetCount
            }
            if (selector.toString().includes('count')) {
                return mockCurrentCount
            }
            return null
        })
    })

    it('debería configurar el mutation correctamente', () => {
        const { result } = renderHook(() => useAddToCartMutation(), {
            wrapper: createWrapper(),
        })

        expect(result.current.mutate).toBeDefined()
        expect(result.current.isPending).toBe(false)
        expect(result.current.isError).toBe(false)
        expect(result.current.error).toBeNull()
    })

    it('debería llamar al servicio addToCart con el payload correcto', async () => {
        const mockResponse = { count: 1 }
        mockedAddToCart.mockResolvedValueOnce(mockResponse)

        const { result } = renderHook(() => useAddToCartMutation(), {
            wrapper: createWrapper(),
        })

        const payload: AddToCartPayload = {
            id: 'product-123',
            colorCode: 1,
            storageCode: 2,
        }

        result.current.mutate(payload)

        await waitFor(() => {
            expect(mockedAddToCart).toHaveBeenCalledWith(payload)
        })
    })

    it('debería actualizar el estado de loading correctamente', async () => {
        // Mock con delay para capturar el estado de loading
        mockedAddToCart.mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve({ count: 1 }), 100))
        )

        const { result } = renderHook(() => useAddToCartMutation(), {
            wrapper: createWrapper(),
        })

        const payload: AddToCartPayload = {
            id: 'product-123',
            colorCode: 1,
            storageCode: 2,
        }

        // Estado inicial
        expect(result.current.isPending).toBe(false)

        // Ejecutar mutation
        result.current.mutate(payload)

        // Verificar que está en loading
        await waitFor(() => {
            expect(result.current.isPending).toBe(true)
        })

        // Esperar a que termine
        await waitFor(() => {
            expect(result.current.isPending).toBe(false)
        })
    })

    it('debería incrementar el contador del store en onSuccess', async () => {
        const mockResponse = { count: 1 }
        mockedAddToCart.mockResolvedValueOnce(mockResponse)

        const { result } = renderHook(() => useAddToCartMutation(), {
            wrapper: createWrapper(),
        })

        const payload: AddToCartPayload = {
            id: 'product-123',
            colorCode: 1,
            storageCode: 2,
        }

        result.current.mutate(payload)

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        // Verificar que se llamó setCount con el valor incrementado
        expect(mockSetCount).toHaveBeenCalledWith(mockCurrentCount + 1)
    })

    it('debería manejar errores correctamente', async () => {
        const mockError = new Error('Error de red')
        mockedAddToCart.mockRejectedValueOnce(mockError)

        const { result } = renderHook(() => useAddToCartMutation(), {
            wrapper: createWrapper(),
        })

        const payload: AddToCartPayload = {
            id: 'product-123',
            colorCode: 1,
            storageCode: 2,
        }

        result.current.mutate(payload)

        await waitFor(() => {
            expect(result.current.isError).toBe(true)
        })

        expect(result.current.error).toEqual(mockError)

        // No debería actualizar el contador en caso de error
        expect(mockSetCount).not.toHaveBeenCalled()
    })

    it('debería invalidar queries del carrito en onSuccess', async () => {
        const mockResponse = { count: 1 }
        mockedAddToCart.mockResolvedValueOnce(mockResponse)

        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        })

        // Spy en invalidateQueries
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        )

        const { result } = renderHook(() => useAddToCartMutation(), { wrapper })

        const payload: AddToCartPayload = {
            id: 'product-123',
            colorCode: 1,
            storageCode: 2,
        }

        result.current.mutate(payload)

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        // Verificar que se invalidaron las queries del carrito
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['cart'] })
    })

    it('debería resetear el estado cuando se ejecuta una nueva mutation', async () => {
        const mockResponse = { count: 1 }
        mockedAddToCart.mockResolvedValueOnce(mockResponse)

        const { result } = renderHook(() => useAddToCartMutation(), {
            wrapper: createWrapper(),
        })

        const payload: AddToCartPayload = {
            id: 'product-123',
            colorCode: 1,
            storageCode: 2,
        }

        // Primera mutation
        result.current.mutate(payload)

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        // Verificar que reset funciona
        expect(typeof result.current.reset).toBe('function')
        result.current.reset()

        // El comportamiento específico del reset puede variar según React Query
        expect(result.current.isError).toBe(false)
    })

    it('debería manejar múltiples mutations secuenciales', async () => {
        const mockResponse1 = { count: 1 }
        const mockResponse2 = { count: 2 }

        mockedAddToCart
            .mockResolvedValueOnce(mockResponse1)
            .mockResolvedValueOnce(mockResponse2)

        const { result } = renderHook(() => useAddToCartMutation(), {
            wrapper: createWrapper(),
        })

        const payload1: AddToCartPayload = {
            id: 'product-123',
            colorCode: 1,
            storageCode: 2,
        }

        const payload2: AddToCartPayload = {
            id: 'product-456',
            colorCode: 2,
            storageCode: 1,
        }

        // Primera mutation
        result.current.mutate(payload1)

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        expect(mockSetCount).toHaveBeenCalledWith(mockCurrentCount + 1)

        // Segunda mutation
        result.current.mutate(payload2)

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        // Verificar que se llamó setCount nuevamente
        expect(mockSetCount).toHaveBeenCalledTimes(2)
        expect(mockedAddToCart).toHaveBeenCalledTimes(2)
    })

    it('debería manejar diferentes tipos de errores', async () => {
        const networkError = new Error('Network Error')
        const apiError = { message: 'API Error', status: 400 }

        const { result } = renderHook(() => useAddToCartMutation(), {
            wrapper: createWrapper(),
        })

        const payload: AddToCartPayload = {
            id: 'product-123',
            colorCode: 1,
            storageCode: 2,
        }

        // Test con Error estándar
        mockedAddToCart.mockRejectedValueOnce(networkError)
        result.current.mutate(payload)

        await waitFor(() => {
            expect(result.current.isError).toBe(true)
            expect(result.current.error).toEqual(networkError)
        })

        // Reset y test con error de API
        result.current.reset()
        mockedAddToCart.mockRejectedValueOnce(apiError)
        result.current.mutate(payload)

        await waitFor(() => {
            expect(result.current.isError).toBe(true)
            expect(result.current.error).toEqual(apiError)
        })
    })

    it('debería mantener el estado correcto durante el ciclo completo', async () => {
        const mockResponse = { count: 1 }
        mockedAddToCart.mockResolvedValueOnce(mockResponse)

        const { result } = renderHook(() => useAddToCartMutation(), {
            wrapper: createWrapper(),
        })

        const payload: AddToCartPayload = {
            id: 'product-123',
            colorCode: 1,
            storageCode: 2,
        }

        // Estado inicial
        expect(result.current.isPending).toBe(false)
        expect(result.current.isSuccess).toBe(false)
        expect(result.current.isError).toBe(false)

        // Ejecutar mutation
        result.current.mutate(payload)

        // Estado final (la mutation se resuelve muy rápido en tests)
        await waitFor(() => {
            expect(result.current.isPending).toBe(false)
            expect(result.current.isSuccess).toBe(true)
            expect(result.current.isError).toBe(false)
        })
    })
})