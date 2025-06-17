import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset`, // Esto es importante
        handleCodeInApp: true,
      });
      setMessage('📬 Se ha enviado un enlace para restablecer tu contraseña.');
    } catch (error) {
      setMessage('❌ Ocurrió un error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-black px-4">
      <h2 className="text-xl font-semibold mb-4">Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          className="border px-3 py-2 w-full"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 w-full hover:bg-gray-800"
        >
          Enviar enlace
        </button>
      </form>
      <p className="mt-4">{message}</p>
    </div>
  );
}
