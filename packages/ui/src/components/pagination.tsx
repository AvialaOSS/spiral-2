import {
  DirectionArrowLeftLight,
  DirectionArrowRightLight,
} from "@aviala-design/icons";
import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useRtl } from "../config";
import { cn } from "../lib/utils";
import { interpolate, useLocaleMessages } from "../locale";
import { Button, buttonVariants } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
} from "./select";
import { Typography } from "./typography";

/** Figma Components → Structure Navigation → Pagination (791:146366) */

function buildPageList(page: number, pageCount: number): Array<number | "ellipsis"> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(pageCount);
  for (let i = page - 1; i <= page + 1; i += 1) {
    if (i >= 1 && i <= pageCount) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const current = sorted[i];
    const prev = sorted[i - 1];
    if (prev != null && current - prev > 1) {
      result.push("ellipsis");
    }
    result.push(current);
  }
  return result;
}

/** Resolve the page numbers hidden behind an ellipsis slot. */
function ellipsisRange(
  pages: Array<number | "ellipsis">,
  index: number
): number[] {
  const prev = pages[index - 1];
  const next = pages[index + 1];
  if (typeof prev !== "number" || typeof next !== "number") return [];
  const start = prev + 1;
  const end = next - 1;
  const range: number[] = [];
  for (let p = start; p <= end; p += 1) range.push(p);
  return range;
}

export type PaginationProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  page?: number;
  defaultPage?: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  showJump?: boolean;
  showSizeChanger?: boolean;
  pageSize?: number;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  jumpLabel?: ReactNode;
  sizeLabel?: ReactNode;
  sizeOptionLabel?: (size: number) => ReactNode;
};

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      className,
      page: pageProp,
      defaultPage = 1,
      pageCount,
      onPageChange,
      showJump = true,
      showSizeChanger = true,
      pageSize: pageSizeProp,
      defaultPageSize = 10,
      pageSizeOptions = [10, 20, 50],
      onPageSizeChange,
      jumpLabel,
      sizeLabel,
      sizeOptionLabel,
      ...props
    },
    ref
  ) => {
    const locale = useLocaleMessages("Pagination");
    const rtl = useRtl();
    const PrevIcon = rtl ? DirectionArrowRightLight : DirectionArrowLeftLight;
    const NextIcon = rtl ? DirectionArrowLeftLight : DirectionArrowRightLight;
    const resolvedJumpLabel = jumpLabel ?? locale.jumpTo;
    const resolvedSizeLabel = sizeLabel ?? locale.pageSize;
    const resolvedSizeOptionLabel =
      sizeOptionLabel ?? ((size: number) => interpolate(locale.items, { size }));
    const [uncontrolledPage, setUncontrolledPage] = useState(defaultPage);
    const [uncontrolledPageSize, setUncontrolledPageSize] = useState(defaultPageSize);
    const [jumpValue, setJumpValue] = useState("");
    const [openEllipsis, setOpenEllipsis] = useState<number | null>(null);
    const page = pageProp ?? uncontrolledPage;
    const pageSize = pageSizeProp ?? uncontrolledPageSize;
    const safePageCount = Math.max(1, pageCount);
    const currentPage = Math.min(Math.max(page, 1), safePageCount);
    const pages = buildPageList(currentPage, safePageCount);

    const setPage = (next: number) => {
      const clamped = Math.min(Math.max(next, 1), safePageCount);
      if (pageProp == null) setUncontrolledPage(clamped);
      onPageChange?.(clamped);
    };

    const setPageSize = (next: number) => {
      if (pageSizeProp == null) setUncontrolledPageSize(next);
      onPageSizeChange?.(next);
    };

    const commitJump = () => {
      const parsed = Number.parseInt(jumpValue, 10);
      if (!Number.isFinite(parsed)) return;
      setPage(parsed);
      setJumpValue("");
    };

    return (
      <div
        ref={ref}
        className={cn("aviala-pagination", className)}
        role="navigation"
        aria-label={props["aria-label"] ?? locale.pagination}
        {...props}
      >
        <div className="aviala-pagination__controls">
          <Button
            mode="noBackgroundCustom"
            size="regular"
            iconOnly
            aria-label={locale.previous}
            disabled={currentPage <= 1}
            leftIcon={<PrevIcon aria-hidden />}
            onClick={() => setPage(currentPage - 1)}
          />
          <div className="aviala-pagination__pages">
            {pages.map((item, index) =>
              item === "ellipsis" ? (
                <Popover
                  key={`ellipsis-${index}`}
                  open={openEllipsis === index}
                  onOpenChange={(open) => setOpenEllipsis(open ? index : null)}
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      data-size="regular"
                      className={cn(
                        buttonVariants({ mode: "noBackgroundCustom", compact: true }),
                        "aviala-pagination__page--ellipsis"
                      )}
                      aria-label={locale.morePages}
                      aria-haspopup="menu"
                    >
                      <Typography level="text" as="span">
                        …
                      </Typography>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="aviala-pagination__ellipsis-content" showArrow flush>
                    <div className="aviala-pagination__ellipsis-menu">
                      {ellipsisRange(pages, index).map((p) => (
                        <button
                          key={p}
                          type="button"
                          data-size="regular"
                          className={cn(
                            buttonVariants({ mode: "noBackgroundCustom", compact: true }),
                            "aviala-pagination__ellipsis-page"
                          )}
                          onClick={() => {
                            setPage(p);
                            setOpenEllipsis(null);
                          }}
                        >
                          <Typography level="text" as="span">
                            {p}
                          </Typography>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              ) : (
                <button
                  key={item}
                  type="button"
                  data-size="regular"
                  className={cn(
                    buttonVariants({ mode: "noBackgroundCustom", compact: true }),
                    "aviala-pagination__page"
                  )}
                  data-active={item === currentPage ? "true" : undefined}
                  aria-current={item === currentPage ? "page" : undefined}
                  onClick={() => setPage(item)}
                >
                  <Typography level="text" as="span">
                    {item}
                  </Typography>
                </button>
              )
            )}
          </div>
          <Button
            mode="noBackgroundCustom"
            size="regular"
            iconOnly
            aria-label={locale.next}
            disabled={currentPage >= safePageCount}
            leftIcon={<NextIcon aria-hidden />}
            onClick={() => setPage(currentPage + 1)}
          />
        </div>

        {showJump ? (
          <div className="aviala-pagination__jump">
            <Typography level="text" as="span">
              {resolvedJumpLabel}
            </Typography>
            <Input
              className="aviala-pagination__jump-input"
              size="regular"
              fullWidth={false}
              value={jumpValue}
              placeholder={locale.pagePlaceholder}
              inputMode="numeric"
              onChange={(event) => setJumpValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  commitJump();
                }
              }}
              onBlur={commitJump}
            />
          </div>
        ) : null}

        {showSizeChanger ? (
          <div className="aviala-pagination__size">
            <Typography level="text" as="span">
              {resolvedSizeLabel}
            </Typography>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger
                size="regular"
                className="aviala-pagination__size-select"
                aria-label={locale.pageSizeAria}
              />
              <SelectContent>
                <SelectItemGroup>
                  {pageSizeOptions.map((option) => (
                    <SelectItem
                      key={option}
                      value={String(option)}
                      itemFunction="checkbox"
                    >
                      {resolvedSizeOptionLabel(option)}
                    </SelectItem>
                  ))}
                </SelectItemGroup>
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>
    );
  }
);
Pagination.displayName = "Pagination";
