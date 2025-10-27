import { render, screen, fireEvent } from '@testing-library/react'
import { ProductDetail } from '@/pages/ProductDetail'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProductQuery } from '@/features/products/hooks/useProduct'
import type { ProductDetails } from '@/features/products/interfaces'

// Mocks
vi.mock('@/features/products/hooks/useProduct', () => ({
    useProductQuery: vi.fn(),
}))

vi.mock('@/features/products/components', () => ({
    ProductAction: ({ product }: { product: ProductDetails }) => (
        <div data-testid="product-action">
            <span>ProductAction for {product.model}</span>
        </div>
    ),
}))

const mockUseProductQuery = vi.mocked(useProductQuery)

const createTestWrapper = (productId: string = '1') => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return function TestWrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/product/${productId}`]}>
                    {children}
                </MemoryRouter>
            </QueryClientProvider>
        )
    }
}

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
            { code: 2, name: 'Purple' },
        ],
        storages: [
            { code: 1, name: '128GB' },
            { code: 2, name: '256GB' },
        ],
    },
}

describe('ProductDetail Page', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Estados de carga y error', () => {
        it('debería mostrar mensaje de carga cuando isLoading es true', () => {
            mockUseProductQuery.mockReturnValue({
                data: undefined,
                isLoading: true,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)

            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Cargando detalles del producto...')).toBeInTheDocument()
            expect(screen.getByRole('status')).toBeInTheDocument()
        })

        it('debería mostrar mensaje de error cuando isError es true', () => {
            const mockRefetch = vi.fn()
            mockUseProductQuery.mockReturnValue({
                data: undefined,
                isLoading: false,
                isError: true,
                error: new Error('Product not found'),
                refetch: mockRefetch,
            } as any)

            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Error: Product not found')).toBeInTheDocument()
            expect(screen.getByRole('alert')).toBeInTheDocument()
            expect(screen.getByText('Reintentar')).toBeInTheDocument()
        })

        it('debería llamar refetch cuando se hace clic en reintentar', async () => {
            const mockRefetch = vi.fn()
            mockUseProductQuery.mockReturnValue({
                data: undefined,
                isLoading: false,
                isError: true,
                error: new Error('Network error'),
                refetch: mockRefetch,
            } as any)

            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            const retryButton = screen.getByText('Reintentar')
            fireEvent.click(retryButton)

            expect(mockRefetch).toHaveBeenCalledTimes(1)
        })
    })

    describe('Renderizado exitoso del producto', () => {
        beforeEach(() => {
            mockUseProductQuery.mockReturnValue({
                data: mockProductDetails,
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)
        })

        it('debería renderizar la estructura principal de la página', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByRole('main')).toBeInTheDocument()
            expect(screen.getByRole('article')).toBeInTheDocument()
            expect(screen.getByText('Volver al listado')).toBeInTheDocument()
        })

        it('debería mostrar el botón de volver al listado con enlace correcto', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            const backLink = screen.getByLabelText('Volver a la lista de productos')
            expect(backLink).toBeInTheDocument()
            expect(backLink.getAttribute('href')).toBe('/')
        })

        it('debería mostrar la imagen del producto con atributos correctos', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            const productImage = screen.getByAltText('Imagen del iPhone 14 de Apple')
            expect(productImage).toBeInTheDocument()
            expect(productImage.getAttribute('src')).toBe('https://example.com/iphone14.jpg')
        })

        it('debería renderizar el componente ProductAction con el producto', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByTestId('product-action')).toBeInTheDocument()
            expect(screen.getByText('ProductAction for iPhone 14')).toBeInTheDocument()
        })

        it('debería mostrar el título de detalles técnicos', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Detalles Técnicos')).toBeInTheDocument()
            const technicalSection = screen.getByText('Detalles Técnicos').closest('section')
            expect(technicalSection).toBeInTheDocument()
        })
    })

    describe('Renderizado de especificaciones de conectividad', () => {
        beforeEach(() => {
            mockUseProductQuery.mockReturnValue({
                data: mockProductDetails,
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)
        })

        it('debería mostrar todas las especificaciones de conectividad', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Conectividad')).toBeInTheDocument()
            expect(screen.getByText('Tecnología de red:')).toBeInTheDocument()
            expect(screen.getByText('GSM / HSPA / LTE / 5G')).toBeInTheDocument()
            expect(screen.getByText('Velocidad de red:')).toBeInTheDocument()
            expect(screen.getByText('HSPA 42.2/5.76 Mbps, LTE-A')).toBeInTheDocument()
            expect(screen.getByText('GPRS:')).toBeInTheDocument()
            expect(screen.getByText('EDGE:')).toBeInTheDocument()
            expect(screen.getByText('WLAN:')).toBeInTheDocument()
            expect(screen.getByText('Wi-Fi 802.11 a/b/g/n/ac/6')).toBeInTheDocument()
        })

        it('debería mostrar Bluetooth como array unido por comas', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Bluetooth:')).toBeInTheDocument()
            expect(screen.getByText('5.3, A2DP, LE')).toBeInTheDocument()
        })

        it('debería mostrar GPS, NFC, Radio y USB', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('GPS:')).toBeInTheDocument()
            expect(screen.getByText('NFC:')).toBeInTheDocument()
            expect(screen.getByText('Radio:')).toBeInTheDocument()
            expect(screen.getByText('USB:')).toBeInTheDocument()
            expect(screen.getByText('Lightning')).toBeInTheDocument()
        })
    })

    describe('Renderizado de especificaciones generales', () => {
        beforeEach(() => {
            mockUseProductQuery.mockReturnValue({
                data: mockProductDetails,
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)
        })

        it('debería mostrar información básica del producto', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Especificaciones')).toBeInTheDocument()
            expect(screen.getByText('Anunciado:')).toBeInTheDocument()
            expect(screen.getByText('2022, September 07')).toBeInTheDocument()
            expect(screen.getByText('Estado:')).toBeInTheDocument()
            expect(screen.getByText('Available')).toBeInTheDocument()
            expect(screen.getByText('Dimensiones:')).toBeInTheDocument()
            expect(screen.getByText('146.7 x 71.5 x 7.8 mm')).toBeInTheDocument()
            expect(screen.getByText('Peso:')).toBeInTheDocument()
            expect(screen.getByText('172 g')).toBeInTheDocument()
        })

        it('debería mostrar especificaciones de pantalla', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Tipo de pantalla:')).toBeInTheDocument()
            expect(screen.getByText('Super Retina XDR OLED')).toBeInTheDocument()
            expect(screen.getByText('Resolución:')).toBeInTheDocument()
            expect(screen.getByText('1170 x 2532 pixels')).toBeInTheDocument()
            expect(screen.getByText('Tamaño de pantalla:')).toBeInTheDocument()
            expect(screen.getByText('6.1 inches')).toBeInTheDocument()
        })

        it('debería mostrar especificaciones de hardware', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Sistema operativo:')).toBeInTheDocument()
            expect(screen.getByText('iOS 16')).toBeInTheDocument()
            expect(screen.getByText('CPU:')).toBeInTheDocument()
            expect(screen.getByText('Hexa-core A16 Bionic')).toBeInTheDocument()
            expect(screen.getByText('RAM:')).toBeInTheDocument()
            expect(screen.getByText('6 GB')).toBeInTheDocument()
        })

        it('debería mostrar memoria interna como array unido por comas', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Memoria interna:')).toBeInTheDocument()
            expect(screen.getByText('128 GB, 256 GB, 512 GB')).toBeInTheDocument()
        })

        it('debería mostrar especificaciones de cámara', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Cámara principal:')).toBeInTheDocument()
            expect(screen.getByText('48 MP, 12 MP')).toBeInTheDocument()
            expect(screen.getByText('Cámara secundaria:')).toBeInTheDocument()
            expect(screen.getByText('12 MP')).toBeInTheDocument()
        })

        it('debería mostrar especificaciones de audio', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Altavoz:')).toBeInTheDocument()
            expect(screen.getByText('Jack de audio:')).toBeInTheDocument()
        })

        it('debería mostrar sensores y batería', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Sensores:')).toBeInTheDocument()
            expect(screen.getByText('Face ID, accelerometer, gyro, proximity, compass, barometer')).toBeInTheDocument()
            expect(screen.getByText('Batería:')).toBeInTheDocument()
            expect(screen.getByText('Li-Ion 3279 mAh')).toBeInTheDocument()
        })
    })

    describe('Manejo de propiedades opcionales', () => {
        it('debería manejar producto sin algunas propiedades opcionales', () => {
            const minimalProduct: ProductDetails = {
                ...mockProductDetails,
                networkSpeed: '',
                gprs: '',
                edge: '',
                wlan: '',
                radio: '',
                audioJack: '',
                sensors: '',
            }

            mockUseProductQuery.mockReturnValue({
                data: minimalProduct,
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)

            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            // Debería seguir mostrando las etiquetas pero sin contenido
            expect(screen.queryByText('Velocidad de red:')).not.toBeInTheDocument()
            expect(screen.queryByText('GPRS:')).not.toBeInTheDocument()
            expect(screen.queryByText('EDGE:')).not.toBeInTheDocument()
            expect(screen.queryByText('WLAN:')).not.toBeInTheDocument()
            expect(screen.queryByText('Radio:')).not.toBeInTheDocument()
            expect(screen.queryByText('Jack de audio:')).not.toBeInTheDocument()
            expect(screen.queryByText('Sensores:')).not.toBeInTheDocument()
        })

        it('debería manejar arrays vacíos en propiedades', () => {
            const productWithEmptyArrays: ProductDetails = {
                ...mockProductDetails,
                internalMemory: [],
                primaryCamera: [],
                bluetooth: [],
            }

            mockUseProductQuery.mockReturnValue({
                data: productWithEmptyArrays,
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)

            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            // Los arrays vacíos aún son truthy, por lo que las etiquetas aparecen pero con contenido vacío
            expect(screen.getByText('Memoria interna:')).toBeInTheDocument()
            expect(screen.getByText('Cámara principal:')).toBeInTheDocument()
            expect(screen.getByText('Bluetooth:')).toBeInTheDocument()

            // Pero el contenido debería estar vacío (solo comas o contenido vacío)
            const internalMemoryElement = screen.getByText('Memoria interna:').nextElementSibling
            expect(internalMemoryElement?.textContent).toBe('')

            const primaryCameraElement = screen.getByText('Cámara principal:').nextElementSibling
            expect(primaryCameraElement?.textContent).toBe('')

            const bluetoothElement = screen.getByText('Bluetooth:').nextElementSibling
            expect(bluetoothElement?.textContent).toBe('')
        })
    })

    describe('Accesibilidad', () => {
        beforeEach(() => {
            mockUseProductQuery.mockReturnValue({
                data: mockProductDetails,
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)
        })

        it('debería tener roles ARIA correctos', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByRole('main')).toBeInTheDocument()
            expect(screen.getByRole('article')).toBeInTheDocument()
        })

        it('debería tener aria-label en el enlace de volver', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductDetail />, { wrapper: TestWrapper })

            const backLink = screen.getByLabelText('Volver a la lista de productos')
            expect(backLink).toBeInTheDocument()
        })
    })

    describe('Integración con useParams', () => {
        it('debería funcionar con diferentes IDs de producto', () => {
            mockUseProductQuery.mockReturnValue({
                data: { ...mockProductDetails, id: '999' },
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)

            const TestWrapper = createTestWrapper('999')
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByTestId('product-action')).toBeInTheDocument()
        })

        it('debería manejar ID undefined del useParams', () => {
            mockUseProductQuery.mockReturnValue({
                data: undefined,
                isLoading: false,
                isError: true,
                error: new Error('Invalid ID'),
                refetch: vi.fn(),
            } as any)

            // Simular useParams sin ID
            const TestWrapper = createTestWrapper('')
            render(<ProductDetail />, { wrapper: TestWrapper })

            expect(screen.getByText('Error: Invalid ID')).toBeInTheDocument()
        })
    })
})