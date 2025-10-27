import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProductAction } from '@/features/products/components/ProductAction'
import { useCartStore } from '@/features/cart/store'
import type { ProductDetails } from '@/features/products/interfaces'

// Mock del hook useAddToCartMutation
const mockMutate = vi.fn()
const mockAddToCartMutation = {
    mutate: mockMutate,
    isPending: false,
    isError: false,
    error: null,
}

vi.mock('@/features/cart/hook/useCard', () => ({
    useAddToCartMutation: () => mockAddToCartMutation,
}))

// Mock del store del carrito
vi.mock('@/features/cart/store', () => ({
    useCartStore: vi.fn(),
}))

const mockUseCartStore = vi.mocked(useCartStore)

// Mock de lucide-react icons
vi.mock('lucide-react', () => ({
    Check: () => <div data-testid="check-icon">✓</div>,
    Loader2: () => <div data-testid="loader-icon">⟳</div>,
    ShoppingCart: () => <div data-testid="cart-icon">🛒</div>,
}))

// Producto de prueba
const mockProduct: ProductDetails = {
    id: 'test-product-1',
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
            { code: 3, name: 'Midnight' },
        ],
        storages: [
            { code: 1, name: '128GB' },
            { code: 2, name: '256GB' },
            { code: 3, name: '512GB' },
        ]
    }
}

// Helper para renderizar con QueryClient
const renderWithQueryClient = (component: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return render(
        <QueryClientProvider client={queryClient}>
            {component}
        </QueryClientProvider>
    )
}

describe('ProductAction Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        // Mock del store del carrito
        mockUseCartStore.mockReturnValue(0) // count inicial

        // Reset del mock de mutation
        mockAddToCartMutation.isPending = false
        mockAddToCartMutation.isError = false
        mockAddToCartMutation.error = null
    })

    it('debería renderizar la información básica del producto', () => {
        renderWithQueryClient(<ProductAction product={mockProduct} />)

        expect(screen.getByText('iPhone 14')).toBeInTheDocument()
        expect(screen.getByText('Marca: Apple')).toBeInTheDocument()
        expect(screen.getByText('999 €')).toBeInTheDocument()
        expect(screen.getByText('Precio')).toBeInTheDocument()
    })

    it('debería renderizar todas las opciones de color', () => {
        renderWithQueryClient(<ProductAction product={mockProduct} />)

        expect(screen.getByLabelText('Blue')).toBeInTheDocument()
        expect(screen.getByLabelText('Purple')).toBeInTheDocument()
        expect(screen.getByLabelText('Midnight')).toBeInTheDocument()
    })

    it('debería renderizar todas las opciones de almacenamiento', () => {
        renderWithQueryClient(<ProductAction product={mockProduct} />)

        expect(screen.getByLabelText('128GB')).toBeInTheDocument()
        expect(screen.getByLabelText('256GB')).toBeInTheDocument()
        expect(screen.getByLabelText('512GB')).toBeInTheDocument()
    })

    it('debería tener el primer color y almacenamiento seleccionados por defecto', () => {
        renderWithQueryClient(<ProductAction product={mockProduct} />)

        const firstColor = screen.getByRole('radio', { name: /blue/i })
        const firstStorage = screen.getByRole('radio', { name: /128gb/i })

        expect(firstColor).toBeChecked()
        expect(firstStorage).toBeChecked()
    })

    it('debería permitir cambiar la selección de color', async () => {
        const user = userEvent.setup()
        renderWithQueryClient(<ProductAction product={mockProduct} />)

        const purpleColor = screen.getByRole('radio', { name: /purple/i })
        await user.click(purpleColor)

        expect(purpleColor).toBeChecked()
    })

    it('debería permitir cambiar la selección de almacenamiento', async () => {
        const user = userEvent.setup()
        renderWithQueryClient(<ProductAction product={mockProduct} />)

        const storage256 = screen.getByRole('radio', { name: /256gb/i })
        await user.click(storage256)

        expect(storage256).toBeChecked()
    })

    it('debería renderizar el botón "Añadir al carrito" por defecto', () => {
        renderWithQueryClient(<ProductAction product={mockProduct} />)

        const addButton = screen.getByRole('button', { name: /añadir al carrito/i })
        expect(addButton).toBeInTheDocument()
        expect(addButton).toBeEnabled()
        expect(screen.getByTestId('cart-icon')).toBeInTheDocument()
    })

    it('debería llamar al mutation cuando se hace clic en añadir al carrito', async () => {
        const user = userEvent.setup()
        renderWithQueryClient(<ProductAction product={mockProduct} />)

        const addButton = screen.getByRole('button', { name: /añadir al carrito/i })
        await user.click(addButton)

        expect(mockMutate).toHaveBeenCalledWith(
            {
                id: 'test-product-1',
                colorCode: 1, // Primer color por defecto
                storageCode: 1, // Primer storage por defecto
            },
            expect.any(Object) // callbacks onSuccess/onError
        )
    })

    it('debería llamar al mutation con las selecciones correctas', async () => {
        const user = userEvent.setup()
        renderWithQueryClient(<ProductAction product={mockProduct} />)

        // Cambiar selecciones
        const purpleColor = screen.getByRole('radio', { name: /purple/i })
        const storage512 = screen.getByRole('radio', { name: /512gb/i })

        await user.click(purpleColor)
        await user.click(storage512)

        const addButton = screen.getByRole('button', { name: /añadir al carrito/i })
        await user.click(addButton)

        expect(mockMutate).toHaveBeenCalledWith(
            {
                id: 'test-product-1',
                colorCode: 2, // Purple
                storageCode: 3, // 512GB
            },
            expect.any(Object)
        )
    })

    it('debería mostrar estado de carga cuando isPending es true', () => {
        mockAddToCartMutation.isPending = true

        renderWithQueryClient(<ProductAction product={mockProduct} />)

        expect(screen.getByText('Añadiendo...')).toBeInTheDocument()
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument()

        const addButton = screen.getByRole('button')
        expect(addButton).toBeDisabled()
    })

    it('debería mostrar mensaje de éxito después de agregar al carrito', async () => {
        const user = userEvent.setup()
        renderWithQueryClient(<ProductAction product={mockProduct} />)

        const addButton = screen.getByRole('button', { name: /añadir al carrito/i })
        await user.click(addButton)

        // Simular éxito en la mutation
        const successCallback = mockMutate.mock.calls[0][1].onSuccess
        successCallback()

        await waitFor(() => {
            expect(screen.getByText('¡Añadido al carrito!')).toBeInTheDocument()
            expect(screen.getByTestId('check-icon')).toBeInTheDocument()
        })
    })

    it('debería mostrar mensaje de error cuando la mutation falla', () => {
        mockAddToCartMutation.isError = true
        mockAddToCartMutation.error = new Error('Error de red') as any

        renderWithQueryClient(<ProductAction product={mockProduct} />)

        expect(screen.getByRole('alert')).toBeInTheDocument()
        expect(screen.getByText(/Error de red/)).toBeInTheDocument()
    })

    it('debería deshabilitar el botón cuando no hay precio', () => {
        const productWithoutPrice = { ...mockProduct, price: '' }

        renderWithQueryClient(<ProductAction product={productWithoutPrice} />)

        const addButton = screen.getByRole('button')
        expect(addButton).toBeDisabled()
        expect(screen.getByText('No disponible')).toBeInTheDocument()
    })

    it('debería tener atributos de accesibilidad correctos', () => {
        renderWithQueryClient(<ProductAction product={mockProduct} />)

        // Verificar roles y labels
        expect(screen.getByRole('complementary')).toBeInTheDocument()
        expect(screen.getByRole('form')).toBeInTheDocument()

        // Verificar fieldsets para grupos de opciones
        const colorFieldset = screen.getByRole('group', { name: /seleccionar color/i })
        const storageFieldset = screen.getByRole('group', { name: /seleccionar almacenamiento/i })

        expect(colorFieldset).toBeInTheDocument()
        expect(storageFieldset).toBeInTheDocument()

        // Verificar radiogroups
        const colorRadioGroup = screen.getAllByRole('radiogroup')[0]
        const storageRadioGroup = screen.getAllByRole('radiogroup')[1]

        expect(colorRadioGroup).toHaveAttribute('aria-required', 'true')
        expect(storageRadioGroup).toHaveAttribute('aria-required', 'true')
    })

    it('debería manejar el submit del formulario', async () => {
        const user = userEvent.setup()
        renderWithQueryClient(<ProductAction product={mockProduct} />)

        const form = screen.getByRole('form')
        await user.click(form)

        // Simular submit con Enter
        const addButton = screen.getByRole('button', { name: /añadir al carrito/i })
        await user.click(addButton)

        expect(mockMutate).toHaveBeenCalled()
    })
})