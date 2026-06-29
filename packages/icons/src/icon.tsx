import type { ComponentType, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  size?: number | string;
  title?: string;
};

export function Icon({ icon: IconComponent, size = 16, title, className, ...props }: IconProps) {
  const ariaProps = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };

  return (
    <IconComponent
      width={size}
      height={size}
      className={className}
      {...ariaProps}
      {...props}
    />
  );
}
