import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const stored = localStorage.getItem("carrito");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

    const agregarAlCarrito = (productoNuevo) => {
    setCarrito((prev) => {
      const existe = prev.find(
        (item) =>
          item.slug === productoNuevo.slug &&
          item.talla === productoNuevo.talla &&
          item.color === productoNuevo.color
      );

      if (existe) {
        // Si ya existe, solo sumamos la cantidad
        return prev.map((item) =>
          item.slug === productoNuevo.slug &&
          item.talla === productoNuevo.talla &&
          item.color === productoNuevo.color
            ? { ...item, cantidad: item.cantidad + productoNuevo.cantidad }
            : item
        );
      }

      // Nuevo item
      return [...prev, productoNuevo];
    });
  };

  const quitarDelCarrito = (slug) => {
    setCarrito((prev) => prev.filter((item) => item.slug !== slug));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, quitarDelCarrito, vaciarCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}

const ModalCarritoContext = createContext();

export function ModalCarritoProvider({ children }) {
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [animatingClose, setAnimatingClose] = useState(false);

  const abrirCarrito = () => setMostrarCarrito(true);

  const cerrarModalConAnimacion = () => {
    setAnimatingClose(true);
    setTimeout(() => {
      setMostrarCarrito(false);
      setAnimatingClose(false);
    }, 400);
  };

  return (
    <ModalCarritoContext.Provider
      value={{ mostrarCarrito, animatingClose, abrirCarrito, cerrarModalConAnimacion }}
    >
      {children}
    </ModalCarritoContext.Provider>
  );
}

export function useModalCarrito() {
  return useContext(ModalCarritoContext);
}