import { getProducts, getProductById } from '@/features/products/service/product.service'
import { apiClient } from '@/app/api/client'
import type { Product, ProductDetails } from '@/features/products/interfaces'

// Mock del cliente API
vi.mock('@/app/api/client', () => ({
    apiClient: vi.fn(),
}))

const mockedApiClient = vi.mocked(apiClient)

describe('Product Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getProducts', () => {
        it('debería llamar al apiClient con el endpoint correcto', async () => {
            const mockProducts: Product[] = [
                {
                    id: '1',
                    brand: 'Apple',
                    model: 'iPhone 14',
                    price: '999',
                    imgUrl: 'https://example.com/iphone14.jpg'
                },
                {
                    id: '2',
                    brand: 'Samsung',
                    model: 'Galaxy S23',
                    price: '899',
                    imgUrl: 'https://example.com/galaxy-s23.jpg'
                }
            ]

            mockedApiClient.mockResolvedValueOnce(mockProducts)

            const result = await getProducts()

            expect(mockedApiClient).toHaveBeenCalledWith('/product')
            expect(result).toEqual(mockProducts)
        })

        it('debería retornar un array de productos', async () => {
            const mockProducts: Product[] = [
                {
                    id: '1',
                    brand: 'Apple',
                    model: 'iPhone 14',
                    price: '999',
                    imgUrl: 'https://example.com/iphone14.jpg'
                }
            ]

            mockedApiClient.mockResolvedValueOnce(mockProducts)

            const result = await getProducts()

            expect(Array.isArray(result)).toBe(true)
            expect(result).toHaveLength(1)
            expect(result[0]).toHaveProperty('id')
            expect(result[0]).toHaveProperty('brand')
            expect(result[0]).toHaveProperty('model')
            expect(result[0]).toHaveProperty('price')
            expect(result[0]).toHaveProperty('imgUrl')
        })

        it('debería retornar un array vacío cuando no hay productos', async () => {
            mockedApiClient.mockResolvedValueOnce([])

            const result = await getProducts()

            expect(result).toEqual([])
            expect(result).toHaveLength(0)
        })

        it('debería propagar errores del apiClient', async () => {
            const mockError = new Error('Network error')
            mockedApiClient.mockRejectedValueOnce(mockError)

            await expect(getProducts()).rejects.toThrow('Network error')
        })

        it('debería manejar respuestas con múltiples productos', async () => {
            const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
                id: `${i + 1}`,
                brand: `Brand ${i + 1}`,
                model: `Model ${i + 1}`,
                price: `${999 + i}`,
                imgUrl: `https://example.com/product-${i + 1}.jpg`
            }))

            mockedApiClient.mockResolvedValueOnce(mockProducts)

            const result = await getProducts()

            expect(result).toHaveLength(50)
            expect(result[0].id).toBe('1')
            expect(result[49].id).toBe('50')
        })
    })

    describe('getProductById', () => {
        const mockProductDetails: ProductDetails = {
            id: '1',
            brand: 'Apple',
            model: 'iPhone 14',
            price: '999',
            imgUrl: 'https://example.com/iphone14.jpg',
            networkTechnology: 'GSM / HSPA / LTE / 5G',
            networkSpeed: 'HSPA 42.2/5.76 Mbps, LTE-A',
            gprs: 'Yes',
            edge: 'Yes',
            announced: '2022, September 07',
            status: 'Available',
            dimentions: '146.7 x 71.5 x 7.8 mm',
            weight: '172 g',
            sim: 'Nano-SIM and eSIM',
            displayType: 'Super Retina XDR OLED',
            displayResolution: '1170 x 2532 pixels',
            displaySize: '6.1 inches',
            os: 'iOS 16',
            cpu: 'Hexa-core A16 Bionic',
            chipset: 'Apple A16 Bionic',
            gpu: 'Apple GPU',
            externalMemory: 'No',
            internalMemory: ['128 GB', '256 GB', '512 GB'],
            ram: '6 GB',
            primaryCamera: ['48 MP', '12 MP'],
            secondaryCmera: '12 MP',
            speaker: 'Yes',
            audioJack: 'No',
            wlan: 'Wi-Fi 802.11 a/b/g/n/ac/6',
            bluetooth: ['5.3', 'A2DP', 'LE'],
            gps: 'Yes',
            nfc: 'Yes',
            radio: 'No',
            usb: 'Lightning',
            sensors: 'Face ID, accelerometer, gyro, proximity, compass, barometer',
            battery: 'Li-Ion 3279 mAh',
            colors: ['Blue', 'Purple', 'Midnight', 'Starlight', 'RED'],
            options: {
                colors: [
                    { code: 1, name: 'Blue' },
                    { code: 2, name: 'Purple' }
                ],
                storages: [
                    { code: 1, name: '128GB' },
                    { code: 2, name: '256GB' }
                ]
            }
        }

        it('debería llamar al apiClient con el endpoint y ID correctos', async () => {
            mockedApiClient.mockResolvedValueOnce(mockProductDetails)

            const result = await getProductById('1')

            expect(mockedApiClient).toHaveBeenCalledWith('/product/1')
            expect(result).toEqual(mockProductDetails)
        })

        it('debería retornar los detalles completos del producto', async () => {
            mockedApiClient.mockResolvedValueOnce(mockProductDetails)

            const result = await getProductById('1')

            // Verificar propiedades básicas
            expect(result.id).toBe('1')
            expect(result.brand).toBe('Apple')
            expect(result.model).toBe('iPhone 14')
            expect(result.price).toBe('999')

            // Verificar propiedades técnicas
            expect(result.networkTechnology).toBeDefined()
            expect(result.cpu).toBeDefined()
            expect(result.ram).toBeDefined()

            // Verificar arrays
            expect(Array.isArray(result.internalMemory)).toBe(true)
            expect(Array.isArray(result.primaryCamera)).toBe(true)
            expect(Array.isArray(result.bluetooth)).toBe(true)

            // Verificar opciones
            expect(result.options).toBeDefined()
            expect(result.options.colors).toBeDefined()
            expect(result.options.storages).toBeDefined()
        })

        it('debería manejar diferentes tipos de ID', async () => {
            mockedApiClient.mockResolvedValueOnce(mockProductDetails)

            // ID numérico como string
            await getProductById('123')
            expect(mockedApiClient).toHaveBeenCalledWith('/product/123')

            // ID alfanumérico
            await getProductById('abc-123')
            expect(mockedApiClient).toHaveBeenCalledWith('/product/abc-123')

            // ID con caracteres especiales
            await getProductById('product_2024')
            expect(mockedApiClient).toHaveBeenCalledWith('/product/product_2024')
        })

        it('debería propagar errores del apiClient', async () => {
            const mockError = new Error('Product not found')
            mockedApiClient.mockRejectedValueOnce(mockError)

            await expect(getProductById('999')).rejects.toThrow('Product not found')
        })

        it('debería manejar ID vacío o inválido', async () => {
            const mockError = new Error('Invalid ID')
            mockedApiClient.mockRejectedValueOnce(mockError)

            await expect(getProductById('')).rejects.toThrow('Invalid ID')
        })

        it('debería manejar respuesta con propiedades opcionales', async () => {
            const minimalProduct: ProductDetails = {
                ...mockProductDetails,
                networkSpeed: '',
                gprs: '',
                edge: '',
                audioJack: '',
                radio: '',
            }

            mockedApiClient.mockResolvedValueOnce(minimalProduct)

            const result = await getProductById('1')

            expect(result.networkSpeed).toBe('')
            expect(result.gprs).toBe('')
            expect(result.edge).toBe('')
            expect(result.audioJack).toBe('')
            expect(result.radio).toBe('')
        })

        it('debería manejar arrays vacíos en las propiedades', async () => {
            const productWithEmptyArrays: ProductDetails = {
                ...mockProductDetails,
                internalMemory: [],
                primaryCamera: [],
                bluetooth: [],
                colors: [],
                options: {
                    colors: [],
                    storages: []
                }
            }

            mockedApiClient.mockResolvedValueOnce(productWithEmptyArrays)

            const result = await getProductById('1')

            expect(result.internalMemory).toEqual([])
            expect(result.primaryCamera).toEqual([])
            expect(result.bluetooth).toEqual([])
            expect(result.colors).toEqual([])
            expect(result.options.colors).toEqual([])
            expect(result.options.storages).toEqual([])
        })
    })
})