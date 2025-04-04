import { getEasingValue, EasingFunction } from "@/config/animations";
import { useLanguage } from "@/contexts/LanguageContext";

interface SectionHeaderProps {
  title: string;
  eyebrow: string;
  description: string;
}

export const SectionHeader = ({ title, eyebrow, description }: SectionHeaderProps) => {
  const { language } = useLanguage();

  return (
    <div className="text-center">
      <span className={`text-emerald-300 text-sm font-semibold uppercase tracking-wider mb-2 inline-block ${
        language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-sans)]'
      }`}>
        {eyebrow}
      </span>
      <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-3 ${
        language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-serif)]'
      } text-gradient`}>
        {title}
      </h2>
      <p className={`text-white/70 max-w-2xl mx-auto text-base sm:text-lg ${
        language === 'ja' ? 'font-[var(--font-jp)]' : 'font-[var(--font-sans)]'
      }`}>
        {description}
      </p>
    </div>
  );
};

