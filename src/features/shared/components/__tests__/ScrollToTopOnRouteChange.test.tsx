import { render } from '@testing-library/react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { act } from 'react'
import { ScrollToTopOnRouteChange } from '../ScrollToTopOnRouteChange'

// Mock de window.scrollTo
const mockScrollTo = vi.fn()
Object.defineProperty(window, 'scrollTo', {
    value: mockScrollTo,
    writable: true
})

// Componente de prueba que permite navegar
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    )
}

const NavigationTestComponent = () => {
    const navigate = useNavigate()

    return (
        <div>
            <ScrollToTopOnRouteChange />
            <button
                onClick={() => navigate('/page1')}
                data-testid="navigate-page1"
            >
                Go to Page 1
            </button>
            <button
                onClick={() => navigate('/page2')}
                data-testid="navigate-page2"
            >
                Go to Page 2
            </button>
            <button
                onClick={() => navigate('/')}
                data-testid="navigate-home"
            >
                Go to Home
            </button>
        </div>
    )
}

describe('ScrollToTopOnRouteChange Component', () => {
    beforeEach(() => {
        mockScrollTo.mockClear()
    })

    it('debería llamar a window.scrollTo en el montaje inicial', () => {
        render(
            <TestWrapper>
                <ScrollToTopOnRouteChange />
            </TestWrapper>
        )

        expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
        expect(mockScrollTo).toHaveBeenCalledTimes(1)
    })

    it('no debería renderizar contenido visible', () => {
        const { container } = render(
            <TestWrapper>
                <ScrollToTopOnRouteChange />
            </TestWrapper>
        )

        expect(container.firstChild).toBeNull()
    })

    it('debería llamar a scrollTo cuando cambia la ubicación', async () => {
        const { getByTestId } = render(
            <TestWrapper>
                <NavigationTestComponent />
            </TestWrapper>
        )

        // Limpiar la llamada inicial
        mockScrollTo.mockClear()

        // Navegar a una nueva página
        const page1Button = getByTestId('navigate-page1')

        await act(async () => {
            page1Button.click()
        })

        expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
        expect(mockScrollTo).toHaveBeenCalledTimes(1)
    })

    it.skip('debería llamar a scrollTo múltiples veces cuando navega a diferentes rutas', async () => {
        const { getByTestId } = render(
            <TestWrapper>
                <ScrollToTopOnRouteChange />
                <NavigationTestComponent />
            </TestWrapper>
        )

        // Esperar un frame para que se ejecute el efecto inicial
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0))
        })

        // Limpiar la llamada inicial
        mockScrollTo.mockClear()

        // Navegar a página 1
        await act(async () => {
            getByTestId('navigate-page1').click()
            await new Promise(resolve => setTimeout(resolve, 0))
        })

        expect(mockScrollTo).toHaveBeenCalledTimes(1)

        // Navegar a página 2
        await act(async () => {
            getByTestId('navigate-page2').click()
            await new Promise(resolve => setTimeout(resolve, 0))
        })

        expect(mockScrollTo).toHaveBeenCalledTimes(2)

        // Navegar de vuelta a home
        await act(async () => {
            getByTestId('navigate-home').click()
            await new Promise(resolve => setTimeout(resolve, 0))
        })

        expect(mockScrollTo).toHaveBeenCalledTimes(3)

        // Verificar que siempre se llama con los mismos parámetros
        expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
    })

    it('debería funcionar cuando se monta en diferentes rutas', () => {
        // Montar en ruta inicial
        const { unmount } = render(
            <TestWrapper>
                <ScrollToTopOnRouteChange />
            </TestWrapper>
        )

        expect(mockScrollTo).toHaveBeenCalledWith(0, 0)

        unmount()
        mockScrollTo.mockClear()

        // Volver a montar (simula navegación y remontaje)
        render(
            <TestWrapper>
                <ScrollToTopOnRouteChange />
            </TestWrapper>
        )

        expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
    })

    it('debería reaccionar solo a cambios de pathname, no de query params', async () => {
        const TestWithSearch = () => {
            const navigate = useNavigate()

            return (
                <div>
                    <ScrollToTopOnRouteChange />
                    <button
                        onClick={() => navigate('/page?search=test')}
                        data-testid="navigate-with-search"
                    >
                        Search
                    </button>
                    <button
                        onClick={() => navigate('/page?search=other')}
                        data-testid="navigate-with-other-search"
                    >
                        Other Search
                    </button>
                </div>
            )
        }

        const { getByTestId } = render(
            <TestWrapper>
                <TestWithSearch />
            </TestWrapper>
        )

        // Limpiar la llamada inicial
        mockScrollTo.mockClear()

        // Navegar a página con search
        await act(async () => {
            getByTestId('navigate-with-search').click()
        })

        expect(mockScrollTo).toHaveBeenCalledTimes(1)

        // Cambiar solo el query param (mismo pathname)
        await act(async () => {
            getByTestId('navigate-with-other-search').click()
        })

        // No debería llamarse otra vez porque el pathname no cambió
        expect(mockScrollTo).toHaveBeenCalledTimes(1)
    })

    it.skip('debería manejar errores en window.scrollTo gracefully', () => {
        // Mock scrollTo que lanza error
        const errorScrollTo = vi.fn(() => {
            throw new Error('Scroll error')
        })
        Object.defineProperty(window, 'scrollTo', {
            value: errorScrollTo,
            writable: true
        })

        // Verificar que el componente se renderiza sin errores
        const { container } = render(
            <TestWrapper>
                <ScrollToTopOnRouteChange />
            </TestWrapper>
        )

        expect(container).toBeDefined()
        expect(errorScrollTo).toHaveBeenCalledWith(0, 0)

        // Restaurar mock original
        Object.defineProperty(window, 'scrollTo', {
            value: mockScrollTo,
            writable: true
        })
    })
})