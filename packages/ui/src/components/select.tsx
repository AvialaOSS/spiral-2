import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  DirectionArrowDownLight,
  DirectionArrowLeft,
  DirectionArrowRight,
  SymbolRight,
  UsersUserCircle,
  type IconLevel,
} from "@aviala-design/icons";
import {
  Children,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  isValidElement,
} from "react";
import { forwardChevronSide, useDirection, useRtl } from "../config";
import { Badge } from "./badge";
import { typographyVariants } from "./typography";
import { cloneAvialaIconElement } from "../lib/clone-aviala-icon";
import { iconLevelCssVarStyle, iconSlotCssVarStyle } from "../lib/icon-slot-sizing";
import { renderSlotIcon } from "../lib/render-slot-icon";
import {
  collectRovingItems,
  focusRovingSibling,
  resolveRovingIndex,
  resolveRovingMove,
  type RovingMove,
} from "../lib/roving-focus";
import { cn } from "../lib/utils";
import { useCloseSuppression } from "../lib/use-close-suppression";
import { useOverlayPortalContainer } from "../overlay/overlay-container";
import { spiralDebugId } from "../lib/spiral-debug";
import { useResolvedControlError } from "./form-field";

/** Figma Components → Information Collect → Select */
export type SelectSize = "regular" | "big";

/** Figma Select Menu Item `Function` variant */
export type SelectItemFunction =
  | "action"
  | "simple"
  | "checkbox"
  | "form-checkbox"
  | "radio"
  | "form-radio";

/** Figma Select Menu Item `Type` variant */
export type SelectItemLayout = "default" | "title" | "people" | "checked";

const SELECT_MENU_ITEM_SELECTOR = ".aviala-select-item";
/** Sub-menu panels also carry `aviala-select-content`, so this matches the closest panel. */
const SELECT_PANEL_SELECTOR = ".aviala-select-content";

/**
 * Move focus between the rows of one menu panel.
 * Rows belonging to an open sub-menu are skipped — that panel owns its own ring.
 */
function focusSelectMenuItem(panel: Element | null, current: Element | null, move: RovingMove) {
  return focusRovingSibling(panel, current, move, SELECT_MENU_ITEM_SELECTOR, {
    filter: (item) => item.closest(SELECT_PANEL_SELECTOR) === panel,
  });
}

/**
 * Radix only walks its own Item collection, so a SelectSubItem in the same panel
 * is skipped. Intercept arrows when the next DOM row is (or the current row is)
 * a sub-item; otherwise leave the event for Radix.
 */
function handleMixedSelectPanelKeys(event: KeyboardEvent<HTMLElement>, panel: Element | null) {
  if (event.defaultPrevented) return;
  if (event.metaKey || event.ctrlKey || event.altKey) return;

  const move = resolveRovingMove(event.key, "vertical");
  if (!move || !panel) return;

  const current =
    event.target instanceof Element ? event.target.closest(SELECT_MENU_ITEM_SELECTOR) : null;
  if (!current) return;

  const items = collectRovingItems(panel, SELECT_MENU_ITEM_SELECTOR, (item) => {
    return item.closest(SELECT_PANEL_SELECTOR) === panel;
  });
  const currentIndex = items.indexOf(current as HTMLElement);
  const next = items[resolveRovingIndex(currentIndex, items.length, move)];
  if (!next || next === current) return;

  const involvesSubItem =
    current.classList.contains("aviala-select-sub-item") ||
    next.classList.contains("aviala-select-sub-item");
  if (!involvesSubItem) return;

  event.preventDefault();
  event.stopPropagation();
  next.focus();
}

const SELECT_SUB_MENU_CLOSE_DELAY_MS = 250;
const SELECT_SUB_MENU_EXIT_ANIM_MS = 150;

type SelectSubMenuMarkerProps = {
  children: ReactNode;
  className?: string;
  side?: "left" | "right";
  sideOffset?: number;
  portalled?: boolean;
};

type ParsedSelectSubMenu = {
  children: ReactNode;
  className?: string;
  side?: "left" | "right";
  sideOffset: number;
  portalled: boolean;
};

type SubMenuItemRegistration = {
  getRoot: () => HTMLElement | null;
  getContent: () => HTMLElement | null;
};

type SelectSubMenuContextValue = {
  contentId: string;
  registerSubItem: (id: string, registration: SubMenuItemRegistration) => void;
  unregisterSubItem: (id: string) => void;
  openSubItem: (id: string) => void;
  scheduleCloseSubItem: (id: string, relatedTarget?: EventTarget | null) => void;
  closeActiveSubItem: () => void;
  isSubItemOpen: (id: string) => boolean;
  isSubItemExiting: (id: string) => boolean;
};

const SelectSubMenuContext = createContext<SelectSubMenuContextValue | null>(null);

type SelectDismissContextValue = {
  pointerDownCloseRef: React.MutableRefObject<boolean>;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
};

const SelectDismissContext = createContext<SelectDismissContextValue | null>(null);

function useSelectSubMenuContext() {
  const context = useContext(SelectSubMenuContext);
  if (!context) {
    throw new Error("Select sub-menu components must be used within SelectContent.");
  }
  return context;
}

function useSelectSubMenuLayer(): SelectSubMenuContextValue {
  const contentId = useId();
  const [activeSubItemId, setActiveSubItemId] = useState<string | null>(null);
  const [exitingSubItemId, setExitingSubItemId] = useState<string | null>(null);
  const itemsRef = useRef(new Map<string, SubMenuItemRegistration>());
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pointerRef = useRef({ x: 0, y: 0 });

  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current !== undefined) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = undefined;
    }
  }, []);

  const clearExitTimer = useCallback(() => {
    if (exitTimerRef.current !== undefined) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = undefined;
    }
  }, []);

  const isTargetInSubItemTree = useCallback((id: string, target: EventTarget | null | undefined) => {
    if (!(target instanceof Node)) return false;
    const registration = itemsRef.current.get(id);
    if (!registration) return false;
    const root = registration.getRoot();
    const content = registration.getContent();
    return (root?.contains(target) ?? false) || (content?.contains(target) ?? false);
  }, []);

  const findSubItemIdForTarget = useCallback((target: EventTarget | null | undefined, excludeId?: string) => {
    if (!(target instanceof Node)) return null;
    for (const [id, registration] of itemsRef.current) {
      if (id === excludeId) continue;
      const root = registration.getRoot();
      const content = registration.getContent();
      if (root?.contains(target) || content?.contains(target)) return id;
    }
    return null;
  }, []);

  const isPointerOverSubItem = useCallback((id: string) => {
    const hovered = document.elementFromPoint(pointerRef.current.x, pointerRef.current.y);
    if (!(hovered instanceof Element)) return false;
    const registration = itemsRef.current.get(id);
    if (!registration) return false;
    const root = registration.getRoot();
    const content = registration.getContent();
    return (root?.contains(hovered) ?? false) || (content?.contains(hovered) ?? false);
  }, []);

  const findSubItemIdAtPointer = useCallback((excludeId?: string) => {
    const hovered = document.elementFromPoint(pointerRef.current.x, pointerRef.current.y);
    if (!(hovered instanceof Element)) return null;
    for (const [id, registration] of itemsRef.current) {
      if (id === excludeId) continue;
      const root = registration.getRoot();
      const content = registration.getContent();
      if (root?.contains(hovered) || content?.contains(hovered)) return id;
    }
    return null;
  }, []);

  const beginExit = useCallback(
    (id: string) => {
      cancelScheduledClose();
      clearExitTimer();
      setExitingSubItemId(id);
      setActiveSubItemId(null);
      exitTimerRef.current = setTimeout(() => {
        setExitingSubItemId((current) => (current === id ? null : current));
        exitTimerRef.current = undefined;
      }, SELECT_SUB_MENU_EXIT_ANIM_MS);
    },
    [cancelScheduledClose, clearExitTimer]
  );

  const openSubItem = useCallback(
    (id: string) => {
      cancelScheduledClose();
      clearExitTimer();
      setExitingSubItemId(null);
      setActiveSubItemId(id);
    },
    [cancelScheduledClose, clearExitTimer]
  );

  const closeActiveSubItem = useCallback(() => {
    if (activeSubItemId) {
      beginExit(activeSubItemId);
      return;
    }
    cancelScheduledClose();
  }, [activeSubItemId, beginExit, cancelScheduledClose]);

  const scheduleCloseSubItem = useCallback(
    (id: string, relatedTarget?: EventTarget | null) => {
      if (exitingSubItemId === id) return;
      if (isTargetInSubItemTree(id, relatedTarget)) return;

      const siblingId = findSubItemIdForTarget(relatedTarget, id);
      if (siblingId) {
        openSubItem(siblingId);
        return;
      }

      cancelScheduledClose();
      closeTimerRef.current = setTimeout(() => {
        if (isPointerOverSubItem(id)) return;

        const pointerSiblingId = findSubItemIdAtPointer(id);
        if (pointerSiblingId) {
          openSubItem(pointerSiblingId);
          return;
        }

        beginExit(id);
      }, SELECT_SUB_MENU_CLOSE_DELAY_MS);
    },
    [
      beginExit,
      cancelScheduledClose,
      exitingSubItemId,
      findSubItemIdAtPointer,
      findSubItemIdForTarget,
      isPointerOverSubItem,
      isTargetInSubItemTree,
      openSubItem,
    ]
  );

  const registerSubItem = useCallback((id: string, registration: SubMenuItemRegistration) => {
    itemsRef.current.set(id, registration);
  }, []);

  const unregisterSubItem = useCallback((id: string) => {
    itemsRef.current.delete(id);
    setActiveSubItemId((current) => (current === id ? null : current));
    setExitingSubItemId((current) => (current === id ? null : current));
  }, []);

  useEffect(() => {
    const trackPointer = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
    };
    document.addEventListener("pointermove", trackPointer, { passive: true });
    return () => document.removeEventListener("pointermove", trackPointer);
  }, []);

  useEffect(
    () => () => {
      cancelScheduledClose();
      clearExitTimer();
    },
    [cancelScheduledClose, clearExitTimer]
  );

  useEffect(() => {
    const visibleSubItemId = activeSubItemId ?? exitingSubItemId;
    if (!visibleSubItemId) return;

    const keepSelectOpen = (event: Event) => {
      if (isWithinSelectSubLayer(event.target)) {
        event.stopPropagation();
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      event.stopPropagation();
      if (activeSubItemId) {
        beginExit(activeSubItemId);
        return;
      }
      if (exitingSubItemId) {
        clearExitTimer();
        setExitingSubItemId(null);
      }
    };

    document.addEventListener("pointerdown", keepSelectOpen, true);
    document.addEventListener("keydown", handleEscape, true);
    return () => {
      document.removeEventListener("pointerdown", keepSelectOpen, true);
      document.removeEventListener("keydown", handleEscape, true);
    };
  }, [activeSubItemId, beginExit, clearExitTimer, exitingSubItemId]);

  return useMemo(
    () => ({
      contentId,
      registerSubItem,
      unregisterSubItem,
      openSubItem,
      scheduleCloseSubItem,
      closeActiveSubItem,
      isSubItemOpen: (id: string) => activeSubItemId === id || exitingSubItemId === id,
      isSubItemExiting: (id: string) => exitingSubItemId === id && activeSubItemId !== id,
    }),
    [
      activeSubItemId,
      closeActiveSubItem,
      contentId,
      exitingSubItemId,
      openSubItem,
      registerSubItem,
      scheduleCloseSubItem,
      unregisterSubItem,
    ]
  );
}

/** Marker child for {@link SelectSubItem} — extracted and rendered in the flyout panel. */
export function SelectSubMenu(_props: SelectSubMenuMarkerProps): null {
  return null;
}
SelectSubMenu.displayName = "SelectSubMenu";

function isSelectSubMenuElement(child: ReactNode): child is ReactElement<SelectSubMenuMarkerProps> {
  return isValidElement(child) && child.type === SelectSubMenu;
}

function parseSelectSubItemChildren(children: ReactNode): {
  itemChildren: ReactNode;
  subMenu: ParsedSelectSubMenu | null;
} {
  const itemNodes: ReactNode[] = [];
  let subMenu: ParsedSelectSubMenu | null = null;

  Children.forEach(children, (child) => {
    if (isSelectSubMenuElement(child)) {
      subMenu = {
        children: child.props.children,
        className: child.props.className,
        side: child.props.side,
        sideOffset: child.props.sideOffset ?? 8,
        portalled: child.props.portalled ?? false,
      };
      return;
    }
    itemNodes.push(child);
  });

  return {
    itemChildren: itemNodes.length === 1 ? itemNodes[0] : itemNodes,
    subMenu,
  };
}

function isWithinSelectSubLayer(target: EventTarget | null) {
  return target instanceof Element && target.closest(".aviala-select-sub-content") !== null;
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
        "aviala-select-item__icon",
        iconLevel === "caption" && "aviala-select-item__icon--sm"
      )}
      style={iconSlotCssVarStyle(node, "--select-item-icon-size", iconLevel, true)}
      {...(debugId ? spiralDebugId(debugId) : undefined)}
    >
      {content}
    </span>
  );
}

function renderBadgeSlot(node: ReactNode): ReactNode {
  if (node == null || node === false) return null;

  return (
    <span className="aviala-select-item__badge">
      {isValidElement(node) && node.type === Badge ? node : <Badge>{node}</Badge>}
    </span>
  );
}

function SelectItemFormRadio() {
  return (
    <span className="aviala-select-item__form-radio" aria-hidden>
      <span className="aviala-select-item__form-radio-surface" />
      <span className="aviala-select-item__form-radio-indicator" />
    </span>
  );
}

function SelectItemFormCheckbox() {
  return (
    <span className="aviala-select-item__form-checkbox" aria-hidden>
      <SymbolRight
        className="aviala-select-item__form-checkbox-icon"
        width={12}
        height={12}
        aria-hidden
      />
    </span>
  );
}

function SelectItemTrailingRadio() {
  return (
    <SelectPrimitive.ItemIndicator className="aviala-select-item__trailing-radio" aria-hidden>
      <SymbolRight level="text" biggerSize aria-hidden />
    </SelectPrimitive.ItemIndicator>
  );
}

function SelectItemTrailingCheckbox() {
  return (
    <SelectPrimitive.ItemIndicator className="aviala-select-item__trailing-checkbox" aria-hidden>
      <SymbolRight level="text" biggerSize aria-hidden />
    </SelectPrimitive.ItemIndicator>
  );
}

function SelectItemDefaultAvatar() {
  return (
    <span className="aviala-select-item__avatar" aria-hidden>
      <UsersUserCircle level="text" biggerSize aria-hidden />
    </span>
  );
}

function SelectExpandChevron() {
  const rtl = useRtl();
  const Icon = rtl ? DirectionArrowLeft : DirectionArrowRight;
  return <Icon level="text" biggerSize aria-hidden />;
}

function renderFunctionSlot(
  itemFunction: SelectItemFunction,
  layout: SelectItemLayout,
  showFunctionIcon: boolean,
  icon?: ReactNode
): ReactNode {
  if (!showFunctionIcon) return null;
  if (layout === "checked") return null;

  const functionStyle = icon
    ? iconSlotCssVarStyle(icon, "--select-item-function-icon-size", "text", true)
    : undefined;

  if (icon !== undefined) {
    return (
      <span
        className="aviala-select-item__function"
        style={functionStyle}
        {...spiralDebugId("select.content.item.function")}
      >
        {cloneAvialaIconElement(icon, { level: "text", biggerSize: true })}
      </span>
    );
  }

  switch (itemFunction) {
    case "radio":
      return (
        <span className="aviala-select-item__function" {...spiralDebugId("select.content.item.function")}>
          <SelectItemTrailingRadio />
        </span>
      );
    case "checkbox":
      return (
        <span className="aviala-select-item__function" {...spiralDebugId("select.content.item.function")}>
          <SelectItemTrailingCheckbox />
        </span>
      );
    case "simple":
    case "action":
    default:
      return (
        <span
          className="aviala-select-item__function"
          style={iconLevelCssVarStyle("text", true, "--select-item-function-icon-size")}
          {...spiralDebugId("select.content.item.function")}
        >
          <SelectExpandChevron />
        </span>
      );
  }
}

export type SelectProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;

export function Select({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled,
  ...props
}: SelectProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // `SelectContent.onCloseAutoFocus` reads the pointer-down flag after the close,
  // so it must survive the closing render.
  const { pointerDownCloseRef, shouldCommitOpenChange } = useCloseSuppression({
    open,
    disabled,
    keepPointerDownFlagAfterClose: true,
  });

  const dismissContextValue = useMemo(
    () => ({ pointerDownCloseRef, triggerRef }),
    [pointerDownCloseRef]
  );

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!shouldCommitOpenChange(nextOpen)) return;
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange, shouldCommitOpenChange]
  );

  return (
    <SelectDismissContext.Provider value={dismissContextValue}>
      <SelectPrimitive.Root
        open={open}
        onOpenChange={handleOpenChange}
        disabled={disabled}
        {...props}
      />
    </SelectDismissContext.Provider>
  );
}
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;

const SELECT_MENU_ITEM_DISPLAY_NAMES = new Set([
  SelectPrimitive.Item.displayName,
  "SelectItem",
  "SelectSubItem",
  "SelectItemPeople",
]);

function getComponentDisplayName(type: unknown): string | undefined {
  if (typeof type === "function" || (typeof type === "object" && type !== null)) {
    return (type as { displayName?: string }).displayName;
  }
  return undefined;
}

export { getComponentDisplayName };

function isSelectGroupElement(child: ReactNode): boolean {
  if (!isValidElement(child)) return false;
  if (child.type === SelectGroup) return true;
  return getComponentDisplayName(child.type) === "SelectItemGroup";
}

function isSelectMenuItemElement(child: ReactNode): boolean {
  if (!isValidElement(child)) return false;
  const displayName = getComponentDisplayName(child.type);
  return displayName !== undefined && SELECT_MENU_ITEM_DISPLAY_NAMES.has(displayName);
}

/** Ensures bare menu items are wrapped in a SelectGroup in the DOM (Figma requirement). */
function wrapUngroupedSelectItems(children: ReactNode): ReactNode {
  const nodes = Children.toArray(children);
  if (nodes.length === 0) return children;

  const wrapped: ReactNode[] = [];
  let bareItems: ReactNode[] = [];
  let autoGroupIndex = 0;

  const flushBareItems = () => {
    if (bareItems.length === 0) return;
    wrapped.push(
      <SelectGroup key={`__select-auto-group-${autoGroupIndex++}`} className="aviala-select-group">
        <div className="aviala-select-group__slot">{bareItems}</div>
      </SelectGroup>
    );
    bareItems = [];
  };

  for (const node of nodes) {
    if (isSelectGroupElement(node)) {
      flushBareItems();
      wrapped.push(node);
    } else if (isSelectMenuItemElement(node)) {
      bareItems.push(node);
    } else {
      flushBareItems();
      wrapped.push(node);
    }
  }

  flushBareItems();
  return wrapped.length === 1 ? wrapped[0] : wrapped;
}

export type SelectTriggerProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
  size?: SelectSize;
  allRound?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Override chevron expand icon (defaults to DirectionArrowDownLight). */
  expandIcon?: ReactNode;
  placeholder?: string;
  error?: boolean;
};

export const SelectTrigger = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(
  (
    {
      className,
      size = "regular",
      allRound = false,
      leftIcon,
      rightIcon,
      expandIcon,
      placeholder,
      error,
      ...props
    },
    ref
  ) => {
    const dismissContext = useContext(SelectDismissContext);
    const resolvedError = useResolvedControlError(error);

    return (
    <SelectPrimitive.Trigger
      ref={(node) => {
        if (dismissContext) {
          dismissContext.triggerRef.current = node;
        }
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={cn("aviala-select-trigger aviala-focus-ring", className)}
      data-size={size}
      data-all-round={allRound ? "true" : "false"}
      data-error={resolvedError ? "true" : undefined}
      aria-invalid={resolvedError || undefined}
      {...spiralDebugId("select.trigger")}
      {...props}
    >
      {renderSlotIcon(leftIcon, "aviala-select-trigger__slot", "select.trigger.icon-left")}
      <span className="aviala-select-trigger__field">
        <SelectPrimitive.Value
          placeholder={placeholder}
          className={cn("aviala-select-trigger__value", typographyVariants({ level: "text" }))}
          {...spiralDebugId("select.trigger.value")}
        />
      </span>
      {renderSlotIcon(rightIcon, "aviala-select-trigger__slot", "select.trigger.icon-right")}
      <SelectPrimitive.Icon asChild>
        <span
          className="aviala-select-trigger__expand"
          aria-hidden
          style={
            expandIcon
              ? iconSlotCssVarStyle(expandIcon, "--input-slot-icon-size", "text", true)
              : iconLevelCssVarStyle("text", true, "--input-slot-icon-size")
          }
          {...spiralDebugId("select.trigger.expand")}
        >
          {expandIcon ?? (
            <DirectionArrowDownLight
              className="aviala-select-trigger__expand-icon"
              level="text"
              biggerSize
              aria-hidden
            />
          )}
        </span>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
    );
  }
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export type SelectContentProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
  /** Render without Portal — use inside nested overlays (e.g. ColorPicker popover). */
  portalled?: boolean;
};

export const SelectContent = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(
  (
    {
      className,
      children,
      position = "popper",
      sideOffset = 8,
      portalled = true,
      onCloseAutoFocus,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const overlayContainer = useOverlayPortalContainer();
    const subMenuLayer = useSelectSubMenuLayer();
    const dismissContext = useContext(SelectDismissContext);

    const handleCloseAutoFocus: NonNullable<SelectContentProps["onCloseAutoFocus"]> = (
      event
    ) => {
      onCloseAutoFocus?.(event);
      if (event.defaultPrevented) {
        if (dismissContext) {
          dismissContext.pointerDownCloseRef.current = false;
        }
        return;
      }
      if (dismissContext?.pointerDownCloseRef.current) {
        event.preventDefault();
        dismissContext.triggerRef.current?.blur();
        dismissContext.pointerDownCloseRef.current = false;
      }
    };

    const content = (
      <SelectSubMenuContext.Provider value={subMenuLayer}>
        <SelectPrimitive.Content
          ref={ref}
          className={cn("aviala-select-content", className)}
          position={position}
          sideOffset={sideOffset}
          onCloseAutoFocus={handleCloseAutoFocus}
          {...spiralDebugId("select.content")}
          {...props}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            handleMixedSelectPanelKeys(event, event.currentTarget);
          }}
        >
          <SelectPrimitive.Viewport
            className="aviala-select-viewport"
            {...spiralDebugId("select.content.viewport")}
          >
            {wrapUngroupedSelectItems(children)}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectSubMenuContext.Provider>
    );

    if (!portalled) return content;

    return (
      <SelectPrimitive.Portal container={overlayContainer}>
        {content}
      </SelectPrimitive.Portal>
    );
  }
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

export type SelectLabelProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Label>;

export const SelectLabel = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("aviala-select-label", typographyVariants({ level: "caption" }), className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

export type SelectItemProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
  /** Figma Function variant (default Action Item) */
  itemFunction?: SelectItemFunction;
  /** Figma Type variant */
  layout?: SelectItemLayout;
  leftIcon?: ReactNode;
  showLeftIcon?: boolean;
  rightIcon?: ReactNode;
  showRightIcon?: boolean;
  badge?: ReactNode;
  showBadge?: boolean;
  showMoreFunction?: boolean;
  /** Inline action before the function icon (Figma MoreFunction) */
  moreAction?: ReactNode;
  /** Override trailing function slot (Figma function icon) */
  icon?: ReactNode;
  /** Show trailing function icon (Figma showFunctionIcon; hidden when layout=`checked` and selected) */
  showFunctionIcon?: boolean;
  /** People layout — 26px avatar node; defaults to UsersUserCircle */
  avatar?: ReactNode;
  /** People layout — secondary caption line */
  subtitle?: ReactNode;
};

export const SelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(
  (
    {
      className,
      children,
      itemFunction = "action",
      layout = "default",
      leftIcon,
      showLeftIcon = false,
      rightIcon,
      showRightIcon = false,
      badge,
      showBadge = false,
      showMoreFunction = false,
      moreAction,
      icon,
      showFunctionIcon = true,
      avatar,
      subtitle,
      ...props
    },
    ref
  ) => {
    const isPeople = layout === "people";
    const isTitle = layout === "title";
    const isFormLeading =
      itemFunction === "form-radio" || itemFunction === "form-checkbox";
    const leftIconLevel: IconLevel = isTitle ? "caption" : "text";
    const showTrailingFunction =
      showFunctionIcon &&
      layout !== "checked" &&
      itemFunction !== "form-radio" &&
      itemFunction !== "form-checkbox";

    const textLevel = isTitle ? "caption" : "text";

    const textContent = isPeople ? (
      <span className="aviala-select-item__content">
        <SelectPrimitive.ItemText
          className={cn("aviala-select-item__text", typographyVariants({ level: textLevel }))}
        >
          {children}
        </SelectPrimitive.ItemText>
        {subtitle != null && subtitle !== false ? (
          <span className={cn("aviala-select-item__subtitle", typographyVariants({ level: "caption" }))}>
            {subtitle}
          </span>
        ) : null}
      </span>
    ) : (
      <SelectPrimitive.ItemText
        className={cn("aviala-select-item__text", typographyVariants({ level: textLevel }))}
      >
        {children}
      </SelectPrimitive.ItemText>
    );

    return (
      <SelectPrimitive.Item
        ref={ref}
        className={cn("aviala-select-item", className)}
        data-layout={layout !== "default" ? layout : undefined}
        data-function={itemFunction !== "action" ? itemFunction : undefined}
        {...spiralDebugId("select.content.item")}
        {...props}
      >
        {isFormLeading && itemFunction === "form-radio" ? <SelectItemFormRadio /> : null}
        {isFormLeading && itemFunction === "form-checkbox" ? (
          <SelectItemFormCheckbox />
        ) : null}

        {showLeftIcon && leftIcon
          ? renderItemIcon(leftIcon, leftIconLevel, "select.content.item.icon-left")
          : null}

        {isPeople ? (avatar ?? <SelectItemDefaultAvatar />) : null}

        {textContent}

        {showBadge ? renderBadgeSlot(badge) : null}

        {showRightIcon && rightIcon
          ? renderItemIcon(rightIcon, leftIconLevel, "select.content.item.icon-right")
          : null}

        {showMoreFunction && moreAction != null ? (
          <span className="aviala-select-item__more">{moreAction}</span>
        ) : null}

        {renderFunctionSlot(itemFunction, layout, showTrailingFunction, icon)}
      </SelectPrimitive.Item>
    );
  }
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

export type SelectSubMenuProps = SelectSubMenuMarkerProps;

export type SelectSubItemProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  /** Figma Function variant (default Action Item — trailing chevron) */
  itemFunction?: SelectItemFunction;
  /** Figma Type variant */
  layout?: SelectItemLayout;
  leftIcon?: ReactNode;
  showLeftIcon?: boolean;
  rightIcon?: ReactNode;
  showRightIcon?: boolean;
  badge?: ReactNode;
  showBadge?: boolean;
  showMoreFunction?: boolean;
  moreAction?: ReactNode;
  icon?: ReactNode;
  showFunctionIcon?: boolean;
  avatar?: ReactNode;
  subtitle?: ReactNode;
  /** Popover side when space allows (default right). Flips to left on collision. */
  side?: "left" | "right";
  sideOffset?: number;
  /** Render flyout in a Portal (default false — keeps panel inside SelectContent). */
  portalled?: boolean;
};

/**
 * Figma Select Menu Item with nested sub-menu — opens a flyout panel on hover/focus.
 * Compose with {@link SelectSubMenu} for sub-menu items.
 */
export const SelectSubItem = forwardRef<HTMLDivElement, SelectSubItemProps>(
  (
    {
      className,
      children,
      itemFunction = "action",
      layout = "default",
      leftIcon,
      showLeftIcon = false,
      rightIcon,
      showRightIcon = false,
      badge,
      showBadge = false,
      showMoreFunction = false,
      moreAction,
      icon,
      showFunctionIcon = true,
      avatar,
      subtitle,
      side: sideProp,
      sideOffset: sideOffsetProp,
      portalled: portalledProp,
      disabled = false,
    },
    ref
  ) => {
    const {
      registerSubItem,
      unregisterSubItem,
      openSubItem,
      scheduleCloseSubItem,
      closeActiveSubItem,
      isSubItemOpen,
      isSubItemExiting,
    } = useSelectSubMenuContext();
    const overlayContainer = useOverlayPortalContainer();
    const { itemChildren, subMenu } = parseSelectSubItemChildren(children);

    if (!subMenu) {
      throw new Error("SelectSubItem requires a SelectSubMenu child.");
    }

    const subItemId = useId();
    const subMenuId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const rtl = useRtl();
    const direction = useDirection();
    const expandKey = rtl ? "ArrowLeft" : "ArrowRight";
    const collapseKey = rtl ? "ArrowRight" : "ArrowLeft";

    const side = sideProp ?? subMenu.side ?? forwardChevronSide(direction);
    const sideOffset = sideOffsetProp ?? subMenu.sideOffset;
    const portalled = portalledProp ?? subMenu.portalled;

    const open = isSubItemOpen(subItemId);
    const exiting = isSubItemExiting(subItemId);

    useEffect(() => {
      registerSubItem(subItemId, {
        getRoot: () => rootRef.current,
        getContent: () => contentRef.current,
      });
      return () => unregisterSubItem(subItemId);
    }, [registerSubItem, subItemId, unregisterSubItem]);

    const handleOpen = useCallback(() => {
      if (disabled) return;
      openSubItem(subItemId);
    }, [disabled, openSubItem, subItemId]);

    const handlePointerLeave = useCallback(
      (event: { relatedTarget: EventTarget | null }) => {
        scheduleCloseSubItem(subItemId, event.relatedTarget);
      },
      [scheduleCloseSubItem, subItemId]
    );

    const isPeople = layout === "people";
    const isTitle = layout === "title";
    const isFormLeading =
      itemFunction === "form-radio" || itemFunction === "form-checkbox";
    const leftIconLevel: IconLevel = isTitle ? "caption" : "text";
    const showTrailingFunction =
      showFunctionIcon &&
      layout !== "checked" &&
      itemFunction !== "form-radio" &&
      itemFunction !== "form-checkbox";

    const textLevel = isTitle ? "caption" : "text";

    const textContent = isPeople ? (
      <span className="aviala-select-item__content">
        <span className={cn("aviala-select-item__text", typographyVariants({ level: textLevel }))}>
          {itemChildren}
        </span>
        {subtitle != null && subtitle !== false ? (
          <span className={cn("aviala-select-item__subtitle", typographyVariants({ level: "caption" }))}>
            {subtitle}
          </span>
        ) : null}
      </span>
    ) : (
      <span className={cn("aviala-select-item__text", typographyVariants({ level: textLevel }))}>
        {itemChildren}
      </span>
    );

    const handleTriggerBlur = (event: FocusEvent<HTMLButtonElement>) => {
      scheduleCloseSubItem(subItemId, event.relatedTarget);
    };

    const focusTrigger = () => {
      rootRef.current
        ?.querySelector<HTMLButtonElement>(".aviala-select-sub-item")
        ?.focus();
    };

    const focusFlyoutStart = () => {
      // The flyout mounts with the popover, so wait a frame before reaching in.
      requestAnimationFrame(() => {
        focusSelectMenuItem(contentRef.current, null, "first");
      });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === expandKey || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleOpen();
        if (event.key === expandKey) focusFlyoutStart();
        return;
      }
      if (event.key === "Escape" || event.key === collapseKey) {
        event.preventDefault();
        closeActiveSubItem();
        return;
      }

      // Radix drives the arrow keys for its own items, but this row is a plain
      // button outside that collection — walk the panel by hand instead.
      const move = resolveRovingMove(event.key, "vertical");
      if (!move) return;
      if (!focusSelectMenuItem(event.currentTarget.closest(SELECT_PANEL_SELECTOR), event.currentTarget, move)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    };

    const handleFlyoutKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape" || event.key === collapseKey) {
        event.preventDefault();
        event.stopPropagation();
        closeActiveSubItem();
        focusTrigger();
        return;
      }

      const move = resolveRovingMove(event.key, "vertical");
      if (!move) return;

      const currentRow =
        event.target instanceof Element
          ? event.target.closest(SELECT_MENU_ITEM_SELECTOR)
          : null;
      if (!focusSelectMenuItem(contentRef.current, currentRow, move)) return;

      event.preventDefault();
      event.stopPropagation();
    };

    const itemRow = (
      <button
        type="button"
        disabled={disabled}
        className={cn("aviala-select-item aviala-select-sub-item", className)}
        data-layout={layout !== "default" ? layout : undefined}
        data-function={itemFunction !== "action" ? itemFunction : undefined}
        data-state={open ? "open" : undefined}
        data-highlighted={open ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? subMenuId : undefined}
        onFocus={handleOpen}
        onBlur={handleTriggerBlur}
        onKeyDown={handleKeyDown}
      >
        {isFormLeading && itemFunction === "form-radio" ? <SelectItemFormRadio /> : null}
        {isFormLeading && itemFunction === "form-checkbox" ? (
          <SelectItemFormCheckbox />
        ) : null}

        {showLeftIcon && leftIcon ? renderItemIcon(leftIcon, leftIconLevel) : null}

        {isPeople ? (avatar ?? <SelectItemDefaultAvatar />) : null}

        {textContent}

        {showBadge ? renderBadgeSlot(badge) : null}

        {showRightIcon && rightIcon ? renderItemIcon(rightIcon, leftIconLevel) : null}

        {showMoreFunction && moreAction != null ? (
          <span className="aviala-select-item__more">{moreAction}</span>
        ) : null}

        {renderFunctionSlot(itemFunction, layout, showTrailingFunction, icon)}
      </button>
    );

    const flyout = (
      <PopoverPrimitive.Content
        ref={contentRef}
        id={subMenuId}
        role="menu"
        className={cn("aviala-select-content aviala-select-sub-content", subMenu.className)}
        side={side}
        align="center"
        sideOffset={sideOffset}
        avoidCollisions
        collisionPadding={8}
        data-exiting={exiting ? "true" : undefined}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onPointerEnter={handleOpen}
        onPointerLeave={handlePointerLeave}
        onPointerDownOutside={(event) => event.preventDefault()}
        onKeyDown={handleFlyoutKeyDown}
      >
        <div className="aviala-select-viewport aviala-select-sub-content__viewport">
          {wrapUngroupedSelectItems(subMenu.children)}
        </div>
      </PopoverPrimitive.Content>
    );

    return (
      <PopoverPrimitive.Root open={open} modal={false}>
        <div
          ref={(node) => {
            rootRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          className="aviala-select-sub-item__root"
          onPointerEnter={handleOpen}
          onPointerLeave={handlePointerLeave}
        >
          <PopoverPrimitive.Anchor asChild>{itemRow}</PopoverPrimitive.Anchor>
          {portalled ? (
            <PopoverPrimitive.Portal container={overlayContainer}>
              {flyout}
            </PopoverPrimitive.Portal>
          ) : (
            flyout
          )}
        </div>
      </PopoverPrimitive.Root>
    );
  }
);
SelectSubItem.displayName = "SelectSubItem";

/** People layout convenience alias — same as `<SelectSubItem layout="people" … />`. */
export type SelectSubItemPeopleProps = Omit<SelectSubItemProps, "layout">;

export const SelectSubItemPeople = forwardRef<HTMLDivElement, SelectSubItemPeopleProps>(
  (props, ref) => <SelectSubItem ref={ref} layout="people" {...props} />
);
SelectSubItemPeople.displayName = "SelectSubItemPeople";

/** People layout convenience alias — same as `<SelectItem layout="people" … />`. */
export type SelectItemPeopleProps = Omit<SelectItemProps, "layout">;

export const SelectItemPeople = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemPeopleProps
>((props, ref) => <SelectItem ref={ref} layout="people" {...props} />);
SelectItemPeople.displayName = "SelectItemPeople";

export type SelectSeparatorProps = ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>;

export const SelectSeparator = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  SelectSeparatorProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("aviala-select-separator", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

/** Convenience wrapper matching Figma Select Menu Item Group */
export type SelectItemGroupProps = {
  label?: ReactNode;
  showDivider?: boolean;
  children: ReactNode;
  className?: string;
};

export function SelectItemGroup({
  label,
  showDivider = false,
  children,
  className,
}: SelectItemGroupProps) {
  return (
    <SelectGroup className={cn("aviala-select-group", className)}>
      {label ? <SelectLabel>{label}</SelectLabel> : null}
      <div className="aviala-select-group__slot">{children}</div>
      {showDivider ? <SelectSeparator /> : null}
    </SelectGroup>
  );
}
