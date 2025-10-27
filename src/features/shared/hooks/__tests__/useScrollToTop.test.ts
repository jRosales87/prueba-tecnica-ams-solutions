import { renderHook, act } from '@testing-library/react'
import { useScrollToTop } from '../useScrollToTop'

// Mock de window.scrollY
Object.defineProperty(window, 'scrollY', {
    writable: true,
    value: 0
})

// Mock de window.addEventListener y removeEventListener
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()

Object.defineProperty(window, 'addEventListener', {
    value: mockAddEventListener,
    writable: true
})

Object.defineProperty(window, 'removeEventListener', {
    value: mockRemoveEventListener,
    writable: true
})

describe('useScrollToTop Hook', () => {
    beforeEach(() => {
        // Resetear mocks
        mockAddEventListener.mockClear()
        mockRemoveEventListener.mockClear()

        // Resetear scrollY
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            value: 0
        })
    })

    it('debería devolver false inicialmente', () => {
        const { result } = renderHook(() => useScrollToTop())

        expect(result.current).toBe(false)
    })

    it('debería agregar event listener de scroll al montar', () => {
        renderHook(() => useScrollToTop())

        expect(mockAddEventListener).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
            { passive: true }
        )
        expect(mockAddEventListener).toHaveBeenCalledTimes(1)
    })

    it('debería remover event listener al desmontar', () => {
        const { unmount } = renderHook(() => useScrollToTop())

        unmount()

        expect(mockRemoveEventListener).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function)
        )
        expect(mockRemoveEventListener).toHaveBeenCalledTimes(1)
    })

    it('debería usar threshold por defecto de 300', () => {
        const { result } = renderHook(() => useScrollToTop())

        // Simular scroll a 299px (debajo del threshold)
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            value: 299
        })

        // Obtener la función de scroll del addEventListener mock
        const scrollHandler = mockAddEventListener.mock.calls[0][1]

        act(() => {
            scrollHandler()
        })

        expect(result.current).toBe(false)

        // Simular scroll a 301px (arriba del threshold)
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            value: 301
        })

        act(() => {
            scrollHandler()
        })

        expect(result.current).toBe(true)
    })

    it('debería usar threshold personalizado', () => {
        const customThreshold = 500
        const { result } = renderHook(() => useScrollToTop(customThreshold))

        // Obtener la función de scroll del addEventListener mock
        const scrollHandler = mockAddEventListener.mock.calls[0][1]

        // Simular scroll a 499px (debajo del threshold personalizado)
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            value: 499
        })

        act(() => {
            scrollHandler()
        })

        expect(result.current).toBe(false)

        // Simular scroll a 501px (arriba del threshold personalizado)
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            value: 501
        })

        act(() => {
            scrollHandler()
        })

        expect(result.current).toBe(true)
    })

    it('debería cambiar estado correctamente cuando se cruza el threshold', () => {
        const { result } = renderHook(() => useScrollToTop(300))

        const scrollHandler = mockAddEventListener.mock.calls[0][1]

        // Inicialmente false
        expect(result.current).toBe(false)

        // Scroll hacia abajo pasando el threshold
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            value: 350
        })

        act(() => {
            scrollHandler()
        })

        expect(result.current).toBe(true)

        // Scroll hacia arriba por debajo del threshold
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            value: 250
        })

        act(() => {
            scrollHandler()
        })

        expect(result.current).toBe(false)
    })

    it('debería manejar múltiples eventos de scroll', () => {
        const { result } = renderHook(() => useScrollToTop(100))

        const scrollHandler = mockAddEventListener.mock.calls[0][1]

        // Múltiples posiciones de scroll
        const scrollPositions = [50, 150, 80, 200, 30, 300]
        const expectedResults = [false, true, false, true, false, true]

        scrollPositions.forEach((position, index) => {
            Object.defineProperty(window, 'scrollY', {
                writable: true,
                value: position
            })

            act(() => {
                scrollHandler()
            })

            expect(result.current).toBe(expectedResults[index])
        })
    })

    it('debería reinicializar event listeners cuando cambia el threshold', () => {
        const { rerender } = renderHook(
            ({ threshold }) => useScrollToTop(threshold),
            { initialProps: { threshold: 300 } }
        )

        // Verificar que se agregó el primer listener
        expect(mockAddEventListener).toHaveBeenCalledTimes(1)

        // Cambiar threshold
        rerender({ threshold: 500 })

        // Debería haber removido el anterior y agregado uno nuevo
        expect(mockRemoveEventListener).toHaveBeenCalledTimes(1)
        expect(mockAddEventListener).toHaveBeenCalledTimes(2)
    })

    it('debería manejar threshold 0 correctamente', () => {
        const { result } = renderHook(() => useScrollToTop(0))

        const scrollHandler = mockAddEventListener.mock.calls[0][1]

        // Con threshold 0, cualquier scroll > 0 debería mostrar el botón
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            value: 1
        })

        act(() => {
            scrollHandler()
        })

        expect(result.current).toBe(true)

        // En posición 0 no debería mostrar
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            value: 0
        })

        act(() => {
            scrollHandler()
        })

        expect(result.current).toBe(false)
    })

    it('debería manejar valores negativos de threshold', () => {
        const { result } = renderHook(() => useScrollToTop(-100))

        const scrollHandler = mockAddEventListener.mock.calls[0][1]

        // Con threshold negativo, incluso en posición 0 debería mostrar el botón
        Object.defineProperty(window, 'scrollY', {
            writable: true,
            value: 0
        })

        act(() => {
            scrollHandler()
        })

        expect(result.current).toBe(true)
    })

    it('debería usar passive: true en el event listener', () => {
        renderHook(() => useScrollToTop())

        expect(mockAddEventListener).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
            { passive: true }
        )
    })
})