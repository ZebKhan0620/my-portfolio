interface TechIconProps {
  icon: React.ReactNode;
  className?: string;
}

// Define gradient once outside component to avoid duplication
const IconGradient = () => (
  <svg className="size-0 absolute hidden" aria-hidden="true">
    <linearGradient id="tech-icon-gradient">
      <stop offset="0%" style={{stopColor: "rgb(110,231,183)"}} />
      <stop offset="100%" style={{stopColor: "rgb(52,211,153)"}} />
    </linearGradient>
  </svg>
);

let gradientInjected = false;

export const TechIcon = ({ icon, className }: TechIconProps) => {
  // Inject gradient only once
  if (!gradientInjected) {
    if (typeof document !== 'undefined') {
      const existingGradient = document.getElementById('tech-icon-gradient');
      if (!existingGradient) {
        document.body.insertAdjacentHTML('beforeend', 
          '<svg width="0" height="0" aria-hidden="true"><linearGradient id="tech-icon-gradient"><stop offset="0%" stop-color="rgb(110,231,183)"/><stop offset="100%" stop-color="rgb(52,211,153)"/></linearGradient></svg>'
        );
      }
      gradientInjected = true;
    }
  }

  return (
    <div className="size-10 text-emerald-400" style={{ color: 'url(#tech-icon-gradient)' }}>
      {icon}
    </div>
  );
};
