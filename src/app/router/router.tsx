
import { Layouts } from '@/features/shared/components';
import { ProductDetail } from '../../pages/ProductDetail';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layouts />,
        children: [
            {
                index: true,
                element: <div>Welcome to the Layouts Management App</div>
            },
            {
                path: 'products/:id',
                element: <ProductDetail />
            }
        ]
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}