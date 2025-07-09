import { useCarrito, useModalCarrito } from "../carrito/CarritoContext";

export default function HeaderRight({ setIsSearchOpen }) {
  const { abrirCarrito } = useModalCarrito();
  const { carrito } = useCarrito();
  return (
    <div className="header-right">
      <div className="list-inline">
          <ul className="list-none">
          <li className="flex">
            <a href="#" onClick={(e) => { e.preventDefault(); setIsSearchOpen(true); }}>
              <i className="bx bx-search"></i>
            </a>
          </li>
          <li className="flex">
            <button onClick={abrirCarrito} className="cursor-pointer flex relative text-[24px] py-0 px-[24px]">
              <i className="bx bx-cart text-2xl"></i>
              {carrito.length > 0 && (
                <span className="absolute -top-2 right-[10px] py-0 px-1 bg-red-500 text-white text-xs px-1 rounded-full">
                  {carrito.length}
                </span>
              )}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
