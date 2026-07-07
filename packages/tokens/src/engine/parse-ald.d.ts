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
        "com.figma.aliasData"?: FigmaAlias;
        "com.figma"?: {
            aliasData?: FigmaAlias;
            modeName?: string;
        };
    };
};
export type RawTokenTree = Record<string, RawToken | Record<string, unknown>>;
export declare function isColorValue(value: unknown): value is TokenColorValue;
export declare function flattenTokens(tree: RawTokenTree, prefix?: string): Record<string, RawToken>;
/** ALD paths use camelCase segments; CSS vars are slash → hyphen + lowercase only. */
export declare function tokenPathToCssVar(path: string): string;
export declare function resolveTokenHex(token: RawToken, palette: Record<string, string>): string | undefined;
export declare function resolveTokenNumber(token: RawToken): number | string | undefined;
//# sourceMappingURL=parse-ald.d.ts.map