import { GeometryDTO, Generator } from "./generator.base.js";

export default function Koch(opts) {
  Generator.call(this);
  this.g = new GeometryDTO();
  this.center = (opts && opts.center) || { x: 0, y: 0 };
  this.size = (opts && opts.size) || 200;
  this.sides = (opts && opts.sides) || 3;
  this.outward = false;
}
Koch.prototype = Object.create(Generator.prototype);
Koch.prototype.constructor = Koch;

Koch.prototype.subdivide = function (a, b, d, sign, ds) {
  if (d === 0) {
    this.g.addSegment({ a: a, b: b });
    return;
  }

  const dx = (b.x - a.x) / 3,
    dy = (b.y - a.y) / 3;
  const p1 = { x: a.x + dx, y: a.y + dy };
  const p2 = { x: a.x + 2 * dx, y: a.y + 2 * dy };

  const base = Math.atan2(dy, dx);
  const angle = base - sign * (Math.PI / 3);
  const len = Math.hypot(dx, dy);
  const p = {
    x: p1.x + Math.cos(angle) * len,
    y: p1.y + Math.sin(angle) * len,
  };

  this.subdivide(a, p1, d - 1, sign, ds + 1);
  this.subdivide(p1, p, d - 1, sign, ds + 1);
  this.subdivide(p, p2, d - 1, sign, ds + 1);
  this.subdivide(p2, b, d - 1, sign, ds + 1);
};

Koch.prototype.polygonVertices = function (cx, cy, n, sideLen) {
  const R = sideLen / (2 * Math.sin(Math.PI / n));
  const start = -Math.PI / 2;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const ang = start + (i * 2 * Math.PI) / n;
    pts.push({ x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) });
  }
  return pts;
};

Koch.prototype.generate = function (patternDTO) {
  const depth = patternDTO.depth | 0;

  const poly = this.polygonVertices(
    this.center.x,
    this.center.y,
    this.sides,
    this.size
  );

  const sign = this.outward ? +1 : -1;

  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    this.subdivide(a, b, depth, sign, 0);
  }

  this.g.meta.depth = depth;
  this.g.meta.sides = this.sides;
  this.g.meta.outward = this.outward;
  return this.g;
};
