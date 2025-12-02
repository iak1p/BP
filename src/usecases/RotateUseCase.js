import UseCase from "./usecases.base.js";

export default function RotateUseCase(opts) {
  UseCase.call(this);
  this.angle = (opts && opts.angle) || 0;
  this.theta = (this.angle * Math.PI) / 180;
  this.cos = Math.cos(this.theta);
  this.sin = Math.sin(this.theta);
  this.pivot = (opts && opts.pivot) || { x: 0, y: 0 };
  this.eps = (opts && opts.eps) || 0;
}
RotateUseCase.prototype = Object.create(UseCase.prototype);
RotateUseCase.prototype.constructor = RotateUseCase;

RotateUseCase.prototype.apply = function (geometry) {
  const cx = this.pivot.x,
    cy = this.pivot.y;

  const totalSegments = geometry.segments.length;
  for (let i = 0; i < totalSegments; i++) {
    const seg = geometry.segments[i];
    seg.a = this.rotatePoint(seg.a, cx, cy);
    seg.b = this.rotatePoint(seg.b, cx, cy);
  }
  // geometry.rotate = this.angle;
  return geometry;
};

RotateUseCase.prototype.rotatePoint = function (p, cx, cy) {
  const dx = p.x - cx;
  const dy = p.y - cy;
  let x = cx + dx * this.cos - dy * this.sin;
  let y = cy + dx * this.sin + dy * this.cos;

  if (this.eps > 0) {
    if (Math.abs(x) < this.eps) x = 0;
    if (Math.abs(y) < this.eps) y = 0;
  }
  return { x, y };
};
