import {
  Navigation,
  NavigationItem,
  NavigationItemGroup,
  type NavigationBackground,
  type NavigationDirection,
} from "@aviala-design/spiral";

import type { KnobValues } from "../../components/DemoKnobs";
import {
  applyIconRoleOverride,
  iconRoleKnobs,
  readIconRoleFromState,
  renderDebugIcon,
} from "../icon-knobs";
import { spiralDebugProps, type DebugComponentEntry } from "../types";

export type NavigationDebugState = {
  background: NavigationBackground;
  direction: NavigationDirection;
  dividingLine: boolean;
  activeItem: string;
  showLeftIcon: boolean;
  leftIconName: string;
  leftIconThickness: string;
  leftIconMode: string;
  leftIconBiggerSize: boolean;
  leftIconLevel: string;
  showRightIcon: boolean;
  rightIconName: string;
  rightIconThickness: string;
  rightIconMode: string;
  rightIconBiggerSize: boolean;
  rightIconLevel: string;
};

const initialState: NavigationDebugState = {
  background: "default",
  direction: "vertical",
  dividingLine: false,
  activeItem: "home",
  showLeftIcon: true,
  leftIconName: "GeneralSetting",
  leftIconThickness: "Light",
  leftIconMode: "default",
  leftIconBiggerSize: true,
  leftIconLevel: "text",
  showRightIcon: false,
  rightIconName: "GeneralSetting",
  rightIconThickness: "Light",
  rightIconMode: "default",
  rightIconBiggerSize: true,
  rightIconLevel: "text",
};

export const navigationEntry: DebugComponentEntry<NavigationDebugState> = {
  id: "navigation",
  label: "Navigation",
  description: "Figma Structure Navigation",
  initialState,
  nodes: [
    {
      debugId: "navigation",
      label: "Navigation",
      knobs: [
        {
          kind: "select",
          name: "background",
          label: "background",
          options: ["none", "default"],
          defaultValue: "default",
        },
        {
          kind: "select",
          name: "direction",
          label: "direction",
          options: ["horizontal", "vertical"],
          defaultValue: "vertical",
        },
        { kind: "boolean", name: "dividingLine", label: "dividingLine", defaultValue: false },
        {
          kind: "select",
          name: "activeItem",
          label: "activeItem",
          options: ["home", "settings", "profile"],
          defaultValue: "home",
        },
      ],
      applyOverride: (state, value: KnobValues) => ({
        ...state,
        background: String(value.background ?? "default") as NavigationBackground,
        direction: String(value.direction ?? "vertical") as NavigationDirection,
        dividingLine: Boolean(value.dividingLine),
        activeItem: String(value.activeItem ?? "home"),
      }),
    },
    {
      debugId: "navigation.item",
      label: "Item",
      parent: "navigation",
      knobs: iconRoleKnobs("leftIcon", true, "GeneralSetting").concat(
        iconRoleKnobs("rightIcon", false, "GeneralSetting")
      ),
      description: "Icon knobs apply to all navigation items in preview.",
      applyOverride: (state, value) =>
        applyIconRoleOverride(applyIconRoleOverride(state, value, "leftIcon"), value, "rightIcon"),
    },
  ],
  renderPreview: (state) => {
    const left = readIconRoleFromState(state, "leftIcon", true);
    const right = readIconRoleFromState(state, "rightIcon", false);

    const itemIcons = {
      leftIcon: renderDebugIcon(
        left.visible,
        left.iconName,
        left.thickness,
        left.mode,
        left.biggerSize,
        left.level
      ),
      rightIcon: renderDebugIcon(
        right.visible,
        right.iconName,
        right.thickness,
        right.mode,
        right.biggerSize,
        right.level
      ),
    };

    const items = [
      { id: "home", label: "Home" },
      { id: "settings", label: "Settings" },
      { id: "profile", label: "Profile" },
    ];

    return (
      <div {...spiralDebugProps("navigation")}>
        <Navigation
          background={state.background}
          direction={state.direction}
          dividingLine={state.dividingLine}
          className="w-[240px]"
        >
          <NavigationItemGroup>
            {items.map((item) => (
              <NavigationItem
                key={item.id}
                href="#"
                active={state.activeItem === item.id}
                onClick={(event) => event.preventDefault()}
                {...itemIcons}
              >
                {item.label}
              </NavigationItem>
            ))}
          </NavigationItemGroup>
        </Navigation>
      </div>
    );
  },
};
