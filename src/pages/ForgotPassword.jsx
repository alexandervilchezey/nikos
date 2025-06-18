import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset`,
        handleCodeInApp: true,
      });
      setMessage('📬 Se ha enviado un enlace para restablecer tu contraseña. Redirigiendo...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setMessage('❌ Ocurrió un error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 w-full max-w-md p-6 border border-gray-200 rounded-xl shadow-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-black text-center">Recuperar Contraseña</h2>

        {message && (
          <p className={`text-sm text-center ${message.startsWith('❌') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded transition ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
          }`}
        >
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>

        <p className="text-sm text-center text-gray-600">
          ¿Ya recordaste tu contraseña?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-black underline"
          >
            Inicia sesión
          </button>
        </p>
      </form>
    </div>
  );
}
