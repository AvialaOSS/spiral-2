import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Typography } from "@aviala/spiral";
import { DocLayout } from "./components/DocLayout";
import { AlertDocPage } from "./pages/components/AlertDocPage";
import { AnchorDocPage } from "./pages/components/AnchorDocPage";
import { ButtonDocPage } from "./pages/components/ButtonDocPage";
import { CascaderDocPage } from "./pages/components/CascaderDocPage";
import { CheckboxDocPage } from "./pages/components/CheckboxDocPage";
import { ColorPickerDocPage } from "./pages/components/ColorPickerDocPage";
import { DatePickerDocPage } from "./pages/components/DatePickerDocPage";
import { TimePickerDocPage } from "./pages/components/TimePickerDocPage";
import { FeedbackDocPage } from "./pages/components/FeedbackDocPage";
import { FormFieldDocPage } from "./pages/components/FormFieldDocPage";
import { InputDocPage } from "./pages/components/InputDocPage";
import { LinkDocPage } from "./pages/components/LinkDocPage";
import { ListDocPage } from "./pages/components/ListDocPage";
import { LoadingDocPage } from "./pages/components/LoadingDocPage";
import { ModalDocPage } from "./pages/components/ModalDocPage";
import { NavigationDocPage } from "./pages/components/NavigationDocPage";
import { PopoverDocPage } from "./pages/components/PopoverDocPage";
import { RadioDocPage } from "./pages/components/RadioDocPage";
import { SegmentatorDocPage } from "./pages/components/SegmentatorDocPage";
import { SelectDocPage } from "./pages/components/SelectDocPage";
import { SwitchDocPage } from "./pages/components/SwitchDocPage";
import { TextareaDocPage } from "./pages/components/TextareaDocPage";
import { TooltipDocPage } from "./pages/components/TooltipDocPage";
import { TypefaceDocPage } from "./pages/components/TypefaceDocPage";
import { TypographyDocPage } from "./pages/components/TypographyDocPage";
import { InstallationPage } from "./pages/guides/InstallationPage";
import { IntroductionPage } from "./pages/guides/IntroductionPage";
import { ThemePage } from "./pages/guides/ThemePage";
import { DebuggerPage } from "./pages/reference/DebuggerPage";
import { IconSyncDocPage } from "./pages/reference/IconSyncDocPage";

const IconsDocPage = lazy(() =>
  import("./pages/reference/IconsDocPage").then((module) => ({ default: module.IconsDocPage }))
);

const IconsPlaygroundPage = lazy(() =>
  import("./pages/reference/IconsPlaygroundPage").then((module) => ({
    default: module.IconsPlaygroundPage,
  }))
);

function IconsPageFallback() {
  return (
    <Typography level="text" as="p" className="docs-page-description">
      加载图标库…
    </Typography>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DocLayout />}>
        <Route index element={<Navigate to="/start/introduction" replace />} />
        <Route path="start/introduction" element={<IntroductionPage />} />
        <Route path="start/installation" element={<InstallationPage />} />
        <Route path="start/theme" element={<ThemePage />} />
        <Route
          path="reference/icons"
          element={
            <Suspense fallback={<IconsPageFallback />}>
              <IconsDocPage />
            </Suspense>
          }
        />
        <Route
          path="reference/icons/playground"
          element={
            <Suspense fallback={<IconsPageFallback />}>
              <IconsPlaygroundPage />
            </Suspense>
          }
        />
        <Route path="icon-sync" element={<IconSyncDocPage />} />
        <Route path="reference/icon-sync" element={<IconSyncDocPage />} />
        <Route path="reference/debugger" element={<DebuggerPage />} />
        <Route path="components/basic-input/button" element={<ButtonDocPage />} />
        <Route path="components/basic-input/input" element={<InputDocPage />} />
        <Route path="components/basic-input/segmentator" element={<SegmentatorDocPage />} />
        <Route path="components/basic-input/switch" element={<SwitchDocPage />} />
        <Route path="components/basic-input/link" element={<LinkDocPage />} />
        <Route path="components/information-collect/select" element={<SelectDocPage />} />
        <Route path="components/information-collect/date-picker" element={<DatePickerDocPage />} />
        <Route path="components/information-collect/time-picker" element={<TimePickerDocPage />} />
        <Route path="components/information-collect/textarea" element={<TextareaDocPage />} />
        <Route path="components/information-collect/checkbox" element={<CheckboxDocPage />} />
        <Route path="components/information-collect/radio" element={<RadioDocPage />} />
        <Route path="components/information-collect/cascader" element={<CascaderDocPage />} />
        <Route path="components/information-collect/color-picker" element={<ColorPickerDocPage />} />
        <Route path="components/structure-navigation/navigation" element={<NavigationDocPage />} />
        <Route path="components/structure-navigation/list" element={<ListDocPage />} />
        <Route path="components/information-display/modal" element={<ModalDocPage />} />
        <Route path="components/system-composition/typography" element={<TypographyDocPage />} />
        <Route path="components/system-composition/typeface" element={<TypefaceDocPage />} />
        <Route path="components/system-composition/form-field" element={<FormFieldDocPage />} />
        <Route path="components/system-composition/anchor" element={<AnchorDocPage />} />
        <Route path="components/system-composition/popover" element={<PopoverDocPage />} />
        <Route path="components/system-composition/tooltip" element={<TooltipDocPage />} />
        <Route path="components/system-composition/loading" element={<LoadingDocPage />} />
        <Route path="components/feedback/alert" element={<AlertDocPage />} />
        <Route path="components/feedback/feedback" element={<FeedbackDocPage />} />
        <Route path="*" element={<Navigate to="/start/introduction" replace />} />
      </Route>
    </Routes>
  );
}
