import { TechIcon } from "./TechIcon";
import { twMerge } from "tailwind-merge";

interface ToolboxItemProps {
  name: string;
  iconType: React.ReactNode;
}

export const ToolboxItems = ({
  items,
  className,
  ItemsWrapperClassName,
}: {
  items: { name: string; iconType: React.ReactNode }[];
  className?: string;
  ItemsWrapperClassName?: string;
}) => {
  return (
    <div className={twMerge("flex [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent]", className)}>
      <div className={twMerge("flex flex-none py-0.5 gap-6 pr-6", ItemsWrapperClassName)}>
        {items.map((item) => (
          <div
            key={item.name}
            className="inline-flex items-center gap-4 py-2 px-3 outline outline-2 outline-white/10 rounded-lg"
          >
            <span>
              <TechIcon icon={item.iconType} className="size-6" />
            </span>
            <span className="font-semibold">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
