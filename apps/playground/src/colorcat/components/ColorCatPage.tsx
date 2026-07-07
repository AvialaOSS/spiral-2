import { EditAddMore, GeneralDownload } from "@aviala/icons";
import {
  Button,
  Link,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  Typography,
  useTheme,
} from "@aviala/spiral";
import { useEffect, useMemo, useState } from "react";
import {
  buildExportPayload,
  downloadTextFile,
  exportAsCssVariables,
  exportAsJson,
} from "../lib/export-palettes";
import { INITIAL_COLOR_ENTRIES } from "../lib/initial-colors";
import { generatePaletteSteps } from "../lib/palette";
import type { ColorEntry, ColorFormat } from "../lib/types";
import { ColorCard } from "./ColorCard";
import { ColorEntryModal, type ColorEntryModalMode } from "./ColorEntryModal";
import "../colorcat.css";

const FORMAT_OPTIONS: { value: ColorFormat; label: string }[] = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "oklch", label: "OKLCH" },
];

export function ColorCatPage() {
  const { applyPreset, setPrimaryColor } = useTheme();
  const [entries, setEntries] = useState<ColorEntry[]>(INITIAL_COLOR_ENTRIES);
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ColorEntryModalMode>("add");
  const [editingEntry, setEditingEntry] = useState<ColorEntry | null>(null);

  useEffect(() => {
    applyPreset("default");
  }, [applyPreset]);

  const primaryEntry = entries.find((entry) => entry.id === "primary") ?? entries[0];

  useEffect(() => {
    if (primaryEntry) {
      setPrimaryColor(primaryEntry.baseColor);
    }
  }, [primaryEntry, setPrimaryColor]);

  const palettesById = useMemo(() => {
    const map: Record<string, { light: ReturnType<typeof generatePaletteSteps>; dark: ReturnType<typeof generatePaletteSteps> }> = {};
    for (const entry of entries) {
      map[entry.id] = {
        light: generatePaletteSteps(entry.baseColor, "light"),
        dark: generatePaletteSteps(entry.baseColor, "dark"),
      };
    }
    return map;
  }, [entries]);

  const openAddModal = () => {
    setModalMode("add");
    setEditingEntry(null);
    setModalOpen(true);
  };

  const openEditModal = (entry: ColorEntry) => {
    setModalMode("edit");
    setEditingEntry(entry);
    setModalOpen(true);
  };

  const handleSaveEntry = (entry: ColorEntry) => {
    setEntries((current) => {
      const index = current.findIndex((item) => item.id === entry.id);
      if (index === -1) return [...current, entry];
      const next = [...current];
      next[index] = { ...current[index], ...entry, isDefault: current[index]?.isDefault };
      return next;
    });
  };

  const handleDeleteEntry = (entry: ColorEntry) => {
    if (entry.isDefault) return;
    setEntries((current) => current.filter((item) => item.id !== entry.id));
  };

  const handleExport = () => {
    const payload = buildExportPayload(entries, palettesById);
    const json = exportAsJson(payload);
    downloadTextFile("colorcat-palettes.json", json, "application/json");
    downloadTextFile("colorcat-palettes.css", exportAsCssVariables(payload), "text/css");
  };

  return (
    <div className="colorcat-page">
      <div className="colorcat-shell">
        <header className="colorcat-header">
          <Typography level="title" className="font-semibold">
            ColorCat
          </Typography>
          <div className="colorcat-header__actions">
            <Select value={format} onValueChange={(value) => setFormat(value as ColorFormat)}>
              <SelectTrigger placeholder="HEX" className="w-[96px]" />
              <SelectContent>
                <SelectItemGroup>
                  {FORMAT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectItemGroup>
              </SelectContent>
            </Select>
            <Button
              mode="default"
              size="regular"
              iconOnly
              leftIcon={<GeneralDownload aria-hidden />}
              aria-label="Export palettes"
              onClick={handleExport}
            />
            <Button mode="primary" leftIcon={<EditAddMore aria-hidden />} onClick={openAddModal}>
              添加颜色
            </Button>
          </div>
        </header>

        <div className="colorcat-body">
          {entries.map((entry) => (
            <ColorCard
              key={entry.id}
              entry={entry}
              format={format}
              onEdit={openEditModal}
              onDelete={handleDeleteEntry}
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-4 left-4">
        <Link href="/" level="caption" mode="noBackgroundCustom">
          ← Back to Playground
        </Link>
      </div>

      <ColorEntryModal
        open={modalOpen}
        mode={modalMode}
        entry={editingEntry}
        onOpenChange={setModalOpen}
        onSave={handleSaveEntry}
      />
    </div>
  );
}
