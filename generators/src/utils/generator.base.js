export function Generator() {}

Generator.prototype.generate = function () {
  throw new Error("override in child");
};

export function GeometryDTO() {
  this.segments = [];
  this.circles = [];
  this.meta = {};
  this._seen = new Set();
}

GeometryDTO.prototype._key = function (p, q) {
  const k1 = `${p.x},${p.y}|${q.x},${q.y}`;
  const k2 = `${q.x},${q.y}|${p.x},${p.y}`;
  return k1 < k2 ? k1 : k2;
};

GeometryDTO.prototype.addSegment = function ({ a, b }) {
  const key = this._key(a, b);
  if (this._seen.has(key)) return;
  this._seen.add(key);
  this.segments.push({ a, b });
};

// export function GeometryDTO() {
//   this.segments = [];
//   this.circles = [];
//   this.meta = {};
// }

// GeometryDTO.prototype.addSegment = function ({ a, b }) {
//   this.segments.push({
//     a: a,
//     b: b,
//   });
// };

export function PatternDTO(type, depth) {
  this.type = type;
  this.depth = depth | 0;
}
