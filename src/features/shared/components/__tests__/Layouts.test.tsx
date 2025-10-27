import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Layouts } from '../Layouts'

// Mock de los componentes hijos
vi.mock('../Header', () => ({
    Header: () => <div data-testid="header">Mock Header</div>
}))

vi.mock('../ScrollToTopOnRouteChange', () => ({
    ScrollToTopOnRouteChange: () => <div data-testid="scroll-to-top">Mock ScrollToTopOnRouteChange</div>
}))

// Wrapper para react-router
const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    )
}

describe('Layouts Component', () => {
    it('debería renderizar la estructura básica del layout', () => {
        renderWithRouter(<Layouts />)

        // Verificar elementos principales
        expect(screen.getByTestId('header')).toBeInTheDocument()
        expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()
        expect(screen.getByRole('main')).toBeInTheDocument()
        expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('debería contener el wrapper principal con la clase correcta', () => {
        const { container } = renderWithRouter(<Layouts />)
        const wrapper = container.firstChild as HTMLElement

        expect(wrapper).toHaveClass('wrapper')
    })

    it('debería renderizar el enlace de saltar al contenido principal', () => {
        renderWithRouter(<Layouts />)

        const skipLink = screen.getByText('Saltar al contenido principal')
        expect(skipLink).toBeInTheDocument()
        expect(skipLink).toHaveAttribute('href', '#main-content')
        expect(skipLink).toHaveClass('sr-only')
    })

    it('debería mostrar el enlace de saltar contenido al hacer focus', () => {
        renderWithRouter(<Layouts />)

        const skipLink = screen.getByText('Saltar al contenido principal')

        // Simular focus
        fireEvent.focus(skipLink)
        expect(skipLink).toHaveClass('focus:not-sr-only')
    })

    it('debería renderizar el main con el id correcto', () => {
        renderWithRouter(<Layouts />)

        const mainElement = screen.getByRole('main')
        expect(mainElement).toHaveAttribute('id', 'main-content')
        expect(mainElement).toHaveClass('p-4')
    })

    it('debería renderizar el footer con el texto de copyright', () => {
        renderWithRouter(<Layouts />)

        const footer = screen.getByRole('contentinfo')
        expect(footer).toBeInTheDocument()
        expect(footer).toHaveClass('mt-auto', 'py-6', 'border-t', 'bg-gray-50')

        const copyrightText = screen.getByText('© 2025 E-Commerce. Todos los derechos reservados.')
        expect(copyrightText).toBeInTheDocument()
    })

    it('debería tener la estructura de layout completa', () => {
        renderWithRouter(<Layouts />)

        // Verificar que todos los elementos clave están presentes
        expect(screen.getByTestId('header')).toBeInTheDocument()
        expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()
        expect(screen.getByRole('main')).toBeInTheDocument()
        expect(screen.getByRole('contentinfo')).toBeInTheDocument()
        expect(screen.getByText('Saltar al contenido principal')).toBeInTheDocument()
    })

    it('debería renderizar el Outlet para las rutas hijas', () => {
        // El Outlet se renderiza automáticamente por react-router
        // Verificamos que el main está presente donde se renderizará el contenido
        renderWithRouter(<Layouts />)

        const mainElement = screen.getByRole('main')
        expect(mainElement).toBeInTheDocument()
    })

    it('debería tener la accesibilidad correcta', () => {
        renderWithRouter(<Layouts />)

        // Verificar roles de accesibilidad
        expect(screen.getByRole('main')).toBeInTheDocument()
        expect(screen.getByRole('contentinfo')).toBeInTheDocument()

        // Verificar enlace de saltar contenido
        const skipLink = screen.getByText('Saltar al contenido principal')
        expect(skipLink).toHaveAttribute('href', '#main-content')
    })

    it('debería tener las clases CSS correctas en el footer', () => {
        renderWithRouter(<Layouts />)

        const footer = screen.getByRole('contentinfo')
        expect(footer).toHaveClass('mt-auto', 'py-6', 'border-t', 'bg-gray-50')

        const footerContent = footer.querySelector('.wrapper')
        expect(footerContent).toHaveClass('wrapper', 'px-4')
    })
})