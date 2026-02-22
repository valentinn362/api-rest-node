import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ArticuloCard from '../components/ArticuloCard';

function Home() {
    const [articulos, setArticulos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Cargar artículos
    useEffect(() => {
        cargarArticulos();
    }, []);

    const cargarArticulos = async () => {
        try {
            const data = await api.listar();
            setArticulos(data.articulos);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Buscar
    const handleBuscar = async (e) => {
        e.preventDefault();
        if (!busqueda.trim()) {
            cargarArticulos();
            return;
        }

        setLoading(true);
        try {
            const data = await api.buscar(busqueda);
            setArticulos(data.articulos);
        } catch (err) {
            setArticulos([]);
            setError(`No se encontraron resultados para "${busqueda}"`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setArticulos(articulos.filter(a => a._id !== id));
    };

    if (loading) return <div className="loading">Cargando...</div>;

    return (
        <div className="home">
            <div className="header">
                <h1>📝 Blog de Artículos</h1>
                <Link to="/crear" className="btn btn-primary">+ Nuevo Artículo</Link>
            </div>

            {/* Búsqueda */}
            <form onSubmit={handleBuscar} className="busqueda">
                <input
                    type="text"
                    placeholder="Buscar artículos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button type="submit">Buscar</button>
                {busqueda && (
                    <button type="button" onClick={() => {setBusqueda(''); cargarArticulos();}}>
                        Limpiar
                    </button>
                )}
            </form>

            {error && <div className="error">{error}</div>}

            {/* Grid de artículos */}
            <div className="grid">
                {articulos.map(art => (
                    <ArticuloCard 
                        key={art._id} 
                        articulo={art} 
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {articulos.length === 0 && !error && (
                <p className="empty">No hay artículos. ¡Crea el primero!</p>
            )}
        </div>
    );
}

export default Home;