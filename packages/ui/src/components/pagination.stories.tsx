import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "./pagination";

const meta: Meta<typeof Pagination> = {
  title: "Structure Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} pageCount={10} onPageChange={setPage} />;
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return <Pagination page={page} pageCount={20} onPageChange={setPage} />;
  },
};

export const WithSizeChanger: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    return (
      <Pagination
        page={page}
        pageCount={12}
        onPageChange={setPage}
        showSizeChanger
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    );
  },
};
