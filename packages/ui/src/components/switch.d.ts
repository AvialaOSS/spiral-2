import * as SwitchPrimitive from "@radix-ui/react-switch";
import { type ComponentPropsWithoutRef } from "react";
/** Figma Components → Basic Input → Switch */
export type SwitchSize = "regular" | "small";
export type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
    size?: SwitchSize;
};
export declare const Switch: import("react").ForwardRefExoticComponent<Omit<SwitchPrimitive.SwitchProps & import("react").RefAttributes<HTMLButtonElement>, "ref"> & {
    size?: SwitchSize;
} & import("react").RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=switch.d.ts.map