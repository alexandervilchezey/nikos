// src/pages/FirebaseRedirector.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function FirebaseRedirector() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const mode = params.get('mode');
    const oobCode = params.get('oobCode');
    console.log('mode',mode);
    if (mode === 'verifyEmail' && oobCode) {
      navigate(`/verify-email?oobCode=${oobCode}`);
    } else if (mode === 'resetPassword' && oobCode) {
      navigate(`/reset?oobCode=${oobCode}`);
    }
  }, [params, navigate]);

  return null;
}
