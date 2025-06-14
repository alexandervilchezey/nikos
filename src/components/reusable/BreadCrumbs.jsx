export default function BreadCrumbs({producto}) {
  return (
    <div className="wrap">
        <div className="breadcrumb list-inline py-4 py-2 md:px-0">
            <ul className="flex justify-left md992:justify-center gap-[10px]">
                <li><a href="/nikos">Inicio</a></li>
                <li><a href="/nikos/productos">Productos</a></li>
                <li><a href={`/nikos/productos/${producto.slug}`}><span>{producto.nombre}</span></a></li>
            </ul>
        </div>
    </div>
  );
};