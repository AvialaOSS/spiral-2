import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from "react";

declare module "@aviala/spiral" {
  export const Modal: React.FC<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
  }>;

  export const ModalContent: React.ForwardRefExoticComponent<
    ComponentPropsWithoutRef<"div"> & {
      size?: "default" | "large";
      children?: ReactNode;
    }
  >;

  export const ModalHeaderText: React.FC<{
    title: ReactNode;
    description?: ReactNode;
  }>;

  export const ModalBody: React.ForwardRefExoticComponent<
    HTMLAttributes<HTMLDivElement> & { children?: ReactNode }
  >;

  export const ModalFooter: React.ForwardRefExoticComponent<
    HTMLAttributes<HTMLDivElement> & { children?: ReactNode }
  >;
}
