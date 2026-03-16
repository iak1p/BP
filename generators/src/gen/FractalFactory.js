import Koch from "./Koch.js";
import Anklet from "./Anklet.js";
import Sierpinsky from "./Sierpinsky.js";

const FRACTAL_DEFAULTS = {
  koch: {
    center: { x: 400, y: 300 },
    size: 200,
    sides: 2,
  },
  anklet: {
    center: { x: 400, y: 300 },
    lineLength: 10,
    squareSide: 20,
  },
  sierpinsky: {
    center: { x: 400, y: 300 },
    size: 400,
  },
};

const FRACTAL_CLASSES = {
  koch: Koch,
  anklet: Anklet,
  sierpinsky: Sierpinsky,
};

export function createFractal(type, options = {}) {
  const FractalClass = FRACTAL_CLASSES[type];

  if (!FractalClass) {
    throw new Error("Unknown fractal type");
  }

  const config = {
    ...FRACTAL_DEFAULTS[type],
    ...options,
    center: {
      ...FRACTAL_DEFAULTS[type].center,
      ...options.center,
    },
  };

  return new FractalClass(config);
}
