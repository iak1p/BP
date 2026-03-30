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

// CompositeGenerator.prototype.polygonToEdges = function (geometry) {
//   const { objects } = geometry;
//   const edges = [];

//   for (const obj of objects) {
//     const { points } = obj;
//     if (!Array.isArray(points) || points.length < 2) {
//       continue;
//     }

//     for (let i = 0; i < points.length; i++) {
//       const a = points[i];
//       const b = points[(i + 1) % points.length];
//       edges.push({ a, b });
//     }
//   }

//   return edges;
// };

// CompositeGenerator.prototype.generate = async function (patternDTO) {
//   console.log(patternDTO);
//   const { patterns, ...otherOptions } = patternDTO?.options;

//   if (patterns.length === 0) {
//     throw new Error("No patterns selected for composite generator");
//   }

//   try {
//     const availableGenerators = await getAvailableGenerators();
//     const allowedTypes = availableGenerators.map((g) => g.id);

//     for (const type of patterns) {
//       if (!allowedTypes.includes(type)) {
//         throw new Error(
//           `Invalid type. Allowed values are: ${allowedTypes.join(", ")}`,
//         );
//       }

//       if (type === "composite") {
//         throw new Error("Composite generator cannot include itself");
//       }

//       const childGenerator = await createFractal(type, otherOptions);

//       const childPattern = new PatternDTO(
//         type,
//         patternDTO.depth,
//         patternDTO.options || {},
//       );

//       const childGeometry = await childGenerator.generate(childPattern);
//       this.mergeGeometry(childGeometry);
//     }

//     this.g.meta.type = "composite";
//     // this.g.meta.patterns = patterns;
//     this.g.meta.depth = patternDTO.depth;
//     this.g.meta.options = patternDTO.options || {};

//     return this.g;
//   } catch (err) {
//     throw err;
//   }
// };

CompositeGenerator.prototype.removePolygons = function () {
  if (!Array.isArray(this.g.objects)) return;

  this.g.objects = this.g.objects.filter((obj) => obj.type !== "polygon");
};

CompositeGenerator.prototype.generateKochFromAnklet = async function (
  patternDTO,
  otherOptions,
) {
  const ankletGenerator = await createFractal("anklet", otherOptions);
  const ankletPattern = new PatternDTO(
    "anklet",
    patternDTO.depth,
    patternDTO.options || {},
  );

  const ankletGeometry = await ankletGenerator.generate(ankletPattern);
  const seedEdges = ankletGenerator.polygonToEdges(ankletGeometry);
  this.mergeGeometry(ankletGeometry);

  const kochGenerator = await createFractal("koch", otherOptions);
  const kochDepth = patternDTO.depth;

  const kochGeometry = kochGenerator.generateFromEdges(seedEdges, kochDepth);
  this.mergeGeometry(kochGeometry);

  this.removePolygons();
};

CompositeGenerator.prototype.generate = async function (patternDTO) {
  const { patterns = [], ...otherOptions } = patternDTO?.options || {};

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
    }

    const hasAnklet = patterns.includes("anklet");
    const hasKoch = patterns.includes("koch");

    if (hasAnklet && hasKoch) {
      await this.generateKochFromAnklet(patternDTO, otherOptions);

      for (const type of patterns) {
        if (type === "anklet" || type === "koch") continue;

        const childGenerator = await createFractal(type, otherOptions);
        const childPattern = new PatternDTO(
          type,
          patternDTO.depth,
          patternDTO.options || {},
        );

        const childGeometry = await childGenerator.generate(childPattern);
        this.mergeGeometry(childGeometry);
      }
    } else {
      for (const type of patterns) {
        const childGenerator = await createFractal(type, otherOptions);
        const childPattern = new PatternDTO(
          type,
          patternDTO.depth,
          patternDTO.options || {},
        );

        const childGeometry = await childGenerator.generate(childPattern);
        this.mergeGeometry(childGeometry);
      }
    }

    this.g.meta.type = "composite";
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
