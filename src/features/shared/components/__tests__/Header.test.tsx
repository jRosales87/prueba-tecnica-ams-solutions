import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from '@/features/shared/components/Header'
import { useCartStore } from '@/features/cart/store'

// Mock del store de carrito
vi.mock('@/features/cart/store', () => ({
    useCartStore: vi.fn(),
}))

const mockedUseCartStore = vi.mocked(useCartStore)

// Helper para renderizar el componente con router y QueryClient
const renderWithProviders = (component: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    })

    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                {component}
            </MemoryRouter>
        </QueryClientProvider>
    )
}

describe('Header Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('debería renderizar el título de E-Commerce', () => {
        mockedUseCartStore.mockReturnValue(0)

        renderWithProviders(<Header />)

        const title = screen.getByRole('link', { name: /ir a la página principal de e-commerce/i })
        expect(title).toBeInTheDocument()
        expect(title).toHaveTextContent('E-Commerce')
    })

    it('debería mostrar el carrito sin contador cuando está vacío', () => {
        mockedUseCartStore.mockReturnValue(0)

        renderWithProviders(<Header />)

        const cartButton = screen.getByRole('button', { name: /carrito de compras vacío/i })
        expect(cartButton).toBeInTheDocument()

        const counter = screen.queryByText('0')
        expect(counter).not.toBeInTheDocument()
    })

    it('debería mostrar el contador del carrito cuando hay productos', () => {
        mockedUseCartStore.mockReturnValue(3)

        renderWithProviders(<Header />)

        const cartButton = screen.getByRole('button', { name: /carrito de compras con 3 artículos/i })
        expect(cartButton).toBeInTheDocument()

        const counter = screen.getByText('3')
        expect(counter).toBeInTheDocument()
        expect(counter).toHaveClass('bg-red-600')
    })

    it('debería usar texto singular cuando hay 1 artículo en el carrito', () => {
        mockedUseCartStore.mockReturnValue(1)

        renderWithProviders(<Header />)

        const cartButton = screen.getByRole('button', { name: /carrito de compras con 1 artículo/i })
        expect(cartButton).toBeInTheDocument()
    })

    it('debería tener navegación principal con role navigation', () => {
        mockedUseCartStore.mockReturnValue(0)

        renderWithProviders(<Header />)

        const nav = screen.getByRole('navigation', { name: /navegación principal/i })
        expect(nav).toBeInTheDocument()
    })

    it('debería tener header con role banner', () => {
        mockedUseCartStore.mockReturnValue(0)

        renderWithProviders(<Header />)

        const header = screen.getByRole('banner')
        expect(header).toBeInTheDocument()
        expect(header).toHaveClass('sticky', 'top-0')
    })
})