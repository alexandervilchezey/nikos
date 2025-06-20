import { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ubicacionesPeru from '../utils/ubicacionesPeru';
import { useForm } from 'react-hook-form';
import InputField from '../components/reusable/InputField';
import SelectField from '../components/reusable/SelectField';

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMensaje, setLoadingMensaje] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const ciudadSeleccionada = watch('ciudad');
  const ciudades = Object.keys(ubicacionesPeru);
  const distritos = ciudadSeleccionada ? ubicacionesPeru[ciudadSeleccionada] : [];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login');
      } else {
        setUsuario(user);

        try {
          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);
          const displayName = user.displayName || '';
          const [nombre, apellido] = displayName.split(' ');

          if (docSnap.exists()) {
            const data = docSnap.data();

            reset({
              nombre: nombre || '',
              apellido: apellido || '',
              dni: data.dni || '',
              telefono: data.telefono || '',
              direccion: data.direccion || '',
              codigopostal: data.codigopostal || '',
              ciudad: data.ciudad || '',
              distrito: data.distrito || '',
            });
          } else {
            setMensaje('No se encontraron datos del usuario.');
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          setMensaje('Ocurrió un error al cargar tu perfil.');
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, reset]);

  const handleGuardar = async (data) => {
     setLoadingMensaje(true);
    if (!usuario) return;

    setMensaje('');
    const nombreCompleto = `${data.nombre} ${data.apellido}`.trim();

    try {
      const docRef = doc(db, 'usuarios', usuario.uid);
      await updateDoc(docRef, data);

      await updateProfile(usuario, {
        displayName: nombreCompleto,
      });

      setMensaje('Datos actualizados correctamente.');
      setTimeout(() => setMensaje(''), 3000);
      setLoadingMensaje(false);
    } catch (error) {
      console.error('Error al guardar:', error);
      setLoadingMensaje(false);
      setMensaje('Error al guardar los cambios.');
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Cargando perfil...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Mi Perfil</h2>

      {mensaje && <p className="text-center text-sm text-blue-600 mb-4">{mensaje}</p>}

      <form onSubmit={handleSubmit(handleGuardar)} className="p-6 space-y-4">

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
              },
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
              },
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

        <button
            type="submit"
            disabled={loading || loadingMensaje}
            className={`w-full py-3 my-3 rounded transition ${
                !loading && !loadingMensaje
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            >
            {loadingMensaje ? "Guardando..." : "Guardar información"}
        </button>
      </form>
    </div>
  );
}
