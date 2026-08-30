import {
  AIAiPersona,
  AIIntelligent,
  DevelopTerminal,
  SymbolApps,
  SymbolWrong,
} from "@aviala-design/icons";
import {
  Button,
  Card,
  CardHead,
  CascaderField,
  Link,
  Modal,
  ModalClose,
  ModalContent,
  ModalTitle,
  ModalTrigger,
  Navigation,
  NavigationBrand,
  NavigationBrandTitle,
  NavigationGroup,
  NavigationItem,
  Stack,
  Typeface,
  Typography,
  type CascaderOption,
} from "@aviala-design/spiral";
import { useState, type ReactNode } from "react";

type NavId = "agents" | "skills" | "models" | "tools";

const NAV_ITEMS: { id: NavId; label: string; icon: ReactNode }[] = [
  { id: "agents", label: "Agents", icon: <AIAiPersona aria-hidden /> },
  { id: "skills", label: "技能", icon: <SymbolApps aria-hidden /> },
  { id: "models", label: "模型", icon: <AIIntelligent aria-hidden /> },
  { id: "tools", label: "工具", icon: <DevelopTerminal aria-hidden /> },
];

const MODEL_OPTIONS: CascaderOption[] = [
  {
    value: "auto",
    label: "自动匹配模型",
  },
  {
    value: "manual",
    label: "手动指定",
    children: [
      { value: "fast-lite", label: "Fast Lite" },
      { value: "think-pro", label: "Think Pro" },
      { value: "omni", label: "Omni" },
    ],
  },
];

const TASK_ROWS: {
  id: "fast" | "think" | "omni";
  title: string;
  description: string;
}[] = [
  {
    id: "fast",
    title: "快速任务",
    description: "响应快、消耗低，适合搜索和信息检索",
  },
  {
    id: "think",
    title: "思考任务",
    description: "深度分析和复杂推理，适合方案评估和代码审查",
  },
  {
    id: "omni",
    title: "综合任务",
    description: "综合能力最强，适合端到端规划和编码",
  },
];

function ModelTaskRow({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description: string;
  value: string[];
  onValueChange: (value: string[], selectedOptions?: CascaderOption[]) => void;
}) {
  return (
    <Card className="w-full border border-[var(--border-border-normal-1,#f0efef)]">
      <CardHead
        slotType="select"
        icon={false}
        title={title}
        description={description}
        select={
          <CascaderField
            className="w-[200px]"
            options={MODEL_OPTIONS}
            value={value}
            onValueChange={onValueChange}
            leftIcon={<AIIntelligent aria-hidden />}
            placeholder="选择模型"
            changeOnSelect
          />
        }
      />
    </Card>
  );
}

export function ModelManagementModalDemo() {
  const [navId, setNavId] = useState<NavId>("models");
  const [fastModel, setFastModel] = useState<string[]>(["auto"]);
  const [thinkModel, setThinkModel] = useState<string[]>(["auto"]);
  const [omniModel, setOmniModel] = useState<string[]>(["auto"]);

  const modelValues = {
    fast: { value: fastModel, onValueChange: setFastModel },
    think: { value: thinkModel, onValueChange: setThinkModel },
    omni: { value: omniModel, onValueChange: setOmniModel },
  } as const;

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Modal — 模型管理</h2>
      <p className="mb-3 text-sm text-muted-foreground">
        侧栏 Navigation + Typeface / Card / Cascader
        组合示例（尽量还原产品管理弹窗）。
      </p>

      <Modal>
        <ModalTrigger asChild>
          <Button mode="primary">打开模型管理</Button>
        </ModalTrigger>

        <ModalContent
          size="large"
          className="[--modal-content-width-large:760px]"
          aria-describedby={undefined}
        >
          {/* Custom shell: sidebar + content (no full-width ModalHeader — matches product layout) */}
          <div className="flex min-h-[440px] flex-1 overflow-hidden rounded-[inherit]">
            <aside className="flex w-[168px] shrink-0 flex-col gap-[var(--gap-content-space,10px)] border-r border-[var(--border-border-normal-1,#f0efef)] bg-[var(--control-control-normal-lightbackground-1,#f0efef)] p-[var(--padding-default,8px)]">
              <Navigation
                direction="vertical"
                background="none"
                className="w-full"
              >
                <NavigationBrand>
                  <NavigationBrandTitle
                    href="#"
                    onClick={(event) => event.preventDefault()}
                  >
                    管理
                  </NavigationBrandTitle>
                </NavigationBrand>
                <NavigationGroup>
                  {NAV_ITEMS.map((item) => (
                    <NavigationItem
                      key={item.id}
                      active={navId === item.id}
                      leftIcon={item.icon}
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setNavId(item.id);
                      }}
                    >
                      {item.label}
                    </NavigationItem>
                  ))}
                </NavigationGroup>
              </Navigation>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col bg-[var(--box-box-normal-background-whiteonly,#ffffff)]">
              <div className="flex items-start gap-[var(--gap-content-space,10px)] px-[var(--padding-big,14px)] pt-[var(--padding-big,14px)] pb-[var(--padding-default,8px)]">
                <div className="min-w-0 flex-1">
                  <ModalTitle className="sr-only">模型管理</ModalTitle>
                  <Typeface
                    content="textTitle"
                    primary="模型"
                    secondary={
                      <span>
                        系统按任务特征将模型分为以下几种，每组默认自动匹配模型，也可按需切换为手动指定。
                        <Link
                          href="#"
                          level="caption"
                          mode="noBackground"
                          className="ml-1 inline align-baseline"
                          onClick={(event) => event.preventDefault()}
                        >
                          帮助文档
                        </Link>
                      </span>
                    }
                  />
                </div>
                <ModalClose asChild>
                  <Button
                    type="button"
                    mode="noBackgroundCustom"
                    iconOnly
                    aria-label="关闭"
                    className="aviala-modal__close shrink-0"
                    leftIcon={<SymbolWrong aria-hidden />}
                  />
                </ModalClose>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-[var(--gap-component-space,8px)] overflow-auto px-[var(--padding-big,14px)] pb-[var(--padding-big,14px)]">
                {navId === "models" ? (
                  TASK_ROWS.map((row) => (
                    <ModelTaskRow
                      key={row.id}
                      title={row.title}
                      description={row.description}
                      value={modelValues[row.id].value}
                      onValueChange={modelValues[row.id].onValueChange}
                    />
                  ))
                ) : (
                  <Stack
                    gap="content"
                    className="rounded-[var(--border-radius-big,12px)] border border-[var(--border-border-normal-1,#f0efef)] p-[var(--padding-big,14px)]"
                  >
                    <Typography level="subtitle">
                      {NAV_ITEMS.find((item) => item.id === navId)?.label}
                    </Typography>
                    <Typography level="caption" tone="default">
                      此分区为布局占位，当前示例聚焦「模型」页内容。
                    </Typography>
                  </Stack>
                )}
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </section>
  );
}
