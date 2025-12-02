import { GeometryDTO, Generator, PatternDTO } from "./generator.base.js";

export default function Anklet(opts) {
  Generator.call(this);
  this.g = new GeometryDTO();
  this.center = (opts && opts.center) || { x: 0, y: 0 };
  this.lineLength = (opts && opts.lineLength) || 20;
  this.squareSide = (opts && opts.squareSide) || 20;

  this.hypotenuseSquare = Math.round(
    Math.sqrt(2 * this.squareSide * this.squareSide)
  );
  this.halfHyp = Math.round(this.hypotenuseSquare / 2);
  this.moveToBase = this.lineLength + this.hypotenuseSquare;
}

Anklet.prototype._addRotatedSquare = function (cx, cy) {
  const h = this.halfHyp;

  const top = { x: cx, y: cy - h };
  const right = { x: cx + h, y: cy };
  const bottom = { x: cx, y: cy + h };
  const left = { x: cx - h, y: cy };

  this.g.addSegment({ a: top, b: right });
  this.g.addSegment({ a: right, b: bottom });
  this.g.addSegment({ a: bottom, b: left });
  this.g.addSegment({ a: left, b: top });

  return { top, right, bottom, left };
};

Anklet.prototype.subdivide = function (cx, cy, depth) {
  if (depth <= 0) return;

  const mid = this._addRotatedSquare(cx, cy);

  this.g.addSegment({
    a: { x: mid.top.x, y: mid.top.y },
    b: { x: mid.top.x, y: mid.top.y - this.lineLength },
  });
  this.g.addSegment({
    a: { x: mid.bottom.x, y: mid.bottom.y },
    b: { x: mid.bottom.x, y: mid.bottom.y + this.lineLength },
  });
  this.g.addSegment({
    a: { x: mid.left.x, y: mid.left.y },
    b: { x: mid.left.x - this.lineLength, y: mid.left.y },
  });
  this.g.addSegment({
    a: { x: mid.right.x, y: mid.right.y },
    b: { x: mid.right.x + this.lineLength, y: mid.right.y },
  });

  const topCY = cy - this.lineLength - this.hypotenuseSquare;
  const bottomCY = cy + this.lineLength + this.hypotenuseSquare;
  const leftCX = cx - this.lineLength - this.hypotenuseSquare;
  const rightCX = cx + this.lineLength + this.hypotenuseSquare;

  this._addRotatedSquare(cx, topCY);
  this._addRotatedSquare(cx, bottomCY);
  this._addRotatedSquare(leftCX, cy);
  this._addRotatedSquare(rightCX, cy);

  this.subdivide(cx, topCY - this.moveToBase, depth - 1);
  this.subdivide(cx, bottomCY + this.moveToBase, depth - 1);
  this.subdivide(leftCX - this.moveToBase, cy, depth - 1);
  this.subdivide(rightCX + this.moveToBase, cy, depth - 1);
};

Anklet.prototype.generate = function (patternDTO) {
  const depth =
    patternDTO && Number.isFinite(patternDTO.depth) ? patternDTO.depth : 1;

  this.subdivide(this.center.x, this.center.y, depth);

  this.g.meta.type = "anklet";
  this.g.meta.depth = depth;
  this.g.meta.lineLength = this.lineLength;
  this.g.meta.squareSide = this.squareSide;

  return this.g;
};