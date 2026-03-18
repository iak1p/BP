import UseCase from "./usecases.base.js";

export default function ColorByDepthUseCase(opts) {
  UseCase.call(this);
  this.hueStart = (opts && opts.hueStart) || 0;
  this.hueEnd = (opts && opts.hueEnd) || 300;
  this.sat = (opts && opts.sat) || 100;
  this.light = (opts && opts.light) || 50;
}
ColorByDepthUseCase.prototype = Object.create(UseCase.prototype);
ColorByDepthUseCase.prototype.constructor = ColorByDepthUseCase;

ColorByDepthUseCase.prototype.apply = function (geometry) {
  const totalDepth = geometry.meta?.depth ?? 1;
  const segs = geometry.segments;
  const n = segs.length;

  for (let i = 0; i < n; i++) {
    const seg = segs[i];
    const d = seg.depth ?? (i / n) * totalDepth;
    const hue =
      this.hueStart + ((this.hueEnd - this.hueStart) * d) / totalDepth;
    seg.color = `hsl(${hue}, ${this.sat}%, ${this.light}%)`;
  }
  return geometry;
};
