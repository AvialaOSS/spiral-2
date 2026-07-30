import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  DirectionArrowDownLight,
  DirectionArrowRightLight,
  SymbolRight,
  type AvialaIconProps,
  type IconLevel,
} from "@aviala-design/icons";
import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { Badge } from "./badge";
import { typographyVariants } from "./typography";
import { cloneAvialaIconElement } from "../lib/clone-aviala-icon";
import { iconLevelCssVarStyle, iconSlotCssVarStyle } from "../lib/icon-slot-sizing";
import { renderSlotIcon } from "../lib/render-slot-icon";
import { cn } from "../lib/utils";
import { spiralDebugId } from "../lib/spiral-debug";

/** Figma Components → Information Collect → Cascader Input */
export type CascaderSize = "regular" | "big";

/** Figma Cascader Menu Item `Function` variant */
export type CascaderItemFunction =
  | "simple"
  | "checkbox"
  | "form-checkbox"
  | "radio"
  | "form-radio"
  | "search"
  | "custom";

/** Figma Cascader Menu Item `Type` variant */
export type CascaderItemLayout = "default" | "title" | "custom";

export type CascaderOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  children?: CascaderOption[];
};

type CascaderContextValue = {
  open: boolean;
  disabled?: boolean;
  size: CascaderSize;
  activePath: string[];
  selectedPath: string[];
  highlightedValue: string | null;
  setHighlightedValue: (value: string | null) => void;
  expandTo: (path: string[]) => void;
  selectPath: (path: string[], closeOnLeaf?: boolean) => void;
  getOptionAtPath: (path: string[]) => CascaderOption | undefined;
  getOptionsAtPath: (path: string[]) => CascaderOption[];
  isPathSelected: (path: string[]) => boolean;
  isPathExpanded: (path: string[]) => boolean;
};

const CascaderContext = createContext<CascaderContextValue | null>(null);

function useCascaderContext() {
  const context = useContext(CascaderContext);
  if (!context) {
    throw new Error("Cascader compound components must be used within Cascader.");
  }
  return context;
}


function renderItemIcon(
  node: ReactNode,
  iconLevel: IconLevel = "text",
  debugId?: string
): ReactNode {
  if (!node) return null;
  const content = cloneAvialaIconElement(node, {
    level: iconLevel,
    biggerSize: true,
  });

  return (
    <span
      className={cn(
        "aviala-cascader-item__icon",
        iconLevel === "caption" && "aviala-cascader-item__icon--sm"
      )}
      style={iconSlotCssVarStyle(node, "--cascader-item-icon-size", iconLevel, true)}
      {...(debugId ? spiralDebugId(debugId) : undefined)}
    >
      {content}
    </span>
  );
}

function renderBadgeSlot(node: ReactNode): ReactNode {
  if (node == null || node === false) return null;

  return (
    <span className="aviala-cascader-item__badge">
      {isValidElement(node) && node.type === Badge ? node : <Badge>{node}</Badge>}
    </span>
  );
}

function CascaderItemFormRadio() {
  return (
    <span className="aviala-cascader-item__form-radio" aria-hidden>
      <span className="aviala-cascader-item__form-radio-surface" />
      <span className="aviala-cascader-item__form-radio-indicator" />
    </span>
  );
}

function CascaderItemFormCheckbox() {
  return (
    <span className="aviala-cascader-item__form-checkbox" aria-hidden>
      <SymbolRight
        className="aviala-cascader-item__form-checkbox-icon"
        thickness="Bold"
        width={12}
        height={12}
        aria-hidden
      />
    </span>
  );
}

function CascaderItemTrailingRadio({ selected }: { selected: boolean }) {
  if (!selected) return null;

  return (
    <span className="aviala-cascader-item__trailing-radio" aria-hidden>
      <SymbolRight level="text" biggerSize aria-hidden />
    </span>
  );
}

function CascaderItemTrailingCheckbox({ selected }: { selected: boolean }) {
  if (!selected) return null;

  return (
    <span className="aviala-cascader-item__trailing-checkbox" aria-hidden>
      <SymbolRight level="text" biggerSize aria-hidden />
    </span>
  );
}

function renderFunctionSlot(
  itemFunction: CascaderItemFunction,
  layout: CascaderItemLayout,
  showFunctionIcon: boolean,
  hasChildren: boolean,
  selected: boolean,
  icon?: ReactNode
): ReactNode {
  if (!showFunctionIcon || layout === "title") return null;

  if (icon !== undefined) {
    return <span className="aviala-cascader-item__function">{icon}</span>;
  }

  switch (itemFunction) {
    case "radio":
      return (
        <span className="aviala-cascader-item__function">
          <CascaderItemTrailingRadio selected={selected} />
        </span>
      );
    case "checkbox":
      return (
        <span className="aviala-cascader-item__function">
          <CascaderItemTrailingCheckbox selected={selected} />
        </span>
      );
    case "simple":
    default:
      return (
        <span className="aviala-cascader-item__function">
          {selected ? (
            <SymbolRight level="text" biggerSize aria-hidden />
          ) : null}
          {hasChildren ? (
            <DirectionArrowRightLight level="text" biggerSize aria-hidden />
          ) : null}
        </span>
      );
  }
}

function findOptionPath(
  options: CascaderOption[],
  targetPath: string[]
): CascaderOption | undefined {
  let currentOptions = options;
  let current: CascaderOption | undefined;

  for (const segment of targetPath) {
    current = currentOptions.find((option) => option.value === segment);
    if (!current) return undefined;
    currentOptions = current.children ?? [];
  }

  return current;
}

function getOptionsAtPath(options: CascaderOption[], path: string[]): CascaderOption[] {
  if (path.length === 0) return options;
  const node = findOptionPath(options, path);
  return node?.children ?? [];
}

function getLabelsForPath(options: CascaderOption[], path: string[]): ReactNode[] {
  const labels: ReactNode[] = [];
  let currentOptions = options;

  for (const segment of path) {
    const option = currentOptions.find((item) => item.value === segment);
    if (!option) break;
    labels.push(option.label);
    currentOptions = option.children ?? [];
  }

  return labels;
}

/** True when `path` is a prefix of `selectedPath` (item lies on the current selection). */
function isPathOnSelectedPath(path: string[], selectedPath: string[]) {
  if (path.length === 0 || path.length > selectedPath.length) return false;
  return path.every((segment, index) => segment === selectedPath[index]);
}

export type CascaderProps = {
  children: ReactNode;
  options?: CascaderOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], selectedOptions: CascaderOption[]) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  size?: CascaderSize;
  /** Select parent nodes — Figma allows any-level selection (default true). */
  changeOnSelect?: boolean;
  className?: string;
};

/**
 * Radix Popover closes on `window` blur (e.g. focusing DevTools). Suppress only
 * blur-initiated closes; pointer-down (outside click, item select, trigger toggle)
 * and Escape must still dismiss on the first interaction.
 */
export function Cascader({
  children,
  options = [],
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  size = "regular",
  changeOnSelect = true,
  className,
}: CascaderProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? []);
  const [activePath, setActivePath] = useState<string[]>(defaultValue ?? []);
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
  const windowBlurCloseRef = useRef(false);
  const pointerDownCloseRef = useRef(false);

  const isOpenControlled = openProp !== undefined;
  const isValueControlled = valueProp !== undefined;
  const open = isOpenControlled ? openProp : internalOpen;
  const selectedPath = isValueControlled ? valueProp ?? [] : internalValue;
  const wasOpenRef = useRef(open);

  useEffect(() => {
    const markWindowBlur = () => {
      windowBlurCloseRef.current = true;
    };
    window.addEventListener("blur", markWindowBlur, true);
    return () => window.removeEventListener("blur", markWindowBlur, true);
  }, []);

  // Only seed expansion when the panel opens. While open, `selectPath` /
  // `expandTo` own `activePath` — re-syncing on every `selectedPath` change
  // collapses the next column (desktop recovers via hover; touch cannot).
  useEffect(() => {
    const justOpened = open && !wasOpenRef.current;
    wasOpenRef.current = open;
    if (!justOpened) return;

    if (selectedPath.length === 0) {
      setActivePath([]);
      return;
    }

    const selectedOption = findOptionPath(options, selectedPath);
    if (selectedOption?.children?.length) {
      setActivePath(selectedPath);
      return;
    }

    setActivePath(selectedPath.slice(0, -1));
  }, [open, options, selectedPath]);

  useEffect(() => {
    if (!open) {
      pointerDownCloseRef.current = false;
      return;
    }

    const markPointerDown = () => {
      pointerDownCloseRef.current = true;
    };
    document.addEventListener("pointerdown", markPointerDown, true);
    return () => document.removeEventListener("pointerdown", markPointerDown, true);
  }, [open]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (disabled && nextOpen) return;
      if (!nextOpen && windowBlurCloseRef.current && !pointerDownCloseRef.current) {
        windowBlurCloseRef.current = false;
        return;
      }
      windowBlurCloseRef.current = false;
      pointerDownCloseRef.current = false;
      if (!isOpenControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [disabled, isOpenControlled, onOpenChange]
  );

  const commitValue = useCallback(
    (path: string[]) => {
      const selectedOptions = path
        .map((_, index) => findOptionPath(options, path.slice(0, index + 1)))
        .filter((option): option is CascaderOption => option !== undefined);

      if (!isValueControlled) {
        setInternalValue(path);
      }
      onValueChange?.(path, selectedOptions);
    },
    [isValueControlled, onValueChange, options]
  );

  const expandTo = useCallback((path: string[]) => {
    setActivePath(path);
  }, []);

  const selectPath = useCallback(
    (path: string[], closeOnLeaf = true) => {
      const option = findOptionPath(options, path);
      const hasChildren = Boolean(option?.children?.length);

      if (!changeOnSelect && hasChildren) {
        expandTo(path);
        return;
      }

      commitValue(path);

      if (hasChildren) {
        expandTo(path);
        return;
      }

      if (closeOnLeaf) {
        handleOpenChange(false);
      }
    },
    [changeOnSelect, commitValue, expandTo, handleOpenChange, options]
  );

  const contextValue = useMemo<CascaderContextValue>(
    () => ({
      open,
      disabled,
      size,
      activePath,
      selectedPath,
      highlightedValue,
      setHighlightedValue,
      expandTo,
      selectPath,
      getOptionAtPath: (path) => findOptionPath(options, path),
      getOptionsAtPath: (path) => getOptionsAtPath(options, path),
      isPathSelected: (path) => isPathOnSelectedPath(path, selectedPath),
      isPathExpanded: (path) => {
        const expandedPrefix = activePath.length > 0 ? activePath : selectedPath.slice(0, -1);
        return (
          path.length <= expandedPrefix.length &&
          path.every((segment, index) => segment === expandedPrefix[index])
        );
      },
    }),
    [
      activePath,
      disabled,
      expandTo,
      highlightedValue,
      open,
      options,
      selectPath,
      selectedPath,
      size,
    ]
  );

  return (
    <CascaderContext.Provider value={contextValue}>
      <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange} modal={false}>
        <div className={cn("inline-flex", className)} {...spiralDebugId("cascader")}>{children}</div>
      </PopoverPrimitive.Root>
    </CascaderContext.Provider>
  );
}

export type CascaderTriggerProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & {
  size?: CascaderSize;
  allRound?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  expandIcon?: ReactNode;
  placeholder?: string;
  error?: boolean;
  /** Override display when using manual composition without `options`. */
  displayValue?: ReactNode;
  separator?: string;
  className?: string;
};

export const CascaderTrigger = forwardRef<HTMLButtonElement, CascaderTriggerProps>(
  (
    {
      className,
      size: sizeProp,
      allRound = false,
      leftIcon,
      rightIcon,
      expandIcon,
      placeholder = "Text",
      error = false,
      displayValue,
      separator = "/",
      disabled: disabledProp,
      ...props
    },
    ref
  ) => {
    const { open, disabled: disabledContext, size: sizeContext, selectedPath, getOptionAtPath } =
      useCascaderContext();
    const size = sizeProp ?? sizeContext;
    const disabled = disabledProp ?? disabledContext;

    const labels = selectedPath
      .map((_, index) => getOptionAtPath(selectedPath.slice(0, index + 1))?.label)
      .filter((label): label is ReactNode => label != null && label !== false);

    const resolvedDisplay =
      displayValue ??
      (labels.length > 0
        ? labels.map((label, index) => (
            <span key={`${selectedPath[index]}-${index}`}>
              {index > 0 ? separator : null}
              {label}
            </span>
          ))
        : null);

    const hasValue = resolvedDisplay != null && resolvedDisplay !== false;

    return (
      <PopoverPrimitive.Trigger asChild>
        <button
          ref={ref}
          type="button"
          className={cn("aviala-cascader-trigger aviala-focus-ring", className)}
          data-size={size}
          data-all-round={allRound ? "true" : "false"}
          data-state={open ? "open" : "closed"}
          data-error={error ? "true" : undefined}
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
          {...spiralDebugId("cascader.trigger")}
          {...props}
        >
          {renderSlotIcon(leftIcon, "aviala-cascader-trigger__slot", "cascader.trigger.icon-left")}
          <span className="aviala-cascader-trigger__field" {...spiralDebugId("cascader.trigger.value")}>
            <span
              className={cn("aviala-cascader-trigger__value", typographyVariants({ level: "text" }))}
              data-placeholder={hasValue ? undefined : "true"}
            >
              {hasValue ? resolvedDisplay : placeholder}
            </span>
          </span>
          {renderSlotIcon(rightIcon, "aviala-cascader-trigger__slot", "cascader.trigger.icon-right")}
          <span
            className="aviala-cascader-trigger__expand"
            aria-hidden
            style={
              expandIcon
                ? iconSlotCssVarStyle(expandIcon, "--input-slot-icon-size", "text", true)
                : iconLevelCssVarStyle("text", true, "--input-slot-icon-size")
            }
            {...spiralDebugId("cascader.trigger.expand")}
          >
            {expandIcon ?? (
              <DirectionArrowDownLight level="text" biggerSize aria-hidden />
            )}
          </span>
        </button>
      </PopoverPrimitive.Trigger>
    );
  }
);
CascaderTrigger.displayName = "CascaderTrigger";

export type CascaderContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
  portalled?: boolean;
  className?: string;
};

export const CascaderContent = forwardRef<HTMLDivElement, CascaderContentProps>(
  (
    {
      className,
      children,
      sideOffset = 8,
      align = "start",
      portalled = true,
      ...props
    },
    ref
  ) => {
    const content = (
      <PopoverPrimitive.Content
        ref={ref}
        className={cn("aviala-cascader-content", className)}
        sideOffset={sideOffset}
        align={align}
        {...spiralDebugId("cascader.content")}
        {...props}
      >
        {children}
      </PopoverPrimitive.Content>
    );

    if (!portalled) return content;
    return <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>;
  }
);
CascaderContent.displayName = "CascaderContent";

export type CascaderMenuProps = {
  children?: ReactNode;
  className?: string;
};

/** Figma Cascader Menu — horizontal column container (`348:13915`). */
export const CascaderMenu = forwardRef<HTMLDivElement, CascaderMenuProps>(
  ({ children, className }, ref) => (
    <div ref={ref} className={cn("aviala-cascader-menu", className)}>
      {children}
    </div>
  )
);
CascaderMenu.displayName = "CascaderMenu";

export type CascaderColumnProps = {
  children: ReactNode;
  className?: string;
  /** Slide + fade in when a new cascade column appears (options-driven menus set this automatically). */
  animateEnter?: boolean;
  /** Slide + fade out before unmount when a cascade column is removed (options-driven menus set this automatically). */
  animateExit?: boolean;
  /** Frozen layout slot for exit overlay columns (keeps flex width stable while animating out). */
  exitLayout?: { left: number; width: number };
};

/** Figma Cascader Menu Item Group Group — single cascade column (`345:20543`). */
export const CascaderColumn = forwardRef<HTMLDivElement, CascaderColumnProps>(
  ({ children, className, animateEnter, animateExit, exitLayout }, ref) => {
    const animate = animateExit ? "exit" : animateEnter ? "enter" : undefined;
    const exitStyle =
      animateExit && exitLayout
        ? ({
            position: "absolute",
            top: 0,
            bottom: 0,
            left: exitLayout.left,
            width: exitLayout.width,
            zIndex: 0,
          } as const)
        : undefined;

    return (
      <div
        ref={ref}
        className={cn("aviala-cascader-column", className)}
        data-animate={animate}
        style={exitStyle}
      >
        <div className="aviala-cascader-column__surface" data-animate={animate}>
          {children}
        </div>
      </div>
    );
  }
);
CascaderColumn.displayName = "CascaderColumn";

export type CascaderItemGroupProps = {
  label?: ReactNode;
  showDivider?: boolean;
  children: ReactNode;
  className?: string;
};

/** Figma Cascader Menu Item Group (`345:16552`). */
export function CascaderItemGroup({
  label,
  showDivider = true,
  children,
  className,
}: CascaderItemGroupProps) {
  return (
    <div className={cn("aviala-cascader-group", className)}>
      {label ? (
        <div className={cn("aviala-cascader-label", typographyVariants({ level: "caption" }))}>
          {label}
        </div>
      ) : null}
      <div className="aviala-cascader-group__slot">{children}</div>
      {showDivider ? <div className="aviala-cascader-separator" role="separator" /> : null}
    </div>
  );
}

export type CascaderItemProps = {
  value: string;
  pathPrefix?: string[];
  itemFunction?: CascaderItemFunction;
  layout?: CascaderItemLayout;
  leftIcon?: ReactNode;
  showLeftIcon?: boolean;
  rightIcon?: ReactNode;
  showRightIcon?: boolean;
  badge?: ReactNode;
  showBadge?: boolean;
  showFunctionIcon?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  hasChildren?: boolean;
};

/** Figma Cascader Menu Item (`345:12487`). */
export const CascaderItem = forwardRef<HTMLButtonElement, CascaderItemProps>(
  (
    {
      value,
      pathPrefix = [],
      itemFunction = "simple",
      layout = "default",
      leftIcon,
      showLeftIcon = false,
      rightIcon,
      showRightIcon = false,
      badge,
      showBadge = false,
      showFunctionIcon = true,
      icon,
      disabled = false,
      children,
      className,
      hasChildren: hasChildrenProp,
    },
    ref
  ) => {
    const {
      highlightedValue,
      setHighlightedValue,
      expandTo,
      selectPath,
      getOptionAtPath,
      isPathSelected,
      isPathExpanded,
    } = useCascaderContext();

    const path = [...pathPrefix, value];
    const option = getOptionAtPath(path);
    const hasChildren = hasChildrenProp ?? Boolean(option?.children?.length);
    const isTitle = layout === "title";
    const isSelected = isPathSelected(path);
    const isExpanded = isPathExpanded(path);
    const isHighlighted = highlightedValue === value;
    const isDisabled = disabled || option?.disabled;

    const isFormLeading = itemFunction === "form-radio" || itemFunction === "form-checkbox";
    const leftIconLevel: IconLevel = isTitle ? "caption" : "text";
    const showTrailingFunction =
      showFunctionIcon &&
      !isTitle &&
      itemFunction !== "form-radio" &&
      itemFunction !== "form-checkbox";

    const handleClick = () => {
      if (isTitle || isDisabled) return;
      if (hasChildren) {
        selectPath(path, false);
        return;
      }
      selectPath(path, true);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (isTitle || isDisabled) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
      if (event.key === "ArrowRight" && hasChildren) {
        event.preventDefault();
        expandTo(path);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role={isTitle ? "presentation" : "option"}
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isExpanded : undefined}
        disabled={isDisabled}
        className={cn("aviala-cascader-item aviala-focus-ring", className)}
        data-layout={layout !== "default" ? layout : undefined}
        data-function={itemFunction !== "simple" ? itemFunction : undefined}
        data-selected={isSelected ? "true" : undefined}
        data-highlighted={isHighlighted ? "true" : undefined}
        data-disabled={isDisabled ? "true" : undefined}
        {...spiralDebugId("cascader.content.item")}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => {
          if (!isTitle) setHighlightedValue(value);
          if (hasChildren) expandTo(pathPrefix.concat(value));
        }}
        onMouseLeave={(event) => {
          if (isTitle) return;
          const next = event.relatedTarget;
          if (next instanceof Node && event.currentTarget.contains(next)) return;
          if (highlightedValue === value) setHighlightedValue(null);
        }}
        onFocus={() => {
          if (!isTitle) setHighlightedValue(value);
        }}
      >
        {isFormLeading && itemFunction === "form-radio" ? <CascaderItemFormRadio /> : null}
        {isFormLeading && itemFunction === "form-checkbox" ? <CascaderItemFormCheckbox /> : null}

        {showLeftIcon && leftIcon
          ? renderItemIcon(leftIcon, leftIconLevel, "cascader.content.item.icon-left")
          : null}

        <span className={cn("aviala-cascader-item__text", typographyVariants({ level: isTitle ? "caption" : "text" }))}>
          {children ?? option?.label}
        </span>

        {showBadge ? renderBadgeSlot(badge ?? "Text") : null}
        {showRightIcon && rightIcon ? renderItemIcon(rightIcon, leftIconLevel) : null}

        {renderFunctionSlot(
          itemFunction,
          layout,
          showTrailingFunction,
          hasChildren,
          isSelected,
          icon
        )}
      </button>
    );
  }
);
CascaderItem.displayName = "CascaderItem";

export type CascaderOptionsMenuProps = {
  className?: string;
};

const COLUMN_ANIMATION_MS = 150;

type RenderColumn = {
  pathPrefix: string[];
  key: string;
  animateEnter: boolean;
  animateExit: boolean;
  exitLayout?: { left: number; width: number };
};

function toColumnKey(pathPrefix: string[]) {
  return pathPrefix.join("/") || "root";
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Renders cascade columns from `Cascader` `options` prop. */
export function CascaderOptionsMenu({ className }: CascaderOptionsMenuProps) {
  const { activePath, selectedPath, getOptionsAtPath, open } = useCascaderContext();
  const prevColumnCountRef = useRef<number | null>(null);
  const prevColumnPathsRef = useRef<string[][]>([]);
  const lastPathChangeAtRef = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const columnElRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [columns, setColumns] = useState<RenderColumn[]>([]);

  const columnPaths = useMemo(() => {
    const paths: string[][] = [[]];
    const expansion = activePath.length > 0 ? activePath : selectedPath.slice(0, -1);

    for (let index = 0; index < expansion.length; index += 1) {
      const prefix = expansion.slice(0, index + 1);
      const nextOptions = getOptionsAtPath(prefix);
      if (nextOptions.length > 0) {
        paths.push(prefix);
      }
    }

    return paths;
  }, [activePath, getOptionsAtPath, selectedPath]);

  useLayoutEffect(() => {
    if (!open) {
      prevColumnCountRef.current = null;
      prevColumnPathsRef.current = [];
      lastPathChangeAtRef.current = 0;
      setColumns([]);
      return;
    }

    const prevPaths = prevColumnPathsRef.current;
    const prevCount = prevColumnCountRef.current;
    const nextKeys = new Set(columnPaths.map(toColumnKey));
    const now = performance.now();
    const isRapid = now - lastPathChangeAtRef.current < COLUMN_ANIMATION_MS;
    lastPathChangeAtRef.current = now;

    const skipAnimations = prefersReducedMotion() || isRapid;
    const isExpanding = prevCount !== null && columnPaths.length > prevCount;
    const enterFromIndex = isExpanding ? prevCount : columnPaths.length;

    const isLateralReplace =
      prevPaths.length > 0 &&
      columnPaths.length === prevPaths.length &&
      columnPaths.some(
        (pathPrefix, index) => toColumnKey(pathPrefix) !== toColumnKey(prevPaths[index]!)
      );

    const removedCount = prevPaths.filter(
      (pathPrefix) => !nextKeys.has(toColumnKey(pathPrefix))
    ).length;

    const allowExitAnimation = !skipAnimations && !isLateralReplace && removedCount === 1;

    const measureExitLayout = (key: string) => {
      const columnEl = columnElRefs.current.get(key);
      const menuEl = menuRef.current;
      if (!columnEl || !menuEl) return undefined;

      const columnRect = columnEl.getBoundingClientRect();
      const menuRect = menuEl.getBoundingClientRect();
      return {
        left: columnRect.left - menuRect.left,
        width: columnRect.width,
      };
    };

    setColumns((prev) => {
      const settled = prev.filter((column) => !column.animateExit);
      const prevByKey = new Map(settled.map((column) => [column.key, column]));

      const active: RenderColumn[] = columnPaths.map((pathPrefix, index) => {
        const key = toColumnKey(pathPrefix);
        const existing = prevByKey.get(key);

        return {
          pathPrefix,
          key,
          animateEnter: skipAnimations ? false : existing ? false : index >= enterFromIndex,
          animateExit: false,
        };
      });

      if (settled.length === 0) {
        return active;
      }

      const toExit: RenderColumn[] = allowExitAnimation
        ? settled
            .filter((column) => !nextKeys.has(column.key))
            .flatMap((column) => {
              const exitLayout = measureExitLayout(column.key);
              if (!exitLayout) {
                return [];
              }

              return [
                {
                  ...column,
                  animateEnter: false,
                  animateExit: true,
                  exitLayout,
                },
              ];
            })
        : [];

      const activeMap = new Map(active.map((column) => [column.key, column]));
      const merged: RenderColumn[] = columnPaths.map((pathPrefix) => activeMap.get(toColumnKey(pathPrefix))!);

      return [...merged, ...toExit];
    });

    prevColumnCountRef.current = columnPaths.length;
    prevColumnPathsRef.current = columnPaths;
  }, [columnPaths, open]);

  useEffect(() => {
    if (!open || !columns.some((column) => column.animateExit)) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setColumns((prev) => prev.filter((column) => !column.animateExit));
    }, COLUMN_ANIMATION_MS);

    return () => window.clearTimeout(timeout);
  }, [columns, open]);

  return (
    <CascaderMenu ref={menuRef} className={className}>
      {columns.map(({ pathPrefix, key, animateEnter, animateExit, exitLayout }) => (
        <CascaderColumn
          key={key}
          ref={(element) => {
            if (element) {
              columnElRefs.current.set(key, element);
              return;
            }
            columnElRefs.current.delete(key);
          }}
          animateEnter={animateEnter}
          animateExit={animateExit}
          exitLayout={exitLayout}
        >
          <CascaderItemGroup label="Title" showDivider>
            {getOptionsAtPath(pathPrefix).map((option) => (
              <CascaderItem
                key={[...pathPrefix, option.value].join("/")}
                value={option.value}
                pathPrefix={pathPrefix}
                disabled={option.disabled}
                hasChildren={Boolean(option.children?.length)}
              >
                {option.label}
              </CascaderItem>
            ))}
          </CascaderItemGroup>
        </CascaderColumn>
      ))}
    </CascaderMenu>
  );
}

export type CascaderFieldProps = Omit<CascaderProps, "children"> &
  Omit<CascaderTriggerProps, "displayValue"> & {
    contentClassName?: string;
    menuClassName?: string;
  };

/** Convenience field — trigger + options-driven menu. */
export function CascaderField({
  options,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  size = "regular",
  changeOnSelect,
  className,
  contentClassName,
  menuClassName,
  allRound,
  leftIcon,
  rightIcon,
  expandIcon,
  placeholder,
  error,
  separator,
  ...triggerProps
}: CascaderFieldProps) {
  return (
    <Cascader
      options={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      size={size}
      changeOnSelect={changeOnSelect}
      className={className}
    >
      <CascaderTrigger
        size={size}
        allRound={allRound}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        expandIcon={expandIcon}
        placeholder={placeholder}
        error={error}
        separator={separator}
        {...triggerProps}
      />
      <CascaderContent className={contentClassName}>
        <CascaderOptionsMenu className={menuClassName} />
      </CascaderContent>
    </Cascader>
  );
}

export { getLabelsForPath, getOptionsAtPath, findOptionPath as getOptionAtPath };
