import { GeneralUpload } from "@aviala-design/icons";
import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../lib/utils";
import { Typeface } from "./typeface";
import { Typography } from "./typography";

/** Figma Components → Information Collect → Upload (527:56239) */
export type UploadStyle = "default" | "large";

const uploadVariants = cva("aviala-upload aviala-focus-ring", {
  variants: {
    style: {
      default: "aviala-upload--style-default",
      large: "aviala-upload--style-large",
    },
  },
  defaultVariants: {
    style: "default",
  },
});

export type UploadProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "style"> &
  VariantProps<typeof uploadVariants> & {
    /** Primary line — Large style */
    title?: ReactNode;
    /** Secondary line — Large style */
    description?: ReactNode;
    /** Default style button label */
    label?: ReactNode;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    /** Enable drag-and-drop (Large style defaults to true) */
    dragAndDrop?: boolean;
    onChange?: (files: FileList | null) => void;
    inputProps?: Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "type" | "accept" | "multiple" | "disabled" | "onChange"
    >;
  };

export const Upload = forwardRef<HTMLDivElement, UploadProps>(
  (
    {
      className,
      style = "default",
      title = "Drag the file here to upload the file",
      description = "Or click here to upload",
      label = "Upload",
      accept,
      multiple,
      disabled,
      dragAndDrop,
      onChange,
      inputProps,
      onDragOver,
      onDragLeave,
      onDrop,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const resolvedStyle = style ?? "default";
    const allowDrag = dragAndDrop ?? resolvedStyle === "large";

    const openPicker = () => {
      if (disabled) return;
      inputRef.current?.click();
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.target.files);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
      onDrop?.(event);
      setDragging(false);
      if (disabled || !allowDrag) return;
      event.preventDefault();
      if (event.dataTransfer.files?.length) {
        onChange?.(event.dataTransfer.files);
      }
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={cn(uploadVariants({ style: resolvedStyle }), className)}
        data-style={resolvedStyle}
        data-disabled={disabled ? "true" : undefined}
        data-dragging={dragging ? "true" : undefined}
        aria-disabled={disabled || undefined}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(event) => {
          onDragOver?.(event);
          if (disabled || !allowDrag) return;
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          onDragLeave?.(event);
          setDragging(false);
        }}
        onDrop={handleDrop}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          className="aviala-upload__input"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          tabIndex={-1}
          aria-hidden
          {...inputProps}
        />
        <span className="aviala-upload__icon" aria-hidden>
          <GeneralUpload width={16} height={16} />
        </span>
        {resolvedStyle === "large" ? (
          <Typeface
            className="aviala-upload__typeface"
            content="textCaption"
            primary={title}
            secondary={description}
          />
        ) : (
          <Typography level="text" as="span" className="aviala-upload__label">
            {label}
          </Typography>
        )}
      </div>
    );
  }
);
Upload.displayName = "Upload";
