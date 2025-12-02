import UseCase from "./usecases.base.js";

export default function ScaleUseCase(opts) {
  UseCase.call(this);
  this.scale = (opts && opts.scale) || 1;
  this.pivot = (opts && opts.pivot) || { x: 0, y: 0 };
}
ScaleUseCase.prototype = Object.create(UseCase.prototype);
ScaleUseCase.prototype.constructor = ScaleUseCase;

ScaleUseCase.prototype.apply = function (geometry) {
  // const cx = this.pivot.x,
  //   cy = this.pivot.y;

  // const n = geometry.segments.length;
  // for (let i = 0; i < n; i++) {
  //   const a = geometry.segments[i].a;
  //   const b = geometry.segments[i].b;

  //   a.x = cx + (a.x - cx) * this.scale;
  //   a.y = cy + (a.y - cy) * this.scale;
  //   b.x = cx + (b.x - cx) * this.scale;
  //   b.y = cy + (b.y - cy) * this.scale;
  // }

  geometry.scale = this.scale;
  return geometry;
};
