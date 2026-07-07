import { Typography } from "@aviala-design/spiral";
import type { ComponentPropsWithoutRef } from "react";
import { Link as RouterLink } from "react-router-dom";

function MdxLink({ href = "", ...props }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/docs/spiral/")) {
    const to = href.replace(/^\/docs\/spiral\/?/, "");
    return <RouterLink to={to} {...props} />;
  }
  return (
    <Typography level="text" as="a" {...props} href={href} className="text-[var(--primary)]" />
  );
}

function MdxH1(props: ComponentPropsWithoutRef<"h1">) {
  return <Typography level="headline1" as="h1" {...props} />;
}

function MdxH2(props: ComponentPropsWithoutRef<"h2">) {
  return <Typography level="title" as="h2" {...props} />;
}

function MdxH3(props: ComponentPropsWithoutRef<"h3">) {
  return <Typography level="subtitle" as="h3" {...props} />;
}

function MdxP(props: ComponentPropsWithoutRef<"p">) {
  return <Typography level="text" as="p" {...props} />;
}

export const mdxComponents = {
  a: MdxLink,
  h1: MdxH1,
  h2: MdxH2,
  h3: MdxH3,
  p: MdxP,
};
