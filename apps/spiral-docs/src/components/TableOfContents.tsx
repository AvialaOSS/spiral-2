import { Anchor, AnchorItem, Typography } from "@aviala-design/spiral";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

type TableOfContentsProps = {
  containerRef: React.RefObject<HTMLElement | null>;
};

function headingIndentLevel(level: Heading["level"]): 0 | 1 {
  return level === 2 ? 0 : 1;
}

export function TableOfContents({ containerRef }: TableOfContentsProps) {
  const location = useLocation();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodes = container.querySelectorAll("h2, h3");
    const next: Heading[] = [];

    nodes.forEach((node) => {
      const level = node.tagName === "H2" ? 2 : 3;
      const text = node.textContent?.trim() ?? "";
      if (!text) return;

      let id = node.id;
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\u4e00-\u9fff-]+/g, "");
        node.id = id;
      }

      next.push({ id, text, level });
    });

    setHeadings(next);
    setActiveId(next[0]?.id ?? null);
  }, [containerRef, location.pathname]);

  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element != null);

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-72px 0px -70% 0px",
        threshold: 0,
      }
    );

    headingElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="docs-toc" aria-label="本页目录">
      <Typography level="caption" as="p" className="mb-3 text-[var(--muted-foreground)]">
        本页目录
      </Typography>
      <Anchor aria-label="本页目录">
        {headings.map((heading) => (
          <AnchorItem
            key={heading.id}
            href={`#${heading.id}`}
            activated={heading.id === activeId}
            indentLevel={headingIndentLevel(heading.level)}
          >
            {heading.text}
          </AnchorItem>
        ))}
      </Anchor>
    </aside>
  );
}

type DocPageHeaderProps = {
  title: string;
  description?: string;
};

export function DocPageHeader({ title, description }: DocPageHeaderProps) {
  return (
    <header className="docs-page-header">
      <Typography level="headline1" as="h1">
        {title}
      </Typography>
      {description ? (
        <Typography level="text" as="p" className="docs-page-description">
          {description}
        </Typography>
      ) : null}
    </header>
  );
}
