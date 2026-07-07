import {
  componentSetToCategory,
  normalizeThickness,
  parseSvgVariantFileName,
  parseVariantName,
  variantToRelativePath,
  variantToSvgBaseName,
} from "../../packages/icons/scripts/icon-utils.mjs";
import assert from "node:assert/strict";

const a = parseVariantName("thickness=Light, mode=default, name=direction_arrowLeft");
assert.equal(a.thickness, "Light");
assert.equal(a.mode, "default");
assert.equal(a.name, "direction_arrowLeft");

const b = parseVariantName("mode=fill, name=general_setting, thickness=Regular");
assert.equal(b.thickness, "Regular");
assert.equal(b.mode, "fill");
assert.equal(b.name, "general_setting");

const medium = parseVariantName("thickness=Medium, mode=default, name=symbol_informationCircle");
assert.equal(medium.thickness, "Medium");

assert.equal(normalizeThickness("Medium"), "Medium");
assert.equal(normalizeThickness("medium"), "Medium");

assert.equal(normalizeThickness("Standard"), "Regular");
assert.equal(normalizeThickness("Semi Light"), "Medium");
assert.equal(normalizeThickness("semilight"), "Medium");

assert.equal(componentSetToCategory("direction/arrowLeft"), "direction");

assert.equal(
  variantToSvgBaseName({ name: "direction_arrowLeft", thickness: "Light", mode: "default" }),
  "direction_arrowLeft-light-default"
);

assert.equal(
  variantToSvgBaseName({ name: "symbol_informationCircle", thickness: "Medium", mode: "default" }),
  "symbol_informationCircle-medium-default"
);

assert.equal(
  variantToRelativePath("direction", {
    name: "direction_arrowLeft",
    thickness: "Regular",
    mode: "default",
  }),
  "direction/direction_arrowLeft-regular-default"
);

const parsed = parseSvgVariantFileName("direction_arrowLeft-regular-default");
assert.deepEqual(parsed, {
  iconName: "direction_arrowLeft",
  thickness: "Regular",
  mode: "default",
});

const parsedMedium = parseSvgVariantFileName("symbol_informationCircle-medium-default");
assert.deepEqual(parsedMedium, {
  iconName: "symbol_informationCircle",
  thickness: "Medium",
  mode: "default",
});

const parsedLegacyStandard = parseSvgVariantFileName("direction_arrowLeft-standard-default");
assert.deepEqual(parsedLegacyStandard, {
  iconName: "direction_arrowLeft",
  thickness: "Regular",
  mode: "default",
});

const parsedLight = parseSvgVariantFileName("symbol_informationCircle-light-default");
assert.deepEqual(parsedLight, {
  iconName: "symbol_informationCircle",
  thickness: "Light",
  mode: "default",
});

assert.equal(parseSvgVariantFileName("arrow-right"), null);

console.log("icon-utils tests passed");
