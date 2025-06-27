import { doc, getDoc, updateDoc, increment, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import placeholder from "../assets/images/no-photo.JPG";

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

export const generarSlugBase = (nombre) => {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const generarSlugUnico = async (nombre, idExistente = null) => {
  const base = generarSlugBase(nombre);
  let slug = base;
  let contador = 1;

  while (true) {
    const q = query(collection(db, 'productos'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    const existe = snapshot.docs.find(doc => doc.id !== idExistente);
    if (!existe) break;
    slug = `${base}-${contador++}`;
  }

  return slug;
};

export const optimizarImagenCloudinary = (url) => {
  if(url){
    return url.replace("/upload/", "/upload/f_auto,q_auto/");
  }else{
    return placeholder;
  }
  
};