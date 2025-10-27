import { render, screen } from '@testing-library/react'
import App from '@/App'

// Mock del router para aislar el componente App
let mockRouterCalled = false;
vi.mock('@/app/router/router', () => ({
    default: () => {
        mockRouterCalled = true;
        return (
            <div data-testid="app-router">
                <h1>Mock AppRouter</h1>
                <p>Router is working</p>
            </div>
        );
    },
}))

describe('App Component', () => {
    beforeEach(() => {
        mockRouterCalled = false;
    });

    it('debería renderizar el componente AppRouter', () => {
        render(<App />)

        expect(screen.getByTestId('app-router')).toBeInTheDocument()
        expect(screen.getByText('Mock AppRouter')).toBeInTheDocument()
        expect(screen.getByText('Router is working')).toBeInTheDocument()
    })

    it('debería ser un componente función válido', () => {
        expect(typeof App).toBe('function')
        expect(App.name).toBe('App')
    })

    it('debería renderizar sin errores', () => {
        expect(() => render(<App />)).not.toThrow()
    })

    it('debería delegar toda la funcionalidad al AppRouter', () => {
        const { container } = render(<App />)

        // Verificar que el contenedor solo contiene el router mockeado
        expect(container.firstChild).toBeInTheDocument()
        expect(screen.getByTestId('app-router')).toBeInTheDocument()
        expect(mockRouterCalled).toBe(true)
    })

    it('debería mantener una estructura simple y limpia', () => {
        const { container } = render(<App />)

        // El componente App debería ser muy simple, solo renderizando AppRouter
        expect(container.children).toHaveLength(1)
    })

    it('debería llamar correctamente a AppRouter en cada renderizado', () => {
        const { rerender } = render(<App />)
        expect(mockRouterCalled).toBe(true)

        mockRouterCalled = false;
        rerender(<App />)
        expect(mockRouterCalled).toBe(true)
    })

    it('debería tener la exportación por defecto correcta', () => {
        expect(App).toBeDefined()
        expect(() => App()).not.toThrow()
    })
})