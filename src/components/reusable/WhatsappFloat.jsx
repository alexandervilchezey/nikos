import whastApp_icon from "../../assets/images/WhatsApp_icon.png";
export default function WhatsappFloat({whatsapp}) {
  return (
    <a
      href={`https://wa.me/${whatsapp}`}
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
