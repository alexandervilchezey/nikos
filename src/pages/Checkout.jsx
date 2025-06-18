import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../components/carrito/CarritoContext";
import InputField from "../components/reusable/InputField";
import SelectField from "../components/reusable/SelectField";
import ubicacionesPeru from "../utils/ubicacionesPeru";
import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { generarMensajeWhatsApp, obtenerNuevoNumeroOrden } from "../utils/generalFunctions";

const numeroWhatsApp = import.meta.env.VITE_WHATSAPP_NUMBER;

export default function CheckoutPage() {
  const { carrito, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const ciudades = Object.keys(ubicacionesPeru);
  const distritos = watch("ciudad") ? ubicacionesPeru[watch("ciudad")] : [];

  // Autocompletar campos con datos del usuario
useEffect(() => {
  const user = auth.currentUser;
  if (user) {
    const fetchData = async () => {
      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const displayName = user.displayName || '';
        const [nombre, apellido] = displayName.split(' ');

        reset({
          nombre: nombre || '',
          apellido: apellido || '',
          telefono: data.telefono || '',
          dni: data.dni || '',
          direccion: data.direccion || '',
          codigopostal: data.codigopostal || '',
          ciudad: data.ciudad || '',
          notas: data.notas || '',
        });

        // Esperar a que ciudad se haya montado
        setTimeout(() => {
          reset((prev) => ({
            ...prev,
            distrito: data.distrito || '',
          }));
        }, 50);
      }
    };

    fetchData();
  }
}, [reset]);


  const onSubmit = async (data) => {
    setLoading(true);
  if (!isValid) {
    console.warn("Formulario inválido. Revisa los campos.");
    setLoading(false);
    return;
  }

  try {
    const numeroOrden = await obtenerNuevoNumeroOrden();

    await addDoc(collection(db, "ordenes"), {
      uid: auth.currentUser?.uid,
      numeroOrden,
      cliente: data,
      estado: 'pendiente',
      carrito,
      total,
      creadoEn: serverTimestamp(),
    });

    const mensaje = generarMensajeWhatsApp(numeroOrden, data, carrito, total);
    const numeroTelefono = numeroWhatsApp || "51944788568";
    const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, "_blank");
    setLoading(false);
    setModalVisible(true);
  } catch (error) {
    console.error("Error al registrar la orden:", error);
  }
};


  const finalizarCompra = () => {
    vaciarCarrito();
    setModalVisible(false);
    reset();
    navigate("/");
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="p-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <h2 className="text-2xl font-bold mb-4">Información de Envío</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Nombre"
            name="nombre"
            register={register}
            rules={{ 
              required: "El nombre es obligatorio",
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                message: "Solo se permiten letras",
              }
            }}
            error={errors.nombre}
          />
          <InputField
            label="Apellido"
            name="apellido"
            register={register}
            rules={{ 
              required: "El apellido es obligatorio",
              pattern: {
                value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,
                message: "Solo se permiten letras",
              } 
            }}
            error={errors.apellido}
          />
          <InputField
            label="DNI"
            name="dni"
            register={register}
            rules={{
              required: "El DNI es obligatorio",
              pattern: {
                value: /^[0-9]{8}$/,
                message: "Debe tener exactamente 8 dígitos",
              },
            }}
            error={errors.dni}
          />
          <InputField
            label="Teléfono"
            name="telefono"
            register={register}
            rules={{
              required: "El teléfono es obligatorio",
              pattern: {
                value: /^[0-9]+$/,
                message: "Solo se permiten números",
              },
            }}
            error={errors.telefono}
          />
          <InputField
            label="Dirección"
            name="direccion"
            register={register}
            rules={{ required: "La dirección es obligatoria" }}
            error={errors.direccion}
          />
           <InputField
            label="Código Postal"
            name="codigopostal"
            register={register}
            rules={{
              required: "El código postal es obligatorio",
              pattern: {
                value: /^[0-9]{1,6}$/,
                message: "Máximo 6 dígitos numéricos",
              },
            }}
            error={errors.codigopostal}
          />
          <SelectField
            label="Ciudad"
            name="ciudad"
            options={ciudades}
            register={register}
            error={errors.ciudad}
            required={true}
          />
          <SelectField
            label="Distrito"
            name="distrito"
            options={distritos}
            register={register}
            error={errors.distrito}
            required={true}
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas adicionales (opcional)
          </label>
          <textarea
            {...register("notas")}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Ej. indicar si desea factura, punto de referencia, etc."
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full py-3 rounded transition ${
              isValid && !loading
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Enviando..." : "Enviar compra"}
          </button>
        </div>
      </form>

      {/* Resumen del carrito */}
      <div className="bg-gray-100 p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Resumen de compra</h2>
        {carrito.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 mb-3 border-b pb-2">
            <img
              src={item.imagen}
              alt={item.nombre}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.nombre}</h3>
              <p className="text-sm text-gray-600">
                Talla: {item.talla} | Color: {item.color}
              </p>
              <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
              <p className="text-sm text-gray-800 font-medium">
                S/ {item.precio * item.cantidad}
              </p>
            </div>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t text-right font-bold text-lg">
          Total: S/ {total.toFixed(2)}
        </div>
        <p className="text-xs text-gray-600 mt-1 text-right">* No incluye delivery</p>
      </div>

      {/* Modal de confirmación */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
            <h3 className="text-xl font-bold mb-2">¡Gracias por tu compra!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Por favor no olvides enviar la orden por WhatsApp y uno de nuestros asesores se comunicará contigo para los siguientes pasos.
            </p>
            <button
              onClick={finalizarCompra}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Muchas gracias
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
