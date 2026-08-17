import Icon from "./Icon";

export default function WhatsAppFAB({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  const cleanNumber = number ? number.replace(/\D/g, "") : "";
  const finalNumber =
    cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
  const message = encodeURIComponent(
    "Hello Safa Kesar! 🌾 I am browsing your online store and would like to inquire about authentic Kashmiri Saffron & Dry Fruits."
  );
  const href = finalNumber
    ? `https://wa.me/${finalNumber}?text=${message}`
    : `https://wa.me/?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="group fixed bottom-[88px] md:bottom-8 right-4 md:right-8 bg-trust-olive hover:bg-[#4a563b] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 z-40 flex items-center justify-center"
    >
      <Icon name="chat" className="text-2xl" />
      <span className="absolute right-full mr-3 whitespace-nowrap bg-walnut-ink text-warm-ivory font-label-caps text-label-caps uppercase px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    </a>
  );
}
