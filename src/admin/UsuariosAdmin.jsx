import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase";


export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [modal, setModal] = useState(null);

  const usuariosPorPagina = 6;

  const cargarUsuarios = async () => {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsuarios(data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((u) => {
    const nombreCompleto = `${u.nombre || ""} ${u.apellido || ""}`.toLowerCase();
    const coincideNombre = nombreCompleto.includes(busqueda.toLowerCase());
    const coincideRol = filtroRol ? u.rol === filtroRol : true;
    return coincideNombre && coincideRol;
  });

  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const usuariosPagina = usuariosFiltrados.slice(
    (paginaActual - 1) * usuariosPorPagina,
    paginaActual * usuariosPorPagina
  );

  const cambiarRol = async (usuario) => {
    await updateDoc(doc(db, "usuarios", usuario.id), {
      rol: usuario.rol === "admin" ? "cliente" : "admin",
    });
    setModal(null);
    cargarUsuarios();
  };

  const cambiarMayorista = async (usuario) => {
    await updateDoc(doc(db, "usuarios", usuario.id), {
      usuarioMayorista: !usuario.usuarioMayorista,
    });
    setModal(null);
    cargarUsuarios();
  };

  const eliminarUsuario = async (usuario) => {
    await updateDoc(doc(db, "usuarios", usuario.id), {
      active: false,
    });
    setModal(null);
    cargarUsuarios();
  };

  const activarUsuario = async (usuario) => {
    await updateDoc(doc(db, "usuarios", usuario.id), {
      active: true,
    });
    setModal(null);
    cargarUsuarios();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/2"
        />
        <select
          value={filtroRol}
          onChange={(e) => {
            setFiltroRol(e.target.value);
            setPaginaActual(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4"
        >
          <option value="">Todos los roles</option>
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Fecha Creado</th>
              <th className="py-2 px-4 border">Activo</th>
              <th className="py-2 px-4 border">Rol</th>
              <th className="py-2 px-4 border">Mayorista</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
  {usuariosPagina.map((usuario) => (
    <tr key={usuario.id} className={`border-t hover:bg-gray-50 ${
    usuario.active === false ? "bg-gray-100 text-gray-400" : ""
  }`}>
      <td className="py-2 px-4 border">
        {usuario.nombre || "—"} {usuario.apellido || ""}
      </td>
      <td className="py-2 px-4 border">
        {usuario.creadoEn?.toDate
          ? usuario.creadoEn.toDate().toLocaleString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })
          : "—"}
      </td>
      <td className="py-2 px-4 border capitalize">{usuario.active ? 'Sí' : 'No'}</td>
      <td className="py-2 px-4 border capitalize">{usuario.rol}</td>
      <td className="py-2 px-4 border text-center">
        {usuario.usuarioMayorista ? "Sí" : "No"}
      </td>
      <td className="py-2 px-4 flex justify-center gap-2 text-center space-x-2">
  {usuario.active === false ? (
    <button
      onClick={() => setModal({ tipo: "activar", usuario })}
      title="Activar cuenta"
    >
      <i className="bx bx-check-circle text-green-600 text-lg hover:scale-110 transition-transform"></i>
    </button>
  ) : (
    <>
      <button
        onClick={() => setModal({ tipo: "cambiarRol", usuario })}
        title="Cambiar rol"
      >
        <i className="bx bx-user-id-card text-blue-600 text-lg hover:scale-110 transition-transform"></i>
      </button>
      <button
        onClick={() => setModal({ tipo: "cambiarMayorista", usuario })}
        title="Cambiar estado mayorista"
      >
        <i className="bx bx-piggy-bank text-yellow-600 text-lg hover:scale-110 transition-transform"></i>
      </button>
      {usuario.uid !== auth.currentUser?.uid && (
        <button
          onClick={() => setModal({ tipo: "eliminar", usuario })}
          title="Desactivar cuenta"
        >
          <i className="bx bx-trash text-red-600 text-lg hover:scale-110 transition-transform"></i>
        </button>
      )}
    </>
  )}
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
            onClick={() =>
              setPaginaActual((p) => Math.min(p + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-30"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modales */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow max-w-sm w-full text-center">
            <p className="mb-4 text-gray-800">
              {modal.tipo === "cambiarRol" &&
                `¿Cambiar rol de ${modal.usuario.nombre} a ${
                  modal.usuario.rol === "admin" ? "cliente" : "admin"
                }?`}
              {modal.tipo === "cambiarMayorista" &&
                `¿Cambiar estado mayorista a ${
                  modal.usuario.usuarioMayorista ? "NO" : "SÍ"
                } para ${modal.usuario.nombre}?`}
                {modal.tipo === "activar" &&
                `¿Deseas activar al usuario ${modal.usuario.nombre}?`}
              {modal.tipo === "eliminar" &&
                `¿Deseas desactivar al usuario ${modal.usuario.nombre}? No podrá iniciar sesión hasta que lo actives.`}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (modal.tipo === "cambiarRol") cambiarRol(modal.usuario);
                  if (modal.tipo === "cambiarMayorista")
                    cambiarMayorista(modal.usuario);
                  if (modal.tipo === "eliminar") eliminarUsuario(modal.usuario);
                  if (modal.tipo === "activar") activarUsuario(modal.usuario);
                }}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
