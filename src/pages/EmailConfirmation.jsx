import { useState } from 'react';
import { auth } from '../firebase/firebase';
import { sendEmailVerification } from 'firebase/auth';

export default function EmailConfirmation() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResend = async () => {
    setMessage('');
    setError('');
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setMessage('Correo de verificación reenviado.');
      } else {
        setError('No hay sesión activa.');
      }
    } catch (err) {
        console.log(err)
      setError('No se pudo enviar el correo. Inténtalo más tarde.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-6 border border-gray-200 rounded-xl shadow-sm space-y-6">
        <h1 className="text-2xl font-semibold text-black text-center">Verifica tu correo</h1>

        <p className="text-gray-700 text-center">
          Te hemos enviado un correo con un enlace para verificar tu cuenta.
        </p>

        {message && <p className="text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          onClick={handleResend}
          className="w-full py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Reenviar correo de verificación
        </button>
      </div>
    </div>
  );
}
