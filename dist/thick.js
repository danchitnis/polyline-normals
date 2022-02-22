//var util = require('polyline-miter-util')
import { add, normal, direction, normalize, set, dot } from "./vecTools.js";
export const PolyLine = (points, closed) => {
    let curNormal = null;
    let lineA = { x: 0, y: 0 };
    let lineB = { x: 0, y: 0 };
    let out = [];
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
        const addNext = (normal, length) => {
            out.push({ vec2: normal, miterLength: length });
        };
        if (i === 1)
            //add initial normals
            addNext(curNormal, 1);
        if (!next) {
            //no miter, simple segment
            curNormal = normal(lineA); //reset normal
            addNext(curNormal, 1);
        }
        else {
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
const computeMiter = (lineA, lineB) => {
    //get tangent line
    let tangent = add(lineA, lineB);
    tangent = normalize(tangent);
    //get miter as a unit vector
    let miter = set(-tangent.y, tangent.x);
    return miter;
};
const computeMiterLen = (lineA, miter, halfThick) => {
    let tmp = set(-lineA.y, lineA.x);
    //get the necessary length of our miter
    return halfThick / dot(miter, tmp);
};
//# sourceMappingURL=thick.js.map