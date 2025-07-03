import { Outlet } from 'react-router-dom';
import Header from '../components/reusable/Header'
import Footer from '../components/reusable/Footer'
import ModalFiltros from "../components/reusable/ModalFiltros";
import CarritoModal from "../components/carrito/CarritoModal";
import { useModalCarrito } from "../components/carrito/CarritoContext";
import WhatsappFloat from '../components/reusable/WhatsappFloat';
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Layout() {
  const { mostrarCarrito, animatingClose, cerrarModalConAnimacion } = useModalCarrito();
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const ref = doc(db, "config", "datosFooter");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setDatos(snap.data());
        }
      } catch (err) {
        console.error("Error al obtener datos del footer:", err);
      }
    };

    fetchDatos();
  }, []);
  return (
    <>
        <Header />
        <Outlet />
        <Footer datos={datos}/>
        <ModalFiltros
          mostrarModalFiltros={mostrarCarrito}
          animatingClose={animatingClose}
          cerrarModalConAnimacion={cerrarModalConAnimacion}
          direction="right"
          width="w-[500px]"
        >
          <CarritoModal />
        </ModalFiltros>
        {datos?.whatsapp && <WhatsappFloat whatsapp={datos.whatsapp} />}
    </>
  );
}