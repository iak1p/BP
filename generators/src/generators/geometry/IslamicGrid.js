import { GeometryDTO, Generator } from "../../utils/generator.base.js";

function IslamicGrid(opts) {
  Generator.call(this);

  this.g = new GeometryDTO();
  this.center = opts?.center || { x: 400, y: 300 };
  this.size = opts?.size || 80;
  this.rows = opts?.rows || 6;
  this.cols = opts?.cols || 6;
}

IslamicGrid.prototype = Object.create(Generator.prototype);
IslamicGrid.prototype.constructor = IslamicGrid;

IslamicGrid.prototype.addLine = function (x1, y1, x2, y2) {
  this.g.addSegment({
    a: { x: x1, y: y1 },
    b: { x: x2, y: y2 },
  });
};

IslamicGrid.prototype.drawTile = function (sideLength, centerX, centerY) {
  const d = (sideLength * Math.sqrt(2)) / 2;
  const s = sideLength * Math.sqrt(3 / 2 - Math.sqrt(2));

  const topX = centerX;
  const topY = centerY - sideLength;

  const rightX = centerX + sideLength;
  const rightY = centerY;

  const bottomX = centerX;
  const bottomY = centerY + sideLength;

  const leftX = centerX - sideLength;
  const leftY = centerY;

  const topLeftX = centerX - d;
  const topLeftY = centerY - d;

  const topRightX = centerX + d;
  const topRightY = centerY - d;

  const bottomLeftX = centerX - d;
  const bottomLeftY = centerY + d;

  const bottomRightX = centerX + d;
  const bottomRightY = centerY + d;

  const sepRightX = centerX + s;
  const sepLeftX = centerX - s;
  const sepTopY = centerY - s;
  const sepBottomY = centerY + s;

  this.addLine(topX, topY, sepRightX, topRightY);
  this.addLine(sepRightX, topRightY, topRightX, topRightY);
  this.addLine(topRightX, topRightY, topRightX, sepTopY);
  this.addLine(topRightX, sepTopY, rightX, rightY);

  this.addLine(rightX, rightY, bottomRightX, sepBottomY);
  this.addLine(bottomRightX, sepBottomY, bottomRightX, bottomRightY);
  this.addLine(bottomRightX, bottomRightY, sepRightX, bottomRightY);
  this.addLine(sepRightX, bottomRightY, bottomX, bottomY);

  this.addLine(bottomX, bottomY, sepLeftX, bottomLeftY);
  this.addLine(sepLeftX, bottomLeftY, bottomLeftX, bottomLeftY);
  this.addLine(bottomLeftX, bottomLeftY, bottomLeftX, sepBottomY);
  this.addLine(bottomLeftX, sepBottomY, leftX, leftY);

  this.addLine(leftX, leftY, topLeftX, sepTopY);
  this.addLine(topLeftX, sepTopY, topLeftX, topLeftY);
  this.addLine(topLeftX, topLeftY, sepLeftX, topLeftY);
  this.addLine(sepLeftX, topLeftY, topX, topY);
};

// no recursive

IslamicGrid.prototype.generateGrid = function () {
  const tileSize = this.size;
  const step = tileSize * 2;

  const totalWidth = this.cols * step;
  const totalHeight = this.rows * step;

  const startX = this.center.x - totalWidth / 2 + tileSize;
  const startY = this.center.y - totalHeight / 2 + tileSize;

  for (let row = 0; row < this.rows; row++) {
    for (let col = 0; col < this.cols; col++) {
      const x = startX + col * step;
      const y = startY + row * step;
      this.drawTile(tileSize, x, y);
    }
  }
};

IslamicGrid.prototype.generate = function (patternDTO = {}) {
  this.size = patternDTO.size ?? this.size;
  this.rows = patternDTO.rows ?? this.rows;
  this.cols = patternDTO.cols ?? this.cols;

  this.generateGrid();

  this.g.meta.size = this.size;
  this.g.meta.rows = this.rows;
  this.g.meta.cols = this.cols;

  return this.g;
};

export default {
  id: "islamicgrid",
  name: "islamicgrid",
  defaults: {
    center: { x: 400, y: 300 },
    size: 70,
    rows: 2,
    cols: 2,
  },
  Generator: IslamicGrid,
};