// components/admin/BotonCatalogo.jsx
import { useState } from 'react';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { db } from '../../firebase/firebase';
import PDFCatalog from '../../components/admin/PDFCatalog';

export default function BotonCatalogo() {
  const [catalogoData, setCatalogoData] = useState(null);
  const [contacto, setContacto] = useState(null);
  const [generando, setGenerando] = useState(false);

  const generarCatalogo = async () => {
    try {
      setGenerando(true);

      // Obtener productos
      const productosSnap = await getDocs(collection(db, 'productos'));
      const productos = productosSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      // Obtener contacto desde config
      const configSnap = await getDoc(doc(db, 'config', 'datosFooter'));
      const contactoData = configSnap.exists() ? configSnap.data() : {};

      setCatalogoData(productos);
      setContacto(contactoData);
    } catch (error) {
      console.error('Error generando catálogo:', error);
    } finally {
      setGenerando(false);
    }
  };

  if (!catalogoData || !contacto) {
    return (
      <button
        onClick={generarCatalogo}
        disabled={generando}
        className={`${
          generando ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
        } text-white px-4 py-2 rounded`}
      >
        {generando ? 'Generando catálogo...' : 'Descargar Catálogo'}
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<PDFCatalog products={catalogoData} contacto={contacto} />}
      fileName="catalogo-nikos.pdf"
    >
      {({ loading }) =>
        loading ? (
          <button className="bg-gray-400 text-white px-4 py-2 rounded" disabled>
            Generando PDF...
          </button>
        ) : (
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            Descargar Catálogo
          </button>
        )
      }
    </PDFDownloadLink>
  );
}
