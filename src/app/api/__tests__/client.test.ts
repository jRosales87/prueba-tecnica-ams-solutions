import { apiClient, ApiError } from '@/app/api/client'

// Mock de fetch
Object.defineProperty(window, 'fetch', {
    value: vi.fn(),
    writable: true,
})
const mockedFetch = vi.mocked(window.fetch)

describe('apiClient', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.resetModules()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('debería realizar una petición GET exitosa', async () => {
        const mockData = { id: 1, name: 'Test Product' }

        mockedFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        } as Response)

        const result = await apiClient('/products')

        expect(mockedFetch).toHaveBeenCalledWith(
            'https://itx-frontend-test.onrender.com/api/products',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        expect(result).toEqual(mockData)
    })

    it('debería realizar una petición POST exitosa', async () => {
        const mockData = { success: true }
        const postData = { name: 'New Product' }

        mockedFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        } as Response)

        const result = await apiClient('/products', {
            method: 'POST',
            body: JSON.stringify(postData),
        })

        expect(mockedFetch).toHaveBeenCalledWith(
            'https://itx-frontend-test.onrender.com/api/products',
            {
                method: 'POST',
                body: JSON.stringify(postData),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        expect(result).toEqual(mockData)
    })

    it('debería incluir headers personalizados', async () => {
        const mockData = { data: 'test' }

        mockedFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        } as Response)

        await apiClient('/products', {
            headers: {
                'Authorization': 'Bearer token',
                'Custom-Header': 'value',
            },
        })

        expect(mockedFetch).toHaveBeenCalledWith(
            'https://itx-frontend-test.onrender.com/api/products',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token',
                    'Custom-Header': 'value',
                },
            }
        )
    })

    it('debería lanzar ApiError cuando la respuesta no es ok', async () => {
        const errorData = { message: 'Product not found' }

        mockedFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: vi.fn().mockResolvedValue(errorData),
        } as unknown as Response)

        try {
            await apiClient('/products/999')
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError)
            if (error instanceof ApiError) {
                expect(error.message).toBe('Product not found')
                expect(error.status).toBe(404)
                expect(error.data).toEqual(errorData)
            }
        }
    })

    it('debería lanzar ApiError con mensaje genérico cuando no hay errorData', async () => {
        mockedFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        } as unknown as Response)

        try {
            await apiClient('/products')
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError)
            if (error instanceof ApiError) {
                expect(error.message).toBe('HTTP Error: 500')
                expect(error.status).toBe(500)
                expect(error.data).toBeNull()
            }
        }
    })

    it('debería manejar errores de red', async () => {
        mockedFetch.mockRejectedValueOnce(new Error('Network error'))

        try {
            await apiClient('/products')
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError)
            if (error instanceof ApiError) {
                expect(error.message).toBe('Network error')
                expect(error.status).toBeUndefined()
            }
        }
    })

    it('debería manejar errores desconocidos', async () => {
        mockedFetch.mockRejectedValueOnce('Unknown error')

        try {
            await apiClient('/products')
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError)
            if (error instanceof ApiError) {
                expect(error.message).toBe('Error desconocido al comunicarse con la API')
            }
        }
    })

    it('debería construir la URL correctamente', async () => {
        mockedFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        } as Response)

        await apiClient('/products/1')

        expect(mockedFetch).toHaveBeenCalledWith(
            'https://itx-frontend-test.onrender.com/api/products/1',
            expect.any(Object)
        )
    })

    it('debería manejar endpoints que empiezan sin /', async () => {
        mockedFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        } as Response)

        await apiClient('products')

        expect(mockedFetch).toHaveBeenCalledWith(
            'https://itx-frontend-test.onrender.com/api/products',
            expect.any(Object)
        )
    })
})

describe('ApiError', () => {
    it('debería crear instancia correctamente con todos los parámetros', () => {
        const error = new ApiError('Test error', 400, { field: 'invalid' })

        expect(error.name).toBe('ApiError')
        expect(error.message).toBe('Test error')
        expect(error.status).toBe(400)
        expect(error.data).toEqual({ field: 'invalid' })
        expect(error).toBeInstanceOf(Error)
    })

    it('debería crear instancia solo con mensaje', () => {
        const error = new ApiError('Simple error')

        expect(error.message).toBe('Simple error')
        expect(error.status).toBeUndefined()
        expect(error.data).toBeUndefined()
    })
})