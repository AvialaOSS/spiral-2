import { type PointerEvent, type RefObject } from "react";
export declare function usePointerDrag<T extends HTMLElement>(ref: RefObject<T | null>, onMove: (x: number, y: number) => void, enabled?: boolean): {
    handlePointerDown: (event: PointerEvent<T>) => void;
    handlePointerMove: (event: PointerEvent<T>) => void;
};
//# sourceMappingURL=use-pointer-drag.d.ts.map