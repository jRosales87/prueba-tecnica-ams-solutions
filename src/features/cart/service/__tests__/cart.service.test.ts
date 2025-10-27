import { addToCart } from '@/features/cart/service/cart.service'
import { apiClient } from '@/app/api/client'
import type { AddToCartPayload, AddToCartResponse } from '@/features/cart/interfaces'

// Mock del cliente API
vi.mock('@/app/api/client', () => ({
    apiClient: vi.fn(),
}))

const mockedApiClient = vi.mocked(apiClient)

describe('Cart Service', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('addToCart', () => {
        const mockPayload: AddToCartPayload = {
            id: '1',
            colorCode: 1,
            storageCode: 2
        }

        const mockResponse: AddToCartResponse = {
            count: 1
        }

        it('debería llamar al apiClient con el endpoint correcto y datos del payload', async () => {
            mockedApiClient.mockResolvedValueOnce(mockResponse)

            const result = await addToCart(mockPayload)

            expect(mockedApiClient).toHaveBeenCalledWith('/cart', {
                method: 'POST',
                body: JSON.stringify(mockPayload)
            })
            expect(result).toEqual(mockResponse)
        })

        it('debería enviar el payload con todos los campos requeridos', async () => {
            mockedApiClient.mockResolvedValueOnce(mockResponse)

            await addToCart(mockPayload)

            const [url, options] = mockedApiClient.mock.calls[0]
            const body = JSON.parse(options?.body as string)

            expect(url).toBe('/cart')
            expect(options?.method).toBe('POST')
            expect(body).toEqual({
                id: '1',
                colorCode: 1,
                storageCode: 2
            })
        })

        it('debería retornar la respuesta con el count actualizado', async () => {
            const expectedResponse: AddToCartResponse = { count: 5 }
            mockedApiClient.mockResolvedValueOnce(expectedResponse)

            const result = await addToCart(mockPayload)

            expect(result).toEqual(expectedResponse)
            expect(result.count).toBe(5)
        })

        it('debería manejar diferentes tipos de ID', async () => {
            mockedApiClient.mockResolvedValueOnce(mockResponse)

            // ID numérico
            await addToCart({ id: '123', colorCode: 1, storageCode: 1 })
            expect(JSON.parse(mockedApiClient.mock.calls[0][1]?.body as string).id).toBe('123')

            // ID alfanumérico
            await addToCart({ id: 'abc-456', colorCode: 2, storageCode: 2 })
            expect(JSON.parse(mockedApiClient.mock.calls[1][1]?.body as string).id).toBe('abc-456')
        })

        it('debería manejar diferentes códigos de color', async () => {
            mockedApiClient.mockResolvedValueOnce(mockResponse)

            const payloadWithDifferentColor: AddToCartPayload = {
                id: '1',
                colorCode: 5,
                storageCode: 2
            }

            await addToCart(payloadWithDifferentColor)

            const body = JSON.parse(mockedApiClient.mock.calls[0][1]?.body as string)
            expect(body.colorCode).toBe(5)
        })

        it('debería manejar diferentes códigos de storage', async () => {
            mockedApiClient.mockResolvedValueOnce(mockResponse)

            const payloadWithDifferentStorage: AddToCartPayload = {
                id: '1',
                colorCode: 1,
                storageCode: 10
            }

            await addToCart(payloadWithDifferentStorage)

            const body = JSON.parse(mockedApiClient.mock.calls[0][1]?.body as string)
            expect(body.storageCode).toBe(10)
        })

        it('debería propagar errores del apiClient', async () => {
            const mockError = new Error('Server error')
            mockedApiClient.mockRejectedValueOnce(mockError)

            await expect(addToCart(mockPayload)).rejects.toThrow('Server error')
        })

        it('debería manejar errores de red', async () => {
            const networkError = new Error('Network connection failed')
            mockedApiClient.mockRejectedValueOnce(networkError)

            await expect(addToCart(mockPayload)).rejects.toThrow('Network connection failed')
        })

        it('debería serializar correctamente el payload como JSON', async () => {
            mockedApiClient.mockResolvedValueOnce(mockResponse)

            const complexPayload: AddToCartPayload = {
                id: 'complex-product-id-123',
                colorCode: 999,
                storageCode: 888
            }

            await addToCart(complexPayload)

            const [, options] = mockedApiClient.mock.calls[0]
            const body = JSON.parse(options?.body as string)

            expect(body).toEqual(complexPayload)
            expect(typeof options?.body).toBe('string')
        })

        it('debería manejar respuesta con count cero', async () => {
            const zeroCountResponse: AddToCartResponse = { count: 0 }
            mockedApiClient.mockResolvedValueOnce(zeroCountResponse)

            const result = await addToCart(mockPayload)

            expect(result.count).toBe(0)
        })

        it('debería manejar respuesta con count alto', async () => {
            const highCountResponse: AddToCartResponse = { count: 999 }
            mockedApiClient.mockResolvedValueOnce(highCountResponse)

            const result = await addToCart(mockPayload)

            expect(result.count).toBe(999)
        })

        it('debería mantener el formato correcto del request', async () => {
            mockedApiClient.mockResolvedValueOnce(mockResponse)

            await addToCart(mockPayload)

            const [url, options] = mockedApiClient.mock.calls[0]

            expect(url).toBe('/cart')
            expect(options?.method).toBe('POST')
            expect(options?.body).toBeDefined()
            expect(typeof options?.body).toBe('string')

            // Verificar que el JSON es válido
            expect(() => JSON.parse(options?.body as string)).not.toThrow()
        })

        it('debería manejar códigos de color y storage en límites válidos', async () => {
            mockedApiClient.mockResolvedValueOnce(mockResponse)

            // Códigos mínimos
            await addToCart({ id: '1', colorCode: 0, storageCode: 0 })
            let body = JSON.parse(mockedApiClient.mock.calls[0][1]?.body as string)
            expect(body.colorCode).toBe(0)
            expect(body.storageCode).toBe(0)

            // Códigos altos
            await addToCart({ id: '1', colorCode: 999999, storageCode: 999999 })
            body = JSON.parse(mockedApiClient.mock.calls[1][1]?.body as string)
            expect(body.colorCode).toBe(999999)
            expect(body.storageCode).toBe(999999)
        })
    })
})