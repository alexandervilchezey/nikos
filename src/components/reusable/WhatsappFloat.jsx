import nikosDatos from "../../utils/generalData";
export default function WhatsappFloat() {
  return (
    <a
      href={`https://wa.me/${nikosDatos.whatsapp}`}
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
