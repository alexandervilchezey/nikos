import { useEffect } from "react";

export default function ModalFiltros({
  mostrarModalFiltros,
  animatingClose,
  cerrarModalConAnimacion,
  direction = "left",
  width = "w-72",
  children
}) {
  useEffect(() => {
    if (mostrarModalFiltros) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [mostrarModalFiltros]);

  if (!mostrarModalFiltros && !animatingClose) return null;

  const directionClass = direction === "left"
    ? animatingClose ? "slide-out-left" : "slide-in-left"
    : animatingClose ? "slide-out-right" : "slide-in-right";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 opacity-100"
        onClick={cerrarModalConAnimacion}
      />

      <div
        className={`relative h-full bg-white shadow-xl ${width} ${directionClass} ${direction === "right" ? "max-w-[75%] right-0 absolute ml-auto" : "left-0 absolute"}`}
      >
        <div className="flex justify-end items-center p-4">
          <button onClick={cerrarModalConAnimacion}>✕</button>
        </div>
        <div className="p-2 overflow-y-auto h-full max-h-[calc(100vh-6rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}