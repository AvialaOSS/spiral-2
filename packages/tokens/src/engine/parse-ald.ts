export type TokenColorValue = {
  hex: string;
  alpha?: number;
};

export type FigmaAlias = {
  targetVariableName: string;
  targetVariableSetName?: string;
};

export type RawToken = {
  $type?: string;
  $value?: TokenColorValue | number | string | RawTokenTree;
  $extensions?: {
    // Figma exports alias data under a flat dotted key.
    "com.figma.aliasData"?: FigmaAlias;
    // Older/nested export shape, kept for backwards compatibility.
    "com.figma"?: {
      aliasData?: FigmaAlias;
      modeName?: string;
    };
  };
};

export type RawTokenTree = Record<string, RawToken | Record<string, unknown>>;

export function isColorValue(value: unknown): value is TokenColorValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "hex" in value &&
    typeof (value as TokenColorValue).hex === "string"
  );
}

export function flattenTokens(
  tree: RawTokenTree,
  prefix = ""
): Record<string, RawToken> {
  const result: Record<string, RawToken> = {};

  for (const [key, node] of Object.entries(tree)) {
    const path = prefix ? `${prefix}/${key}` : key;
    if (node && typeof node === "object" && "$type" in node) {
      result[path] = node as RawToken;
    } else if (node && typeof node === "object") {
      Object.assign(result, flattenTokens(node as RawTokenTree, path));
    }
  }

  return result;
}

/** ALD paths use camelCase segments; CSS vars are slash → hyphen + lowercase only. */
export function tokenPathToCssVar(path: string): string {
  return "--" + path.replace(/\//g, "-").toLowerCase();
}

export function resolveTokenHex(
  token: RawToken,
  palette: Record<string, string>
): string | undefined {
  // Semantic tokens bake the light hex into $value but also alias the primitive
  // ramp. Prefer the alias so dark mode resolves against the dark palette; the
  // primitive ramps themselves have no alias and fall through to the literal hex.
  const alias =
    token.$extensions?.["com.figma.aliasData"]?.targetVariableName ??
    token.$extensions?.["com.figma"]?.aliasData?.targetVariableName;
  if (alias && palette[alias]) {
    return palette[alias];
  }
  if (isColorValue(token.$value)) {
    return token.$value.hex;
  }
  return undefined;
}

export function resolveTokenNumber(
  token: RawToken
): number | string | undefined {
  if (typeof token.$value === "number") return token.$value;
  if (typeof token.$value === "string") return token.$value;
  return undefined;
}
