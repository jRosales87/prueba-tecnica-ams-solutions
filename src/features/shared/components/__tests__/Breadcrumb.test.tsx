import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Breadcrumb } from '../Breadcrumb'

// Mock del hook useBreadcrumbs
const mockUseBreadcrumbs = vi.fn()
vi.mock('../../hooks/useBreadcrumbs', () => ({
    useBreadcrumbs: () => mockUseBreadcrumbs()
}))

// Wrapper para React Router
const BreadcrumbWrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
        {children}
    </BrowserRouter>
)

describe('Breadcrumb Component', () => {
    beforeEach(() => {
        mockUseBreadcrumbs.mockClear()
    })

    it('debería renderizar correctamente con un solo breadcrumb (Inicio)', () => {
        mockUseBreadcrumbs.mockReturnValue([
            {
                label: 'Inicio',
                href: undefined,
                isCurrentPage: true
            }
        ])

        render(
            <BreadcrumbWrapper>
                <Breadcrumb />
            </BreadcrumbWrapper>
        )

        const nav = screen.getByRole('navigation')
        expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
        expect(nav).toHaveClass('py-2', 'border-t', 'border-gray-100')

        const list = screen.getByRole('list')
        expect(list).toHaveClass('flex', 'items-center', 'space-x-2', 'text-sm')

        const homeSpan = screen.getByText('Inicio')
        expect(homeSpan).toHaveAttribute('aria-current', 'page')
        expect(homeSpan).toHaveClass('flex', 'items-center', 'hover:text-gray-900', 'transition-colors', 'text-gray-900', 'font-medium')

        // Verificar que tiene el icono Home
        const homeIcon = homeSpan.querySelector('svg')
        expect(homeIcon).toBeInTheDocument()
        expect(homeIcon).toHaveAttribute('aria-hidden', 'true')
    })

    it('debería renderizar breadcrumbs múltiples con separadores', () => {
        mockUseBreadcrumbs.mockReturnValue([
            {
                label: 'Inicio',
                href: '/',
                isCurrentPage: false
            },
            {
                label: 'Apple iPhone 15',
                href: undefined,
                isCurrentPage: true
            }
        ])

        render(
            <BreadcrumbWrapper>
                <Breadcrumb />
            </BreadcrumbWrapper>
        )

        // Verificar que hay un separador (ChevronRight)
        const listItems = screen.getAllByRole('listitem')
        expect(listItems).toHaveLength(2)

        // Verificar el primer breadcrumb (Inicio) como link
        const homeLink = screen.getByRole('link', { name: /ir a inicio/i })
        expect(homeLink).toBeInTheDocument()
        expect(homeLink).toHaveAttribute('href', '/')
        expect(homeLink).toHaveClass('text-gray-600', 'hover:underline')

        // Verificar el segundo breadcrumb (página actual)
        const currentPage = screen.getByText('Apple iPhone 15')
        expect(currentPage).toHaveAttribute('aria-current', 'page')

        // Verificar que hay un separador entre breadcrumbs
        const chevronIcon = screen.getByRole('navigation').querySelector('svg[class*="h-4 w-4 text-gray-400"]')
        expect(chevronIcon).toBeInTheDocument()
    })

    it('debería renderizar breadcrumb sin href como span cuando no es página actual', () => {
        mockUseBreadcrumbs.mockReturnValue([
            {
                label: 'Categoría',
                href: undefined,
                isCurrentPage: false
            }
        ])

        render(
            <BreadcrumbWrapper>
                <Breadcrumb />
            </BreadcrumbWrapper>
        )

        const categorySpan = screen.getByText('Categoría')
        expect(categorySpan.tagName).toBe('SPAN')
        expect(categorySpan).not.toHaveAttribute('aria-current')
        expect(categorySpan).toHaveClass('text-gray-900', 'font-medium')
    })

    it('debería mostrar iconos Home solo en el primer elemento', () => {
        mockUseBreadcrumbs.mockReturnValue([
            {
                label: 'Inicio',
                href: '/',
                isCurrentPage: false
            },
            {
                label: 'Producto',
                href: undefined,
                isCurrentPage: true
            }
        ])

        render(
            <BreadcrumbWrapper>
                <Breadcrumb />
            </BreadcrumbWrapper>
        )

        const homeLink = screen.getByRole('link', { name: /ir a inicio/i })
        const homeIcon = homeLink.querySelector('svg')
        expect(homeIcon).toBeInTheDocument()

        const productSpan = screen.getByText('Producto')
        const productIcon = productSpan.querySelector('svg')
        expect(productIcon).not.toBeInTheDocument()
    })

    it('debería manejar breadcrumbs largos correctamente', () => {
        mockUseBreadcrumbs.mockReturnValue([
            {
                label: 'Inicio',
                href: '/',
                isCurrentPage: false
            },
            {
                label: 'Samsung Galaxy S24 Ultra 512GB Phantom Black Titanium Edition',
                href: undefined,
                isCurrentPage: true
            }
        ])

        render(
            <BreadcrumbWrapper>
                <Breadcrumb />
            </BreadcrumbWrapper>
        )

        const longTitle = screen.getByText('Samsung Galaxy S24 Ultra 512GB Phantom Black Titanium Edition')
        expect(longTitle).toBeInTheDocument()
        expect(longTitle).toHaveAttribute('aria-current', 'page')
    })

    it('debería tener las clases CSS correctas para diferentes estados', () => {
        mockUseBreadcrumbs.mockReturnValue([
            {
                label: 'Inicio',
                href: '/',
                isCurrentPage: false
            },
            {
                label: 'Producto',
                href: undefined,
                isCurrentPage: true
            }
        ])

        render(
            <BreadcrumbWrapper>
                <Breadcrumb />
            </BreadcrumbWrapper>
        )

        // Link breadcrumb (no es página actual)
        const homeLink = screen.getByRole('link')
        expect(homeLink).toHaveClass(
            'flex', 'items-center', 'hover:text-gray-900', 'transition-colors',
            'text-gray-600', 'hover:underline', 'focus:outline-none',
            'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-1', 'rounded'
        )

        // Span breadcrumb (página actual)
        const currentPage = screen.getByText('Producto')
        expect(currentPage).toHaveClass(
            'flex', 'items-center', 'hover:text-gray-900', 'transition-colors',
            'text-gray-900', 'font-medium'
        )
    })

    it('debería manejar breadcrumbs vacíos', () => {
        mockUseBreadcrumbs.mockReturnValue([])

        render(
            <BreadcrumbWrapper>
                <Breadcrumb />
            </BreadcrumbWrapper>
        )

        const nav = screen.getByRole('navigation')
        expect(nav).toBeInTheDocument()

        const list = screen.getByRole('list')
        expect(list).toBeInTheDocument()
        expect(list.children).toHaveLength(0)
    })

    it('debería manejar múltiples separadores correctamente', () => {
        mockUseBreadcrumbs.mockReturnValue([
            {
                label: 'Inicio',
                href: '/',
                isCurrentPage: false
            },
            {
                label: 'Categoría',
                href: '/category',
                isCurrentPage: false
            },
            {
                label: 'Subcategoría',
                href: '/subcategory',
                isCurrentPage: false
            },
            {
                label: 'Producto Final',
                href: undefined,
                isCurrentPage: true
            }
        ])

        render(
            <BreadcrumbWrapper>
                <Breadcrumb />
            </BreadcrumbWrapper>
        )

        const listItems = screen.getAllByRole('listitem')
        expect(listItems).toHaveLength(4)

        // Debería haber 3 separadores (chevron icons)
        const nav = screen.getByRole('navigation')
        const chevronIcons = nav.querySelectorAll('svg[class*="text-gray-400"]')
        expect(chevronIcons).toHaveLength(3)
    })

    it('debería tener accesibilidad correcta', () => {
        mockUseBreadcrumbs.mockReturnValue([
            {
                label: 'Inicio',
                href: '/',
                isCurrentPage: false
            },
            {
                label: 'Producto',
                href: undefined,
                isCurrentPage: true
            }
        ])

        render(
            <BreadcrumbWrapper>
                <Breadcrumb />
            </BreadcrumbWrapper>
        )

        // Verificar atributos de accesibilidad
        const nav = screen.getByRole('navigation')
        expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')

        const currentPage = screen.getByText('Producto')
        expect(currentPage).toHaveAttribute('aria-current', 'page')

        const homeLink = screen.getByRole('link')
        expect(homeLink).toHaveAttribute('aria-label', 'Ir a Inicio')

        // Verificar que los iconos tienen aria-hidden
        const icons = nav.querySelectorAll('svg[aria-hidden="true"]')
        expect(icons.length).toBeGreaterThan(0)
    })

    it('debería tener la estructura HTML semántica correcta', () => {
        mockUseBreadcrumbs.mockReturnValue([
            {
                label: 'Inicio',
                href: '/',
                isCurrentPage: false
            }
        ])

        render(
            <BreadcrumbWrapper>
                <Breadcrumb />
            </BreadcrumbWrapper>
        )

        // Verificar que usa nav > ol > li estructura
        const nav = screen.getByRole('navigation')
        const list = screen.getByRole('list')
        const listItem = screen.getByRole('listitem')

        expect(nav.tagName).toBe('NAV')
        expect(list.tagName).toBe('OL')
        expect(listItem.tagName).toBe('LI')
        expect(nav.contains(list)).toBe(true)
        expect(list.contains(listItem)).toBe(true)
    })
})