import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
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

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(userCredential.user, {
        displayName: `${form.name} ${form.lastname}`,
      });

      await sendEmailVerification(userCredential.user);
      navigate('/confirmar');
    } catch (err) {
        console.log(err)
      setError('No se pudo registrar el usuario.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 border border-gray-200 rounded-xl shadow-sm space-y-4"
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

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmar contraseña"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Registrarme
        </button>

        <p className="text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-black underline">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
