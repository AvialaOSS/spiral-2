declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";
  export default function MDXContent(props: MDXProps): JSX.Element;
}

declare module "./generated/props.json" {
  import type { PropsRegistry } from "./props-registry";
  const value: PropsRegistry;
  export default value;
}
