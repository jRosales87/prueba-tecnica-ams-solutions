/**
 * Cliente HTTP base para comunicación con la API
 */

// URL base de la API desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://itx-frontend-test.onrender.com/api';

/**
 * Error personalizado para errores de API
 */
export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(
    message: string,
    status?: number,
    data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Cliente HTTP genérico
 * Maneja automáticamente:
 * - URL base
 * - Headers JSON
 * - Manejo de errores
 * - Parsing de respuestas
 */
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Normalize endpoint to ensure it starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    // Si la respuesta no es OK (status 200-299), lanzar error
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ApiError(
        errorData?.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData
      );
    }

    // Parsear y retornar datos JSON
    const data = await response.json();
    return data;
  } catch (error) {
    // Si ya es un ApiError, re-lanzarlo
    if (error instanceof ApiError) {
      throw error;
    }

    // Si es un error de red u otro, convertirlo a ApiError
    if (error instanceof Error) {
      throw new ApiError(error.message);
    }

    // Fallback para errores desconocidos
    throw new ApiError('Error desconocido al comunicarse con la API');
  }
}
