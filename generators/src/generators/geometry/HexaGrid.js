import { GeometryDTO, Generator } from "../../utils/generator.base.js";

function HexaGrid(opts) {
  Generator.call(this);
  this.g = new GeometryDTO();

  this.center = (opts && opts.center) || { x: 400, y: 300 };
  this.sideLength = (opts && opts.sideLength) || 80;
  this.rows = (opts && opts.rows) || 6;
  this.cols = (opts && opts.cols) || 6;
}

HexaGrid.prototype = Object.create(Generator.prototype);
HexaGrid.prototype.constructor = HexaGrid;

HexaGrid.prototype.addSegment = function (a, b) {
  this.g.addLine({ a, b });
};

HexaGrid.prototype.addHexaShape = function (centerX, centerY, sideLength) {
  const middleToSideDistance = sideLength * Math.sin(Math.PI / 3);
  const distanceOfInnerPeak = (sideLength * Math.sqrt(3)) / 6;
  const innerStarSideLength = (sideLength * Math.sqrt(3)) / 3;

  const p1 = { x: centerX, y: centerY - sideLength };
  const p2 = { x: centerX + middleToSideDistance, y: centerY - sideLength / 2 };
  const p3 = { x: centerX + middleToSideDistance, y: centerY + sideLength / 2 };
  const p4 = { x: centerX, y: centerY + sideLength };
  const p5 = { x: centerX - middleToSideDistance, y: centerY + sideLength / 2 };
  const p6 = { x: centerX - middleToSideDistance, y: centerY - sideLength / 2 };

  const c23y = p2.y + (p3.y - p2.y) / 2;
  const c56y = p5.y + (p6.y - p5.y) / 2;

  this.addSegment(p1, { x: p2.x - innerStarSideLength, y: p2.y });
  this.addSegment({ x: p2.x - innerStarSideLength, y: p2.y }, p2);
  this.addSegment(p2, { x: p2.x - distanceOfInnerPeak, y: c23y });
  this.addSegment({ x: p2.x - distanceOfInnerPeak, y: c23y }, p3);
  this.addSegment(p3, { x: p3.x - innerStarSideLength, y: p3.y });
  this.addSegment({ x: p3.x - innerStarSideLength, y: p3.y }, p4);
  this.addSegment(p4, { x: p5.x + innerStarSideLength, y: p5.y });
  this.addSegment({ x: p5.x + innerStarSideLength, y: p5.y }, p5);
  this.addSegment(p5, { x: p5.x + distanceOfInnerPeak, y: c56y });
  this.addSegment({ x: p5.x + distanceOfInnerPeak, y: c56y }, p6);
  this.addSegment(p6, { x: p6.x + innerStarSideLength, y: p6.y });
  this.addSegment({ x: p6.x + innerStarSideLength, y: p6.y }, p1);
};

HexaGrid.prototype.generateRow = function (
  colIndex,
  currentX,
  currentY,
  stepX,
) {
  if (colIndex >= this.cols) return;

  this.addHexaShape(currentX, currentY, this.sideLength);
  this.generateRow(colIndex + 1, currentX + 2 * stepX, currentY, stepX);
};

HexaGrid.prototype.generateRows = function (
  rowIndex,
  currentY,
  baseX,
  stepX,
  stepY,
) {
  if (rowIndex >= this.rows) return;

  const startX = rowIndex % 2 === 0 ? baseX + stepX : baseX;

  this.generateRow(0, startX, currentY, stepX);
  this.generateRows(rowIndex + 1, currentY + stepY, baseX, stepX, stepY);
};

HexaGrid.prototype.generate = function (patternDTO) {
  const rows = patternDTO.rows ?? this.rows;
  const cols = patternDTO.cols ?? this.cols;
  const sideLength = patternDTO.sideLength ?? this.sideLength;

  this.rows = rows;
  this.cols = cols;
  this.sideLength = sideLength;

  const stepX = sideLength * Math.sin(Math.PI / 3);
  const stepY = sideLength + sideLength * Math.sin(Math.PI / 6);

  const gridWidth = (cols - 1) * 2 * stepX + 3 * stepX;
  const gridHeight = (rows - 1) * stepY + 2 * sideLength;

  const baseX = this.center.x - gridWidth / 2 + stepX;
  const startY = this.center.y - gridHeight / 2 + sideLength;

  this.generateRows(0, startY, baseX, stepX, stepY);

  this.g.meta.rows = rows;
  this.g.meta.cols = cols;
  this.g.meta.sideLength = sideLength;

  return this.g;
};

export default {
  id: "hexagrid",
  name: "hexagrid",
  defaults: {
    center: { x: 400, y: 300 },
    sideLength: 70,
    rows: 2,
    cols: 2,
  },
  Generator: HexaGrid,
};
