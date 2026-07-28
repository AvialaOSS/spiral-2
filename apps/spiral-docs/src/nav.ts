export type NavItem = {
  label: string;
  path: string;
  component?: string;
};

export type NavSection = {
  section: string;
  items: NavItem[];
};

/** 与 Storybook title / Figma 分类对齐 */
export const nav: NavSection[] = [
  {
    section: "开始",
    items: [
      { label: "介绍", path: "/start/introduction" },
      { label: "安装", path: "/start/installation" },
      { label: "主题", path: "/start/theme" },
    ],
  },
  {
    section: "参考",
    items: [
      { label: "Icons 图标", path: "/reference/icons" },
      { label: "Icons Playground", path: "/reference/icons/playground" },
      { label: "Rem 字号调试", path: "/reference/rem-scale" },
      { label: "组件调试器", path: "/reference/debugger" },
      { label: "图标同步", path: "/icon-sync" },
    ],
  },
  {
    section: "基础输入",
    items: [
      { label: "Button 按钮", path: "/components/basic-input/button", component: "Button" },
      { label: "Input 输入框", path: "/components/basic-input/input", component: "Input" },
      {
        label: "Segmentator 分段器",
        path: "/components/basic-input/segmentator",
        component: "SegmentatorGroup",
      },
      { label: "Switch 开关", path: "/components/basic-input/switch", component: "Switch" },
      { label: "Link 链接", path: "/components/basic-input/link", component: "Link" },
    ],
  },
  {
    section: "信息采集",
    items: [
      { label: "Select 选择器", path: "/components/information-collect/select", component: "Select" },
      {
        label: "DatePicker 日期选择",
        path: "/components/information-collect/date-picker",
        component: "DatePickerField",
      },
      {
        label: "TimePicker 时间选择",
        path: "/components/information-collect/time-picker",
        component: "TimePickerField",
      },
      {
        label: "Textarea 多行输入",
        path: "/components/information-collect/textarea",
        component: "Textarea",
      },
      {
        label: "Checkbox 复选框",
        path: "/components/information-collect/checkbox",
        component: "Checkbox",
      },
      {
        label: "RadioGroup 单选组",
        path: "/components/information-collect/radio",
        component: "RadioGroup",
      },
      {
        label: "Cascader 级联选择",
        path: "/components/information-collect/cascader",
        component: "CascaderField",
      },
      {
        label: "ColorPicker 颜色选择",
        path: "/components/information-collect/color-picker",
        component: "ColorPicker",
      },
      { label: "Slider 滑块", path: "/components/information-collect/slider", component: "Slider" },
      { label: "Upload 上传", path: "/components/information-collect/upload", component: "Upload" },
      {
        label: "ScrollPicker 滚轮选择",
        path: "/components/information-collect/scroll-picker",
        component: "ScrollPicker",
      },
    ],
  },
  {
    section: "结构导航",
    items: [
      {
        label: "Navigation 导航",
        path: "/components/structure-navigation/navigation",
        component: "Navigation",
      },
      { label: "List 列表", path: "/components/structure-navigation/list", component: "List" },
      {
        label: "Breadcrumb 面包屑",
        path: "/components/structure-navigation/breadcrumb",
        component: "Breadcrumb",
      },
      {
        label: "Pagehead 页头",
        path: "/components/structure-navigation/pagehead",
        component: "Pagehead",
      },
      { label: "Steps 步骤条", path: "/components/structure-navigation/steps", component: "Steps" },
      {
        label: "Pagination 分页",
        path: "/components/structure-navigation/pagination",
        component: "Pagination",
      },
      { label: "Card 卡片", path: "/components/structure-navigation/card", component: "Card" },
    ],
  },
  {
    section: "信息展示",
    items: [
      {
        label: "Modal 模态框",
        path: "/components/information-display/modal",
        component: "Modal",
      },
      { label: "Badge 徽章", path: "/components/information-display/badge", component: "Badge" },
      { label: "Tag 标签", path: "/components/information-display/tag", component: "Tag" },
      { label: "Avatar 头像", path: "/components/information-display/avatar", component: "Avatar" },
      { label: "Table 表格", path: "/components/information-display/table", component: "Table" },
    ],
  },
  {
    section: "系统组合",
    items: [
      {
        label: "Typography 排版",
        path: "/components/system-composition/typography",
        component: "Typography",
      },
      {
        label: "Typeface 字体组合",
        path: "/components/system-composition/typeface",
        component: "Typeface",
      },
      {
        label: "FormField 表单字段",
        path: "/components/system-composition/form-field",
        component: "FormField",
      },
      { label: "Anchor 锚点", path: "/components/system-composition/anchor", component: "Anchor" },
      {
        label: "Popover 弹出层",
        path: "/components/system-composition/popover",
        component: "Popover",
      },
      {
        label: "Tooltip 工具提示",
        path: "/components/system-composition/tooltip",
        component: "Tooltip",
      },
      { label: "Loading 加载", path: "/components/system-composition/loading", component: "Loading" },
      { label: "Scroll 滚动条", path: "/components/system-composition/scroll", component: "Scroll" },
    ],
  },
  {
    section: "反馈",
    items: [
      {
        label: "Alert 提示",
        path: "/components/feedback/alert",
        component: "Alert",
      },
      {
        label: "Feedback 反馈",
        path: "/components/feedback/feedback",
        component: "Feedback",
      },
      {
        label: "Progress 进度",
        path: "/components/feedback/progress",
        component: "Progress",
      },
    ],
  },
];

export function flattenNavItems(): NavItem[] {
  return nav.flatMap((section) => section.items);
}

export function navPathToHref(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}
