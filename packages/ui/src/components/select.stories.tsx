import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemPeople,
  SelectSubItem,
  SelectSubMenu,
  SelectTrigger,
  type SelectItemFunction,
  type SelectItemLayout,
  type SelectSize,
} from "./select";

const meta: Meta<typeof Select> = {
  title: "Information Collect/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Select>;

function SelectDemo({
  size = "regular",
  allRound = false,
  placeholder = "Text",
  defaultValue,
}: {
  size?: SelectSize;
  allRound?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <Select defaultValue={defaultValue}>
      <SelectTrigger
        size={size}
        allRound={allRound}
        placeholder={placeholder}
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <SelectContent>
        <SelectItemGroup label="Title" showDivider>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectItemGroup>
        <SelectItemGroup label="Title">
          <SelectItem value="c">Option C</SelectItem>
          <SelectItem value="d">Option D</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  );
}

export const Empty: Story = {
  render: () => <SelectDemo />,
};

export const Filled: Story = {
  render: () => <SelectDemo defaultValue="a" />,
};

export const Big: Story = {
  render: () => <SelectDemo size="big" defaultValue="b" />,
};

export const AllRound: Story = {
  render: () => <SelectDemo allRound defaultValue="c" />,
};

/**
 * Figma Select Menu Item Group — showTitle=true (`276:6234`).
 * QA: stays open when clicking DevTools; closes on one outside click, Escape, or item select.
 */
export const MenuWithTitle: Story = {
  render: () => (
    <Select defaultOpen defaultValue="a">
      <SelectTrigger
        placeholder="Text"
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <SelectContent>
        <SelectItemGroup label="Title" showDivider>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectItemGroup>
        <SelectItemGroup label="Title">
          <SelectItem value="c">Option C</SelectItem>
          <SelectItem value="d">Option D</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Figma Select Menu Item Group — showTitle=false (no label row) */
export const MenuNoTitle: Story = {
  render: () => (
    <Select defaultOpen defaultValue="a">
      <SelectTrigger
        placeholder="Text"
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <SelectContent>
        <SelectItemGroup showDivider>
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectItemGroup>
        <SelectItemGroup>
          <SelectItem value="c">Option C</SelectItem>
          <SelectItem value="d">Option D</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select defaultValue="a" disabled>
      <SelectTrigger
        placeholder="Text"
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-[290px]"
      />
      <SelectContent>
        <SelectItemGroup>
          <SelectItem value="a">Option A</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Figma Action Item with icons, badge, and MoreFunction */
export const ActionItemVariants: Story = {
  render: () => (
    <Select defaultOpen defaultValue="action">
      <SelectTrigger placeholder="Action items" className="w-[290px]" />
      <SelectContent>
        <SelectItemGroup>
          <SelectItem value="action" showLeftIcon leftIcon={<GeneralSetting aria-hidden />}>
            Default action
          </SelectItem>
          <SelectItem
            value="rich"
            showLeftIcon
            leftIcon={<GeneralSetting aria-hidden />}
            showRightIcon
            rightIcon={<GeneralSetting aria-hidden />}
            showBadge
            badge="New"
            showMoreFunction
            moreAction={<span className="text-[length:var(--size-regular,18px)] text-[var(--select-item-selected-fg)]">More</span>}
          >
            With slots
          </SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Figma Function=Radio / Form-Radio / CheckBox / Form-CheckBox */
export const FormControlItems: Story = {
  render: () => (
    <Select defaultOpen defaultValue="radio-trail">
      <SelectTrigger placeholder="Form controls" className="w-[290px]" />
      <SelectContent>
        <SelectItemGroup label="Trailing">
          <SelectItem value="radio-trail" itemFunction="radio">
            Radio
          </SelectItem>
          <SelectItem value="checkbox-trail" itemFunction="checkbox">
            CheckBox
          </SelectItem>
        </SelectItemGroup>
        <SelectItemGroup label="Leading">
          <SelectItem value="form-radio" itemFunction="form-radio">
            Form-Radio
          </SelectItem>
          <SelectItem value="form-checkbox" itemFunction="form-checkbox">
            Form-CheckBox
          </SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Figma Type=Checked — hides function icon when selected */
export const CheckedLayout: Story = {
  render: () => (
    <Select defaultOpen defaultValue="checked">
      <SelectTrigger placeholder="Checked layout" className="w-[290px]" />
      <SelectContent>
        <SelectItemGroup>
          <SelectItem value="checked" layout="checked" itemFunction="simple">
            Selected item
          </SelectItem>
          <SelectItem value="other" layout="checked" itemFunction="simple">
            Other item
          </SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Figma Type=People with optional form controls */
export const PeopleItems: Story = {
  render: () => (
    <Select defaultOpen defaultValue="people-action">
      <SelectTrigger placeholder="People" className="w-[290px]" />
      <SelectContent>
        <SelectItemGroup>
          <SelectItemPeople value="people-action" subtitle="Design">
            Alex Chen
          </SelectItemPeople>
          <SelectItemPeople value="people-radio" itemFunction="radio" subtitle="Engineering">
            Sam Rivera
          </SelectItemPeople>
          <SelectItemPeople value="people-form-radio" itemFunction="form-radio" subtitle="Product">
            Jordan Lee
          </SelectItemPeople>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Figma Type=Title row inside a group */
export const TitleRow: Story = {
  render: () => (
    <Select defaultOpen defaultValue="row">
      <SelectTrigger placeholder="Title row" className="w-[290px]" />
      <SelectContent>
        <SelectItemGroup>
          <SelectItem value="title" layout="title" itemFunction="simple" showFunctionIcon={false}>
            Section title
          </SelectItem>
          <SelectItem value="row">Default row</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};

/** Matrix of Function × Layout for visual QA */
export const ItemVariantMatrix: Story = {
  render: () => {
    const functions: SelectItemFunction[] = [
      "action",
      "radio",
      "checkbox",
      "form-radio",
      "form-checkbox",
    ];
    const layouts: SelectItemLayout[] = ["default", "people"];

    return (
      <Select defaultOpen defaultValue="action-default">
        <SelectTrigger placeholder="Matrix" className="w-[290px]" />
        <SelectContent className="max-h-[480px]">
          {layouts.map((layout) => (
            <SelectItemGroup key={layout} label={layout} showDivider>
              {functions.map((itemFunction) => {
                const value = `${itemFunction}-${layout}`;
                const Item = layout === "people" ? SelectItemPeople : SelectItem;
                return (
                  <Item
                    key={value}
                    value={value}
                    itemFunction={itemFunction}
                    layout={layout === "people" ? "people" : "default"}
                    subtitle={layout === "people" ? "Caption" : undefined}
                  >
                    {itemFunction}
                  </Item>
                );
              })}
            </SelectItemGroup>
          ))}
        </SelectContent>
      </Select>
    );
  },
};

/**
 * Figma Select Menu Item with nested sub-menu flyout.
 * Hover parent to open; panel is vertically centered, 8px to the right (flips left on collision).
 */
export const NestedSubMenu: Story = {
  render: () => (
    <Select defaultOpen defaultValue="leaf-a">
      <SelectTrigger placeholder="Nested sub-menu" className="w-[290px]" />
      <SelectContent>
        <SelectItemGroup label="Actions">
          <SelectSubItem itemFunction="action">
            More options
            <SelectSubMenu>
              <SelectItemGroup label="Sub group">
                <SelectItem value="leaf-a">Sub option A</SelectItem>
                <SelectItem value="leaf-b">Sub option B</SelectItem>
              </SelectItemGroup>
              <SelectItemGroup label="More">
                <SelectItem value="leaf-c">Sub option C</SelectItem>
              </SelectItemGroup>
            </SelectSubMenu>
          </SelectSubItem>
          <SelectItem value="simple">Simple option</SelectItem>
        </SelectItemGroup>
        <SelectItemGroup label="Regions" showDivider>
          <SelectSubItem itemFunction="action" showLeftIcon leftIcon={<GeneralSetting aria-hidden />}>
            Settings
            <SelectSubMenu>
              <SelectItemGroup>
                <SelectItem value="pref-a">Preference A</SelectItem>
                <SelectItem value="pref-b">Preference B</SelectItem>
              </SelectItemGroup>
            </SelectSubMenu>
          </SelectSubItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  ),
};
