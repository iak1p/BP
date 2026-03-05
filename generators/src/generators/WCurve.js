import { GeometryDTO, Generator } from "./generator.base.js";

export default function WCurve(opts) {
  Generator.call(this);
  this.g = new GeometryDTO();
}
WCurve.prototype = Object.create(Generator.prototype);
WCurve.prototype.constructor = WCurve;

WCurve.prototype.subdivide = function () {
};

WCurve.prototype.polygonVertices = function () {
};

WCurve.prototype.generate = function (patternDTO) {
  const depth = patternDTO.depth | 0;

  return this.g;
};
