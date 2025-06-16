import './App.css'
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout'
import Home from './pages/Home'
import Products from './pages/Products';
import ProductosPage from './pages/ProductosPage';
import { useModalCarrito } from "./components/carrito/CarritoContext";
import ModalFiltros from "./components/reusable/ModalFiltros";
import CarritoModal from "./components/carrito/CarritoModal";
import Checkout from './pages/Checkout';

function App() {
  const {
    mostrarCarrito,
    animatingClose,
    cerrarModalConAnimacion
  } = useModalCarrito();
  return (
    <div className="relative" style={{ minHeight: '100dvh' }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/productos/:slug" element={<Products />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Routes>
      <ModalFiltros
        mostrarModalFiltros={mostrarCarrito}
        animatingClose={animatingClose}
        cerrarModalConAnimacion={cerrarModalConAnimacion}
        direction="right"
        width="w-[500px]"
      >
        <CarritoModal />
      </ModalFiltros>
    </div>
  )
}

export default App