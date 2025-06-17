import { doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const obtenerNuevoNumeroOrden = async () => {
  const docRef = doc(db, "config", "ordenes");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const ultimoNumero = docSnap.data().ultimoNumero || 0;
    await updateDoc(docRef, {
      ultimoNumero: increment(1)
    });
    return ultimoNumero + 1;
  } else {
    // Si no existe, crearlo
    await setDoc(docRef, { ultimoNumero: 1 });
    return 1;
  }
};

export const generarMensajeWhatsApp = (numeroOrden, data, carrito, total) => {
  const nombre = `${data.nombre} ${data.apellido}`;
  const productosTexto = carrito.map((item) => 
    `• ${item.nombre} x${item.cantidad} – S/ ${item.precio * item.cantidad}`
  ).join('\n');

  return `Hola! se envía la orden N°${String(numeroOrden).padStart(4, '0')} de ${nombre}

 Productos:
${productosTexto}

 Total: S/. ${total}`;
};