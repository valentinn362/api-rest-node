import { useNavigate, useParams } from 'react-router-dom';
import ArticuloForm from '../components/ArticuloForm';

function CrearArticulo({ editar = false }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleGuardado = (articulo) => {
        navigate(`/articulo/${articulo._id}`);
    };

    return (
        <div className="crear">
            <h1>{editar ? 'Editar' : 'Crear'} Artículo</h1>
            <ArticuloForm 
                articuloId={editar ? id : null} 
                onGuardado={handleGuardado} 
            />
        </div>
    );
}

export default CrearArticulo;