type BrandMarkProps = {
  className?: string;
  title?: string;
  /** `navy` para fundos claros; `bright` para fundos escuros */
  tone?: "navy" | "bright";
  /** Quando o wordmark adjacente já nomeia a marca */
  decorative?: boolean;
};

export function BrandMark({
  className = "h-9 w-9",
  title = "DuplexSoft",
  tone = "navy",
  decorative = false,
}: BrandMarkProps) {
  const src =
    tone === "bright" ? "/brand/mark-bright-v2.png" : "/brand/mark-v2.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={decorative ? "" : title}
      width={64}
      height={64}
      className={`block bg-transparent object-contain ${className}`}
      style={{ backgroundColor: "transparent" }}
      decoding="async"
    />
  );
}
