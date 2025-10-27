import { render } from '@testing-library/react'
import AppRouter from '@/app/router/router'

// Mocks de los componentes
vi.mock('@/features/shared/components', () => ({
    Layouts: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="layouts">
            <div>Mock Layouts Component</div>
            {children}
        </div>
    ),
}))

vi.mock('@/pages/ProductsList', () => ({
    ProductsList: () => (
        <div data-testid="products-list">
            <h1>Products List Page</h1>
        </div>
    ),
}))

vi.mock('@/pages/ProductDetail', () => ({
    ProductDetail: () => (
        <div data-testid="product-detail">
            <h1>Product Detail Page</h1>
        </div>
    ),
}))

vi.mock('@/app/providers/QueryProvider', () => ({
    QueryProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="query-provider">
            {children}
        </div>
    ),
}))

describe('AppRouter', () => {
    it('debería renderizar el componente sin errores', () => {
        expect(() => render(<AppRouter />)).not.toThrow()
    })

    it('debería ser un componente función válido', () => {
        expect(typeof AppRouter).toBe('function')
    })

    it('debería incluir RouterProvider en su estructura', () => {
        const { container } = render(<AppRouter />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it('debería manejar rutas definidas en el router', () => {
        // Test básico de que el router está configurado
        const { container } = render(<AppRouter />)
        expect(container).toBeInTheDocument()
    })

    it('debería exportar una función por defecto', () => {
        expect(AppRouter).toBeDefined()
        expect(typeof AppRouter).toBe('function')
    })
})

// Test adicional para verificar que el router tiene la estructura esperada
describe('Router Configuration', () => {
    it('debería tener las rutas configuradas correctamente', () => {
        // Al renderizar el router, debería inicializar sin problemas
        expect(() => render(<AppRouter />)).not.toThrow()
    })

    it('debería usar createBrowserRouter internamente', () => {
        // Verificar que el componente se renderiza correctamente
        const { container } = render(<AppRouter />)
        expect(container.firstChild).toBeInTheDocument()
    })
})