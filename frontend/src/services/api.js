const API_URL = "http://localhost:3900/api";

// Helper para peticiones
const fetchApi = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensaje || 'Error en la petición');
    }
    
    return response.json();
};

// Llamadas específicas
export const api = {
    // Listar todos
    listar: (limite = 0) => fetchApi(`/articulos?limite=${limite}`),
    
    // Obtener uno
    obtener: (id) => fetchApi(`/articulo/${id}`),
    
    // Crear
    crear: (data) => fetchApi('/crear', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    // Actualizar
    actualizar: (id, data) => fetchApi(`/articulo/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
    
    // Borrar
    borrar: (id) => fetchApi(`/articulo/${id}`, {
        method: 'DELETE',
    }),
    
    // Buscar
    buscar: (query) => fetchApi(`/buscar/${encodeURIComponent(query)}`),
    
    // Subir imagen (FormData, no JSON)
    subirImagen: async (id, file) => {
        const formData = new FormData();
        formData.append('file0', file);
        
        const response = await fetch(`${API_URL}/subir-imagen/${id}`, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.mensaje || 'Error al subir imagen');
        }
        
        return response.json();
    },
    
    // URL de imagen
    getImagenUrl: (filename) => `${API_URL}/imagen/articulo/${filename}`,
};