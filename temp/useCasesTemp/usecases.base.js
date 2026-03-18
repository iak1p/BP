export default function UseCase() {}

UseCase.prototype.apply = function () {
  throw new Error("override in child");
};
