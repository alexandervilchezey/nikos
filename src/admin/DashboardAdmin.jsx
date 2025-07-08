import { useEffect, useState, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

import { useNavigate } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

function formatFecha(fecha) {
  return fecha.toISOString().split("T")[0];
}

function restarDias(fecha, dias) {
  const copia = new Date(fecha);
  copia.setDate(copia.getDate() - dias);
  return copia;
}

function parseFechaInicio(fechaStr) {
  return new Date(`${fechaStr}T00:00:00`);
}

function parseFechaFin(fechaStr) {
  return new Date(`${fechaStr}T23:59:59.999`);
}

function filtrarVentasPorFecha(ventas, fechaInicioStr, fechaFinStr) {
  const desde = parseFechaInicio(fechaInicioStr);
  const hasta = parseFechaFin(fechaFinStr);

  return ventas.filter((v) => {
    const fecha = v.creadoEn?.toDate?.();
    if (!fecha) return false;
    return fecha >= desde && fecha <= hasta;
  });
}

function obtenerDetalleProductos(ventasFiltradas) {
  const detalleMap = {};
  ventasFiltradas.forEach((venta) => {
    (venta.carrito || []).forEach((item) => {
      const clave = `${item.nombre}_${item.color}_${item.talla}_${item.tipoCalzado || "—"}`;
      if (!detalleMap[clave]) {
        detalleMap[clave] = {
          nombre: item.nombre,
          color: item.color || "—",
          talla: item.talla || "—",
          usuario: item.usuario || "—",
          cantidad: 0
        };
      }
      detalleMap[clave].cantidad += item.cantidad;
    });
  });

  return Object.values(detalleMap).sort((a, b) => b.cantidad - a.cantidad);
}

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const hoy = new Date();
  const hace7dias = restarDias(hoy, 7);

  const [fechaInicio, setFechaInicio] = useState(formatFecha(hace7dias));
  const [fechaFin, setFechaFin] = useState(formatFecha(hoy));

  useEffect(() => {
    const fetchAll = async () => {
      const [uSnap, pSnap, vSnap] = await Promise.all([
        getDocs(collection(db, "usuarios")),
        getDocs(collection(db, "productos")),
        getDocs(collection(db, "ordenes")),
      ]);

      setUsuarios(uSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setProductos(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setVentas(vSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };

    fetchAll();
  }, []);

  const ventasFiltradas = useMemo(() => {
    return filtrarVentasPorFecha(ventas, fechaInicio, fechaFin);
  }, [ventas, fechaInicio, fechaFin]);

  const totalVentas = useMemo(() => {
    return ventasFiltradas.reduce((acc, v) => acc + (v.total || 0), 0);
  }, [ventasFiltradas]);

  const ventasPorDia = useMemo(() => {
    const mapa = {};
    ventasFiltradas.forEach((v) => {
      const fecha = v.creadoEn?.toDate();
      if (!fecha) return;
      const key = formatFecha(fecha);
      mapa[key] = (mapa[key] || 0) + (v.total || 0);
    });
    return mapa;
  }, [ventasFiltradas]);

  const detalleProductos = useMemo(() => {
    return obtenerDetalleProductos(ventasFiltradas);
  }, [ventasFiltradas]);

  const fechas = Object.keys(ventasPorDia).sort();
  const valores = fechas.map((f) => ventasPorDia[f]);

  const productosMasVendidos = {};
  ventasFiltradas.forEach((venta) => {
    (venta.carrito || []).forEach((item) => {
      productosMasVendidos[item.nombre] = (productosMasVendidos[item.nombre] || 0) + item.cantidad;
    });
  });

  const topProductos = Object.entries(productosMasVendidos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const ultimasOrdenes = ventas
    .filter((v) => v.creadoEn?.toDate)
    .sort((a, b) => b.creadoEn.toDate() - a.creadoEn.toDate())
    .slice(0, 5);

  if (loading) return <div className="p-6">Cargando dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto gap-4">
      {/* Cards resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card icon="👥" label="Usuarios" value={usuarios.length} />
        <Card icon="📦" label="Productos" value={productos.length} />
        <Card icon="🧾" label="Órdenes" value={ventas.length} />
        <Card icon="💰" label="Total Ventas" value={`S/. ${totalVentas.toFixed(2)}`} />
      </div>

      {/* Filtro de fechas */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center my-2">
        <div>
          <label className="text-sm text-gray-600">Desde</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border px-3 py-1 rounded w-full sm:w-auto"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Hasta</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border px-3 py-1 rounded w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gráfico */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-semibold mb-2">Ventas por día</h2>
          <Bar
            data={{
              labels: fechas,
              datasets: [
                {
                  label: "Ventas (S/.)",
                  data: valores,
                  backgroundColor: "#60A5FA",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => `S/. ${context.raw.toFixed(2)}`
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: value => `S/. ${value}`
                  }
                }
              }
            }}
          />
        </div>

        {/* Top productos */}
        <div className="bg-white rounded shadow p-4 overflow-auto">
          <h2 className="font-semibold mb-2">Top 5 productos más vendidos</h2>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left px-2 py-1">Producto</th>
                <th className="text-left px-2 py-1">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {topProductos.map(([nombre, cantidad]) => (
                <tr key={nombre} className="border-b">
                  <td className="px-2 py-1">{nombre}</td>
                  <td className="px-2 py-1">{cantidad} unidades</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setModalVisible(true)}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Ver todos los productos vendidos →
          </button>
        </div>

        {/* Últimos usuarios */}
        <div className="bg-white rounded shadow p-4 overflow-auto">
          <h2 className="font-semibold mb-2">Últimos 5 usuarios</h2>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left px-2 py-1">Nombre</th>
                <th className="text-left px-2 py-1">Correo</th>
                <th className="text-left px-2 py-1">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {usuarios
                .sort((a, b) => b.creadoEn?.toDate() - a.creadoEn?.toDate())
                .slice(0, 5)
                .map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="px-2 py-1">{u.nombre} {u.apellido}</td>
                    <td className="px-2 py-1">{u.email || "—"}</td>
                    <td className="px-2 py-1">
                      {u.creadoEn?.toDate().toLocaleString("es-PE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button
            onClick={() => navigate("/admin/usuarios")}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Ver todos los usuarios →
          </button>
        </div>

        {/* Últimas ventas */}
        <div className="bg-white rounded shadow p-4 overflow-auto">
          <h2 className="font-semibold mb-2">Últimas 5 ventas</h2>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="text-left px-2 py-1">N° Orden</th>
                <th className="text-left px-2 py-1">Total</th>
                <th className="text-left px-2 py-1">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ultimasOrdenes.map((orden) => (
                <tr key={orden.id} className="border-b">
                  <td className="px-2 py-1">#{String(orden.numeroOrden).padStart(4, "0")}</td>
                  <td className="px-2 py-1">S/. {orden.total?.toFixed(2)}</td>
                  <td className="px-2 py-1">
                    {orden.creadoEn?.toDate().toLocaleString("es-PE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => navigate("/admin/ventas")}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Ver todas las ventas →
          </button>
        </div>
      </div>

      {/* Modal de productos vendidos */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-5xl w-full max-h-[80vh] overflow-y-auto rounded-lg shadow p-6 relative">
            <h2 className="text-xl font-bold mb-4">Todos los productos vendidos</h2>
            <table className="w-full text-sm border">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="text-left px-2 py-1">Producto</th>
                  <th className="text-left px-2 py-1">Color</th>
                  <th className="text-left px-2 py-1">Talla</th>
                  <th className="text-left px-2 py-1">Usuario</th>
                  <th className="text-left px-2 py-1">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {detalleProductos.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-2 py-1">{p.nombre}</td>
                    <td className="px-2 py-1">{p.color}</td>
                    <td className="px-2 py-1">{p.talla}</td>
                    <td className="px-2 py-1">{p.usuario}</td>
                    <td className="px-2 py-1">{p.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => setModalVisible(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ icon, label, value }) {
  return (
    <div className="bg-white shadow rounded p-3 sm:p-4 text-center text-sm">
      <div className="text-xl sm:text-2xl">{icon}</div>
      <div className="text-gray-600">{label}</div>
      <div className="font-bold text-lg sm:text-xl">{value}</div>
    </div>
  );
}
