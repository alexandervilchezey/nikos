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
      const index = prev.findIndex(
        (item) =>
          item.slug === productoNuevo.slug &&
          item.talla === productoNuevo.talla &&
          item.color === productoNuevo.color
      );

      if (index !== -1) {
        const actualizado = [...prev];
        const nuevaCantidad = actualizado[index].cantidad + productoNuevo.cantidad;
        actualizado[index].cantidad = Math.min(nuevaCantidad, 3); // máximo 3 unidades
        return actualizado;
      }

      return [...prev, { ...productoNuevo, cantidad: Math.min(productoNuevo.cantidad, 3) }];
    });
  };

  const quitarDelCarrito = (slug, talla, color) => {
    setCarrito((prev) =>
      prev.filter(
        (item) =>
          !(item.slug === slug && item.talla === talla && item.color === color)
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const actualizarCantidad = (slug, talla, color, nuevaCantidad) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (
          item.slug === slug &&
          item.talla === talla &&
          item.color === color
        ) {
          return {
            ...item,
            cantidad: Math.max(1, Math.min(nuevaCantidad, 3)), // entre 1 y 3
          };
        }
        return item;
      })
    );
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        quitarDelCarrito,
        vaciarCarrito,
        actualizarCantidad,
      }}
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
