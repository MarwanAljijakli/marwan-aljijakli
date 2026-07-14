import type { LocalizedText } from "@/content/portfolio";

type BilingualProps = Readonly<{
  text: LocalizedText;
  className?: string;
}>;

export function Bilingual({ text, className }: BilingualProps) {
  const classes = className ? `localized-copy ${className}` : "localized-copy";

  return (
    <>
      <span className={`${classes} copy-en`}>{text.en}</span>
      <span className={`${classes} copy-ar`} lang="ar">
        {text.ar}
      </span>
    </>
  );
}
