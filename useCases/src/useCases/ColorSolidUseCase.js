import UseCase from "./usecases.base.js";

export default function ColorSolidUseCase(opts) {
  UseCase.call(this);
  this.color = (opts && opts.color) || "#000000";
}
ColorSolidUseCase.prototype = Object.create(UseCase.prototype);
ColorSolidUseCase.prototype.constructor = ColorSolidUseCase;

ColorSolidUseCase.prototype.apply = function (geometry) {
  const totalSegments = geometry.segments.length;

  for (let i = 0; i < totalSegments; i++) {
    geometry.segments[i].color = this.color;
  }

  // geometry.color = this.color;
  return geometry;
};
