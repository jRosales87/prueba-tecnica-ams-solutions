import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProductCard } from '@/features/products/components/ProductCard'
import type { Product } from '@/features/products/interfaces'

const mockProduct: Product = {
    id: '1',
    brand: 'Apple',
    model: 'iPhone 15',
    price: '999',
    imgUrl: 'https://example.com/iphone15.jpg'
}

const mockProductWithoutPrice: Product = {
    id: '2',
    brand: 'Samsung',
    model: 'Galaxy S24',
    price: '',
    imgUrl: 'https://example.com/galaxy-s24.jpg'
}

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <MemoryRouter>
            {component}
        </MemoryRouter>
    )
}

describe('ProductCard Component', () => {
    it('debería renderizar la información del producto correctamente', () => {
        renderWithRouter(<ProductCard product={mockProduct} />)

        expect(screen.getByText('iPhone 15')).toBeInTheDocument()
        expect(screen.getByText('Apple')).toBeInTheDocument()
        expect(screen.getByText('999 €')).toBeInTheDocument()
    })

    it('debería mostrar "Precio no disponible" cuando no hay precio', () => {
        renderWithRouter(<ProductCard product={mockProductWithoutPrice} />)

        expect(screen.getByText('Precio no disponible')).toBeInTheDocument()
    })

    it('debería tener un enlace al detalle del producto', () => {
        renderWithRouter(<ProductCard product={mockProduct} />)

        const link = screen.getByRole('link', {
            name: /ver detalles de iphone 15 de apple, precio 999 €/i
        })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/product/1')
    })

    it('debería mostrar la imagen del producto con alt text correcto', () => {
        renderWithRouter(<ProductCard product={mockProduct} />)

        const image = screen.getByRole('img', {
            name: /imagen del iphone 15 de apple/i
        })
        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute('src', mockProduct.imgUrl)
        expect(image).toHaveAttribute('loading', 'lazy')
    })

    it('debería tener la estructura correcta con article', () => {
        renderWithRouter(<ProductCard product={mockProduct} />)

        const article = screen.getByRole('article')
        expect(article).toBeInTheDocument()
        expect(article).toHaveClass('border', 'rounded-md', 'p-4')
    })

    it('debería incluir aria-label descriptivo en el precio', () => {
        renderWithRouter(<ProductCard product={mockProduct} />)

        const priceElement = screen.getByLabelText(/precio: 999 euros/i)
        expect(priceElement).toBeInTheDocument()
    })

    it('debería incluir aria-label descriptivo en la marca', () => {
        renderWithRouter(<ProductCard product={mockProduct} />)

        const brandElement = screen.getByLabelText(/marca: apple/i)
        expect(brandElement).toBeInTheDocument()
    })

    it('debería manejar productos sin precio en el aria-label del enlace', () => {
        renderWithRouter(<ProductCard product={mockProductWithoutPrice} />)

        const link = screen.getByRole('link', {
            name: /ver detalles de galaxy s24 de samsung, precio no disponible/i
        })
        expect(link).toBeInTheDocument()
    })

    it('debería tener clases de hover y transiciones', () => {
        renderWithRouter(<ProductCard product={mockProduct} />)

        const article = screen.getByRole('article')
        expect(article).toHaveClass('hover:shadow-lg', 'transition-shadow')

        const link = screen.getByRole('link')
        expect(link).toHaveClass('group')
    })
})