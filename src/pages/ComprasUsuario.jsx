import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function ComprasUsuario() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompra, setSelectedCompra] = useState(null);
  const navigate = useNavigate();
  const comprasPorPagina = 5;

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      navigate('/login');
      return;
    }

    const obtenerCompras = async () => {
      try {
        const q = query(collection(db, 'ordenes'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const comprasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompras(comprasData);
      } catch (error) {
        console.error('Error al obtener las compras:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerCompras();
  }, [navigate]);

  useEffect(() => {
    document.body.style.overflow = selectedCompra ? 'hidden' : 'auto';
  }, [selectedCompra]);

  const indexInicial = (currentPage - 1) * comprasPorPagina;
  const comprasPaginadas = compras.slice(indexInicial, indexInicial + comprasPorPagina);
  const totalPaginas = Math.ceil(compras.length / comprasPorPagina);

  if (loading) return <p className="text-center mt-10">Cargando tus compras...</p>;
  if (compras.length === 0) return <p className="text-center mt-10">No tienes compras registradas.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Mis Compras</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">Orden</th>
              <th className="py-2 px-4 border">Fecha</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {comprasPaginadas.map((compra) => (
              <tr key={compra.id} className="border-t">
                <td className="py-2 px-4 border">{compra.numeroOrden}</td>
                <td className="py-2 px-4 border">{compra.creadoEn?.toDate().toLocaleDateString()}</td>
                <td className="py-2 px-4 border">S/ {compra.total}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => setSelectedCompra(compra)}
                    className="text-blue-600 hover:underline"
                  >
                    Ver productos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-30"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">Página {currentPage} de {totalPaginas}</span>
          <button
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-30"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={currentPage === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      </div>

      {selectedCompra && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-white max-w-3xl w-full rounded shadow-lg p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCompra(null)}
              className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">Detalle de productos</h3>
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Producto</th>
                  <th className="py-2 px-4 border">Cantidad</th>
                  <th className="py-2 px-4 border">Color</th>
                  <th className="py-2 px-4 border">Talla</th>
                </tr>
              </thead>
              <tbody>
                {selectedCompra.carrito.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2 px-4 border">{item.nombre}</td>
                    <td className="py-2 px-4 border">{item.cantidad}</td>
                    <td className="py-2 px-4 border">
                      {item.color ? (
                        <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: item.color }}></div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="py-2 px-4 border">{item.talla || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
