import { BrandMark } from "@/components/BrandMark";

type BrandLogoProps = {
  variant?: "light" | "dark";
  className?: string;
  showWordmark?: boolean;
  size?: "md" | "lg" | "xl";
  /**
   * Lockup empilhado (marca acima do wordmark), como nas logos oficiais —
   * usa assets transparentes (mark) para não carregar o fundo do PNG.
   */
  lockup?: boolean;
};

const sizes = {
  md: { mark: "h-9 w-9", text: "text-[1.35rem]", stackMark: "h-14 w-14", stackText: "text-xl" },
  lg: { mark: "h-11 w-11", text: "text-[1.55rem]", stackMark: "h-16 w-16", stackText: "text-2xl" },
  xl: {
    mark: "h-16 w-16 sm:h-[4.25rem] sm:w-[4.25rem]",
    text: "text-3xl sm:text-4xl md:text-5xl",
    stackMark: "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28",
    stackText: "text-3xl sm:text-4xl md:text-5xl",
  },
} as const;

export function BrandLogo({
  variant = "light",
  className = "",
  showWordmark = true,
  size = "md",
  lockup = false,
}: BrandLogoProps) {
  const isDark = variant === "dark";
  const scale = sizes[size];

  const wordmark = showWordmark ? (
    <span className={`display-font font-semibold leading-none tracking-tight ${lockup ? scale.stackText : scale.text}`}>
      <span className={isDark ? "text-white" : "text-brand-deep"}>Duplex</span>
      <span className={isDark ? "text-accent-soft" : "text-brand"}>Soft</span>
    </span>
  ) : null;

  const markDecorative = Boolean(showWordmark);

  if (lockup) {
    return (
      <span className={`inline-flex flex-col gap-3 ${className || "items-center"}`}>
        <BrandMark
          tone={isDark ? "bright" : "navy"}
          className={`${scale.stackMark} shrink-0`}
          decorative={markDecorative}
        />
        {wordmark}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandMark
        tone={isDark ? "bright" : "navy"}
        className={`${scale.mark} shrink-0`}
        decorative={markDecorative}
      />
      {wordmark}
    </span>
  );
}
