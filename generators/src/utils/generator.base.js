export function Generator() {}

Generator.prototype.generate = function () {
  throw new Error("override in child");
};

export function GeometryDTO() {
  this.objects = [];

  this.meta = {
    transforms: [],
  };

  this._seen = new Set();
}

GeometryDTO.prototype._key = function (p, q) {
  const k1 = `${p.x},${p.y}|${q.x},${q.y}`;
  const k2 = `${q.x},${q.y}|${p.x},${p.y}`;
  return k1 < k2 ? k1 : k2;
};

GeometryDTO.prototype.addLine = function ({ a, b }) {
  const key = this._key(a, b);

  if (this._seen.has(key)) return;

  this._seen.add(key);

  this.objects.push({
    type: "line",
    a,
    b,
    style: {},
  });
};

GeometryDTO.prototype._polygonKey = function (points) {
  const pts = points.map((p) => `${p.x},${p.y}`);

  const rotations = [];

  for (let i = 0; i < pts.length; i++) {
    const rotated = pts.slice(i).concat(pts.slice(0, i));
    rotations.push(rotated.join("|"));
  }

  const reversed = [...pts].reverse();

  for (let i = 0; i < reversed.length; i++) {
    const rotated = reversed.slice(i).concat(reversed.slice(0, i));
    rotations.push(rotated.join("|"));
  }

  return rotations.sort()[0];
};

GeometryDTO.prototype.addPolygon = function (points) {
  if (!Array.isArray(points) || points.length < 3) {
    throw new Error("Polygon must contain at least 3 points");
  }

  const key = this._polygonKey(points);

  if (this._seen.has(key)) return;

  this._seen.add(key);

  this.objects.push({
    type: "polygon",
    points,
    style: {},
  });
};

export function PatternDTO(type, params = {}) {
  if (!type) throw new Error("Type is required");
  this.type = type;
  this.params = params;
}
