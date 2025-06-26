import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function FiltrosAdmin() {
  const [filtros, setFiltros] = useState([]);
  const [nuevoFiltro, setNuevoFiltro] = useState({ valor: "", tipo: "" });
  const [imagen, setImagen] = useState(null);
  const [editando, setEditando] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);

  const [paginaActual, setPaginaActual] = useState(1);
  const filtrosPorPagina = 6;

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ddebdvfcg/upload";

  const cargarFiltros = async () => {
    const snapshot = await getDocs(collection(db, "filtros"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFiltros(data);
  };

  useEffect(() => {
    cargarFiltros();
  }, []);

  const subirACloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "nikosperu_preset");
    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleGuardar = async () => {
    if (!nuevoFiltro.valor || !nuevoFiltro.tipo) return;

    setSubiendo(true);
    let urlImagen = null;

    if (nuevoFiltro.tipo.toLowerCase() === "marca") {
      if (imagen) urlImagen = await subirACloudinary(imagen);
      if (!imagen && editando?.imagen === null) urlImagen = null;
    }

    const data = {
      valor: nuevoFiltro.valor,
      tipo: nuevoFiltro.tipo.toLowerCase(),
      ...(urlImagen !== null ? { imagen: urlImagen } : {}),
    };

    if (nuevoFiltro.tipo.toLowerCase() === "usuario") {
      data.tallas = nuevoFiltro.tallas?.filter(t => t.trim() !== "") || [];
    }

    if (editando) {
      await updateDoc(doc(db, "filtros", editando.id), data);
    } else {
      await addDoc(collection(db, "filtros"), data);
    }

    setNuevoFiltro({ valor: "", tipo: "", tallas: [] });
    setImagen(null);
    setEditando(null);
    setModalAbierto(false);
    setSubiendo(false);
    cargarFiltros();
  };

  const handleEditar = (filtro) => {
    setNuevoFiltro({
      valor: filtro.valor,
      tipo: filtro.tipo,
      tallas: filtro.tallas || [],
    });
    setEditando(filtro);
    setImagen(null);
    setModalAbierto(true);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este filtro?")) {
      await deleteDoc(doc(db, "filtros", id));
      cargarFiltros();
    }
  };

  const filtrosFiltrados = filtros.filter((f) => {
    const matchValor = f.valor.toLowerCase().includes(busqueda.toLowerCase());
    const matchTipo = filtroTipo ? f.tipo === filtroTipo : true;
    return matchValor && matchTipo;
  });

  const totalPaginas = Math.ceil(filtrosFiltrados.length / filtrosPorPagina);
  const inicio = (paginaActual - 1) * filtrosPorPagina;
  const filtrosPagina = filtrosFiltrados.slice(inicio, inicio + filtrosPorPagina);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Gestión de Categorías</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por valor"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/2 shadow-sm"
        />
        <select
          value={filtroTipo}
          onChange={(e) => {
            setFiltroTipo(e.target.value);
            setPaginaActual(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/4 shadow-sm"
        >
          <option value="">Todos los tipos</option>
          <option value="usuario">Usuario</option>
          <option value="origen">Origen</option>
          <option value="uso">Uso</option>
          <option value="marca">Marca</option>
          <option value="material">Material</option>
          <option value="tipo">Tipo</option>
        </select>
        <button
          onClick={() => {
            setNuevoFiltro({ valor: "", tipo: "" });
            setEditando(null);
            setModalAbierto(true);
          }}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition w-full md:w-auto"
        >
          + Nuevo Filtro
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 border">Valor</th>
              <th className="py-2 px-4 border">Tipo</th>
              <th className="py-2 px-4 border">Imagen</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrosPagina.map((filtro) => (
              <tr key={filtro.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4 border">{filtro.valor}</td>
                <td className="py-2 px-4 border">{filtro.tipo}</td>
                <td className="py-2 px-4 border text-center">
                  {filtro.imagen ? (
                    <img
                      src={filtro.imagen}
                      alt={filtro.valor}
                      className="w-16 h-10 object-contain rounded border mx-auto"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-2 px-4 flex justify-center gap-2 text-center space-x-2">
                  <button
                    onClick={() => handleEditar(filtro)}
                    className="p-2 text-blue-600 hover:underline"
                  >
                    <i className="bx bx-pencil"></i>
                  </button>
                  <button
                    onClick={() => handleEliminar(filtro.id)}
                    className="p-2 text-red-600 hover:underline"
                  >
                    <i className="bx bx-trash"></i>
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
          <span className="text-gray-600">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
            disabled={paginaActual === totalPaginas}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-30"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Modal de edición/creación */}
      {modalAbierto && (
  <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm bg-opacity-40 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
      <h3 className="text-lg font-semibold mb-4">
        {editando ? "Editar filtro" : "Nuevo filtro"}
      </h3>

      <div className="flex flex-col space-y-4 gap-3">
        <input
          type="text"
          placeholder="Valor (ej. Hombre, Casual, Nike)"
          value={nuevoFiltro.valor}
          onChange={(e) => setNuevoFiltro({ ...nuevoFiltro, valor: e.target.value })}
          className="w-full px-3 py-2 border rounded shadow-sm"
        />

        <select
          value={nuevoFiltro.tipo}
          onChange={(e) => {
            setNuevoFiltro({ ...nuevoFiltro, tipo: e.target.value });
            setImagen(null);
          }}
          className="w-full px-3 py-2 border rounded shadow-sm"
        >
          <option value="">Tipo de filtro</option>
          <option value="usuario">Usuario</option>
          <option value="origen">Origen</option>
          <option value="uso">Uso</option>
          <option value="marca">Marca</option>
          <option value="material">Material</option>
          <option value="tipo">Tipo</option>
        </select>

        {/* Campo dinámico para tallas */}
        {nuevoFiltro.tipo === "usuario" && (
          <div>
            <label className="font-medium text-sm mb-2">Tallas asociadas</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(nuevoFiltro.tallas || []).map((talla, index) => (
                <div key={index} className="flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    value={talla}
                    onChange={(e) => {
                      const updated = [...nuevoFiltro.tallas];
                      updated[index] = e.target.value;
                      setNuevoFiltro({ ...nuevoFiltro, tallas: updated });
                    }}
                    className="w-16 px-2 py-1 border rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = nuevoFiltro.tallas.filter((_, i) => i !== index);
                      setNuevoFiltro({ ...nuevoFiltro, tallas: updated });
                    }}
                    className="text-red-500 text-sm hover:underline"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setNuevoFiltro({
                  ...nuevoFiltro,
                  tallas: [...(nuevoFiltro.tallas || []), ""]
                })
              }
              className="text-blue-600 text-sm hover:underline"
            >
              + Agregar talla
            </button>
          </div>
        )}

        {/* Campo para imagen de marca */}
        {nuevoFiltro.tipo === "marca" && (
          <div className="flex flex-col items-start gap-2">
            {imagen ? (
              <div className="relative w-32 h-20 border rounded overflow-hidden">
                <img
                  src={URL.createObjectURL(imagen)}
                  alt="Vista previa"
                  className="object-contain w-full h-full"
                />
                <button
                  onClick={() => setImagen(null)}
                  className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 rounded-bl hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : editando?.imagen ? (
              <div className="relative w-32 h-20 border rounded overflow-hidden">
                <img
                  src={editando.imagen}
                  alt="Imagen actual"
                  className="object-contain w-full h-full"
                />
                <button
                  onClick={() => setEditando({ ...editando, imagen: null })}
                  className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1 rounded-bl hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setImagen(file);
                  e.target.value = "";
                }}
                className="w-full px-3 py-2 border rounded shadow-sm"
              />
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6 space-x-2 gap-3">
        <button
          onClick={() => setModalAbierto(false)}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          onClick={handleGuardar}
          disabled={subiendo}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {subiendo ? "Subiendo..." : editando ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
