export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-sm text-gray-600 mb-1">Total Ventas</h3>
        <p className="text-2xl font-bold">S/ 8,230</p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-sm text-gray-600 mb-1">Productos</h3>
        <p className="text-2xl font-bold">125</p>
      </div>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-sm text-gray-600 mb-1">Usuarios</h3>
        <p className="text-2xl font-bold">320</p>
      </div>
    </div>
  );
}
