import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ArticuloDetalle from './pages/ArticuloDetalle';
import CrearArticulo from './pages/CrearArticulo';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/articulo/:id" element={<ArticuloDetalle />} />
                    <Route path="/crear" element={<CrearArticulo />} />
                    <Route path="/editar/:id" element={<CrearArticulo editar={true} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;