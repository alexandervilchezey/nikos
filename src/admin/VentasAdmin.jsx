import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { generarMensajeWhatsApp } from "../utils/generalFunctions";

export default function VentasAdmin() {
  const [ordenes, setOrdenes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalEstado, setModalEstado] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(false);

  const ordenesPorPagina = 6;

  const cargarOrdenes = async () => {
    const snapshot = await getDocs(collection(db, "ordenes"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrdenes(data);
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const ordenesFiltradas = ordenes.filter((orden) => {
    const nombreCompleto = `${orden.cliente?.nombre || ""} ${orden.cliente?.apellido || ""}`.toLowerCase();
    const coincideNombre = nombreCompleto.includes(busqueda.toLowerCase());
    const coincideEstado = filtroEstado ? orden.estado === filtroEstado : true;
    return coincideNombre && coincideEstado;
  }).sort((a, b) =>
    ordenAscendente
      ? a.numeroOrden - b.numeroOrden
      : b.numeroOrden - a.numeroOrden
  );

  const totalPaginas = Math.ceil(ordenesFiltradas.length / ordenesPorPagina);
  const ordenesPagina = ordenesFiltradas.slice(
    (paginaActual - 1) * ordenesPorPagina,
    paginaActual * ordenesPorPagina
  );

  const cambiarEstado = async (orden, nuevoEstado) => {
    await updateDoc(doc(db, "ordenes", orden.id), { estado: nuevoEstado });
    setModalEstado(null);
    cargarOrdenes();
  };

  const reenviarWhatsapp = (orden) => {
    const mensaje = generarMensajeWhatsApp(
      orden.numeroOrden,
      orden.cliente,
      orden.carrito,
      orden.total,
      orden.mayorista
    );
    const numero = orden.cliente.telefono?.replace(/\D/g, "");
    if (!numero) return alert("Número de teléfono no válido");

    const link = `https://wa.me/51${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(link, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Gestión de Ventas</h2>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre del cliente"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/2"
        />
        <select
          value={filtroEstado}
          onChange={(e) => {
            setFiltroEstado(e.target.value);
            setPaginaActual(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
          <option value="anulado">Anulado</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th
                onClick={() => {
                  setOrdenAscendente(!ordenAscendente);
                  setPaginaActual(1);
                }}
                className="py-2 px-4 border cursor-pointer select-none"
              >
                N° Orden {ordenAscendente ? "⬇" : "⬆"}
              </th>
              <th className="py-2 px-4 border">Cliente</th>
              <th className="py-2 px-4 border">Total</th>
              <th className="py-2 px-4 border">Estado</th>
              <th className="py-2 px-4 border">Compra Mayorista</th>
              <th className="py-2 px-4 border">Fecha realizada</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenesPagina.map((orden) => (
              <tr key={orden.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 border text-center">
                  #{String(orden.numeroOrden).padStart(4, "0")}
                </td>
                <td className="py-2 px-4 border">
                  {orden.cliente?.nombre} {orden.cliente?.apellido}
                </td>
                <td className="py-2 px-4 border">S/ {orden.total.toFixed(2)}</td>
                <td className="py-2 px-4 border capitalize">{orden.estado}</td>
                <td className="py-2 px-4 border capitalize">{orden.mayorista ? 'Sí': 'No'}</td>
                <td className="py-2 px-4 border text-center">
                  {orden.creadoEn?.toDate
                    ? orden.creadoEn.toDate().toLocaleString("es-PE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : "—"}
                </td>
                <td className="py-2 px-4 flex justify-center gap-3 text-center">
                  <button
                    onClick={() => setModalDetalle(orden)}
                    title="Ver detalle"
                  >
                    <i className="bx bx-eye-alt text-blue-600 text-lg hover:scale-110 transition-transform"></i>
                  </button>
                  <button
                    onClick={() => setModalEstado(orden)}
                    title="Cambiar estado"
                  >
                    <i className="bx bx-checklist text-yellow-600 text-lg hover:scale-110 transition-transform"></i>
                  </button>
                  <button
                    onClick={() => reenviarWhatsapp(orden)}
                    title="Reenviar a WhatsApp"
                  >
                    <i className="bx bx-send-alt text-green-600 text-lg hover:scale-110 transition-transform"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
            disabled={paginaActual === 1}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-30"
          >
            Anterior
          </button>
          <span className="text-gray-600">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-30"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal Detalle */}
      {modalDetalle && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              Detalle de Orden #{String(modalDetalle.numeroOrden).padStart(4, "0")}
            </h3>
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="text-left border-b">
                  <th>Producto</th>
                  <th>Talla</th>
                  <th>Color</th>
                  <th>Cant</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {modalDetalle.carrito.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-1">{item.nombre}</td>
                    <td className="py-1">{item.talla}</td>
                    <td className="py-1">{item.color}</td>
                    <td className="py-1">{item.cantidad}</td>
                    <td className="py-1">S/{modalDetalle.mayorista ? item.precioMayorista : item.precioDescuento || item.precio}</td>
                    <td className="py-1">
                      S/{((modalDetalle.mayorista ? item.precioMayorista : item.precioDescuento || item.precio) * item.cantidad).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right font-semibold text-lg">
              Total: S/ {modalDetalle.total.toFixed(2)}
            </div>
            <div className="text-right mt-4">
              <button
                onClick={() => setModalDetalle(null)}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Estado */}
      {modalEstado && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Cambiar estado</h3>
            <p className="mb-3 text-gray-600">
              Estado actual: <strong>{modalEstado.estado}</strong>
            </p>
            <div className="flex flex-col gap-2 mb-4">
              {["pendiente", "cancelado", "anulado"].map((estado) => (
                <button
                  key={estado}
                  onClick={() => cambiarEstado(modalEstado, estado)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  {estado}
                </button>
              ))}
            </div>
            <button
              onClick={() => setModalEstado(null)}
              className="text-sm text-gray-500 hover:underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
