import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { applyActionCode, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verificando...');

  useEffect(() => {
    const oobCode = params.get('oobCode');
    if (!oobCode) {
      setStatus('❌ Código inválido.');
      return;
    }

    onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified) {
        setStatus('✅ Tu correo ya está verificado. Redirigiendo...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        applyActionCode(auth, oobCode)
          .then(() => {
            setStatus('✅ Correo verificado exitosamente. Redirigiendo...');
            setTimeout(() => navigate('/login'), 3000);
          })
          .catch((error) => {
            if (error.code === 'auth/invalid-action-code') {
              setStatus('✅ Enlace verificado. Redirigiendo...');
            } else {
              setStatus('❌ Ocurrió un error inesperado.');
            }
          });
      }
    });
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-black">
      <p className="text-lg">{status}</p>
    </div>
  );
}
