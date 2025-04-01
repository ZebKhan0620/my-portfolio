import { getEasingValue, EasingFunction } from "@/config/animations";

interface SectionHeaderProps {
  title: string;
  eyebrow: string;
  description: string;
}

export const SectionHeader = ({ title, eyebrow, description }: SectionHeaderProps) => {
  return (
    <div className="text-center">
      <span className="text-emerald-300 text-sm font-semibold uppercase tracking-wider mb-2 inline-block">
        {eyebrow}
      </span>
      <h2 className="text-4xl font-bold mb-3 font-serif text-gradient">
        {title}
      </h2>
      <p className="text-white/70 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
};

