import UseCase from "./usecases.base.js";

function LineWidthUseCase(opts) {
  UseCase.call(this);
  this.width = (opts && opts.width) || 1;
}
LineWidthUseCase.prototype = Object.create(UseCase.prototype);
LineWidthUseCase.prototype.constructor = LineWidthUseCase;

LineWidthUseCase.prototype.apply = function (geometry) {
  const totalObjects = geometry.objects.length;
  console.log(geometry.objects);

  for (let i = 0; i < totalObjects; i++) {
    geometry.objects[i].style.width = this.width;
  }

  return geometry;
};

export default {
  id: "width",
  name: "width",
  defaults: {
    width: 1,
  },
  UseCase: LineWidthUseCase,
};
