import { Link, type LinkProps } from "@aviala-design/spiral";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

type DocsLinkProps = Omit<LinkProps, "href" | "asChild"> & {
  to: string;
};

/** In-app docs navigation that respects BrowserRouter basename. */
export function DocsLink({ to, onClick, children, ...props }: DocsLinkProps) {
  const navigate = useNavigate();
  const href = `/docs/spiral${to.startsWith("/") ? to : `/${to}`}`;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  return (
    <Link {...props} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
