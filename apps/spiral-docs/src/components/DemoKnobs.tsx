import {
  FormField,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  SelectValue,
  Stack,
  Switch,
} from "@aviala-design/spiral";
import { useId } from "react";
import { IconPickerKnob } from "./IconPickerKnob";

export type KnobSelect = {
  kind: "select";
  name: string;
  label: string;
  options: readonly string[];
  defaultValue: string;
};

export type KnobBoolean = {
  kind: "boolean";
  name: string;
  label: string;
  defaultValue: boolean;
};

export type KnobString = {
  kind: "string";
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
};

export type KnobIcon = {
  kind: "icon";
  name: string;
  label: string;
  defaultValue: string;
};

export type KnobDef = KnobSelect | KnobBoolean | KnobString | KnobIcon;

export type KnobValues = Record<string, string | boolean>;

export function defaultKnobValues(knobs: KnobDef[]): KnobValues {
  return Object.fromEntries(
    knobs.map((knob) => [knob.name, knob.kind === "boolean" ? knob.defaultValue : knob.defaultValue])
  );
}

type DemoKnobsProps = {
  knobs: KnobDef[];
  values: KnobValues;
  onChange: (values: KnobValues) => void;
};

export function DemoKnobs({ knobs, values, onChange }: DemoKnobsProps) {
  const baseId = useId();

  if (knobs.length === 0) return null;

  return (
    <Stack gap="block" className="docs-demo-knobs-fields">
      {knobs.map((knob) => {
        const fieldId = `${baseId}-${knob.name}`;

        if (knob.kind === "select") {
          const current = String(values[knob.name] ?? knob.defaultValue);
          return (
            <FormField key={knob.name} label={knob.label} htmlFor={fieldId}>
              <Select
                value={current}
                onValueChange={(next) => onChange({ ...values, [knob.name]: next })}
              >
                <SelectTrigger id={fieldId} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItemGroup>
                    {knob.options.map((option) => (
                      <SelectItem key={option} value={option} itemFunction="radio">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectItemGroup>
                </SelectContent>
              </Select>
            </FormField>
          );
        }

        if (knob.kind === "boolean") {
          const checked = Boolean(values[knob.name] ?? knob.defaultValue);
          return (
            <FormField key={knob.name} label={knob.label} htmlFor={fieldId}>
              <div className="docs-demo-knob-switch">
                <Switch
                  id={fieldId}
                  size="small"
                  checked={checked}
                  onCheckedChange={(next) => onChange({ ...values, [knob.name]: next })}
                />
              </div>
            </FormField>
          );
        }

        if (knob.kind === "icon") {
          const current = String(values[knob.name] ?? knob.defaultValue);
          return (
            <IconPickerKnob
              key={knob.name}
              id={fieldId}
              label={knob.label}
              value={current}
              onChange={(next) => onChange({ ...values, [knob.name]: next })}
            />
          );
        }

        return (
          <FormField key={knob.name} label={knob.label} htmlFor={fieldId}>
            <Input
              id={fieldId}
              value={String(values[knob.name] ?? knob.defaultValue)}
              placeholder={knob.placeholder}
              onChange={(e) => onChange({ ...values, [knob.name]: e.target.value })}
            />
          </FormField>
        );
      })}
    </Stack>
  );
}
