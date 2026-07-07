import { transform } from "@babel/standalone";
import * as React from "react";

export type LiveEvalResult = {
  element: React.ReactNode | null;
  error: string | null;
};

export function evaluateLiveCode(
  code: string,
  scope: Record<string, unknown>
): LiveEvalResult {
  if (!code.trim()) {
    return { element: null, error: null };
  }

  try {
    const transformed = transform(code, {
      presets: [["react", { runtime: "classic" }]],
      filename: "live-demo.jsx",
    })?.code;

    if (!transformed) {
      return { element: null, error: "代码转换失败" };
    }

    let preview: React.ReactNode = null;
    const render = (node: React.ReactNode) => {
      preview = node;
    };

    const scopeKeys = Object.keys(scope);
    const scopeValues = Object.values(scope);

    const fn = new Function(
      "React",
      "render",
      ...scopeKeys,
      transformed
    ) as (
      react: typeof React,
      renderFn: typeof render,
      ...args: unknown[]
    ) => unknown;

    fn(React, render, ...scopeValues);
    return { element: preview, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { element: null, error: message };
  }
}
