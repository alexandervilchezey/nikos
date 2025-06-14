export default function Footer() {
  return (
    <div id="contacto" className="footer relative left-1/2 -translate-x-1/2 w-screen">
    <footer className="bg-black text-gray-200 py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h2 className="title-footer text-2xl font-bold mb-2">Nikos</h2>
          <p className="text-sm">Diseñamos productos únicos para personas únicas. Calidad, estilo y funcionalidad en uno solo.</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-3">Enlaces</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline">Inicio</a></li>
            <li><a href="/nikos/productos" className="hover:underline">Productos</a></li>
            <li><a href="/nikos/#marcas" className="hover:underline">Marcas</a></li>
            <li><a href="#contacto" className="hover:underline">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-3">Contacto</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: contacto@mimarca.com</li>
            <li>Tel: +34 123 456 789</li>
            <li>Dirección: Calle Ficticia 123, Ciudad</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-3">Síguenos</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.5-3.7 1 0 2 .2 2 .2v2.3h-1.1c-1.1 0-1.4.7-1.4 1.4v1.7h2.5l-.4 2.9H13.4v7A10 10 0 0 0 22 12z"/>
                </svg>
            </a>
            <a href="#" className="hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm">
        © {new Date().getFullYear()} Nikos. Todos los derechos reservados.
      </div>
    </footer>
    </div>
  );
};