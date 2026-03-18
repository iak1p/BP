import UseCase from "./usecases.base.js";

export default function LineWidthUseCase(opts) {
  UseCase.call(this);
  this.width = (opts && opts.width) || 1;
}
LineWidthUseCase.prototype = Object.create(UseCase.prototype);
LineWidthUseCase.prototype.constructor = LineWidthUseCase;

LineWidthUseCase.prototype.apply = function (geometry) {
  const totalSegments = geometry.segments.length;

  for (let i = 0; i < totalSegments; i++) {
    geometry.segments[i].width = this.width;
  }

  return geometry;
};
