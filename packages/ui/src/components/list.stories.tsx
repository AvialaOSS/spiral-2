import { GeneralSetting } from "@aviala-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
} from "./select";
import {
  List,
  ListItem,
  ListItemGroup,
  ListSeparator,
  type ListItemLeading,
  type ListItemType,
} from "./list";

const meta: Meta<typeof List> = {
  title: "Structure Navigation/List",
  component: List,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof List>;

function DemoSelect() {
  return (
    <Select defaultValue="a">
      <SelectTrigger
        size="regular"
        placeholder="请选择提醒方式"
        leftIcon={<GeneralSetting aria-hidden />}
        rightIcon={<GeneralSetting aria-hidden />}
        className="w-full"
      />
      <SelectContent portalled={false}>
        <SelectItemGroup>
          <SelectItem value="a">仅应用内提醒</SelectItem>
          <SelectItem value="b">应用内 + 邮件</SelectItem>
        </SelectItemGroup>
      </SelectContent>
    </Select>
  );
}

function ListItemMatrix({
  itemType,
  leading,
}: {
  itemType: ListItemType;
  leading: ListItemLeading;
}) {
  return (
    <ListItem
      itemType={itemType}
      leading={leading}
      title="消息推送"
      subtitle="接收新消息的系统推送"
      actionLabel="管理"
      select={<DemoSelect />}
    />
  );
}

/** Figma List (738:148304) — title + card with Select-type items */
export const Default: Story = {
  render: () => (
    <List title="通知设置" className="w-[387px]">
      <ListItem
        itemType="select"
        leading="shaped"
        title="消息推送"
        subtitle="接收新消息的系统推送"
        actionLabel="管理"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="select"
        leading="shaped"
        title="评论回复"
        subtitle="有人回复我的评论时提醒"
        actionLabel="管理"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="select"
        leading="shaped"
        title="审批待办"
        subtitle="待我处理的审批任务"
        actionLabel="管理"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="select"
        leading="shaped"
        title="日程提醒"
        subtitle="会议开始前的提前提醒"
        actionLabel="管理"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="select"
        leading="shaped"
        title="安全提醒"
        subtitle="异地登录与密码变更通知"
        actionLabel="管理"
        select={<DemoSelect />}
      />
    </List>
  ),
};

/** Figma List item variant matrix (647:87555) — all Type × left icon setting */
export const ItemVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["select", "action", "switch"] as const).map((itemType) => (
        <ListGroupSection key={itemType} label={`Type=${itemType}`}>
          {(["shaped", "default", "none"] as const).map((leading) => (
            <ListItem
              key={`${itemType}-${leading}`}
              itemType={itemType}
              leading={leading}
              title="消息推送"
              subtitle="接收新消息的系统推送"
              actionLabel="管理"
              select={<DemoSelect />}
            />
          ))}
        </ListGroupSection>
      ))}
    </div>
  ),
};

function ListGroupSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <ListItemGroup label={label} className="w-[507px]">
      {children}
    </ListItemGroup>
  );
}

/** Leading icon settings */
export const LeadingIcons: Story = {
  render: () => (
    <List title="通知设置" className="w-[507px]">
      <ListItem
        itemType="select"
        leading="shaped"
        title="Shaped icon"
        subtitle="36px theme circle"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="select"
        leading="default"
        title="Default icon"
        subtitle="22px plain icon"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="select"
        leading="none"
        title="No icon"
        subtitle="Content aligned to edge"
        select={<DemoSelect />}
      />
    </List>
  ),
};

/** Trailing Type variants */
export const TrailingTypes: Story = {
  render: () => (
    <List title="通知设置" className="w-[507px]">
      <ListItem
        itemType="select"
        leading="shaped"
        title="Select trailing"
        subtitle="Primary button + select"
        actionLabel="管理"
        select={<DemoSelect />}
      />
      <ListItem
        itemType="action"
        leading="shaped"
        title="Action trailing"
        subtitle="Button group + chevron"
        actionLabel="管理"
      />
      <ListItem
        itemType="switch"
        leading="shaped"
        title="Switch trailing"
        subtitle="Primary button + switch"
        actionLabel="管理"
        switchProps={{ defaultChecked: true }}
      />
    </List>
  ),
};

/** Multiple titled groups with separator */
export const GroupedSections: Story = {
  render: () => (
    <div className="flex w-[387px] flex-col gap-4">
      <ListItemGroup label="Section A">
        <ListItem
          itemType="select"
          leading="shaped"
          title="Item A1"
          subtitle="Caption"
          select={<DemoSelect />}
        />
        <ListItem
          itemType="select"
          leading="shaped"
          title="Item A2"
          subtitle="Caption"
          select={<DemoSelect />}
        />
      </ListItemGroup>
      <ListSeparator />
      <ListItemGroup label="Section B">
        <ListItem
          itemType="action"
          leading="default"
          title="Item B1"
          subtitle="Caption"
        />
        <ListItem
          itemType="switch"
          leading="none"
          title="Item B2"
          subtitle="Caption"
          switchProps={{ defaultChecked: true }}
        />
      </ListItemGroup>
    </div>
  ),
};

/** Interactive row with hover highlight */
export const Interactive: Story = {
  render: () => (
    <List title="通知设置" className="w-[507px]">
      <ListItem
        itemType="action"
        leading="shaped"
        title="Clickable row"
        subtitle="Hover highlight"
        interactive
        onClick={() => undefined}
      />
      <ListItem
        itemType="select"
        leading="shaped"
        title="Selected row"
        subtitle="Selected state"
        selected
        select={<DemoSelect />}
      />
      <ListItem
        itemType="switch"
        leading="shaped"
        title="Disabled row"
        subtitle="Reduced opacity"
        disabled
        switchProps={{ defaultChecked: true }}
      />
    </List>
  ),
};

/** Link row without trailing actions / divider (chevron kept) */
export const LinkWithoutTrailing: Story = {
  render: () => (
    <List className="w-[507px]">
      <ListItem
        itemType="action"
        leading="default"
        title="对文档有改进意见吗？"
        subtitle="欢迎编辑文档，为更多开发者提供帮助"
        showTrailing={false}
        href="https://github.com/AvialaOSS/avialaWebsite/tree/main/apps/spiral-docs"
        target="_blank"
        rel="noopener noreferrer"
      />
    </List>
  ),
};

/** Single variant helper for controls */
export const SingleItem: Story = {
  args: {
    title: "通知设置",
    className: "w-[507px]",
  },
  render: (args) => (
    <List {...args}>
      <ListItemMatrix itemType="select" leading="shaped" />
    </List>
  ),
};
