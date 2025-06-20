import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const oobCode = params.get('oobCode');

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus('');

    if (newPassword !== confirmPassword) {
      return setStatus('Las contraseñas no coinciden.');
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus('Contraseña restablecida. Redirigiendo...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.log(error);
      setStatus('Error al cambiar la contraseña. Ya ha usado este enlace. Redirigiendo...');
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  useEffect(() => {
    if (!oobCode) setStatus('Código inválido.');
  }, [oobCode]);

  const isError = status.toLowerCase().includes('error') || status.toLowerCase().includes('inválido') || status.toLowerCase().includes('coinciden') || status.toLowerCase().includes('enlace');

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleReset}
        className="flex flex-col gap-2 w-full max-w-md p-6 border border-gray-200 rounded-xl shadow-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-black text-center">Nueva Contraseña</h2>

        {status && (
          <p className={`text-sm text-center ${isError ? 'text-red-500' : 'text-green-600'}`}>
            {status}
          </p>
        )}

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
          >
            {showPassword ? (
              <i className='bx  bx-eye-slash h-5 w-5'></i> 
            ) : (
              <i className='bx bx-eye h-5 w-5'></i>
            )}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirm ? 'text' : 'password'}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
          >
            {showConfirm ? (
              <i className='bx  bx-eye-slash h-5 w-5'></i> 
            ) : (
              <i className='bx bx-eye h-5 w-5'></i>
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
          {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
        </button>
      </form>
    </div>
  );
}
