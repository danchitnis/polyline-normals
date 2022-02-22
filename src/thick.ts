//var util = require('polyline-miter-util')

export type Vec2 = {
  x: number;
  y: number;
};

export type NormalMiter = {
  vec2: Vec2;
  miterLength: number;
};

export const PolyLine = (points: Vec2[], closed: boolean): NormalMiter[] => {
  let curNormal = null as Vec2;
  let lineA = { x: 0, y: 0 } as Vec2;
  let lineB = { x: 0, y: 0 } as Vec2;
  let out = [] as NormalMiter[];

  if (closed) {
    points = points.slice();
    points.push(points[0]);
  }

  let totalPoints = points.length;
  for (let i = 1; i < totalPoints; i++) {
    let last = points[i - 1];
    let cur = points[i];
    let next = i < points.length - 1 ? points[i + 1] : null;

    lineA = direction(cur, last);
    if (!curNormal) {
      curNormal = normal(lineA);
    }

    const addNext = (normal: Vec2, length: number) => {
      out.push({ vec2: normal, miterLength: length } as NormalMiter);
    };

    if (i === 1)
      //add initial normals
      addNext(curNormal, 1);

    if (!next) {
      //no miter, simple segment
      curNormal = normal(lineA); //reset normal
      addNext(curNormal, 1);
    } else {
      //miter with last
      //get unit dir of next line
      lineB = direction(next, cur);

      //stores tangent & miter
      let miter = computeMiter(lineA, lineB);
      let miterLen = computeMiterLen(lineA, miter, 1);
      addNext(miter, miterLen);
    }
  }

  //if the polyline is a closed loop, clean up the last normal??????????????
  /*if (points.length > 2 && closed) {
    let last2 = points[totalPoints - 2];
    let cur2 = points[0];
    let next2 = points[1];

    lineA = direction(cur2, last2);
    lineB = direction(next2, cur2);
    curNormal = normal(lineA);

    let miterLen2 = computeMiter(lineA, lineB, 1);
    out[0].vec2 = miter;
    out[totalPoints - 1].vec2 = miter;
    out[0].vec2.y = miterLen2;
    out[totalPoints - 1].vec2.y = miterLen2;
    out.pop();
  }*/

  return out;
};

const computeMiter = (lineA: Vec2, lineB: Vec2): Vec2 => {
  //get tangent line
  let tangent = add(lineA, lineB);
  tangent = normalize(tangent);

  //get miter as a unit vector
  let miter = set(-tangent.y, tangent.x);

  return miter;
};

const computeMiterLen = (lineA: Vec2, miter: Vec2, halfThick: number): number => {
  let tmp = set(-lineA.y, lineA.x);
  //get the necessary length of our miter
  return halfThick / dot(miter, tmp);
};

const normal = (dir: Vec2): Vec2 => {
  //get perpendicular
  let out = set(-dir.y, dir.x);
  return out;
};

const direction = (a: Vec2, b: Vec2): Vec2 => {
  //get unit dir of two lines
  let out = subtract(a, b);
  out = normalize(out);
  return out;
};

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
const add = (a: Vec2, b: Vec2): Vec2 => {
  let out = { x: 0, y: 0 } as Vec2;
  out.x = a.x + b.x;
  out.y = a.y + b.y;
  return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
const dot = (a: Vec2, b: Vec2): number => {
  return a.x * b.x + a.y * b.y;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
const normalize = (a: Vec2): Vec2 => {
  let out = { x: 0, y: 0 } as Vec2;
  let len = a.x * a.x + a.y * a.y;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out.x = a.x * len;
    out.y = a.y * len;
  }
  return out;
};

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
const set = (x: number, y: number): Vec2 => {
  let out = { x: 0, y: 0 } as Vec2;
  out.x = x;
  out.y = y;
  return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
const subtract = (a: Vec2, b: Vec2): Vec2 => {
  let out = { x: 0, y: 0 } as Vec2;
  out.x = a.x - b.x;
  out.y = a.y - b.y;
  return out;
};
