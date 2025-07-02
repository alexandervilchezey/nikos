// IMPORTACIONES
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../components/carrito/CarritoContext";
import InputField from "../components/reusable/InputField";
import SelectField from "../components/reusable/SelectField";
import ubicacionesPeru from "../utils/ubicacionesPeru";
import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { generarMensajeWhatsApp, obtenerNuevoNumeroOrden, optimizarImagenCloudinary } from "../utils/generalFunctions";
import nikosDatos from "../utils/generalData";

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

  const isMayorista = useMemo(() => {
    try {
      const usuarioInfo = JSON.parse(localStorage.getItem("usuario"));
      return usuarioInfo?.usuarioMayorista === true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }, []);

  const ciudades = Object.keys(ubicacionesPeru);
  const distritos = watch("ciudad") ? ubicacionesPeru[watch("ciudad")] : [];

  // ✅ Autocompletar campos
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const fetchData = async () => {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const displayName = user.displayName || "";
          const [nombre, apellido] = displayName.split(" ");

          reset({
            nombre: nombre || "",
            apellido: apellido || "",
            telefono: data.telefono || "",
            dni: data.dni || "",
            direccion: data.direccion || "",
            codigopostal: data.codigopostal || "",
            ciudad: data.ciudad || "",
            notas: data.notas || "",
          });

          setTimeout(() => {
            reset((prev) => ({
              ...prev,
              distrito: data.distrito || "",
            }));
          }, 50);
        }
      };

      fetchData();
    }
  }, [reset]);

  // ✅ Cálculo del total usando el precio correcto
  const total = useMemo(() => {
    return carrito.reduce((acc, item) => {
      const precioUnitario = isMayorista
        ? item.precioMayorista
        : item.precioDescuento || item.precio;
      return acc + precioUnitario * item.cantidad;
    }, 0);
  }, [carrito, isMayorista]);

  // Al enviar el formulario
  const onSubmit = async (data) => {
    setLoading(true);
    if (!isValid) {
      console.warn("Formulario inválido");
      setLoading(false);
      return;
    }

    try {
      const numeroOrden = await obtenerNuevoNumeroOrden();
      await addDoc(collection(db, "ordenes"), {
        uid: auth.currentUser?.uid || "",
        numeroOrden,
        cliente: data,
        estado: "pendiente",
        carrito,
        total,
        creadoEn: serverTimestamp(),
      });

      const mensaje = generarMensajeWhatsApp(numeroOrden, data, carrito, total);
      const urlWhatsApp = `https://wa.me/${nikosDatos.whatsapp}?text=${encodeURIComponent(mensaje)}`;
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

  return (
    <div className="p-4 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6" noValidate>
        <h2 className="text-2xl font-bold mb-4">Información de Envío</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Nombre" name="nombre" register={register} rules={{ required: "Obligatorio", pattern: { value: /^[A-Za-z\s]+$/, message: "Solo letras" }}} error={errors.nombre} />
          <InputField label="Apellido" name="apellido" register={register} rules={{ required: "Obligatorio", pattern: { value: /^[A-Za-z\s]+$/, message: "Solo letras" }}} error={errors.apellido} />
          <InputField label="DNI" name="dni" register={register} rules={{ required: "Obligatorio", pattern: { value: /^[0-9]{8}$/, message: "8 dígitos" }}} error={errors.dni} />
          <InputField label="Teléfono" name="telefono" register={register} rules={{ required: "Obligatorio", pattern: { value: /^[0-9]+$/, message: "Solo números" }}} error={errors.telefono} />
          <InputField label="Dirección" name="direccion" register={register} rules={{ required: "Obligatorio" }} error={errors.direccion} />
          <InputField label="Código Postal" name="codigopostal" register={register} rules={{ required: "Obligatorio", pattern: { value: /^[0-9]{1,6}$/, message: "Máximo 6 dígitos" }}} error={errors.codigopostal} />
          <SelectField label="Ciudad" name="ciudad" options={ciudades} register={register} error={errors.ciudad} required />
          <SelectField label="Distrito" name="distrito" options={distritos} register={register} error={errors.distrito} required />
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
          <textarea {...register("notas")} rows={4} className="w-full border rounded px-3 py-2 text-sm resize-none" placeholder="Punto de referencia, facturación, etc." />
        </div>

        <div className="pt-4">
          <button type="submit" disabled={!isValid || loading} className={`w-full py-3 rounded font-semibold transition ${isValid && !loading ? "bg-black text-white hover:bg-gray-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
            {loading ? "Enviando..." : "Enviar compra"}
          </button>
        </div>
      </form>

      {/* Resumen del carrito */}
      <div className="bg-gray-100 p-4 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Resumen de compra</h2>
        {carrito.map((item, idx) => {
          const precioUnitario = isMayorista
            ? item.precioMayorista
            : item.precioDescuento || item.precio;

          return (
            <div key={idx} className="flex items-center gap-4 mb-3 border-b pb-2">
              <img
                src={optimizarImagenCloudinary(item.imagen)}
                alt={`Imagen de ${item.nombre}`}
                loading="lazy"
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.nombre}</h3>
                <div className="text-sm text-gray-600 flex items-center">
                  Talla: {item.talla} | Color: {item.color}
                </div>
                <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                <p className="text-sm font-medium text-gray-800">
                  S/ {(precioUnitario * item.cantidad).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
        <div className="mt-4 pt-4 text-right font-bold text-lg">
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
              Por favor envía la orden por WhatsApp. Un asesor se comunicará contigo.
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
