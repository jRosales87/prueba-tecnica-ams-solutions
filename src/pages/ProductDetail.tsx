import { ProductAction } from '@/features/products/components';
import { useProductQuery } from '@/features/products/hooks/useProduct';
import { useParams } from 'react-router-dom';

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();

    const { data: product, isLoading, isError, error, refetch } = useProductQuery(id || '');

    // Estado de carga
    if (isLoading) {
        return <p>Loading...</p>;
    }

    // Estado de error
    if (isError) {
        return <p>Error: {(error as Error).message}</p>;
    }

    // Renderizar los detalles del producto
    return (
        <section className="container mx-auto px-4 py-8">
            <div className='mb-10'>
                <h2 className="text-2xl font-bold">{product?.model}</h2>
                <p className="text-lg text-gray-600">{product?.brand}</p>
            </div>
            <div className='flex gap-10'>
                <img src={product?.imgUrl} alt={product?.model} className="w-96 h-96 object-contain mb-5" />
                {product && <ProductAction product={product} />}
            </div>
            <div>
                <div>
                    <h2>Detalles Técnicos</h2>
                </div>
                <div>
                    <p>Network Technology: {product?.networkTechnology}</p>
                    <p>Network Speed: {product?.networkSpeed}</p>
                    <p>GPRS: {product?.gprs}</p>
                    <p>EDGE: {product?.edge}</p>
                    <p>Announced: {product?.announced}</p>
                    <p>Status: {product?.status}</p>
                    <p>Dimensions: {product?.dimentions}</p>
                    <p>Weight: {product?.weight}</p>
                    <p>SIM: {product?.sim}</p>
                    <p>Display Type: {product?.displayType}</p>
                    <p>Display Resolution: {product?.displayResolution}</p>
                    <p>Display Size: {product?.displaySize}</p>
                    <p>OS: {product?.os}</p>
                    <p>CPU: {product?.cpu}</p>
                    <p>Internal Memory: {product?.internalMemory}</p>
                    <p>RAM: {product?.ram}</p>
                    <p>Primary Camera: {product?.primaryCamera}</p>
                    <p>Secondary Camera: {product?.secondaryCmera}</p>
                    <p>Speaker: {product?.speaker}</p>
                    <p>Audio Jack: {product?.audioJack}</p>
                    <p>WLAN: {product?.wlan}</p>
                    <p>Bluetooth: {product?.bluetooth}</p>
                    <p>GPS: {product?.gps}</p>
                    <p>NFC: {product?.nfc}</p>
                    <p>Radio: {product?.radio}</p>
                    <p>USB: {product?.usb}</p>
                    <p>Sensors: {product?.sensors}</p>
                    <p>Battery: {product?.battery}</p>

                </div>
            </div>
        </section>
    );
};