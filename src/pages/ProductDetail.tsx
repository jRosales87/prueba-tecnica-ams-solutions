import { ProductAction } from '@/features/products/components';
import { useProductQuery } from '@/features/products/hooks/useProduct';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();

    const { data: product, isLoading, isError, error, refetch } = useProductQuery(id || '');

    // Estado de carga
    if (isLoading) {
        return (
            <main className="container mx-auto px-4 py-8" role="main">
                <div className="flex items-center justify-center py-8" role="status" aria-live="polite">
                    <p className="text-lg">Cargando detalles del producto...</p>
                </div>
            </main>
        );
    }

    // Estado de error
    if (isError) {
        return (
            <main className="container mx-auto px-4 py-8" role="main">
                <div className="text-center py-8" role="alert" aria-live="assertive">
                    <p className="text-red-500 mb-4">
                        Error: {(error as Error).message}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Reintentar
                    </button>
                </div>
            </main>
        );
    }

    // Renderizar los detalles del producto
    return (
        <main className="container mx-auto px-4 py-8" role="main">
            {/* Botón Volver al listado */}
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    aria-label="Volver a la lista de productos"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                    Volver al listado
                </Link>
            </div>

            <article>
                <div className='flex gap-10 mb-10'>

                    <img
                        src={product?.imgUrl}
                        alt={`Imagen del ${product?.model} de ${product?.brand}`}
                        className="w-96 h-96 object-contain"
                    />

                    {product && <ProductAction product={product} />}
                </div>

                <section aria-labelledby="technical-details-heading">
                    <h2 id="technical-details-heading" className="text-2xl font-bold mb-6">
                        Detalles Técnicos
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Conectividad</h3>
                            <dl className="space-y-2">
                                {product?.networkTechnology && (
                                    <div>
                                        <dt className="inline font-medium">Tecnología de red:</dt>
                                        <dd className="inline ml-2">{product.networkTechnology}</dd>
                                    </div>
                                )}
                                {product?.networkSpeed && (
                                    <div>
                                        <dt className="inline font-medium">Velocidad de red:</dt>
                                        <dd className="inline ml-2">{product.networkSpeed}</dd>
                                    </div>
                                )}
                                {product?.gprs && (
                                    <div>
                                        <dt className="inline font-medium">GPRS:</dt>
                                        <dd className="inline ml-2">{product.gprs}</dd>
                                    </div>
                                )}
                                {product?.edge && (
                                    <div>
                                        <dt className="inline font-medium">EDGE:</dt>
                                        <dd className="inline ml-2">{product.edge}</dd>
                                    </div>
                                )}
                                {product?.wlan && (
                                    <div>
                                        <dt className="inline font-medium">WLAN:</dt>
                                        <dd className="inline ml-2">{product.wlan}</dd>
                                    </div>
                                )}
                                {product?.bluetooth && (
                                    <div>
                                        <dt className="inline font-medium">Bluetooth:</dt>
                                        <dd className="inline ml-2">{Array.isArray(product.bluetooth) ? product.bluetooth.join(', ') : product.bluetooth}</dd>
                                    </div>
                                )}
                                {product?.gps && (
                                    <div>
                                        <dt className="inline font-medium">GPS:</dt>
                                        <dd className="inline ml-2">{product.gps}</dd>
                                    </div>
                                )}
                                {product?.nfc && (
                                    <div>
                                        <dt className="inline font-medium">NFC:</dt>
                                        <dd className="inline ml-2">{product.nfc}</dd>
                                    </div>
                                )}
                                {product?.radio && (
                                    <div>
                                        <dt className="inline font-medium">Radio:</dt>
                                        <dd className="inline ml-2">{product.radio}</dd>
                                    </div>
                                )}
                                {product?.usb && (
                                    <div>
                                        <dt className="inline font-medium">USB:</dt>
                                        <dd className="inline ml-2">{product.usb}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Especificaciones</h3>
                            <dl className="space-y-2">
                                {product?.announced && (
                                    <div>
                                        <dt className="inline font-medium">Anunciado:</dt>
                                        <dd className="inline ml-2">{product.announced}</dd>
                                    </div>
                                )}
                                {product?.status && (
                                    <div>
                                        <dt className="inline font-medium">Estado:</dt>
                                        <dd className="inline ml-2">{product.status}</dd>
                                    </div>
                                )}
                                {product?.dimentions && (
                                    <div>
                                        <dt className="inline font-medium">Dimensiones:</dt>
                                        <dd className="inline ml-2">{product.dimentions}</dd>
                                    </div>
                                )}
                                {product?.weight && (
                                    <div>
                                        <dt className="inline font-medium">Peso:</dt>
                                        <dd className="inline ml-2">{product.weight}</dd>
                                    </div>
                                )}
                                {product?.sim && (
                                    <div>
                                        <dt className="inline font-medium">SIM:</dt>
                                        <dd className="inline ml-2">{product.sim}</dd>
                                    </div>
                                )}
                                {product?.displayType && (
                                    <div>
                                        <dt className="inline font-medium">Tipo de pantalla:</dt>
                                        <dd className="inline ml-2">{product.displayType}</dd>
                                    </div>
                                )}
                                {product?.displayResolution && (
                                    <div>
                                        <dt className="inline font-medium">Resolución:</dt>
                                        <dd className="inline ml-2">{product.displayResolution}</dd>
                                    </div>
                                )}
                                {product?.displaySize && (
                                    <div>
                                        <dt className="inline font-medium">Tamaño de pantalla:</dt>
                                        <dd className="inline ml-2">{product.displaySize}</dd>
                                    </div>
                                )}
                                {product?.os && (
                                    <div>
                                        <dt className="inline font-medium">Sistema operativo:</dt>
                                        <dd className="inline ml-2">{product.os}</dd>
                                    </div>
                                )}
                                {product?.cpu && (
                                    <div>
                                        <dt className="inline font-medium">CPU:</dt>
                                        <dd className="inline ml-2">{product.cpu}</dd>
                                    </div>
                                )}
                                {product?.internalMemory && (
                                    <div>
                                        <dt className="inline font-medium">Memoria interna:</dt>
                                        <dd className="inline ml-2">{Array.isArray(product.internalMemory) ? product.internalMemory.join(', ') : product.internalMemory}</dd>
                                    </div>
                                )}
                                {product?.ram && (
                                    <div>
                                        <dt className="inline font-medium">RAM:</dt>
                                        <dd className="inline ml-2">{product.ram}</dd>
                                    </div>
                                )}
                                {product?.primaryCamera && (
                                    <div>
                                        <dt className="inline font-medium">Cámara principal:</dt>
                                        <dd className="inline ml-2">{Array.isArray(product.primaryCamera) ? product.primaryCamera.join(', ') : product.primaryCamera}</dd>
                                    </div>
                                )}
                                {product?.secondaryCmera && (
                                    <div>
                                        <dt className="inline font-medium">Cámara secundaria:</dt>
                                        <dd className="inline ml-2">{product.secondaryCmera}</dd>
                                    </div>
                                )}
                                {product?.speaker && (
                                    <div>
                                        <dt className="inline font-medium">Altavoz:</dt>
                                        <dd className="inline ml-2">{product.speaker}</dd>
                                    </div>
                                )}
                                {product?.audioJack && (
                                    <div>
                                        <dt className="inline font-medium">Jack de audio:</dt>
                                        <dd className="inline ml-2">{product.audioJack}</dd>
                                    </div>
                                )}
                                {product?.sensors && (
                                    <div>
                                        <dt className="inline font-medium">Sensores:</dt>
                                        <dd className="inline ml-2">{product.sensors}</dd>
                                    </div>
                                )}
                                {product?.battery && (
                                    <div>
                                        <dt className="inline font-medium">Batería:</dt>
                                        <dd className="inline ml-2">{product.battery}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </section>
            </article>
        </main>
    );
};