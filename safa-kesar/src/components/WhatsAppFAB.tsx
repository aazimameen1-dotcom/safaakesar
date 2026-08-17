import Icon from "./Icon";

export default function WhatsAppFAB({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <a
      href={`https://wa.me/${number}`}
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
