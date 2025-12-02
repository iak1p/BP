import ColorByDepthUseCase from "./ColorByDepthUseCase.js";
import ColorSolidUseCase from "./ColorSolidUseCase.js";
import LineWidthUseCase from "./LineWidthUseCase.js";
import RotateUseCase from "./RotateUseCase.js";
import ScaleUseCase from "./ScaleUseCase.js";

export const UseCaseRegistry = {
  colorSolid: ColorSolidUseCase,
  scale: ScaleUseCase,
  rotate: RotateUseCase,
  colorDepth: ColorByDepthUseCase,
  width: LineWidthUseCase,
};

export default function createUseCase(def) {
  if (typeof def === "string") {
    const Ctor = UseCaseRegistry[def];

    if (!Ctor) throw new Error(`Unknown use case: ${def}`);

    return new Ctor({});
  }
  if (def && typeof def === "object" && def.name) {
    const Ctor = UseCaseRegistry[def.name];

    if (!Ctor) throw new Error(`Unknown use case: ${def.name}`);

    const { name, ...opts } = def;

    return new Ctor(opts);
  }
  throw new Error("Invalid use case definition");
}
