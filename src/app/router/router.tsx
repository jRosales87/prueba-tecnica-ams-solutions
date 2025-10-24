
import { Layouts } from '@/features/shared/components';
import { ProductDetail } from '../../pages/ProductDetail';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProductsList } from '@/pages/ProductsList';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layouts />,
        children: [
            {
                index: true,
                element: <ProductsList />
            },
            {
                path: 'product/:id',
                element: <ProductDetail />
            }
        ]
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}