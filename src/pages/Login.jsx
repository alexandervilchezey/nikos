import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await user.reload();

      if (!user.emailVerified) {
        await auth.signOut();
        return setError('Debes verificar tu correo antes de iniciar sesión.');
      }

      // Obtener datos del usuario en Firestore
      const userDocRef = doc(db, 'usuarios', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().active === false) {
        await auth.signOut();
        return setError('Tu cuenta ha sido desactivada. Contacta con soporte.');
      }

      if (!userDoc.exists()) {
        await auth.signOut();
        return setError('Tu cuenta presenta errores. Contacta con soporte.');
      }

      const userData = userDoc.data();
      const { rol, usuarioMayorista = false } = userData;

      // Limpia antes de guardar
      localStorage.removeItem('usuario');

      // Guarda solo lo esencial
      const sessionData = JSON.stringify({
        uid: user.uid,
        rol,
        usuarioMayorista
      });

      if (remember) {
        localStorage.setItem('usuario', sessionData);
      } else {
        localStorage.setItem('usuario', sessionData);
      }

      if (rol === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error(err);
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-6 border border-gray-200 rounded-xl shadow space-y-6"
      >
        <h1 className="text-2xl font-semibold text-black text-center">Iniciar sesión</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-black">Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-black">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 my-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="form-checkbox border-gray-400"
              />
              <span>Recuérdame</span>
            </label>
            <button
              type="button"
              onClick={() => navigate('/forgotPassword')}
              className="text-black hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Iniciar sesión
        </button>

        <p className="text-center text-sm text-gray-700 my-1">
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-black hover:underline"
          >
            Registrarme
          </button>
        </p>

        <p className="text-center text-sm text-gray-700 my-1">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-black hover:underline"
          >
            Volver a la página principal
          </button>
        </p>
      </form>
    </div>
  );
}
