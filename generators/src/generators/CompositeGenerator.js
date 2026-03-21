import { Generator, GeometryDTO, PatternDTO } from "../utils/generator.base.js";
import { createFractal, getAvailableGenerators } from "./FractalFactoryAutoDetect.js";

function CompositeGenerator(opts = {}) {
  Generator.call(this);
  this.g = new GeometryDTO();
  this.opts = opts;
}

CompositeGenerator.prototype = Object.create(Generator.prototype);
CompositeGenerator.prototype.constructor = CompositeGenerator;

CompositeGenerator.prototype.mergeGeometry = function (geometry) {
  if (!geometry) return;

  if (Array.isArray(geometry.segments)) {
    for (const segment of geometry.segments) {
      this.g.addSegment(segment);
    }
  }
};

CompositeGenerator.prototype.generate = async function (patternDTO) {
  console.log(patternDTO);
  const { patterns, ...otherOptions } = patternDTO?.options;

  if (patterns.length === 0) {
    throw new Error("No patterns selected for composite generator");
  }

  try {
    const availableGenerators = await getAvailableGenerators();
    const allowedTypes = availableGenerators.map((g) => g.id);

    for (const type of patterns) {
      if (!allowedTypes.includes(type)) {
        throw new Error(
          `Invalid type. Allowed values are: ${allowedTypes.join(", ")}`,
        );
      }

      if (type === "composite") {
        throw new Error("Composite generator cannot include itself");
      }

      const childGenerator = await createFractal(type, otherOptions);

      const childPattern = new PatternDTO(
        type,
        patternDTO.depth,
        patternDTO.options || {},
      );

      const childGeometry = await childGenerator.generate(childPattern);
      this.mergeGeometry(childGeometry);
    }

    this.g.meta.type = "composite";
    this.g.meta.patterns = patterns;
    this.g.meta.depth = patternDTO.depth;
    this.g.meta.options = patternDTO.options || {};

    return this.g;
  } catch (err) {
    throw err;
  }
};

export default {
  id: "composite",
  name: "composite",
  defaults: {
    center: { x: 400, y: 300 },
    size: 70,
    sideLength: 70,
    rows: 2,
    cols: 2,
    patterns: [],
  },
  Generator: CompositeGenerator,
};
