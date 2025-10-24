import { useParams } from 'react-router-dom';

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div>
            <h2>Product Details</h2>
            <p>Product ID: {id}</p>
        </div>
    );
};