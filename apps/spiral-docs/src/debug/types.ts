import type { ReactNode } from "react";

import type { KnobDef, KnobValues } from "../components/DemoKnobs";

import { defaultKnobValues } from "../components/DemoKnobs";



export const SPIRAL_DEBUG_ATTR = "data-spiral-debug-id";



/** DOM attrs for inspect-mode targeting — use in UI components or registry preview wrappers. */

export function spiralDebugProps(debugId: string): {

  [SPIRAL_DEBUG_ATTR]: string;

  "data-component": string;

} {

  return {

    [SPIRAL_DEBUG_ATTR]: debugId,

    "data-component": debugId.split(".")[0] ?? debugId,

  };

}



export type DebugNodeSchema<TState = unknown> = {

  /** Matches `data-spiral-debug-id` on DOM nodes */

  debugId: string;

  /** Human label in tree / breadcrumb */

  label: string;

  /** Parent node debugId for tree hierarchy */

  parent?: string;

  /** Props editable when this node is selected */

  knobs: KnobDef[];

  /** Merge knob values into preview state */

  applyOverride: (state: TState, value: KnobValues) => TState;

  /** Shown when node has no knobs (leaf presentation parts) */

  description?: string;

};



export type DebugComponentEntry<TState = unknown> = {

  id: string;

  label: string;

  description?: string;

  initialState: TState;

  nodes: DebugNodeSchema<TState>[];

  /** Live preview from merged override state */

  renderPreview: (state: TState) => ReactNode;

};



export function rootDebugId(nodes: DebugNodeSchema[]): string {

  return nodes.find((node) => !node.parent)?.debugId ?? nodes[0]!.debugId;

}



export function findDebugTargetFromEvent(event: React.MouseEvent | MouseEvent): string | null {

  const target = event.target;

  if (!(target instanceof Element)) return null;

  const el = target.closest(`[${SPIRAL_DEBUG_ATTR}]`);

  return el?.getAttribute(SPIRAL_DEBUG_ATTR) ?? null;

}



export function buildBreadcrumb(

  debugId: string,

  nodesById: Map<string, DebugNodeSchema>

): DebugNodeSchema[] {

  const trail: DebugNodeSchema[] = [];

  let current: string | undefined = debugId;

  while (current) {

    const node = nodesById.get(current);

    if (!node) break;

    trail.unshift(node);

    current = node.parent;

  }

  return trail;

}



export function defaultNodeKnobValues(nodes: DebugNodeSchema[]): Record<string, KnobValues> {

  return Object.fromEntries(nodes.map((node) => [node.debugId, defaultKnobValues(node.knobs)]));

}



/** Rebuild preview state by folding every node's knob values through applyOverride. */

export function buildStateFromKnobValues<TState>(

  entry: DebugComponentEntry<TState>,

  knobValuesByNode: Record<string, KnobValues>

): TState {

  return entry.nodes.reduce(

    (state, node) =>

      node.applyOverride(state, knobValuesByNode[node.debugId] ?? defaultKnobValues(node.knobs)),

    entry.initialState

  );

}



export function nodeTree(nodes: DebugNodeSchema[]): DebugNodeSchema[] {

  const roots = nodes.filter((n) => !n.parent);

  const childrenOf = (parentId: string) => nodes.filter((n) => n.parent === parentId);



  const walk = (node: DebugNodeSchema): DebugNodeSchema[] => [

    node,

    ...childrenOf(node.debugId).flatMap(walk),

  ];

  return roots.flatMap(walk);

}


