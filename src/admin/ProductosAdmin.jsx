import { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ProductoModal from '../components/admin/ProductoModal';
import Modal from '../components/reusable/Modal';

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [orden, setOrden] = useState('recientes');
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 6;

  const [isOpen, setIsOpen] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);

  const abrirNuevo = () => {
    setProductoEdit(null);
    setTimeout(() => {
      setIsOpen(true);
    }, 0);
  };

  const editar = (producto) => {
    setProductoEdit(producto);
    setIsOpen(true);
  };

  const confirmarEliminar = (producto) => {
    setProductoEdit(producto);
    setModalEliminar(true);
  };

  const eliminar = async () => {
    if (!productoEdit) return;
    await deleteDoc(doc(db, 'productos', productoEdit.id));
    setProductos((prev) => prev.filter((p) => p.id !== productoEdit.id));
    setModalEliminar(false);
  };

  useEffect(() => {
    const obtenerProductos = async () => {
      const querySnapshot = await getDocs(collection(db, 'productos'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(data);
    };
    obtenerProductos();
  }, [isOpen]);

  const filtrarYOrdenar = () => {
    let filtrados = productos.filter(p => p.nombre.toLowerCase().includes(filtroNombre.toLowerCase()));

    if (orden === 'recientes') {
      filtrados.sort((a, b) => b.creadoEn?.seconds - a.creadoEn?.seconds);
    } else {
      filtrados.sort((a, b) => a.creadoEn?.seconds - b.creadoEn?.seconds);
    }

    return filtrados;
  };

  const productosFiltrados = filtrarYOrdenar();
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const inicio = (paginaActual - 1) * productosPorPagina;
  const productosPagina = productosFiltrados.slice(inicio, inicio + productosPorPagina);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <button onClick={abrirNuevo} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          + Nuevo Producto
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full md:w-64"
        />
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded"
        >
          <option value="recientes">Más recientes</option>
          <option value="antiguos">Más antiguos</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Precio</th>
              <th className="py-2 px-4 border">Marca</th>
              <th className="py-2 px-4 border">Material</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosPagina.map((producto) => (
              <tr key={producto.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 border">{producto.nombre}</td>
                <td className="py-2 px-4 border">S/ {producto.precio}</td>
                <td className="py-2 px-4 border">{producto.marca}</td>
                <td className="py-2 px-4 border">{(producto.material || []).join(', ')}</td>
                <td className="py-2 px-4 flex justify-center gap-2 text-center space-x-2">
                  <button
                    onClick={() => editar(producto)}
                    className="p-2 text-blue-600 hover:underline"
                  >
                    <i className='bx bx-pencil'></i>
                  </button>
                  <button
                    onClick={() => confirmarEliminar(producto)}
                    className="p-2 text-red-600 hover:underline"
                  >
                    <i className='bx bx-trash'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-30"
          >
            Anterior
          </button>
          <span className="text-gray-600">Página {paginaActual} de {totalPaginas}</span>
          <button
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-30"
          >
            Siguiente
          </button>
        </div>
      </div>

      <ProductoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        editarProducto={productoEdit}
      />

      <Modal isOpen={modalEliminar} onClose={() => setModalEliminar(false)}>
            <div className="w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-2">Eliminar producto</h2>
            <p className="mb-4">¿Estás seguro que deseas eliminar el producto "{productoEdit?.nombre || ''}"?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalEliminar(false)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                No, cancelar
              </button>
              <button
                onClick={eliminar}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
      </Modal>

      
    </div>
  );
}
