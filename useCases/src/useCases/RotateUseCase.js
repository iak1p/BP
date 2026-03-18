import UseCase from "./usecases.base.js";

function RotateUseCase(opts) {
  UseCase.call(this);
  this.angle = (opts && opts.angle) || 0;
}
RotateUseCase.prototype = Object.create(UseCase.prototype);
RotateUseCase.prototype.constructor = RotateUseCase;

RotateUseCase.prototype.apply = function (geometry) {
  geometry.rotate = this.angle;
  return geometry;
};

export default {
  id: "rotate",
  name: "rotate",
  defaults: {
    angle: 0,
  },
  UseCase: RotateUseCase,
};
