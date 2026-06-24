"use client";

import { useMagnetic } from "@/hooks/useMagnetic";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  strength?: number;
};

// Anchor with magnetic pull (spec R20). Forwards all anchor props.
export function MagneticLink({
  strength = 0.3,
  className,
  children,
  ...rest
}: Props) {
  const ref = useMagnetic<HTMLAnchorElement>(strength);
  return (
    <a ref={ref} className={className} {...rest}>
      {children}
    </a>
  );
}
