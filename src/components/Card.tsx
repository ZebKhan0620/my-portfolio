export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={`bg-white/5 backdrop-blur border border-white/10 rounded-3xl ${className}`}>{children}</div>;
};
