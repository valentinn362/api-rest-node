import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3900/api/articulos")
      .then(res => res.json())
      .then(data => {
        setArticulos(data.articulos || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="container">
      <h1>📝 Mis Artículos</h1>
      
      <div className="grid">
        {articulos.map(art => (
          <article key={art._id} className="card">
            {art.imagen && (
              <img 
                src={`http://localhost:3900/api/imagen/articulo/${art.imagen}`} 
                alt={art.titulo}
              />
            )}
            <div className="content">
              <h2>{art.titulo}</h2>
              <p>{art.contenido}</p>
              <span className="fecha">
                {new Date(art.fecha).toLocaleDateString()}
              </span>
            </div>
          </article>
        ))}
      </div>

      {articulos.length === 0 && (
        <p className="empty">No hay artículos aún</p>
      )}
    </div>
  );
}

export default App;