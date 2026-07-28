import { GeneralCollapseSidebar, GeneralExpandSidebar, SymbolInformationCircle } from "@aviala-design/icons";
import Editor, { type Monaco } from "@monaco-editor/react";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
  useTheme,
} from "@aviala-design/spiral";
import {
  Component,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { applySpiralMonacoThemes, spiralMonacoThemeId } from "../lib/monaco-spiral-theme";
import { evaluateLiveCode } from "../lib/live-eval";
import { buildDemoIconScope, isIconCatalogLoaded, loadIconCatalog } from "../demos/demo-icons";
import {
  DemoKnobs,
  defaultKnobValues,
  type KnobDef,
  type KnobValues,
} from "./DemoKnobs";

function collectIconKnobNames(knobs: KnobDef[], values: KnobValues): string[] {
  const names: string[] = [];
  for (const knob of knobs) {
    if (knob.kind === "icon") {
      const name = String(values[knob.name] ?? knob.defaultValue);
      if (name) names.push(name);
      continue;
    }
    if (knob.kind !== "items") continue;
    const items = Array.isArray(values[knob.name])
      ? (values[knob.name] as Array<Record<string, string | boolean>>)
      : knob.defaultValue;
    for (const field of knob.fields) {
      if (field.kind !== "icon") continue;
      for (const item of items) {
        const name = String(item[field.name] ?? field.defaultValue);
        if (name) names.push(name);
      }
    }
  }
  return names;
}

function hasIconKnobs(knobs: KnobDef[]): boolean {
  return knobs.some(
    (knob) =>
      knob.kind === "icon" ||
      (knob.kind === "items" && knob.fields.some((field) => field.kind === "icon"))
  );
}

/** Stable fallback — inline `[]` defaults recreate every render and retrigger sync effects. */
const EMPTY_KNOBS: KnobDef[] = [];

type LiveDemoProps = {
  initialCode: string;
  scope: Record<string, unknown>;
  knobs?: KnobDef[];
  buildCode?: (values: KnobValues) => string;
};

class LivePreviewErrorBoundary extends Component<
  { children: ReactNode; resetKey: string },
  { error: string | null }
> {
  state = { error: null as string | null };

  static getDerivedStateFromError(error: Error) {
    return { error: error.message };
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <Typography level="caption" className="docs-live-error">
          渲染错误：{this.state.error}
        </Typography>
      );
    }
    return this.props.children;
  }
}

export function LiveDemo({ initialCode, scope, knobs = EMPTY_KNOBS, buildCode }: LiveDemoProps) {
  const { mode } = useTheme();
  const monacoRef = useRef<Monaco | null>(null);
  const monacoTheme = spiralMonacoThemeId(mode);
  const hasKnobs = knobs.length > 0;
  const usesIconKnobs = hasIconKnobs(knobs);
  const knobDefaults = useMemo(() => defaultKnobValues(knobs), [knobs]);
  const [knobValues, setKnobValues] = useState<KnobValues>(knobDefaults);
  const [catalogReady, setCatalogReady] = useState(isIconCatalogLoaded());
  const [knobsPanelOpen, setKnobsPanelOpen] = useState(true);
  const [code, setCode] = useState(initialCode);
  const [editorCode, setEditorCode] = useState(initialCode);
  const [knobsSynced, setKnobsSynced] = useState(Boolean(buildCode && hasKnobs));
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setCode(initialCode);
    setEditorCode(initialCode);
    setKnobValues(defaultKnobValues(knobs));
    setKnobsSynced(Boolean(buildCode && knobs.length > 0));
    setKnobsPanelOpen(true);
  }, [initialCode, knobs, buildCode]);

  useEffect(() => {
    if (!usesIconKnobs || catalogReady) return;
    void loadIconCatalog().then(() => setCatalogReady(true));
  }, [usesIconKnobs, catalogReady]);

  const mergedScope = useMemo(() => {
    if (!usesIconKnobs) return scope;
    const iconScope = buildDemoIconScope(collectIconKnobNames(knobs, knobValues));
    return { ...scope, ...iconScope };
  }, [scope, knobs, knobValues, usesIconKnobs, catalogReady]);

  const applyKnobs = useCallback(
    (values: KnobValues) => {
      setKnobValues(values);
      if (buildCode) {
        const next = buildCode(values);
        setCode(next);
        setEditorCode(next);
        setKnobsSynced(true);
      }
    },
    [buildCode]
  );

  const handleEditorChange = (value: string | undefined) => {
    const next = value ?? "";
    setEditorCode(next);
    setKnobsSynced(false);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setCode(next);
    }, 180);
  };

  useEffect(
    () => () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    },
    []
  );

  const { element, error } = useMemo(() => evaluateLiveCode(code, mergedScope), [code, mergedScope]);

  const reset = () => {
    setKnobValues(knobDefaults);
    setCode(initialCode);
    setEditorCode(initialCode);
    setKnobsSynced(Boolean(buildCode && hasKnobs));
  };

  const handleMonacoBeforeMount = useCallback((monaco: Monaco) => {
    monacoRef.current = monaco;
    applySpiralMonacoThemes(monaco);
  }, []);

  useLayoutEffect(() => {
    if (!monacoRef.current) return;
    applySpiralMonacoThemes(monacoRef.current);
  }, [mode]);

  return (
    <TooltipProvider>
      <div className="docs-live-demo">
        <div
          className={`docs-live-stage${hasKnobs && knobsPanelOpen ? " has-knobs-open" : ""}${hasKnobs && !knobsPanelOpen ? " has-knobs-collapsed" : ""}`}
        >
          <div className="docs-live-preview docs-demo-surface">
            <LivePreviewErrorBoundary resetKey={code}>{element}</LivePreviewErrorBoundary>
          </div>

          {hasKnobs && knobsPanelOpen ? (
            <aside className="docs-live-knobs-panel" aria-label="API 调参">
              <div className="docs-live-knobs-header">
                <Typography level="subtitle" as="h3">
                  API 调参
                </Typography>
                <Button
                  type="button"
                  mode="noBackground"
                  size="small"
                  iconOnly
                  aria-label="隐藏调参面板"
                  onClick={() => setKnobsPanelOpen(false)}
                  leftIcon={<GeneralCollapseSidebar aria-hidden />}
                />
              </div>
              <div className="docs-live-knobs-body">
                <DemoKnobs knobs={knobs} values={knobValues} onChange={applyKnobs} />
              </div>
            </aside>
          ) : null}

          {hasKnobs && !knobsPanelOpen ? (
            <Button
              type="button"
              mode="default"
              size="small"
              className="docs-live-knobs-expand"
              aria-label="显示 API 调参"
              onClick={() => setKnobsPanelOpen(true)}
              leftIcon={<GeneralExpandSidebar aria-hidden />}
            >
              API
            </Button>
          ) : null}
        </div>

        {(error || !knobsSynced) && (
          <div className="docs-live-meta">
            {error ? (
              <Typography level="caption" className="docs-live-error">
                {error}
              </Typography>
            ) : null}
            {!knobsSynced ? (
              <Typography level="caption" className="docs-live-hint">
                已手动编辑代码，API 调参与编辑器内容可能不同步。
              </Typography>
            ) : null}
          </div>
        )}

        <div className="docs-live-editor-wrap">
          <div className="docs-live-editor-toolbar">
            <div className="docs-live-editor-label">
              <Typography level="caption">代码</Typography>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="docs-live-info-trigger"
                    aria-label="代码编辑说明"
                  >
                    <SymbolInformationCircle width={16} height={16} aria-hidden />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="docs-live-info-tooltip">
                  在 Monaco 编辑器中编写 JSX，通过 render(...) 输出预览。需要 state 时可定义组件后
                  render(&lt;Demo /&gt;)。
                </TooltipContent>
              </Tooltip>
            </div>
            <Button mode="default" size="small" onClick={reset}>
              重置
            </Button>
          </div>
          <Editor
            className="docs-monaco-editor"
            height="220px"
            language="javascript"
            theme={monacoTheme}
            value={editorCode}
            onChange={handleEditorChange}
            beforeMount={handleMonacoBeforeMount}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              tabSize: 2,
              automaticLayout: true,
              padding: { top: 8, bottom: 8 },
            }}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
