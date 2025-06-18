export default function EmailConfirmation() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-6 border border-gray-200 rounded-xl shadow-sm space-y-6">
        <h1 className="text-2xl font-semibold text-black text-center">Verifica tu correo</h1>
        <p className="text-gray-700 text-center">
          Te hemos enviado un correo con un enlace para verificar tu cuenta.
        </p>
      </div>
    </div>
  );
}
