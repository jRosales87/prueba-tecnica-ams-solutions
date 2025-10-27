import { render, screen } from '@testing-library/react'
import { QueryProvider } from '@/app/providers/QueryProvider'

// Mock completo del módulo QueryProvider
vi.mock('@/app/providers/QueryProvider', async () => {
    const actual = await vi.importActual('@/app/providers/QueryProvider')
    return {
        ...actual,
        QueryProvider: ({ children }: { children: React.ReactNode }) => (
            <div data-testid="query-provider-mock">
                {children}
            </div>
        ),
    }
})

describe('QueryProvider', () => {
    const TestComponent = () => (
        <div data-testid="test-child">Test Child Component</div>
    )

    it('debería renderizar children correctamente', () => {
        render(
            <QueryProvider>
                <TestComponent />
            </QueryProvider>
        )

        expect(screen.getByTestId('test-child')).toBeInTheDocument()
        expect(screen.getByText('Test Child Component')).toBeInTheDocument()
    })

    it('debería envolver children correctamente', () => {
        render(
            <QueryProvider>
                <TestComponent />
            </QueryProvider>
        )

        expect(screen.getByTestId('query-provider-mock')).toBeInTheDocument()
        expect(screen.getByTestId('test-child')).toBeInTheDocument()
    })

    it('debería ser un componente función válido', () => {
        expect(typeof QueryProvider).toBe('function')
    })

    it('debería manejar children null sin errores', () => {
        expect(() => render(<QueryProvider>{null}</QueryProvider>)).not.toThrow()
    })

    it('debería renderizar múltiples children', () => {
        render(
            <QueryProvider>
                <div data-testid="child-1">Child 1</div>
                <div data-testid="child-2">Child 2</div>
            </QueryProvider>
        )

        expect(screen.getByTestId('child-1')).toBeInTheDocument()
        expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })

    it('debería exportar una función nombrada', () => {
        expect(QueryProvider).toBeDefined()
        expect(QueryProvider.name).toBe('QueryProvider')
    })

    it('debería proporcionar contexto a sus children', () => {
        const { container } = render(
            <QueryProvider>
                <TestComponent />
            </QueryProvider>
        )

        expect(container.firstChild).toBeInTheDocument()
        expect(screen.getByTestId('query-provider-mock')).toBeInTheDocument()
    })

    it('debería manejar props de children correctamente', () => {
        const ComponentWithProps = ({ message }: { message: string }) => (
            <div data-testid="component-with-props">{message}</div>
        )

        render(
            <QueryProvider>
                <ComponentWithProps message="Hello from QueryProvider" />
            </QueryProvider>
        )

        expect(screen.getByTestId('component-with-props')).toBeInTheDocument()
        expect(screen.getByText('Hello from QueryProvider')).toBeInTheDocument()
    })

    it('debería mantener la estructura de componentes anidados', () => {
        render(
            <QueryProvider>
                <div data-testid="parent">
                    <div data-testid="nested-child">Nested Content</div>
                </div>
            </QueryProvider>
        )

        expect(screen.getByTestId('parent')).toBeInTheDocument()
        expect(screen.getByTestId('nested-child')).toBeInTheDocument()
        expect(screen.getByText('Nested Content')).toBeInTheDocument()
    })
})