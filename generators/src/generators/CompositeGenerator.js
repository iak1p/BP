import { Generator, GeometryDTO, PatternDTO } from "../utils/generator.base.js";
import {
  createFractal,
  getAvailableGenerators,
} from "./FractalFactoryAutoDetect.js";

function CompositeGenerator(opts = {}) {
  Generator.call(this);
  this.g = new GeometryDTO();
  this.opts = opts;
}

CompositeGenerator.prototype = Object.create(Generator.prototype);
CompositeGenerator.prototype.constructor = CompositeGenerator;

CompositeGenerator.prototype.mergeGeometry = function (geometry) {
  if (!geometry) return;

  if (Array.isArray(geometry.objects)) {
    for (const object of geometry.objects) {
      this.g.objects.push(object);
    }
  }
};

CompositeGenerator.prototype.removePolygons = function () {
  if (!Array.isArray(this.g.objects)) return;

  this.g.objects = this.g.objects.filter((obj) => obj.type !== "polygon");
};

CompositeGenerator.prototype.generateKochFromAnklet = async function (options) {
  const { anklet, koch } = options;

  const ankletPattern = new PatternDTO("anklet", anklet);
  const ankletGenerator = await createFractal(
    ankletPattern.type,
    ankletPattern.params,
  );

  const ankletGeometry = await ankletGenerator.generate();
  const seedEdges = ankletGenerator.polygonToEdges(ankletGeometry);
  this.mergeGeometry(ankletGeometry);

  const kochGenerator = await createFractal("koch", koch);
  const kochDepth = koch.depth;

  const kochGeometry = kochGenerator.generateFromEdges(seedEdges, kochDepth);
  this.mergeGeometry(kochGeometry);

  this.removePolygons();
};

CompositeGenerator.prototype.generate = async function (patternDTO) {
  const { patterns = [] } = patternDTO?.params || {};

  if (patterns.length === 0) {
    throw new Error("No patterns selected for composite generator");
  }

  try {
    const availableGenerators = await getAvailableGenerators();
    const allowedTypes = availableGenerators.map((g) => g.id);

    for (const fractal of patterns) {
      if (!allowedTypes.includes(fractal.type)) {
        throw new Error(
          `Invalid type. Allowed values are: ${allowedTypes.join(", ")}`,
        );
      }

      if (fractal.type === "composite") {
        throw new Error("Composite generator cannot include itself");
      }
    }

    const hasAnklet = patterns.some((f) => f.type === "anklet");
    const hasKoch = patterns.some((f) => f.type === "koch");

    if (hasAnklet && hasKoch) {
      const anklet = patterns.find((p) => p.type === "anklet");
      const koch = patterns.find((p) => p.type === "koch");

      await this.generateKochFromAnklet({
        anklet: anklet?.params,
        koch: koch?.params,
      });

      for (const fractal of patterns) {
        if (fractal.type === "anklet" || fractal.type === "koch") continue;

        const childPattern = new PatternDTO(fractal.type, fractal.params);

        const childGenerator = await createFractal(
          childPattern.type,
          childPattern.params,
        );

        const childGeometry = await childGenerator.generate();
        this.mergeGeometry(childGeometry);
      }
    } else {
      for (const fractal of patterns) {
        const childPattern = new PatternDTO(fractal.type, fractal.params);

        const childGenerator = await createFractal(
          childPattern.type,
          childPattern.params,
        );

        const childGeometry = await childGenerator.generate();
        this.mergeGeometry(childGeometry);
      }
    }

    this.g.meta.type = "composite";
    // this.g.meta.depth = patternDTO.depth;
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
    patterns: [],
  },
  Generator: CompositeGenerator,
};
