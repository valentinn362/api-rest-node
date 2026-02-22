import { useState, useEffect } from 'react';
import { api } from '../services/api';

function ArticuloForm({ articuloId, onGuardado }) {
    const [formData, setFormData] = useState({
        titulo: '',
        contenido: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Si es edición, cargar datos
    useEffect(() => {
        if (articuloId) {
            api.obtener(articuloId)
                .then(data => {
                    setFormData({
                        titulo: data.articulo.titulo,
                        contenido: data.articulo.contenido
                    });
                })
                .catch(err => setError(err.message));
        }
    }, [articuloId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let resultado;
            if (articuloId) {
                resultado = await api.actualizar(articuloId, formData);
            } else {
                resultado = await api.crear(formData);
            }
            onGuardado(resultado.articulo);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            {error && <div className="error">{error}</div>}
            
            <div className="form-group">
                <label>Título:</label>
                <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    required
                    minLength={5}
                />
            </div>

            <div className="form-group">
                <label>Contenido:</label>
                <textarea
                    value={formData.contenido}
                    onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                    required
                    rows={5}
                />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Guardando...' : (articuloId ? 'Actualizar' : 'Crear')}
            </button>
        </form>
    );
}

export default ArticuloForm;