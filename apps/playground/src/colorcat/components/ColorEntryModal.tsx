import {
  Button,
  ColorPicker,
  ColorPickerContent,
  ColorPickerTrigger,
  FormField,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeaderText,
} from "@aviala/spiral";
import { useEffect, useState } from "react";
import type { ColorEntry } from "../lib/types";

export type ColorEntryModalMode = "add" | "edit";

type ColorEntryModalProps = {
  open: boolean;
  mode: ColorEntryModalMode;
  entry: ColorEntry | null;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: ColorEntry) => void;
};

function createDraft(mode: ColorEntryModalMode, entry: ColorEntry | null): ColorEntry {
  if (mode === "edit" && entry) return { ...entry };
  return {
    id: crypto.randomUUID(),
    name: "",
    subtitle: "",
    baseColor: "#FF5532",
  };
}

export function ColorEntryModal({
  open,
  mode,
  entry,
  onOpenChange,
  onSave,
}: ColorEntryModalProps) {
  const [draft, setDraft] = useState<ColorEntry>(() => createDraft(mode, entry));

  useEffect(() => {
    if (open) {
      setDraft(createDraft(mode, entry));
    }
  }, [open, mode, entry]);

  const canSave = draft.name.trim().length > 0 && draft.subtitle.trim().length > 0;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeaderText
          title={mode === "add" ? "添加颜色" : "编辑颜色"}
          description="设置名称、分类与基础色值。"
        />
        <ModalBody>
          <div className="colorcat-modal-form">
            <FormField label="名称">
              <Input
                value={draft.name}
                placeholder="Primary"
                onChange={(event) =>
                  setDraft((current) => ({ ...current, name: event.target.value }))
                }
              />
            </FormField>
            <FormField label="分类 / 副标题">
              <Input
                value={draft.subtitle}
                placeholder="主题色"
                onChange={(event) =>
                  setDraft((current) => ({ ...current, subtitle: event.target.value }))
                }
              />
            </FormField>
            <div className="colorcat-modal-form__row">
              <span className="colorcat-modal-form__label">基础颜色</span>
              <ColorPicker
                value={draft.baseColor}
                onChange={(next) => setDraft((current) => ({ ...current, baseColor: next }))}
              >
                <ColorPickerTrigger className="w-full max-w-xs" />
                <ColorPickerContent />
              </ColorPicker>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button mode="second" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            mode="primary"
            disabled={!canSave}
            onClick={() => {
              onSave({
                ...draft,
                name: draft.name.trim(),
                subtitle: draft.subtitle.trim(),
              });
              onOpenChange(false);
            }}
          >
            保存
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
