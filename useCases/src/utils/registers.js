// import ColorByDepthUseCase from "../../../src/usecases/ColorByDepthUseCase.js";
// import ColorSolidUseCase from "../../../src/usecases/ColorSolidUseCase.js";
// import LineWidthUseCase from "../../../src/usecases/LineWidthUseCase.js";
// import RotateUseCase from "../../../src/usecases/RotateUseCase.js";
// import ScaleUseCase from "../../../src/usecases/ScaleUseCase.js";

import ColorSolidUseCase from "../useCases/ColorSolidUseCase.js";
import ScaleUseCase from "../useCases/ScaleUseCase.js";
import RotateUseCase from "../useCases/RotateUseCase.js";
import ColorByDepthUseCase from "../useCases/ColorByDepthUseCase.js";
import LineWidthUseCase from "../useCases/LineWidthUseCase.js";

// import ColorByDepthUseCase from "../../../src/usecases/ColorByDepthUseCase";
// import LineWidthUseCase from "../../../src/usecases/LineWidthUseCase";
// import ScaleUseCase from "../../../src/usecases/ScaleUseCase";
// import ColorSolidUseCase from "../useCases/ColorSolidUseCase";
// import RotateUseCase from "../useCases/RotateUseCase";

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
