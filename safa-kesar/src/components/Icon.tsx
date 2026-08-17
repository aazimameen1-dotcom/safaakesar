export default function Icon({
  name,
  fill,
  className = "",
}: {
  name: string;
  fill?: boolean;
  className?: string;
}) {  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
