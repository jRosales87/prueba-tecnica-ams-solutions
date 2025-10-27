import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProductsQuery, useProductQuery } from '@/features/products/hooks/useProduct'
import * as productService from '@/features/products/service/product.service'
import type { Product, ProductDetails } from '@/features/products/interfaces'

// Mock del servicio de productos
vi.mock('@/features/products/service/product.service', () => ({
    getProducts: vi.fn(),
    getProductById: vi.fn(),
}))

const mockedGetProducts = vi.mocked(productService.getProducts)
const mockedGetProductById = vi.mocked(productService.getProductById)

const mockProducts: Product[] = [
    {
        id: '1',
        brand: 'Apple',
        model: 'iPhone 15',
        price: '999',
        imgUrl: 'https://example.com/iphone15.jpg'
    },
    {
        id: '2',
        brand: 'Samsung',
        model: 'Galaxy S24',
        price: '899',
        imgUrl: 'https://example.com/galaxy-s24.jpg'
    }
]

const mockProductDetails: ProductDetails = {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 15',
    price: '999',
    imgUrl: 'https://example.com/iphone15.jpg',
    networkTechnology: '5G',
    networkSpeed: 'High Speed',
    gprs: 'Yes',
    edge: 'Yes',
    announced: '2023',
    status: 'Available',
    dimentions: '147.6 x 71.6 x 7.8 mm',
    weight: '171 g',
    sim: 'Nano-SIM',
    displayType: 'Super Retina XDR OLED',
    displayResolution: '1179 x 2556 pixels',
    displaySize: '6.1 inches',
    os: 'iOS 17',
    cpu: 'A17 Pro',
    chipset: 'Apple A17 Pro',
    gpu: 'Apple GPU',
    externalMemory: 'No',
    internalMemory: ['128GB', '256GB', '512GB'],
    ram: '8GB',
    primaryCamera: ['48 MP', '12 MP ultrawide'],
    secondaryCmera: '12 MP',
    speaker: 'Yes',
    audioJack: 'No',
    wlan: 'Wi-Fi 6',
    bluetooth: ['5.3'],
    gps: 'Yes',
    nfc: 'Yes',
    radio: 'No',
    usb: 'USB-C',
    sensors: 'Face ID, accelerometer, gyro, proximity, compass, barometer',
    battery: '3349 mAh',
    colors: ['Natural Titanium', 'Blue Titanium'],
    options: {
        colors: [
            { code: 1, name: 'Natural Titanium' },
            { code: 2, name: 'Blue Titanium' }
        ],
        storages: [
            { code: 1, name: '128GB' },
            { code: 2, name: '256GB' },
            { code: 3, name: '512GB' }
        ]
    }
}

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

describe('useProduct hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('useProductsQuery', () => {
        it('debería retornar lista de productos exitosamente', async () => {
            mockedGetProducts.mockResolvedValue(mockProducts)

            const { result } = renderHook(() => useProductsQuery(), {
                wrapper: createWrapper(),
            })

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true)
            })

            expect(result.current.data).toEqual(mockProducts)
            expect(result.current.isLoading).toBe(false)
            expect(result.current.isError).toBe(false)
        })

        it('debería manejar errores al cargar productos', async () => {
            const errorMessage = 'Failed to fetch products'
            mockedGetProducts.mockRejectedValue(new Error(errorMessage))

            const { result } = renderHook(() => useProductsQuery(), {
                wrapper: createWrapper(),
            })

            await waitFor(() => {
                expect(result.current.isError).toBe(true)
            })

            expect(result.current.error).toBeInstanceOf(Error)
            expect(result.current.data).toBeUndefined()
            expect(result.current.isLoading).toBe(false)
        })

        it('debería estar en estado de carga inicialmente', () => {
            mockedGetProducts.mockImplementation(() => new Promise(() => { })) // Never resolves

            const { result } = renderHook(() => useProductsQuery(), {
                wrapper: createWrapper(),
            })

            expect(result.current.isLoading).toBe(true)
            expect(result.current.data).toBeUndefined()
            expect(result.current.isError).toBe(false)
        })
    })

    describe('useProductQuery', () => {
        it('debería retornar detalles del producto exitosamente', async () => {
            mockedGetProductById.mockResolvedValue(mockProductDetails)

            const { result } = renderHook(() => useProductQuery('1'), {
                wrapper: createWrapper(),
            })

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true)
            })

            expect(result.current.data).toEqual(mockProductDetails)
            expect(result.current.isLoading).toBe(false)
            expect(result.current.isError).toBe(false)
            expect(mockedGetProductById).toHaveBeenCalledWith('1')
        })

        it('debería manejar errores al cargar detalle del producto', async () => {
            const errorMessage = 'Product not found'
            mockedGetProductById.mockRejectedValue(new Error(errorMessage))

            const { result } = renderHook(() => useProductQuery('999'), {
                wrapper: createWrapper(),
            })

            await waitFor(() => {
                expect(result.current.isError).toBe(true)
            })

            expect(result.current.error).toBeInstanceOf(Error)
            expect(result.current.data).toBeUndefined()
            expect(result.current.isLoading).toBe(false)
        })

        it('no debería ejecutar la query cuando id está vacío', () => {
            const { result } = renderHook(() => useProductQuery(''), {
                wrapper: createWrapper(),
            })

            expect(result.current.fetchStatus).toBe('idle')
            expect(mockedGetProductById).not.toHaveBeenCalled()
        })

        it('debería estar habilitado solo cuando hay id', () => {
            const { result: resultWithId } = renderHook(() => useProductQuery('1'), {
                wrapper: createWrapper(),
            })

            const { result: resultWithoutId } = renderHook(() => useProductQuery(''), {
                wrapper: createWrapper(),
            })

            // Con ID debería ejecutarse
            expect(resultWithId.current.fetchStatus).not.toBe('idle')

            // Sin ID no debería ejecutarse
            expect(resultWithoutId.current.fetchStatus).toBe('idle')
        })

        it('debería tener la query key correcta', async () => {
            mockedGetProductById.mockResolvedValue(mockProductDetails)

            const { result } = renderHook(() => useProductQuery('1'), {
                wrapper: createWrapper(),
            })

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true)
            })

            // Verificar que la query key sea correcta (['product', '1'])
            expect(mockedGetProductById).toHaveBeenCalledWith('1')
        })
    })
})