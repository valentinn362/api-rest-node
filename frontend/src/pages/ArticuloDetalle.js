import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import SubirImagen from '../components/SubirImagen';

function ArticuloDetalle() {
    const { id } = useParams();
    const [articulo, setArticulo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.obtener(id)
            .then(data => {
                setArticulo(data.articulo);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleImagenSubida = (artActualizado) => {
        setArticulo(artActualizado);
    };

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!articulo) return <div>No encontrado</div>;

    return (
        <div className="detalle">
            <Link to="/" className="btn btn-secondary">← Volver</Link>
            
            <article className="articulo-completo">
                {articulo.imagen && (
                    <img 
                        src={api.getImagenUrl(articulo.imagen)} 
                        alt={articulo.titulo}
                        className="imagen-principal"
                    />
                )}
                
                <h1>{articulo.titulo}</h1>
                <p className="fecha">
                    {new Date(articulo.fecha).toLocaleString()}
                </p>
                <div className="contenido">{articulo.contenido}</div>
            </article>

            <div className="acciones">
                <h3>Acciones</h3>
                <Link to={`/editar/${articulo._id}`} className="btn btn-secondary">
                    Editar Artículo
                </Link>
                
                <h4>Subir/Actualizar Imagen</h4>
                <SubirImagen 
                    articuloId={articulo._id} 
                    onImagenSubida={handleImagenSubida}
                />
            </div>
        </div>
    );
}

export default ArticuloDetalle;