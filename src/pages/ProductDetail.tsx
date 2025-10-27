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
            <main className="container mx-auto px-4 py-4 sm:py-8" role="main">
                <div className="flex items-center justify-center py-8" role="status" aria-live="polite">
                    <p className="text-base sm:text-lg">Cargando detalles del producto...</p>
                </div>
            </main>
        );
    }

    // Estado de error
    if (isError) {
        return (
            <main className="container mx-auto px-4 py-4 sm:py-8" role="main">
                <div className="text-center py-8" role="alert" aria-live="assertive">
                    <p className="text-red-500 mb-4 text-sm sm:text-base">
                        Error: {(error as Error).message}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Reintentar
                    </button>
                </div>
            </main>
        );
    }

    // Renderizar los detalles del producto
    return (
        <main className="container mx-auto px-4 py-4 sm:py-8" role="main">
            {/* Botón Volver al listado */}
            <div className="mb-4 sm:mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    aria-label="Volver a la lista de productos"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                    Volver al listado
                </Link>
            </div>

            <article>
                {/* Layout principal: imagen y acciones */}
                <div className='flex flex-col lg:flex-row gap-6 lg:gap-10 mb-8 lg:mb-10'>
                    {/* Imagen del producto */}
                    <div className="flex-shrink-0 w-full lg:w-auto">
                        <img
                            src={product?.imgUrl}
                            alt={`Imagen del ${product?.model} de ${product?.brand}`}
                            className="w-full h-64 sm:h-80 lg:w-96 lg:h-96 object-contain mx-auto bg-gray-50 rounded-lg"
                        />
                    </div>

                    {/* Acciones del producto */}
                    <div className="flex-1 lg:flex-shrink-0 lg:min-w-0">
                        {product && <ProductAction product={product} />}
                    </div>
                </div>

                {/* Detalles técnicos */}
                <section aria-labelledby="technical-details-heading">
                    <h2 id="technical-details-heading" className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                        Detalles Técnicos
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Conectividad</h3>
                            <dl className="space-y-2">
                                {product?.networkTechnology && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Tecnología de red:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.networkTechnology}</dd>
                                    </div>
                                )}
                                {product?.networkSpeed && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Velocidad de red:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.networkSpeed}</dd>
                                    </div>
                                )}
                                {product?.gprs && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">GPRS:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.gprs}</dd>
                                    </div>
                                )}
                                {product?.edge && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">EDGE:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.edge}</dd>
                                    </div>
                                )}
                                {product?.wlan && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">WLAN:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.wlan}</dd>
                                    </div>
                                )}
                                {product?.bluetooth && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Bluetooth:</dt>
                                        <dd className="sm:ml-2 text-gray-700 break-words">{Array.isArray(product.bluetooth) ? product.bluetooth.join(', ') : product.bluetooth}</dd>
                                    </div>
                                )}
                                {product?.gps && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">GPS:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.gps}</dd>
                                    </div>
                                )}
                                {product?.nfc && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">NFC:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.nfc}</dd>
                                    </div>
                                )}
                                {product?.radio && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Radio:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.radio}</dd>
                                    </div>
                                )}
                                {product?.usb && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">USB:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.usb}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Especificaciones</h3>
                            <dl className="space-y-2">
                                {product?.announced && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Anunciado:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.announced}</dd>
                                    </div>
                                )}
                                {product?.status && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Estado:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.status}</dd>
                                    </div>
                                )}
                                {product?.dimentions && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Dimensiones:</dt>
                                        <dd className="sm:ml-2 text-gray-700 break-words">{product.dimentions}</dd>
                                    </div>
                                )}
                                {product?.weight && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Peso:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.weight}</dd>
                                    </div>
                                )}
                                {product?.sim && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">SIM:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.sim}</dd>
                                    </div>
                                )}
                                {product?.displayType && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Tipo de pantalla:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.displayType}</dd>
                                    </div>
                                )}
                                {product?.displayResolution && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Resolución:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.displayResolution}</dd>
                                    </div>
                                )}
                                {product?.displaySize && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Tamaño de pantalla:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.displaySize}</dd>
                                    </div>
                                )}
                                {product?.os && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Sistema operativo:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.os}</dd>
                                    </div>
                                )}
                                {product?.cpu && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">CPU:</dt>
                                        <dd className="sm:ml-2 text-gray-700 break-words">{product.cpu}</dd>
                                    </div>
                                )}
                                {product?.internalMemory && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Memoria interna:</dt>
                                        <dd className="sm:ml-2 text-gray-700 break-words">{Array.isArray(product.internalMemory) ? product.internalMemory.join(', ') : product.internalMemory}</dd>
                                    </div>
                                )}
                                {product?.ram && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">RAM:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.ram}</dd>
                                    </div>
                                )}
                                {product?.primaryCamera && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Cámara principal:</dt>
                                        <dd className="sm:ml-2 text-gray-700 break-words">{Array.isArray(product.primaryCamera) ? product.primaryCamera.join(', ') : product.primaryCamera}</dd>
                                    </div>
                                )}
                                {product?.secondaryCmera && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Cámara secundaria:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.secondaryCmera}</dd>
                                    </div>
                                )}
                                {product?.speaker && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Altavoz:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.speaker}</dd>
                                    </div>
                                )}
                                {product?.audioJack && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Jack de audio:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.audioJack}</dd>
                                    </div>
                                )}
                                {product?.sensors && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Sensores:</dt>
                                        <dd className="sm:ml-2 text-gray-700 break-words">{product.sensors}</dd>
                                    </div>
                                )}
                                {product?.battery && (
                                    <div className="flex flex-col sm:flex-row">
                                        <dt className="font-medium text-gray-900 sm:w-32 sm:flex-shrink-0">Batería:</dt>
                                        <dd className="sm:ml-2 text-gray-700">{product.battery}</dd>
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