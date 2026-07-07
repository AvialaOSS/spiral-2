import type { PropItem } from "./components/PropsTable";

export type ComponentPropsDoc = {
  displayName: string;
  description: string;
  props: PropItem[];
};

export type PropsRegistry = Record<string, ComponentPropsDoc>;

import registry from "./generated/props.json";

export function getComponentProps(name: string): ComponentPropsDoc | undefined {
  return (registry as PropsRegistry)[name];
}
