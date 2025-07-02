import nikosDatos from "../../utils/generalData";
import whastApp_icon from "../../assets/images/WhatsApp_icon.png";
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
        src={whastApp_icon}
        alt="WhatsApp"
        width="50"
        height="50"
      />
    </a>
  );
}
