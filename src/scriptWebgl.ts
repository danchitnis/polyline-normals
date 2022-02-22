/**
 *
 */

import { drawTriangles } from "./webgl.js";
import { PolyLine } from "./thick.js";
import { Vec2, scaleAndAdd } from "./vecTools.js";

/*============== Creating a canvas ====================*/
let canvas = document.getElementById("canvas") as HTMLCanvasElement;

let line = [
  { x: -0.8, y: 0.8 },
  { x: 0.5, y: 0.8 },
  { x: 0.0, y: 0.0 },
  { x: -0.4, y: 0.0 },
] as Vec2[];

let thick = 0.1;
let halfThick = thick / 2;

let triPoints = [] as number[];

let normals = PolyLine(line, false);

for (let i = 0; i < line.length; i++) {
  let top = scaleAndAdd(line[i], normals[i].vec2, normals[i].miterLength * halfThick);
  let bot = scaleAndAdd(line[i], normals[i].vec2, -normals[i].miterLength * halfThick);
  triPoints.push(top.x, top.y, bot.x, bot.y);
}

let vertices = new Float32Array(triPoints);

drawTriangles(canvas, vertices);
