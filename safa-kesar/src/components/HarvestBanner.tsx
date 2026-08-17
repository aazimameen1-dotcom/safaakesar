import Icon from "./Icon";

export default function HarvestBanner({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="bg-secondary-container text-on-secondary-container py-2 text-center border-b border-outline-variant">
      <p className="font-label-caps text-label-caps flex items-center justify-center gap-2">
        <Icon name="eco" fill className="text-[16px]" />
        {text}
      </p>
    </div>
  );
}
