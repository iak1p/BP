import fs from "fs";
import { createCanvas } from "canvas";
import path from "path";

export default function CanvasRenderer(opt) {
  this.bgColor = (opt && opt.bgColor) || "#000000";
  this.width = (opt && opt.width) || 800;
  this.height = (opt && opt.height) || 600;
}

CanvasRenderer.prototype.render = function (geometry) {
  const segments = geometry.segments || [];
  const circles = geometry.circles || [];

  const canvas = createCanvas(this.width, this.height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = this.bgColor;
  ctx.fillRect(0, 0, this.width, this.height);

  ctx.save();

  const cx = this.width / 2;
  const cy = this.height / 2;

  if (geometry.scale) {
    ctx.translate(cx, cy);
    ctx.scale(geometry.scale, geometry.scale);
    ctx.translate(-cx, -cy);
  }

  if (geometry.rotate) {
    ctx.translate(cx, cy);
    ctx.rotate((geometry.rotate * Math.PI) / 180);
    ctx.translate(-cx, -cy);
  }

  for (const seg of segments) {
    ctx.beginPath();
    ctx.moveTo(seg.a.x, seg.a.y);
    ctx.lineTo(seg.b.x, seg.b.y);
    ctx.lineWidth = seg.width || 1;
    ctx.strokeStyle = seg.color || "#afafaf";
    ctx.stroke();
  }

  // for (const c of circles) {
  //   ctx.beginPath();
  //   ctx.arc(c.c.x, c.c.y, c.r, 0, Math.PI * 2, true);

  //   if (c.fillColor) {
  //     ctx.fillStyle = c.fillColor;
  //     ctx.fill();
  //   }
  //   ctx.lineWidth = c.width || 2;
  //   ctx.strokeStyle = c.color || "#afafaf";
  //   ctx.stroke();
  // }

  ctx.restore();

  const dir = "./src/data";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const out = fs.createWriteStream(`${dir}/file_${Date.now()}.png`);
  // const out = fs.createWriteStream(`./src/data/file_${Date.now()}.png`);
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on("finish", () => console.log("Saved → 1.png"));

  return canvas;
};
