import { scaleAndAdd, Vec2 } from "./vecTools.js";
import { PolyLine } from "./thick.js";

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */

let line = [
  { x: 100, y: 100 },
  { x: 200, y: 100 },
  { x: 300, y: 200 },
  { x: 200, y: 200 },
] as Vec2[];

let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d");

let thick = 25;
let halfThick = thick / 2;
let pointSize = 4;

let top = [] as Vec2[];
let bot = [] as Vec2[];

let normals = PolyLine(line, false);

console.log(normals);

line.forEach((point, index) => {
  let norm = normals[index].vec2;
  let len = normals[index].miterLength;

  ctx.fillStyle = "white";
  ctx.fillRect(point.x - pointSize / 2, point.y - pointSize / 2, pointSize, pointSize);

  ctx.strokeStyle = "white";
  ctx.beginPath();
  let tmp = scaleAndAdd(point, norm, len * halfThick);
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(tmp.x, tmp.y);
  top.push(tmp);

  tmp = scaleAndAdd(point, norm, -len * halfThick);
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(tmp.x, tmp.y);
  ctx.stroke();
  bot.push(tmp);
});

//edges
ctx.globalAlpha = 1;

ctx.beginPath();
top.forEach((t) => {
  ctx.lineTo(t.x, t.y);
});
ctx.stroke();

ctx.beginPath();
bot.forEach((t) => {
  ctx.lineTo(t.x, t.y);
});
ctx.stroke();
