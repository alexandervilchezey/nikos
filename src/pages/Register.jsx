import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // Actualizar displayName
      await updateProfile(user, {
        displayName: `${form.name} ${form.lastname}`,
      });

      // Guardar en Firestore
      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        email: user.email,
        rol: 'cliente',
        nombre: form.name,
        apellido: form.lastname,
        creadoEn: new Date()
      });

      // Enviar verificación de correo
      await sendEmailVerification(user);
      navigate('/confirmar');

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo ya está registrado.');
      } else {
        setError('No se pudo registrar el usuario.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-md p-6 gap-2 border border-gray-200 rounded-xl shadow space-y-6"
      >
        <h1 className="text-2xl font-semibold text-black text-center">Crear cuenta</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <input
            name="name"
            type="text"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            name="lastname"
            type="text"
            placeholder="Apellido"
            value={form.lastname}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-600"
          >
            {showPassword ? (
              <i className="bx bx-eye-slash h-5 w-5"></i>
            ) : (
              <i className="bx bx-eye h-5 w-5"></i>
            )}
          </button>
        </div>

        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2.5 text-gray-600"
          >
            {showConfirm ? (
              <i className="bx bx-eye-slash h-5 w-5"></i>
            ) : (
              <i className="bx bx-eye h-5 w-5"></i>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded transition ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
          }`}
        >
          {loading ? 'Creando cuenta...' : 'Registrarme'}
        </button>

        <p className="text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <a href="/nikos/login" className="text-black underline">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
