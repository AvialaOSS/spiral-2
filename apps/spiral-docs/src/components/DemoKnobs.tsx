import { GeneralDelete, GeneralGrabber, SymbolAdd } from "@aviala-design/icons";
import {
  Button,
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
  Typography,
} from "@aviala-design/spiral";
import { useEffect, useId, useRef, useState, type DragEvent } from "react";
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

export type KnobItemField = KnobSelect | KnobBoolean | KnobString | KnobIcon;

export type KnobItemRecord = Record<string, string | boolean>;

export type KnobItems = {
  kind: "items";
  name: string;
  label: string;
  itemLabel?: string;
  min?: number;
  max?: number;
  fields: KnobItemField[];
  defaultValue: KnobItemRecord[];
};

export type KnobDef = KnobSelect | KnobBoolean | KnobString | KnobIcon | KnobItems;

export type KnobValue = string | boolean | KnobItemRecord[];
export type KnobValues = Record<string, KnobValue>;

function cloneItems(items: KnobItemRecord[]): KnobItemRecord[] {
  return items.map((item) => ({ ...item }));
}

function blankItem(fields: KnobItemField[]): KnobItemRecord {
  return Object.fromEntries(fields.map((field) => [field.name, field.defaultValue]));
}

export function defaultKnobValues(knobs: KnobDef[]): KnobValues {
  return Object.fromEntries(
    knobs.map((knob) => {
      if (knob.kind === "items") {
        return [knob.name, cloneItems(knob.defaultValue)];
      }
      return [knob.name, knob.defaultValue];
    })
  );
}

export function getKnobItems(
  values: KnobValues,
  name: string,
  fallback: KnobItemRecord[] = []
): KnobItemRecord[] {
  const value = values[name];
  return Array.isArray(value) ? value : fallback;
}

type DemoKnobsProps = {
  knobs: KnobDef[];
  values: KnobValues;
  onChange: (values: KnobValues) => void;
};

function ItemFieldEditor({
  field,
  fieldId,
  value,
  onChange,
}: {
  field: KnobItemField;
  fieldId: string;
  value: string | boolean;
  onChange: (next: string | boolean) => void;
}) {
  if (field.kind === "select") {
    const current = String(value ?? field.defaultValue);
    return (
      <FormField label={field.label} htmlFor={fieldId}>
        <Select value={current} onValueChange={(next) => onChange(next)}>
          <SelectTrigger id={fieldId} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItemGroup>
              {field.options.map((option) => (
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

  if (field.kind === "boolean") {
    const checked = Boolean(value ?? field.defaultValue);
    return (
      <FormField label={field.label} htmlFor={fieldId}>
        <div className="docs-demo-knob-switch">
          <Switch
            id={fieldId}
            size="small"
            checked={checked}
            onCheckedChange={(next) => onChange(next)}
          />
        </div>
      </FormField>
    );
  }

  if (field.kind === "icon") {
    return (
      <IconPickerKnob
        id={fieldId}
        label={field.label}
        value={String(value ?? field.defaultValue)}
        onChange={(next) => onChange(next)}
      />
    );
  }

  return (
    <FormField label={field.label} htmlFor={fieldId}>
      <Input
        id={fieldId}
        value={String(value ?? field.defaultValue)}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormField>
  );
}

function ItemsKnobEditor({
  knob,
  values,
  onChange,
  baseId,
}: {
  knob: KnobItems;
  values: KnobValues;
  onChange: (values: KnobValues) => void;
  baseId: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const rowIdsRef = useRef<string[]>([]);
  const items = getKnobItems(values, knob.name, knob.defaultValue);
  const itemLabel = knob.itemLabel ?? "Item";
  const min = knob.min ?? 1;
  const max = knob.max ?? 8;
  const itemsSignature = `${items.length}:${JSON.stringify(items)}`;

  useEffect(() => {
    const ids = rowIdsRef.current;
    if (ids.length === items.length) return;
    if (ids.length < items.length) {
      const next = [...ids];
      while (next.length < items.length) {
        next.push(`${knob.name}-${next.length}-${Math.random().toString(36).slice(2, 9)}`);
      }
      rowIdsRef.current = next;
      return;
    }
    rowIdsRef.current = ids.slice(0, items.length);
  }, [items.length, itemsSignature, knob.name]);

  const commit = (next: KnobItemRecord[], nextIds?: string[]) => {
    if (nextIds) rowIdsRef.current = nextIds;
    onChange({ ...values, [knob.name]: next });
  };

  const updateItem = (index: number, patch: KnobItemRecord) => {
    commit(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    if (items.length >= max) return;
    const next = [...items, blankItem(knob.fields)];
    const nextIds = [
      ...rowIdsRef.current,
      `${knob.name}-${next.length - 1}-${Math.random().toString(36).slice(2, 9)}`,
    ];
    commit(next, nextIds);
    setOpenIndex(next.length - 1);
  };

  const removeItem = (index: number) => {
    if (items.length <= min) return;
    const next = items.filter((_, i) => i !== index);
    const nextIds = rowIdsRef.current.filter((_, i) => i !== index);
    commit(next, nextIds);
    setOpenIndex((prev) => {
      if (prev == null) return null;
      if (prev === index) return Math.max(0, index - 1);
      if (prev > index) return prev - 1;
      return prev;
    });
  };

  const reorderItem = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return;
    const next = [...items];
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row!);
    const nextIds = [...rowIdsRef.current];
    const [id] = nextIds.splice(from, 1);
    nextIds.splice(to, 0, id!);
    commit(next, nextIds);
    setOpenIndex((prev) => {
      if (prev == null) return null;
      if (prev === from) return to;
      if (from < prev && prev <= to) return prev - 1;
      if (to <= prev && prev < from) return prev + 1;
      return prev;
    });
  };

  const clearDrag = () => {
    setDragFrom(null);
    setDropTarget(null);
  };

  const onGrabberDragStart = (event: DragEvent<HTMLButtonElement>, index: number) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
    setDragFrom(index);
    setDropTarget(index);
  };

  const onItemDragOver = (event: DragEvent<HTMLDivElement>, index: number) => {
    if (dragFrom == null) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dropTarget !== index) setDropTarget(index);
  };

  const onItemDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    const from = dragFrom ?? Number(event.dataTransfer.getData("text/plain"));
    reorderItem(from, index);
    clearDrag();
  };

  const rowTitle = (item: KnobItemRecord, index: number) => {
    const primary = knob.fields[0];
    if (!primary) return `${itemLabel} ${index + 1}`;
    const raw = item[primary.name];
    if (typeof raw === "string" && raw.trim()) return raw;
    if (primary.kind === "select" && typeof raw === "string") return raw;
    return `${itemLabel} ${index + 1}`;
  };

  return (
    <div className="docs-demo-knob-items">
      <div className="docs-demo-knob-items__header">
        <Typography level="caption" as="div" className="docs-demo-knob-items__label">
          {knob.label}
        </Typography>
        <Button
          mode="noBackgroundCustom"
          size="tiny"
          leftIcon={<SymbolAdd aria-hidden />}
          disabled={items.length >= max}
          onClick={addItem}
        >
          添加
        </Button>
      </div>
      <div className="docs-demo-knob-items__list">
        {items.map((item, index) => {
          const expanded = openIndex === index;
          const isDragging = dragFrom === index;
          const isDropTarget = dropTarget === index && dragFrom != null && dragFrom !== index;
          return (
            <div
              key={rowIdsRef.current[index] ?? `${knob.name}-${index}`}
              className={`docs-demo-knob-item${expanded ? " is-open" : ""}${isDragging ? " is-dragging" : ""}${isDropTarget ? " is-drop-target" : ""}`}
              onDragOver={(event) => onItemDragOver(event, index)}
              onDrop={(event) => onItemDrop(event, index)}
              onDragLeave={() => {
                if (dropTarget === index) setDropTarget(null);
              }}
            >
              <div className="docs-demo-knob-item__toolbar">
                <button
                  type="button"
                  className="docs-demo-knob-item__grabber"
                  aria-label="拖动排序"
                  title="拖动排序"
                  draggable
                  onDragStart={(event) => onGrabberDragStart(event, index)}
                  onDragEnd={clearDrag}
                >
                  <GeneralGrabber aria-hidden />
                </button>
                <button
                  type="button"
                  className="docs-demo-knob-item__toggle"
                  aria-expanded={expanded}
                  onClick={() => setOpenIndex(expanded ? null : index)}
                >
                  <Typography level="text" as="span">
                    {rowTitle(item, index)}
                  </Typography>
                </button>
                <div className="docs-demo-knob-item__actions">
                  <Button
                    mode="noBackgroundCustom"
                    size="tiny"
                    iconOnly
                    aria-label="删除"
                    disabled={items.length <= min}
                    leftIcon={<GeneralDelete aria-hidden />}
                    onClick={() => removeItem(index)}
                  />
                </div>
              </div>
              {expanded ? (
                <Stack gap="component" className="docs-demo-knob-item__fields">
                  {knob.fields.map((field) => (
                    <ItemFieldEditor
                      key={field.name}
                      field={field}
                      fieldId={`${baseId}-${knob.name}-${index}-${field.name}`}
                      value={item[field.name] ?? field.defaultValue}
                      onChange={(next) => updateItem(index, { [field.name]: next })}
                    />
                  ))}
                </Stack>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DemoKnobs({ knobs, values, onChange }: DemoKnobsProps) {
  const baseId = useId();

  if (knobs.length === 0) return null;

  return (
    <Stack gap="block" className="docs-demo-knobs-fields">
      {knobs.map((knob) => {
        const fieldId = `${baseId}-${knob.name}`;

        if (knob.kind === "items") {
          return (
            <ItemsKnobEditor
              key={knob.name}
              knob={knob}
              values={values}
              onChange={onChange}
              baseId={baseId}
            />
          );
        }

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
