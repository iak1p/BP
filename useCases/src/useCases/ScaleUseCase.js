import UseCase from "./usecases.base.js";

function ScaleUseCase(opts) {
  UseCase.call(this);
  this.scale = (opts && opts.scale) || 1;
}
ScaleUseCase.prototype = Object.create(UseCase.prototype);
ScaleUseCase.prototype.constructor = ScaleUseCase;

ScaleUseCase.prototype.apply = function (geometry) {
  geometry.meta.transforms.push({ type: "scale", value: this.scale });
  return geometry;
};

export default {
  id: "scale",
  name: "scale",
  defaults: {
    scale: 1,
  },
  UseCase: ScaleUseCase,
};
