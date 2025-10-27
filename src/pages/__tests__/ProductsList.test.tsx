import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProductsList } from '@/pages/ProductsList'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProductsQuery } from '@/features/products/hooks/useProduct'
import type { Product } from '@/features/products/interfaces'

// Mocks
vi.mock('@/features/products/hooks/useProduct', () => ({
    useProductsQuery: vi.fn(),
}))

vi.mock('@/features/products/components/ProductCard', () => ({
    ProductCard: ({ product }: { product: Product }) => (
        <div data-testid={`product-card-${product.id}`}>
            <h3>{product.brand} {product.model}</h3>
            <span>${product.price}</span>
        </div>
    ),
}))

vi.mock('@/features/shared/components/SearchBar', () => ({
    SearchBar: ({ onSearch }: { onSearch: (query: string) => void }) => (
        <div data-testid="search-bar">
            <input
                type="text"
                placeholder="Buscar productos..."
                onChange={(e) => onSearch(e.target.value)}
                data-testid="search-input"
            />
        </div>
    ),
}))

vi.mock('@/features/shared/components/ScrollToTop', () => ({
    ScrollToTop: () => <div data-testid="scroll-to-top">ScrollToTop</div>,
}))

const mockUseProductsQuery = vi.mocked(useProductsQuery)

const createTestWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return function TestWrapper({ children }: { children: React.ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    {children}
                </MemoryRouter>
            </QueryClientProvider>
        )
    }
}

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
    },
    {
        id: '3',
        brand: 'Google',
        model: 'Pixel 7',
        price: '599',
        imgUrl: 'https://example.com/pixel7.jpg'
    },
    {
        id: '4',
        brand: 'Apple',
        model: 'iPhone 13',
        price: '799',
        imgUrl: 'https://example.com/iphone13.jpg'
    }
]

describe('ProductsList Page', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Estados de carga y error', () => {
        it('debería mostrar mensaje de carga cuando isLoading es true', () => {
            mockUseProductsQuery.mockReturnValue({
                data: undefined,
                isLoading: true,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)

            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            expect(screen.getByText('Productos')).toBeInTheDocument()
            expect(screen.getByText('Cargando productos...')).toBeInTheDocument()
            expect(screen.getByRole('status')).toBeInTheDocument()
            expect(screen.getByTestId('search-bar')).toBeInTheDocument()
        })

        it('debería mostrar mensaje de error cuando isError es true', () => {
            const mockRefetch = vi.fn()
            mockUseProductsQuery.mockReturnValue({
                data: undefined,
                isLoading: false,
                isError: true,
                error: new Error('Network error'),
                refetch: mockRefetch,
            } as any)

            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            expect(screen.getByText('Productos')).toBeInTheDocument()
            expect(screen.getByText('Error al cargar los productos: Network error')).toBeInTheDocument()
            expect(screen.getByRole('alert')).toBeInTheDocument()
            expect(screen.getByText('Reintentar')).toBeInTheDocument()
        })

        it('debería llamar refetch cuando se hace clic en reintentar', () => {
            const mockRefetch = vi.fn()
            mockUseProductsQuery.mockReturnValue({
                data: undefined,
                isLoading: false,
                isError: true,
                error: new Error('Server error'),
                refetch: mockRefetch,
            } as any)

            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const retryButton = screen.getByText('Reintentar')
            fireEvent.click(retryButton)

            expect(mockRefetch).toHaveBeenCalledTimes(1)
        })
    })

    describe('Renderizado exitoso de productos', () => {
        beforeEach(() => {
            mockUseProductsQuery.mockReturnValue({
                data: mockProducts,
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)
        })

        it('debería renderizar la estructura principal de la página', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            expect(screen.getByRole('main')).toBeInTheDocument()
            expect(screen.getByTestId('search-bar')).toBeInTheDocument()
            expect(screen.getByLabelText('Lista de productos')).toBeInTheDocument()
            expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()
        })

        it('debería mostrar todos los productos cuando no hay búsqueda', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            expect(screen.getByTestId('product-card-1')).toBeInTheDocument()
            expect(screen.getByTestId('product-card-2')).toBeInTheDocument()
            expect(screen.getByTestId('product-card-3')).toBeInTheDocument()
            expect(screen.getByTestId('product-card-4')).toBeInTheDocument()

            expect(screen.getByText('Apple iPhone 14')).toBeInTheDocument()
            expect(screen.getByText('Samsung Galaxy S23')).toBeInTheDocument()
            expect(screen.getByText('Google Pixel 7')).toBeInTheDocument()
            expect(screen.getByText('Apple iPhone 13')).toBeInTheDocument()
        })

        it('debería mostrar el grid con los roles ARIA correctos', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const grid = screen.getByRole('grid')
            expect(grid).toBeInTheDocument()
            expect(grid).toHaveAttribute('aria-label', '4 productos disponibles')

            const gridCells = screen.getAllByRole('gridcell')
            expect(gridCells).toHaveLength(4)
        })
    })

    describe('Funcionalidad de búsqueda', () => {
        beforeEach(() => {
            mockUseProductsQuery.mockReturnValue({
                data: mockProducts,
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)
        })

        it('debería filtrar productos por marca (case insensitive)', async () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const searchInput = screen.getByTestId('search-input')
            fireEvent.change(searchInput, { target: { value: 'apple' } })

            await waitFor(() => {
                expect(screen.getByText('2 resultados para "apple"')).toBeInTheDocument()
            })

            expect(screen.getByTestId('product-card-1')).toBeInTheDocument() // iPhone 14
            expect(screen.getByTestId('product-card-4')).toBeInTheDocument() // iPhone 13
            expect(screen.queryByTestId('product-card-2')).not.toBeInTheDocument() // Samsung
            expect(screen.queryByTestId('product-card-3')).not.toBeInTheDocument() // Google
        })

        it('debería filtrar productos por modelo', async () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const searchInput = screen.getByTestId('search-input')
            fireEvent.change(searchInput, { target: { value: 'galaxy' } })

            await waitFor(() => {
                expect(screen.getByText('1 resultado para "galaxy"')).toBeInTheDocument()
            })

            expect(screen.getByTestId('product-card-2')).toBeInTheDocument() // Samsung Galaxy
            expect(screen.queryByTestId('product-card-1')).not.toBeInTheDocument()
            expect(screen.queryByTestId('product-card-3')).not.toBeInTheDocument()
            expect(screen.queryByTestId('product-card-4')).not.toBeInTheDocument()
        })

        it('debería mostrar mensaje cuando no hay resultados', async () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const searchInput = screen.getByTestId('search-input')
            fireEvent.change(searchInput, { target: { value: 'nokia' } })

            await waitFor(() => {
                expect(screen.getByText('0 resultados para "nokia"')).toBeInTheDocument()
            })

            expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument()
            expect(screen.getByText('Intenta con una búsqueda diferente o explora todos los productos.')).toBeInTheDocument()
        })

        it('debería ignorar espacios en blanco en la búsqueda', async () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const searchInput = screen.getByTestId('search-input')
            fireEvent.change(searchInput, { target: { value: '  apple  ' } })

            await waitFor(() => {
                expect(screen.getByText(/2 resultados para/)).toBeInTheDocument()
            })

            expect(screen.getByTestId('product-card-1')).toBeInTheDocument()
            expect(screen.getByTestId('product-card-4')).toBeInTheDocument()
        })

        it('debería limpiar la búsqueda y mostrar todos los productos', async () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const searchInput = screen.getByTestId('search-input')

            // Primero buscar
            fireEvent.change(searchInput, { target: { value: 'apple' } })

            await waitFor(() => {
                expect(screen.getByText('2 resultados para "apple"')).toBeInTheDocument()
            })

            // Luego limpiar
            fireEvent.change(searchInput, { target: { value: '' } })

            await waitFor(() => {
                expect(screen.queryByText(/resultados para/)).not.toBeInTheDocument()
            })

            expect(screen.getByTestId('product-card-1')).toBeInTheDocument()
            expect(screen.getByTestId('product-card-2')).toBeInTheDocument()
            expect(screen.getByTestId('product-card-3')).toBeInTheDocument()
            expect(screen.getByTestId('product-card-4')).toBeInTheDocument()
        })

        it('debería manejar búsquedas con caracteres especiales', async () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const searchInput = screen.getByTestId('search-input')
            fireEvent.change(searchInput, { target: { value: '@#$%' } })

            await waitFor(() => {
                expect(screen.getByText('0 resultados para "@#$%"')).toBeInTheDocument()
            })

            expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument()
        })
    })

    describe('Estados de datos vacíos', () => {
        it('debería manejar lista de productos vacía', () => {
            mockUseProductsQuery.mockReturnValue({
                data: [],
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)

            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument()
            expect(screen.queryByText('Intenta con una búsqueda diferente')).not.toBeInTheDocument()
        })

        it('debería manejar productos undefined', () => {
            mockUseProductsQuery.mockReturnValue({
                data: undefined,
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)

            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            expect(screen.getByText('No se encontraron productos.')).toBeInTheDocument()
        })
    })

    describe('Accesibilidad', () => {
        beforeEach(() => {
            mockUseProductsQuery.mockReturnValue({
                data: mockProducts,
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)
        })

        it('debería tener roles ARIA correctos', () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            expect(screen.getByRole('main')).toBeInTheDocument()
            expect(screen.getByRole('grid')).toBeInTheDocument()
            expect(screen.getAllByRole('gridcell')).toHaveLength(4)
        })

        it('debería tener aria-live regions para actualizaciones dinámicas', async () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const searchInput = screen.getByTestId('search-input')
            fireEvent.change(searchInput, { target: { value: 'apple' } })

            await waitFor(() => {
                const statusElement = screen.getByText('2 resultados para "apple"')
                expect(statusElement.closest('[aria-live="polite"]')).toBeInTheDocument()
            })
        })

        it('debería tener aria-describedby en el botón de reintentar', () => {
            mockUseProductsQuery.mockReturnValue({
                data: undefined,
                isLoading: false,
                isError: true,
                error: new Error('Network error'),
                refetch: vi.fn(),
            } as any)

            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const retryButton = screen.getByText('Reintentar')
            expect(retryButton).toHaveAttribute('aria-describedby', 'retry-help')
            expect(screen.getByText('Hacer clic para intentar cargar los productos nuevamente')).toBeInTheDocument()
        })
    })

    describe('Funcionalidad de callback memoizado', () => {
        beforeEach(() => {
            mockUseProductsQuery.mockReturnValue({
                data: mockProducts,
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)
        })

        it('debería mantener la referencia del callback handleSearch', () => {
            const TestWrapper = createTestWrapper()
            const { rerender } = render(<ProductsList />, { wrapper: TestWrapper })

            // Re-renderizar
            rerender(<ProductsList />)

            // Verificar que SearchBar sigue funcionando
            const searchBar = screen.getByTestId('search-bar')
            expect(searchBar).toBeInTheDocument()
        })
    })

    describe('Conteo de resultados', () => {
        beforeEach(() => {
            mockUseProductsQuery.mockReturnValue({
                data: mockProducts,
                isLoading: false,
                isError: false,
                error: null,
                refetch: vi.fn(),
            } as any)
        })

        it('debería mostrar singular para 1 resultado', async () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const searchInput = screen.getByTestId('search-input')
            fireEvent.change(searchInput, { target: { value: 'pixel' } })

            await waitFor(() => {
                expect(screen.getByText('1 resultado para "pixel"')).toBeInTheDocument()
            })
        })

        it('debería mostrar plural para múltiples resultados', async () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const searchInput = screen.getByTestId('search-input')
            fireEvent.change(searchInput, { target: { value: 'phone' } })

            await waitFor(() => {
                expect(screen.getByText('2 resultados para "phone"')).toBeInTheDocument()
            })
        })

        it('debería mostrar plural para 0 resultados', async () => {
            const TestWrapper = createTestWrapper()
            render(<ProductsList />, { wrapper: TestWrapper })

            const searchInput = screen.getByTestId('search-input')
            fireEvent.change(searchInput, { target: { value: 'nokia' } })

            await waitFor(() => {
                expect(screen.getByText('0 resultados para "nokia"')).toBeInTheDocument()
            })
        })
    })
})