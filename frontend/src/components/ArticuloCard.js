import { Link } from 'react-router-dom';
import { api } from '../services/api';

function ArticuloCard({ articulo, onDelete }) {
    const handleDelete = async () => {
        if (!window.confirm('¿Eliminar este artículo?')) return;
        
        try {
            await api.borrar(articulo._id);
            onDelete(articulo._id);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <article className="card">
            {articulo.imagen && (
                <img 
                    src={api.getImagenUrl(articulo.imagen)} 
                    alt={articulo.titulo}
                    className="card-image"
                />
            )}
            <div className="card-content">
                <h3>{articulo.titulo}</h3>
                <p>{articulo.contenido.substring(0, 100)}...</p>
                <div className="card-actions">
                    <Link to={`/articulo/${articulo._id}`} className="btn btn-primary">
                        Ver más
                    </Link>
                    <Link to={`/editar/${articulo._id}`} className="btn btn-secondary">
                        Editar
                    </Link>
                    <button onClick={handleDelete} className="btn btn-danger">
                        Eliminar
                    </button>
                </div>
            </div>
        </article>
    );
}

export default ArticuloCard;