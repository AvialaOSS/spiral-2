import {

  Button,

  Select,

  SelectContent,

  SelectItem,

  SelectItemGroup,

  SelectTrigger,

  SelectValue,

  Stack,

  Switch,

  Typography,

} from "@aviala-design/spiral";

import { useCallback, useMemo, useState } from "react";

import {

  DemoKnobs,

  defaultKnobValues,

  type KnobValues,

} from "./DemoKnobs";

import {

  buildBreadcrumb,

  buildStateFromKnobValues,

  defaultNodeKnobValues,

  findDebugTargetFromEvent,

  rootDebugId,

  SPIRAL_DEBUG_ATTR,

  type DebugComponentEntry,

  type DebugNodeSchema,

} from "../debug/types";

import { componentDebugById, componentDebugRegistry, defaultComponentDebugId } from "../debug/registry";



type ComponentDebuggerProps = {

  initialComponentId?: string;

};



function DebugTreeNode({

  node,

  depth,

  selectedId,

  onSelect,

  childrenOf,

}: {

  node: DebugNodeSchema;

  depth: number;

  selectedId: string;

  onSelect: (id: string) => void;

  childrenOf: (parentId: string) => DebugNodeSchema[];

}) {

  const children = childrenOf(node.debugId);

  const isSelected = selectedId === node.debugId;



  return (

    <li className="docs-debugger-tree-item">

      <button

        type="button"

        className={`docs-debugger-tree-btn${isSelected ? " is-selected" : ""}`}

        style={{ paddingLeft: `calc(${depth} * 12px + 8px)` }}

        onClick={() => onSelect(node.debugId)}

      >

        {node.label}

      </button>

      {children.length > 0 ? (

        <ul className="docs-debugger-tree-list">

          {children.map((child) => (

            <DebugTreeNode

              key={child.debugId}

              node={child}

              depth={depth + 1}

              selectedId={selectedId}

              onSelect={onSelect}

              childrenOf={childrenOf}

            />

          ))}

        </ul>

      ) : null}

    </li>

  );

}



export function ComponentDebugger({ initialComponentId = defaultComponentDebugId }: ComponentDebuggerProps) {

  const [componentId, setComponentId] = useState(initialComponentId);

  const [inspectMode, setInspectMode] = useState(true);

  const [selectedNodeId, setSelectedNodeId] = useState<string>("");



  const entry: DebugComponentEntry =

    componentDebugById[componentId] ?? componentDebugRegistry[0]!;



  const nodesById = useMemo(

    () => new Map(entry.nodes.map((node) => [node.debugId, node])),

    [entry.nodes]

  );



  const [nodeKnobValues, setNodeKnobValues] = useState<Record<string, KnobValues>>(() =>

    defaultNodeKnobValues(entry.nodes)

  );



  const previewState = useMemo(

    () => buildStateFromKnobValues(entry, nodeKnobValues),

    [entry, nodeKnobValues]

  );



  const resetForEntry = useCallback((nextEntry: DebugComponentEntry) => {

    const knobs = defaultNodeKnobValues(nextEntry.nodes);

    setNodeKnobValues(knobs);

    setSelectedNodeId(rootDebugId(nextEntry.nodes));

  }, []);



  const handleComponentChange = (nextId: string) => {

    setComponentId(nextId);

    const nextEntry = componentDebugById[nextId];

    if (nextEntry) resetForEntry(nextEntry);

  };



  const effectiveSelectedId = selectedNodeId || rootDebugId(entry.nodes);

  const selectedNode = nodesById.get(effectiveSelectedId) ?? entry.nodes[0]!;

  const breadcrumb = buildBreadcrumb(effectiveSelectedId, nodesById);

  const selectedKnobValues =

    nodeKnobValues[effectiveSelectedId] ?? defaultKnobValues(selectedNode.knobs);



  const childrenOf = useCallback(

    (parentId: string) => entry.nodes.filter((n) => n.parent === parentId),

    [entry.nodes]

  );



  const roots = entry.nodes.filter((n) => !n.parent);



  const handlePreviewClick = (event: React.MouseEvent) => {

    if (!inspectMode) return;

    const targetId = findDebugTargetFromEvent(event);

    if (!targetId || !nodesById.has(targetId)) return;

    event.preventDefault();

    event.stopPropagation();

    setSelectedNodeId(targetId);

  };



  const updateSelectedKnobs = (values: KnobValues) => {

    setNodeKnobValues((prev) => ({ ...prev, [effectiveSelectedId]: values }));

  };



  const reset = () => resetForEntry(entry);



  return (

    <div className="docs-debugger">

      <div className="docs-debugger-toolbar">

        <Stack direction="row" gap="block" className="docs-debugger-toolbar-left">

          <FormFieldInline label="组件">

            <Select value={componentId} onValueChange={handleComponentChange}>

              <SelectTrigger className="docs-debugger-component-select">

                <SelectValue />

              </SelectTrigger>

              <SelectContent>

                <SelectItemGroup>

                  {componentDebugRegistry.map((item) => (

                    <SelectItem key={item.id} value={item.id} itemFunction="radio">

                      {item.label}

                    </SelectItem>

                  ))}

                </SelectItemGroup>

              </SelectContent>

            </Select>

          </FormFieldInline>

          <FormFieldInline label="点选">

            <Switch

              size="small"

              checked={inspectMode}

              onCheckedChange={setInspectMode}

              aria-label="Inspect mode"

            />

          </FormFieldInline>

        </Stack>

        <Button mode="default" size="small" onClick={reset}>

          重置

        </Button>

      </div>



      <div className={`docs-debugger-stage${inspectMode ? " is-inspect" : ""}`}>

        <div

          className="docs-debugger-preview docs-demo-surface"

          onClickCapture={handlePreviewClick}

          data-spiral-debug-root={rootDebugId(entry.nodes)}

        >

          {entry.renderPreview(previewState)}

        </div>



        <aside className="docs-debugger-panel" aria-label="Component debugger">

          <div className="docs-debugger-panel-section">

            <Typography level="subtitle" as="h3">

              选中路径

            </Typography>

            <nav className="docs-debugger-breadcrumb" aria-label="Selection breadcrumb">

              {breadcrumb.map((node, index) => (

                <span key={node.debugId} className="docs-debugger-breadcrumb-segment">

                  {index > 0 ? <span className="docs-debugger-breadcrumb-sep">›</span> : null}

                  <button

                    type="button"

                    className={`docs-debugger-breadcrumb-btn${node.debugId === effectiveSelectedId ? " is-current" : ""}`}

                    onClick={() => setSelectedNodeId(node.debugId)}

                  >

                    {node.label}

                  </button>

                </span>

              ))}

            </nav>

          </div>



          <div className="docs-debugger-panel-section">

            <Typography level="subtitle" as="h3">

              组件树

            </Typography>

            <ul className="docs-debugger-tree-list docs-debugger-tree-root">

              {roots.map((node) => (

                <DebugTreeNode

                  key={node.debugId}

                  node={node}

                  depth={0}

                  selectedId={effectiveSelectedId}

                  onSelect={setSelectedNodeId}

                  childrenOf={childrenOf}

                />

              ))}

            </ul>

          </div>



          <div className="docs-debugger-panel-section docs-debugger-panel-knobs">

            <Typography level="subtitle" as="h3">

              API — {selectedNode.label}

            </Typography>

            <Typography level="caption" className="docs-debugger-node-id">

              {SPIRAL_DEBUG_ATTR}="{selectedNode.debugId}"

            </Typography>

            {selectedNode.knobs.length > 0 ? (

              <DemoKnobs

                knobs={selectedNode.knobs}

                values={selectedKnobValues}

                onChange={updateSelectedKnobs}

              />

            ) : (

              <Typography level="text" className="docs-debugger-node-hint">

                {selectedNode.description ??

                  "此节点为展示性子部件，请在父级节点调整相关 props。"}

              </Typography>

            )}

          </div>

        </aside>

      </div>

    </div>

  );

}



function FormFieldInline({ label, children }: { label: string; children: React.ReactNode }) {

  return (

    <label className="docs-debugger-inline-field">

      <Typography level="caption" className="docs-debugger-inline-label">

        {label}

      </Typography>

      {children}

    </label>

  );

}


