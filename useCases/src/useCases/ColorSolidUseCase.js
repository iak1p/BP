import UseCase from "./usecases.base.js";

function ColorSolidUseCase(opts) {
  UseCase.call(this);
  this.color = (opts && opts.color) || "#000000";
}
ColorSolidUseCase.prototype = Object.create(UseCase.prototype);
ColorSolidUseCase.prototype.constructor = ColorSolidUseCase;

ColorSolidUseCase.prototype.apply = function (geometry) {
  const totalObjects = geometry.objects.length;
  console.log(geometry.objects);

  for (let i = 0; i < totalObjects; i++) {
    geometry.objects[i].style.color = this.color;
  }

  return geometry;
};

export default {
  id: "colorSolid",
  name: "colorSolid",
  defaults: {
    color: "#000000",
  },
  UseCase: ColorSolidUseCase,
};
