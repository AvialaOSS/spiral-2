export function isColorValue(value) {
    return (typeof value === "object" &&
        value !== null &&
        "hex" in value &&
        typeof value.hex === "string");
}
export function flattenTokens(tree, prefix = "") {
    const result = {};
    for (const [key, node] of Object.entries(tree)) {
        const path = prefix ? `${prefix}/${key}` : key;
        if (node && typeof node === "object" && "$type" in node) {
            result[path] = node;
        }
        else if (node && typeof node === "object") {
            Object.assign(result, flattenTokens(node, path));
        }
    }
    return result;
}
/** ALD paths use camelCase segments; CSS vars are slash → hyphen + lowercase only. */
export function tokenPathToCssVar(path) {
    return "--" + path.replace(/\//g, "-").toLowerCase();
}
export function resolveTokenHex(token, palette) {
    // Semantic tokens bake the light hex into $value but also alias the primitive
    // ramp. Prefer the alias so dark mode resolves against the dark palette; the
    // primitive ramps themselves have no alias and fall through to the literal hex.
    const alias = token.$extensions?.["com.figma.aliasData"]?.targetVariableName ??
        token.$extensions?.["com.figma"]?.aliasData?.targetVariableName;
    if (alias && palette[alias]) {
        return palette[alias];
    }
    if (isColorValue(token.$value)) {
        return token.$value.hex;
    }
    return undefined;
}
export function resolveTokenNumber(token) {
    if (typeof token.$value === "number")
        return token.$value;
    if (typeof token.$value === "string")
        return token.$value;
    return undefined;
}
