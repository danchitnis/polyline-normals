/**
 * https://www.tutorialspoint.com/webgl/webgl_drawing_a_triangle.htm
 * https://webglfundamentals.org/webgl/lessons/webgl-points-lines-triangles.html
 */

import { draw } from "./webgl.js";
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

//let vertices = new Float32Array([0, 0, 0.0, 0.5, 0.5, 0.0]);
let triPoints = [] as number[];

let normals = PolyLine(line, false);

//let sideTop = [] as Vec2[];
//let sideBot = [] as Vec2[];

for (let i = 0; i < line.length; i++) {
  let top = scaleAndAdd(line[i], normals[i].vec2, normals[i].miterLength * halfThick);
  //sideTop.push(top);
  triPoints.push(top.x, top.y);
  let bot = scaleAndAdd(line[i], normals[i].vec2, -normals[i].miterLength * halfThick);
  //sideBot.push(bot);
  triPoints.push(bot.x, bot.y);
}

/*for (let i = 0; i < line.length; i++) {
  triPoints.push(sideTop[i].x, sideTop[i].y);
  triPoints.push(sideBot[i].x, sideBot[i].y);
}*/

let vertices = new Float32Array(triPoints);

draw(canvas, vertices);
