import { PatternDTO } from "./src/generators/generator.base.js";
import Koch from "./src/generators/Koch.js";
import createUseCase from "./src/usecases/registers.js";
import CanvasRenderer from "./src/adapter/canvas.renderer.js";
import Sierpinsky from "./src/generators/Serpinsky.js";
import Anklet from "./src/generators/anklet.js";

// import { app, BrowserWindow } from "electron";

// app.whenReady().then(() => {
//   const win = new BrowserWindow({
//     width: 300,
//     height: 200,
//     webPreferences: {
//       nodeIntegration: true,
//     },
//   });

//   win.loadFile("./index.html");
// });

var patternKoch = new PatternDTO("koch", 2);
var patternAnklet = new PatternDTO("anklet", 4);
var patternSierpinsky = new PatternDTO("sierpinsky", 2);

const koch = new Koch({
  center: { x: 400, y: 300 },
  size: 200,
  sides: 2,
});
const anklet = new Anklet({
  center: { x: 400, y: 300 },
  lineLength: 10,
  squareSide: 20,
});
const sierpinsky = new Sierpinsky({
  center: { x: 400, y: 300 },
  size: 400,
});

let geometry = koch.generate(patternKoch);
// let geometry = sierpinsky.generate(patternSierpinsky);
// let geometry = anklet.generate(patternAnklet);

const useCase = createUseCase({
  name: "colorSolid",
  color: "#797a39ff",
});

const useCase2 = createUseCase({
  name: "scale",
  scale: 1.5,
  pivot: { x: 400, y: 300 },
});

const useCase3 = createUseCase({
  name: "rotate",
  angle: 45,
  pivot: { x: 400, y: 300 },
  // eps: 20,
});

const useCase4 = createUseCase({
  name: "width",
  width: 2,
});

// NOT WORKING
// const useCase4 = createUseCase({
//   name: "colorDepth",
//   hueStart: 239,
//   hueEnd: 25,
//   sat: 90,
//   light: 99,
// });

geometry = useCase.apply(geometry);
// geometry = useCase2.apply(geometry);
// geometry = useCase3.apply(geometry);
// geometry = useCase4.apply(geometry);

// NOT WORKING
// geometry = useCase4.apply(geometry);

const renderer = new CanvasRenderer({
  bgColor: "#000000",
  width: 800,
  height: 600,
});
delete geometry._seen;
renderer.render(geometry);
console.log(geometry);

import express from "express";
import cors from "cors";

import canvasRoutes from "./src/adapter/canvas.renderer.routes.js";

export const app = express();

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(4000, async () => {
  console.log(`Server running on port ${4000}`);
});

app.use("/api/canvas", canvasRoutes);

fetch("http://localhost:4000/api/canvas/render", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    geometry,
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
// короче сделать pipeline потом  создать локальную датабазу через докер