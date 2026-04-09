import { GeometryDTO, Generator } from "../../utils/generator.base.js";

function IslamicSquare(opts) {
  Generator.call(this);

  this.g = new GeometryDTO();
  this.center = opts?.center || { x: 400, y: 300 };
  this.size = opts?.size || 80;
  this.rows = opts?.rows || 6;
  this.cols = opts?.cols || 6;
}

IslamicSquare.prototype = Object.create(Generator.prototype);
IslamicSquare.prototype.constructor = IslamicSquare;

IslamicSquare.prototype.drawTile = function (sideLength, centerX, centerY) {
  const d = (sideLength * Math.sqrt(2)) / 2;

  const top = { x: centerX, y: centerY - sideLength };
  const right = { x: centerX + sideLength, y: centerY };
  const bottom = { x: centerX, y: centerY + sideLength };
  const left = { x: centerX - sideLength, y: centerY };

  const topLeft = { x: centerX - d, y: centerY - d };
  const topRight = { x: centerX + d, y: centerY - d };
  const bottomRight = { x: centerX + d, y: centerY + d };
  const bottomLeft = { x: centerX - d, y: centerY + d };

  //   this.addLine(top.x, top.y, topRight.x, topRight.y);
  //   this.addLine(topRight.x, topRight.y, right.x, right.y);
  //   this.addLine(right.x, right.y, bottomRight.x, bottomRight.y);
  //   this.addLine(bottomRight.x, bottomRight.y, bottom.x, bottom.y);
  //   this.addLine(bottom.x, bottom.y, bottomLeft.x, bottomLeft.y);
  //   this.addLine(bottomLeft.x, bottomLeft.y, left.x, left.y);
  //   this.addLine(left.x, left.y, topLeft.x, topLeft.y);
  //   this.addLine(topLeft.x, topLeft.y, top.x, top.y);

  this.g.addPolygon(
    [top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft],
    // {
    //   strokeColor: "#afafaf",
    //   strokeWidth: 1,
    //   fillColor: null,
    // },
  );
};

// no recursive

IslamicSquare.prototype.generateGrid = function () {
  const tileSize = this.size;
  const startX = this.center.x - ((this.cols - 1) * tileSize * 2) / 2;
  const startY = this.center.y - ((this.rows - 1) * tileSize * 2) / 2;

  for (let row = 0; row < this.rows; row++) {
    for (let col = 0; col < this.cols; col++) {
      const x = startX + col * tileSize * 2;
      const y = startY + row * tileSize * 2;
      this.drawTile(tileSize, x, y);
    }
  }
};

IslamicSquare.prototype.generate = function () {
  this.generateGrid();

  this.g.meta.size = this.size;
  this.g.meta.rows = this.rows;
  this.g.meta.cols = this.cols;

  return this.g;
};

export default {
  id: "islamicsquare",
  name: "islamicsquare",
  defaults: {
    center: { x: 0, y: 0 },
    size: 70,
    rows: 2,
    cols: 2,
  },
  Generator: IslamicSquare,
};
