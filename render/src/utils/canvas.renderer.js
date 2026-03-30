import fs from "fs";
import { createCanvas } from "canvas";

export default function CanvasRenderer(opt) {
  this.bgColor = (opt && opt.bgColor) || "#000000";
  this.width = (opt && opt.width) || 800;
  this.height = (opt && opt.height) || 600;
}

// CanvasRenderer.prototype.drawLine = function (ctx, seg) {
//   // console.log(seq);

//   ctx.beginPath();
//   ctx.moveTo(seg.a.x, seg.a.y);
//   ctx.lineTo(seg.b.x, seg.b.y);

//   ctx.strokeStyle = seg.color || "#afafaf";
//   ctx.lineWidth = seg.width || 1;
//   ctx.stroke();
// };

CanvasRenderer.prototype.drawLine = function (ctx, line) {
  const { style = {} } = line;
  ctx.beginPath();
  ctx.moveTo(line.a.x, line.a.y);
  ctx.lineTo(line.b.x, line.b.y);

  ctx.strokeStyle = style.color || "#afafaf";
  ctx.lineWidth = style.width || 1;
  ctx.stroke();
};

CanvasRenderer.prototype.drawPolygon = function (ctx, polygon) {
  const { points = [], style = {} } = polygon;
  console.log(polygon);

  if (!Array.isArray(points) || points.length < 3) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.closePath();

  // if (style.fillColor) {
  //   ctx.fillStyle = style.fillColor;
  //   ctx.fill();
  // }

  ctx.strokeStyle = style.color || "#afafaf";
  ctx.lineWidth = style.width || 1;
  ctx.stroke();
};

CanvasRenderer.prototype.render = function (geometry) {
  const canvas = createCanvas(this.width, this.height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = this.bgColor;
  ctx.fillRect(0, 0, this.width, this.height);

  ctx.save();

  const cx = this.width / 2;
  const cy = this.height / 2;

  const transforms = geometry.meta?.transforms || [];

  for (const transform of transforms) {    
    switch (transform.type) {
      case "scale":
        ctx.translate(cx, cy);
        ctx.scale(transform.value, transform.value);
        ctx.translate(-cx, -cy);
        break;

      case "rotate":
        ctx.translate(cx, cy);
        ctx.rotate((transform.value * Math.PI) / 180);
        ctx.translate(-cx, -cy);
        break;
    }
  }

  const objects = geometry.objects || [];

  for (const obj of objects) {
    switch (obj.type) {
      case "line":
        this.drawLine(ctx, obj);
        break;

      case "polygon":
        this.drawPolygon(ctx, obj);
        break;

      default:
        console.warn(`Unsupported object type: ${obj.type}`);
        break;
    }
  }

  ctx.restore();

  const dir = "./src/data";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const fileName = Date.now();
  const out = fs.createWriteStream(`${dir}/file_${fileName}.png`);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on("finish", () => console.log(`Saved → file_${fileName}.png`));

  return canvas;
};
