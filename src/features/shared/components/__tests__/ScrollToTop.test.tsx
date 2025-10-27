import { render, screen, fireEvent } from '@testing-library/react'
import { ScrollToTop } from '../ScrollToTop'

// Mock del hook useScrollToTop
const mockUseScrollToTop = vi.fn()
vi.mock('../../hooks/useScrollToTop', () => ({
    useScrollToTop: (threshold: number) => mockUseScrollToTop(threshold)
}))

// Mock de window.scrollTo
const mockScrollTo = vi.fn()
Object.defineProperty(window, 'scrollTo', {
    value: mockScrollTo,
    writable: true
})

describe('ScrollToTop Component', () => {
    beforeEach(() => {
        mockUseScrollToTop.mockClear()
        mockScrollTo.mockClear()
    })

    it('no debería renderizar cuando showButton es false', () => {
        mockUseScrollToTop.mockReturnValue(false)

        const { container } = render(<ScrollToTop />)

        expect(container.firstChild).toBeNull()
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('debería renderizar el botón cuando showButton es true', () => {
        mockUseScrollToTop.mockReturnValue(true)

        render(<ScrollToTop />)

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()
        expect(button).toHaveAttribute('aria-label', 'Volver al inicio de la página')
        expect(button).toHaveAttribute('title', 'Volver arriba')
    })

    it('debería usar el threshold por defecto de 300', () => {
        mockUseScrollToTop.mockReturnValue(true)

        render(<ScrollToTop />)

        expect(mockUseScrollToTop).toHaveBeenCalledWith(300)
    })

    it('debería usar el threshold personalizado cuando se proporciona', () => {
        mockUseScrollToTop.mockReturnValue(true)
        const customThreshold = 500

        render(<ScrollToTop threshold={customThreshold} />)

        expect(mockUseScrollToTop).toHaveBeenCalledWith(customThreshold)
    })

    it('debería llamar a window.scrollTo con comportamiento smooth por defecto al hacer click', () => {
        mockUseScrollToTop.mockReturnValue(true)

        render(<ScrollToTop />)

        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockScrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth'
        })
    })

    it('debería usar el comportamiento personalizado cuando se proporciona', () => {
        mockUseScrollToTop.mockReturnValue(true)

        render(<ScrollToTop behavior="auto" />)

        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockScrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'auto'
        })
    })

    it('debería tener las clases CSS correctas', () => {
        mockUseScrollToTop.mockReturnValue(true)

        render(<ScrollToTop />)

        const button = screen.getByRole('button')
        expect(button).toHaveClass(
            'fixed', 'bottom-6', 'right-6', 'z-50', 'p-3',
            'bg-blue-600', 'text-white', 'rounded-full', 'shadow-lg',
            'hover:bg-blue-700', 'focus:outline-none', 'focus:ring-2',
            'focus:ring-blue-500', 'focus:ring-offset-2', 'transition-all',
            'duration-300', 'hover:scale-110', 'active:scale-95', 'cursor-pointer'
        )
    })

    it('debería renderizar el icono ChevronUp con aria-hidden', () => {
        mockUseScrollToTop.mockReturnValue(true)

        render(<ScrollToTop />)

        const icon = screen.getByRole('button').querySelector('svg')
        expect(icon).toBeInTheDocument()
        expect(icon).toHaveAttribute('aria-hidden', 'true')
        expect(icon).toHaveClass('w-6', 'h-6')
    })

    it('debería manejar múltiples clicks correctamente', () => {
        mockUseScrollToTop.mockReturnValue(true)

        render(<ScrollToTop />)

        const button = screen.getByRole('button')

        fireEvent.click(button)
        fireEvent.click(button)
        fireEvent.click(button)

        expect(mockScrollTo).toHaveBeenCalledTimes(3)
        expect(mockScrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth'
        })
    })

    it('debería funcionar con diferentes combinaciones de props', () => {
        mockUseScrollToTop.mockReturnValue(true)

        render(<ScrollToTop threshold={100} behavior="instant" />)

        expect(mockUseScrollToTop).toHaveBeenCalledWith(100)

        const button = screen.getByRole('button')
        fireEvent.click(button)

        expect(mockScrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'instant'
        })
    })

    it('debería cambiar la visibilidad cuando cambia showButton', () => {
        // Inicialmente oculto
        mockUseScrollToTop.mockReturnValue(false)
        const { rerender } = render(<ScrollToTop />)
        expect(screen.queryByRole('button')).not.toBeInTheDocument()

        // Luego visible
        mockUseScrollToTop.mockReturnValue(true)
        rerender(<ScrollToTop />)
        expect(screen.getByRole('button')).toBeInTheDocument()

        // Luego oculto otra vez
        mockUseScrollToTop.mockReturnValue(false)
        rerender(<ScrollToTop />)
        expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
})