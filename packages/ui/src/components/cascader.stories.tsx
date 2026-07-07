import { GeneralSetting } from "@aviala/icons";
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
    label: "China",
    children: [
      {
        value: "hainan",
        label: "Hainan",
        children: [
          { value: "haikou", label: "Haikou" },
          { value: "sanya", label: "Sanya" },
        ],
      },
      {
        value: "guangdong",
        label: "Guangdong",
        children: [
          { value: "guangzhou", label: "Guangzhou" },
          { value: "shenzhen", label: "Shenzhen" },
        ],
      },
    ],
  },
  {
    value: "usa",
    label: "United States",
    children: [
      {
        value: "ca",
        label: "California",
        children: [
          { value: "sf", label: "San Francisco" },
          { value: "la", label: "Los Angeles" },
        ],
      },
    ],
  },
];

function CascaderDemo({
  size = "regular",
  allRound = false,
  placeholder = "Text",
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
        placeholder="Text"
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <CascaderContent>
        <CascaderMenu>
          <CascaderColumn>
            <CascaderItemGroup label="Title" showDivider>
              <CascaderItem value="a" pathPrefix={[]} hasChildren>
                Group A
              </CascaderItem>
              <CascaderItem value="b" pathPrefix={[]} hasChildren>
                Group B
              </CascaderItem>
              <CascaderItem value="c" pathPrefix={[]}>
                Leaf C
              </CascaderItem>
            </CascaderItemGroup>
            <CascaderItemGroup label="Title" showDivider>
              <CascaderItem value="d" pathPrefix={[]}>
                Leaf D
              </CascaderItem>
            </CascaderItemGroup>
          </CascaderColumn>
          <CascaderColumn>
            <CascaderItemGroup label="Title" showDivider>
              <CascaderItem value="a1" pathPrefix={["a"]}>
                Item A1
              </CascaderItem>
              <CascaderItem value="a2" pathPrefix={["a"]} hasChildren>
                Item A2
              </CascaderItem>
            </CascaderItemGroup>
          </CascaderColumn>
          <CascaderColumn>
            <CascaderItemGroup label="Title" showDivider>
              <CascaderItem value="a2x" pathPrefix={["a", "a2"]}>
                Item A2X
              </CascaderItem>
              <CascaderItem value="a2y" pathPrefix={["a", "a2"]}>
                Item A2Y
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
        <CascaderItemGroup label="Title" showDivider>
          <CascaderItem value="title" layout="title">
            Title
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
      <CascaderTrigger placeholder="Text" className="w-[290px]" />
      <CascaderContent>
        <CascaderMenu>
          <CascaderColumn>
            <CascaderItemGroup label="Regions">
              <CascaderItem value="short" pathPrefix={[]} hasChildren>
                Short
              </CascaderItem>
              <CascaderItem value="long" pathPrefix={[]} hasChildren>
                A much longer region label
              </CascaderItem>
            </CascaderItemGroup>
            <CascaderItemGroup label="Other">
              <CascaderItem value="leaf" pathPrefix={[]}>
                Leaf item
              </CascaderItem>
            </CascaderItemGroup>
          </CascaderColumn>
        </CascaderMenu>
      </CascaderContent>
    </Cascader>
  ),
};

/** Options-driven three-level demo — expand parent items to see column slide-in. */
export const MultiLevel: Story = {
  render: () => (
    <Cascader options={regionOptions} defaultOpen defaultValue={["china", "hainan", "haikou"]}>
      <CascaderTrigger
        placeholder="Text"
        leftIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <CascaderContent>
        <CascaderOptionsMenu />
      </CascaderContent>
    </Cascader>
  ),
};

/** Region cascader — open and hover/click parents to preview column expand animation. */
export const ColumnExpandAnimation: Story = {
  render: () => (
    <CascaderField
      options={regionOptions}
      placeholder="Select region"
      leftIcon={<GeneralSetting aria-hidden />}
      className="w-[290px]"
    />
  ),
};
