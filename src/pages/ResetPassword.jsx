import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const oobCode = params.get('oobCode');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus('✅ Contraseña restablecida. Redirigiendo...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
        console.log(error)
      setStatus('❌ Error al cambiar la contraseña.');
    }
  };

  useEffect(() => {
    if (!oobCode) setStatus('Código inválido.');
  }, [oobCode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-black px-4">
      <h2 className="text-xl font-semibold mb-4">Nueva Contraseña</h2>
      <form onSubmit={handleReset} className="w-full max-w-sm space-y-4">
        <input
          type="password"
          className="border px-3 py-2 w-full"
          placeholder="Escribe tu nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 w-full hover:bg-gray-800"
        >
          Cambiar Contraseña
        </button>
      </form>
      <p className="mt-4">{status}</p>
    </div>
  );
}
