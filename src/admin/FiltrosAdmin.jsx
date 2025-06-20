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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function FiltrosAdmin() {
  const [filtros, setFiltros] = useState([]);
  const [nuevoFiltro, setNuevoFiltro] = useState({ valor: "", tipo: "" });
  const [imagen, setImagen] = useState(null);
  const [editando, setEditando] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const cargarFiltros = async () => {
    const snapshot = await getDocs(collection(db, "filtros"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setFiltros(data);
  };

  useEffect(() => {
    cargarFiltros();
  }, []);

  const handleGuardar = async () => {
    if (!nuevoFiltro.valor || !nuevoFiltro.tipo) return;

    let urlImagen = null;

    if (nuevoFiltro.tipo.toLowerCase() === "marca" && imagen) {
      setSubiendo(true);
      const storage = getStorage();
      const imageRef = ref(storage, `filtros/marcas/${Date.now()}_${imagen.name}`);
      await uploadBytes(imageRef, imagen);
      urlImagen = await getDownloadURL(imageRef);
      setSubiendo(false);
    }

    const data = {
      valor: nuevoFiltro.valor,
      tipo: nuevoFiltro.tipo.toLowerCase(),
      ...(urlImagen && { imagen: urlImagen }),
    };

    if (editando) {
      await updateDoc(doc(db, "filtros", editando.id), data);
    } else {
      await addDoc(collection(db, "filtros"), data);
    }

    setNuevoFiltro({ valor: "", tipo: "" });
    setImagen(null);
    setEditando(null);
    cargarFiltros();
  };

  const handleEditar = (filtro) => {
    setNuevoFiltro({ valor: filtro.valor, tipo: filtro.tipo });
    setEditando(filtro);
    setImagen(null);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este filtro?")) {
      await deleteDoc(doc(db, "filtros", id));
      cargarFiltros();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Gestión de Filtros</h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Valor (ej. Hombre, Casual, Nike)"
          value={nuevoFiltro.valor}
          onChange={(e) => setNuevoFiltro({ ...nuevoFiltro, valor: e.target.value })}
          className="px-3 py-2 border rounded"
        />
        <select
          value={nuevoFiltro.tipo}
          onChange={(e) => setNuevoFiltro({ ...nuevoFiltro, tipo: e.target.value })}
          className="px-3 py-2 border rounded"
        >
          <option value="">Tipo de filtro</option>
          <option value="usuario">Usuario</option>
          <option value="estilo">Estilo</option>
          <option value="uso">Uso</option>
          <option value="marca">Marca</option>
          <option value="material">Material</option>
          <option value="tipo">Tipo</option>
        </select>

        {nuevoFiltro.tipo === "marca" && (
          <input
            type="file"
            onChange={(e) => setImagen(e.target.files[0])}
            className="block border rounded px-3 py-2"
          />
        )}
      </div>

      <button
        onClick={handleGuardar}
        disabled={subiendo}
        className="mb-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {editando ? "Actualizar filtro" : "Guardar filtro"}
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Valor</th>
              <th className="border px-4 py-2">Tipo</th>
              <th className="border px-4 py-2">Imagen</th>
              <th className="border px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtros.map((filtro) => (
              <tr key={filtro.id} className="text-center">
                <td className="border px-4 py-2">{filtro.valor}</td>
                <td className="border px-4 py-2 capitalize">{filtro.tipo}</td>
                <td className="border px-4 py-2">
                  {filtro.imagen ? (
                    <img src={filtro.imagen} alt={filtro.valor} className="w-16 h-10 object-contain mx-auto" />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEditar(filtro)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(filtro.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
