import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Cascader,
  CascaderColumn,
  CascaderContent,
  CascaderField,
  CascaderItem,
  CascaderItemGroup,
  CascaderMenu,
  CascaderOptionsMenu,
  CascaderTrigger,
  type CascaderOption,
  type CascaderSize,
} from "./cascader";

const meta: Meta<typeof Cascader> = {
  title: "Information Collect/Cascader",
  component: Cascader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Cascader>;

const regionOptions: CascaderOption[] = [
  {
    value: "china",
    label: "中国",
    children: [
      {
        value: "hainan",
        label: "海南省",
        children: [
          { value: "haikou", label: "海口市" },
          { value: "sanya", label: "三亚市" },
        ],
      },
      {
        value: "guangdong",
        label: "广东省",
        children: [
          { value: "guangzhou", label: "广州市" },
          { value: "shenzhen", label: "深圳市" },
        ],
      },
    ],
  },
  {
    value: "usa",
    label: "美国",
    children: [
      {
        value: "ca",
        label: "加利福尼亚州",
        children: [
          { value: "sf", label: "旧金山" },
          { value: "la", label: "洛杉矶" },
        ],
      },
    ],
  },
];

function CascaderDemo({
  size = "regular",
  allRound = false,
  placeholder = "请选择所在地区",
  defaultValue,
  defaultOpen = false,
  error = false,
  className = "w-[290px]",
}: {
  size?: CascaderSize;
  allRound?: boolean;
  placeholder?: string;
  defaultValue?: string[];
  defaultOpen?: boolean;
  error?: boolean;
  className?: string;
}) {
  return (
    <CascaderField
      options={regionOptions}
      defaultValue={defaultValue}
      defaultOpen={defaultOpen}
      size={size}
      allRound={allRound}
      placeholder={placeholder}
      error={error}
      leftIcon={<GeneralSetting aria-hidden />}
      rightIcon={<GeneralSetting aria-hidden />}
      className={className}
    />
  );
}

/** Figma Cascader Input — Input State=Empty (`345:11819`). */
export const Empty: Story = {
  render: () => <CascaderDemo />,
};

/** Figma Cascader Input — Input State=Fill (`345:11893`). */
export const Filled: Story = {
  render: () => <CascaderDemo defaultValue={["china", "hainan", "haikou"]} />,
};

/** Figma Cascader Input — Size=Big (`345:11782`). */
export const Big: Story = {
  render: () => (
    <CascaderDemo size="big" defaultValue={["china", "hainan", "haikou"]} className="w-[300px]" />
  ),
};

/** Figma Cascader Input — All-Round=ON (`345:12115`). */
export const AllRound: Story = {
  render: () => (
    <CascaderDemo allRound defaultValue={["china", "guangdong", "guangzhou"]} />
  ),
};

/** Figma Cascader — open panel with multi-column menu (`498:72783`). */
export const OpenPanel: Story = {
  render: () => (
    <CascaderDemo defaultOpen defaultValue={["china", "hainan", "haikou"]} />
  ),
};

/** Figma Cascader Input — State=Disable (`345:11967`). */
export const Disabled: Story = {
  render: () => (
    <CascaderField
      options={regionOptions}
      defaultValue={["china", "hainan", "haikou"]}
      disabled
      leftIcon={<GeneralSetting aria-hidden />}
      rightIcon={<GeneralSetting aria-hidden />}
      className="w-[290px]"
    />
  ),
};

/** Figma Cascader Input — error border (matches Select error pattern). */
export const Error: Story = {
  render: () => (
    <CascaderDemo defaultValue={["china", "hainan", "sanya"]} error />
  ),
};

/** Multi-level cascade — parent selection allowed at any level (Figma default). */
export const AnyLevelSelect: Story = {
  render: () => (
    <CascaderField
      options={regionOptions}
      defaultOpen
      defaultValue={["china", "hainan"]}
      changeOnSelect
      leftIcon={<GeneralSetting aria-hidden />}
      className="w-[290px]"
    />
  ),
};

/** Compound composition — manual columns matching Figma menu structure. */
export const CompoundMenu: Story = {
  render: () => (
    <Cascader defaultOpen defaultValue={["a", "a2"]}>
      <CascaderTrigger
        placeholder="请选择产品型号"
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <CascaderContent>
        <CascaderMenu>
          <CascaderColumn>
            <CascaderItemGroup label="业务线" showDivider>
              <CascaderItem value="a" pathPrefix={[]} hasChildren>
                服务器产品线
              </CascaderItem>
              <CascaderItem value="b" pathPrefix={[]} hasChildren>
                存储产品线
              </CascaderItem>
              <CascaderItem value="c" pathPrefix={[]}>
                网络产品线
              </CascaderItem>
            </CascaderItemGroup>
            <CascaderItemGroup label="其他" showDivider>
              <CascaderItem value="d" pathPrefix={[]}>
                未分类产品
              </CascaderItem>
            </CascaderItemGroup>
          </CascaderColumn>
          <CascaderColumn>
            <CascaderItemGroup label="子产品线" showDivider>
              <CascaderItem value="a1" pathPrefix={["a"]}>
                通用服务器
              </CascaderItem>
              <CascaderItem value="a2" pathPrefix={["a"]} hasChildren>
                AI 服务器
              </CascaderItem>
            </CascaderItemGroup>
          </CascaderColumn>
          <CascaderColumn>
            <CascaderItemGroup label="型号" showDivider>
              <CascaderItem value="a2x" pathPrefix={["a", "a2"]}>
                AI-100 训练机型
              </CascaderItem>
              <CascaderItem value="a2y" pathPrefix={["a", "a2"]}>
                AI-200 推理机型
              </CascaderItem>
            </CascaderItemGroup>
          </CascaderColumn>
        </CascaderMenu>
      </CascaderContent>
    </Cascader>
  ),
};

/** Figma Cascader Menu Item function variants (`345:12487`). */
export const ItemFunctionVariants: Story = {
  render: () => (
    <div className="w-[200px] rounded-[10px] border border-[var(--select-menu-border)] bg-[var(--select-menu-bg)] p-1.5 shadow-[var(--select-menu-shadow)]">
      <Cascader defaultOpen defaultValue={["selected"]}>
        <CascaderItemGroup label="选项类型" showDivider>
          <CascaderItem value="title" layout="title">
            分组标题
          </CascaderItem>
          <CascaderItem value="simple" pathPrefix={[]} hasChildren>
            Simple Item
          </CascaderItem>
          <CascaderItem value="selected" pathPrefix={[]} hasChildren>
            Selected
          </CascaderItem>
          <CascaderItem value="radio" pathPrefix={[]} itemFunction="radio">
            Radio
          </CascaderItem>
          <CascaderItem value="checkbox" pathPrefix={[]} itemFunction="checkbox">
            Checkbox
          </CascaderItem>
          <CascaderItem value="form-radio" pathPrefix={[]} itemFunction="form-radio">
            Form Radio
          </CascaderItem>
          <CascaderItem value="form-checkbox" pathPrefix={[]} itemFunction="form-checkbox">
            Form Checkbox
          </CascaderItem>
        </CascaderItemGroup>
      </Cascader>
    </div>
  ),
};

/** Multi-group column — last group auto-hides divider; columns hug content width. */
export const GroupDividerAndHugWidth: Story = {
  render: () => (
    <Cascader defaultOpen>
      <CascaderTrigger placeholder="请选择所在地区" className="w-[290px]" />
      <CascaderContent>
        <CascaderMenu>
          <CascaderColumn>
            <CascaderItemGroup label="地区">
              <CascaderItem value="short" pathPrefix={[]} hasChildren>
                华南
              </CascaderItem>
              <CascaderItem value="long" pathPrefix={[]} hasChildren>
                粤港澳大湾区综合服务区
              </CascaderItem>
            </CascaderItemGroup>
            <CascaderItemGroup label="其他">
              <CascaderItem value="leaf" pathPrefix={[]}>
                海外节点
              </CascaderItem>
            </CascaderItemGroup>
          </CascaderColumn>
        </CascaderMenu>
      </CascaderContent>
    </Cascader>
  ),
};

/** Options-driven three-level demo with an opt-in column group header (`groupTitle`). */
export const MultiLevel: Story = {
  render: () => (
    <Cascader options={regionOptions} defaultOpen defaultValue={["china", "hainan", "haikou"]}>
      <CascaderTrigger
        placeholder="请选择所在地区"
        leftIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <CascaderContent>
        <CascaderOptionsMenu groupTitle="地区" />
      </CascaderContent>
    </Cascader>
  ),
};

/** Region cascader — open and hover/click parents to preview column expand animation. */
export const ColumnExpandAnimation: Story = {
  render: () => (
    <CascaderField
      options={regionOptions}
      placeholder="请选择所在地区"
      leftIcon={<GeneralSetting aria-hidden />}
      className="w-[290px]"
    />
  ),
};
