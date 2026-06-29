import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { Loader } from "@aviala/icons";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--button-radius,var(--radius-md))] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--button-bg,var(--primary))] text-[var(--button-fg,var(--primary-foreground))] hover:opacity-90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[var(--button-height-md,36px)] px-[var(--button-padding-x,12px)] py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      icon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          icon
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
