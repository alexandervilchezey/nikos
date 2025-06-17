import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verificando...');

  useEffect(() => {
    const oobCode = params.get('oobCode');
    if (!oobCode) {
      setStatus('Código inválido');
      return;
    }

    applyActionCode(auth, oobCode)
      .then(() => {
        setStatus('✅ Correo verificado. Redirigiendo...');
        setTimeout(() => navigate('/login'), 3000);
      })
      .catch(() => {
        setStatus('❌ Enlace inválido o expirado.');
      });
  }, [params, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-black">
      <p className="text-lg">{status}</p>
    </div>
  );
}
