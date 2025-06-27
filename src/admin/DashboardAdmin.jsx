import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function DashboardAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      const usuariosSnap = await getDocs(query(collection(db, "usuarios"), orderBy("creadoEn", "desc")));
      const ventasSnap = await getDocs(query(collection(db, "ventas"), orderBy("fecha", "desc")));

      setUsuarios(usuariosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setVentas(ventasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    cargarDatos();
  }, []);

  const usuariosRecientes = usuarios.slice(0, 5);
  const ventasFiltradas = ventas.filter((v) => {
    if (!fechaInicio || !fechaFin) return true;
    const fecha = v.fecha?.toDate?.();
    return fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin);
  });

  const totalVentas = ventasFiltradas.reduce((sum, v) => sum + (v.total || 0), 0);
  const totalOrdenes = ventasFiltradas.length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Principal</h2>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="border px-4 py-2 rounded" />
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="border px-4 py-2 rounded" />
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded shadow p-4">
          <h3 className="text-lg font-medium">Total de Ventas</h3>
          <p className="text-2xl text-green-600 font-bold mt-2">S/. {totalVentas.toFixed(2)}</p>
        </div>
        <div className="bg-white border rounded shadow p-4">
          <h3 className="text-lg font-medium">Total de Órdenes</h3>
          <p className="text-2xl text-blue-600 font-bold mt-2">{totalOrdenes}</p>
        </div>
        <div className="bg-white border rounded shadow p-4">
          <h3 className="text-lg font-medium">Usuarios Registrados</h3>
          <p className="text-2xl text-purple-600 font-bold mt-2">{usuarios.length}</p>
        </div>
      </div>

      {/* Últimos usuarios */}
      <div className="bg-white rounded shadow p-4 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Últimos Usuarios</h3>
          <a href="/admin/usuarios" className="text-blue-600 text-sm hover:underline">Ver más</a>
        </div>
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {usuariosRecientes.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="py-2 px-4 border">{u.nombre} {u.apellido}</td>
                <td className="py-2 px-4 border">
                  {u.creadoEn?.toDate?.().toLocaleString("es-PE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                  }) || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simulación de gráfico (puedes reemplazar por Chart.js) */}
      <div className="bg-white border rounded shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Resumen gráfico (simulado)</h3>
        <img src="/ventas_diarias.png" alt="Ventas Diarias" className="w-full rounded" />
      </div>
    </div>
  );
}
