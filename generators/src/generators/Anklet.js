import { GeometryDTO, Generator } from "../utils/generator.base.js";

function Anklet(opts) {
  Generator.call(this);
  this.g = new GeometryDTO();
  this.center = (opts && opts.center) || { x: 0, y: 0 };
  this.lineLength = (opts && opts.lineLength) || 20;
  this.squareSide = (opts && opts.squareSide) || 20;
  this.depth = (opts && opts.depth) || 3;

  this.hypotenuseSquare = Math.round(
    Math.sqrt(2 * this.squareSide * this.squareSide),
  );
  this.halfHyp = Math.round(this.hypotenuseSquare / 2);
  this.moveToBase = this.lineLength + this.hypotenuseSquare;
}

Anklet.prototype._addRotatedSquare = function (cx, cy, depth) {
  const h = this.halfHyp;

  const top = { x: cx, y: cy - h };
  const right = { x: cx + h, y: cy };
  const bottom = { x: cx, y: cy + h };
  const left = { x: cx - h, y: cy };

  this.g.addPolygon([top, right, bottom, left], depth);

  return { top, right, bottom, left };
};

Anklet.prototype.polygonToEdges = function (geometry) {
  const { objects } = geometry;
  const edges = [];

  for (const obj of objects) {
    const { points } = obj;
    if (!Array.isArray(points) || points.length < 2) {
      continue;
    }

    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      edges.push({ a, b });
    }
  }

  return edges;
};

Anklet.prototype.subdivide = function (cx, cy, depth) {
  if (depth <= 0) return;

  const mid = this._addRotatedSquare(cx, cy, depth);

  this.g.addLine({
    a: { x: mid.top.x, y: mid.top.y },
    b: { x: mid.top.x, y: mid.top.y - this.lineLength },
    depth
  });
  
  this.g.addLine({
    a: { x: mid.bottom.x, y: mid.bottom.y },
    b: { x: mid.bottom.x, y: mid.bottom.y + this.lineLength },
    depth
  });
  this.g.addLine({
    a: { x: mid.left.x, y: mid.left.y },
    b: { x: mid.left.x - this.lineLength, y: mid.left.y },
    depth
  });
  this.g.addLine({
    a: { x: mid.right.x, y: mid.right.y },
    b: { x: mid.right.x + this.lineLength, y: mid.right.y },
    depth
  });

  const topCY = cy - this.lineLength - this.hypotenuseSquare;
  const bottomCY = cy + this.lineLength + this.hypotenuseSquare;
  const leftCX = cx - this.lineLength - this.hypotenuseSquare;
  const rightCX = cx + this.lineLength + this.hypotenuseSquare;

  this._addRotatedSquare(cx, topCY, depth);
  this._addRotatedSquare(cx, bottomCY, depth);
  this._addRotatedSquare(leftCX, cy, depth);
  this._addRotatedSquare(rightCX, cy, depth);

  this.subdivide(cx, topCY - this.moveToBase, depth - 1);
  this.subdivide(cx, bottomCY + this.moveToBase, depth - 1);
  this.subdivide(leftCX - this.moveToBase, cy, depth - 1);
  this.subdivide(rightCX + this.moveToBase, cy, depth - 1);
};

Anklet.prototype.generate = function (patternDTO) {
  this.subdivide(this.center.x, this.center.y, this.depth);

  this.g.meta.type = "anklet";
  this.g.meta.depth = this.depth;
  this.g.meta.lineLength = this.lineLength;
  this.g.meta.squareSide = this.squareSide;

  return this.g;
};

export default {
  id: "anklet",
  name: "anklet",
  defaults: {
    center: { x: 0, y: 0 },
    lineLength: 20,
    squareSide: 20,
    depth: 3,
  },
  Generator: Anklet,
};
