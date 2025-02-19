export const SectionHeader = ({ title, eyebrow, description }: { title: string, eyebrow: string, description: string }) => {
  return <div className="text-center">
    <h2 className="text-4xl font-bold">{title}</h2>
    <p className="text-gray-400">{description}</p>
  </div>;
};

