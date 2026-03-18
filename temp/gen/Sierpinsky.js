import { GeometryDTO, Generator } from "../../generators/src/utils/generator.base.js";

export default function Sierpinsky(opts) {
  Generator.call(this);
  this.g = new GeometryDTO();
  this.center = (opts && opts.center) || { x: 0, y: 0 };
  this.size = (opts && opts.size) || 200;
  this.sides = 3;
}
Sierpinsky.prototype = Object.create(Generator.prototype);
Sierpinsky.prototype.constructor = Sierpinsky;

Sierpinsky.prototype.subdivide = function (a, b, c, depth) {
  if (depth <= 0) {
    this.g.addSegment({ a, b });
    this.g.addSegment({ a: b, b: c });
    this.g.addSegment({ a: c, b: a });
    return;
  }

  const ab = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const bc = { x: (b.x + c.x) / 2, y: (b.y + c.y) / 2 };
  const ac = { x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 };

  this.subdivide(a, ab, ac, depth - 1);
  this.subdivide(b, ab, bc, depth - 1);
  this.subdivide(c, ac, bc, depth - 1);
};

Sierpinsky.prototype.polygonVertices = function (cx, cy, n, sideLen) {
  const R = sideLen / (2 * Math.sin(Math.PI / n));
  const start = -Math.PI / 2;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const ang = start + (i * 2 * Math.PI) / n;
    pts.push({ x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) });
  }
  return pts;
};

Sierpinsky.prototype.generate = function (patternDTO) {
  const depth = patternDTO.depth | 0;

  const [a, b, c] = this.polygonVertices(
    this.center.x,
    this.center.y,
    this.sides,
    this.size
  );

  this.subdivide(a, b, c, depth);

  this.g.meta.depth = depth;
  this.g.meta.sides = this.sides;
  return this.g;
};
