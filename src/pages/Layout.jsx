import { Outlet } from 'react-router-dom';
import Header from '../components/reusable/Header'
import Footer from '../components/reusable/Footer'
import ModalFiltros from "../components/reusable/ModalFiltros";
import CarritoModal from "../components/carrito/CarritoModal";
import { useModalCarrito } from "../components/carrito/CarritoContext";

export default function Layout() {
  const { mostrarCarrito, animatingClose, cerrarModalConAnimacion } = useModalCarrito();

  return (
    <>
        <Header />
        <Outlet />
        <Footer />
        <ModalFiltros
          mostrarModalFiltros={mostrarCarrito}
          animatingClose={animatingClose}
          cerrarModalConAnimacion={cerrarModalConAnimacion}
          direction="right"
          width="w-[500px]"
        >
          <CarritoModal />
        </ModalFiltros>
    </>
  );
}