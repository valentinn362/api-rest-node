import { useState } from 'react';
import { api } from '../services/api';

function SubirImagen({ articuloId, onImagenSubida }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Selecciona una imagen');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const resultado = await api.subirImagen(articuloId, file);
            onImagenSubida(resultado.articulo);
            setFile(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-imagen">
            {error && <div className="error">{error}</div>}
            
            <input
                type="file"
                accept="image/png,image/jpg,image/jpeg,image/gif"
                onChange={(e) => setFile(e.target.files[0])}
            />
            
            {file && (
                <div className="preview">
                    <p>Archivo: {file.name}</p>
                    <img src={URL.createObjectURL(file)} alt="Preview" width={200} />
                </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Subiendo...' : 'Subir Imagen'}
            </button>
        </form>
    );
}

export default SubirImagen;