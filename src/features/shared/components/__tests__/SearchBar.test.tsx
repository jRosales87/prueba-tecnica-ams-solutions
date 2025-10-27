import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useSearchParams } from 'react-router-dom'
import { SearchBar } from '@/features/shared/components/SearchBar'

const renderWithRouter = (component: React.ReactElement, initialEntries = ['/']) => {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            {component}
        </MemoryRouter>
    )
}

describe('SearchBar Component', () => {
    const mockOnSearch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('debería renderizar el input de búsqueda correctamente', () => {
        renderWithRouter(<SearchBar onSearch={mockOnSearch} />)

        const input = screen.getByRole('searchbox', {
            name: /buscar productos por marca o modelo/i
        })
        expect(input).toBeInTheDocument()
        expect(input).toHaveAttribute('placeholder', 'Buscar productos...')
    })

    it('debería usar placeholder personalizado cuando se proporciona', () => {
        renderWithRouter(
            <SearchBar onSearch={mockOnSearch} placeholder="Buscar teléfonos..." />
        )

        const input = screen.getByPlaceholderText('Buscar teléfonos...')
        expect(input).toBeInTheDocument()
    })

    it('debería mostrar el icono de búsqueda', () => {
        renderWithRouter(<SearchBar onSearch={mockOnSearch} />)

        // El icono está marcado como aria-hidden, así que buscamos por clase o contenedor
        const searchIcon = document.querySelector('[aria-hidden="true"]')
        expect(searchIcon).toBeInTheDocument()
    })

    it('debería llamar a onSearch cuando el usuario escribe', async () => {
        const user = userEvent.setup()
        renderWithRouter(<SearchBar onSearch={mockOnSearch} />)

        const input = screen.getByRole('searchbox')

        await user.type(input, 'iPhone')

        // Debido al useDeferredValue, necesitamos esperar
        await waitFor(() => {
            expect(mockOnSearch).toHaveBeenCalledWith('iPhone')
        })
    })

    it('debería actualizar la URL con el parámetro de búsqueda', async () => {
        const user = userEvent.setup()

        // Create a custom history to track navigation
        let currentSearch = ''
        const TestComponent = () => {
            const [searchParams] = useSearchParams()
            currentSearch = searchParams.toString()
            return <SearchBar onSearch={mockOnSearch} />
        }

        render(
            <MemoryRouter initialEntries={['/']}>
                <TestComponent />
            </MemoryRouter>
        )

        const input = screen.getByRole('searchbox')
        await user.type(input, 'Samsung')

        await waitFor(() => {
            expect(currentSearch).toContain('q=Samsung')
        })
    })

    it('debería cargar el valor inicial desde la URL', () => {
        renderWithRouter(
            <SearchBar onSearch={mockOnSearch} />,
            ['/?q=iPhone']
        )

        const input = screen.getByRole('searchbox')
        expect(input).toHaveValue('iPhone')
    })

    it('debería limpiar la URL cuando se borra el texto', async () => {
        const user = userEvent.setup()
        renderWithRouter(
            <SearchBar onSearch={mockOnSearch} />,
            ['/?q=iPhone']
        )

        const input = screen.getByRole('searchbox')
        expect(input).toHaveValue('iPhone')

        await user.clear(input)

        await waitFor(() => {
            expect(mockOnSearch).toHaveBeenCalledWith('')
            expect(window.location.search).toBe('')
        })
    })

    it('debería tener los atributos de accesibilidad correctos', () => {
        renderWithRouter(<SearchBar onSearch={mockOnSearch} />)

        const input = screen.getByRole('searchbox')
        expect(input).toHaveAttribute('type', 'search')
        expect(input).toHaveAttribute('autoComplete', 'off')
        expect(input).toHaveAttribute('aria-describedby', 'search-help')

        const helpText = screen.getByText(/escribe para buscar productos/i)
        expect(helpText).toHaveClass('sr-only')
        expect(helpText).toHaveAttribute('id', 'search-help')
    })

    it('debería tener role search en el contenedor', () => {
        renderWithRouter(<SearchBar onSearch={mockOnSearch} />)

        const searchContainer = screen.getByRole('search')
        expect(searchContainer).toBeInTheDocument()
    })

    it('debería tener label con sr-only para screen readers', () => {
        renderWithRouter(<SearchBar onSearch={mockOnSearch} />)

        const label = screen.getByLabelText(/buscar productos por marca o modelo/i)
        expect(label).toBeInTheDocument()

        const labelElement = screen.getByText('Buscar productos por marca o modelo')
        expect(labelElement).toHaveClass('sr-only')
        expect(labelElement.tagName).toBe('LABEL')
    })

    it('debería manejar eventos de teclado correctamente', async () => {
        const user = userEvent.setup()
        renderWithRouter(<SearchBar onSearch={mockOnSearch} />)

        const input = screen.getByRole('searchbox')

        await user.click(input)
        await user.keyboard('Apple')

        await waitFor(() => {
            expect(input).toHaveValue('Apple')
            expect(mockOnSearch).toHaveBeenCalledWith('Apple')
        })
    })
})