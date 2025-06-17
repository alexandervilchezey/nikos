const numeroWhatsApp = import.meta.env.VITE_WHATSAPP_NUMBER;
export default function WhatsappFloat() {
  const numeroTelefono = numeroWhatsApp || '51944788568';
  return (
    <a
      href={`https://wa.me/${numeroTelefono}`}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contáctanos por WhatsApp"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png"
        alt="WhatsApp"
        width="50"
        height="50"
      />
    </a>
  );
}
