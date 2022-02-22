/**
 *
 * https://www.tutorialspoint.com/webgl/webgl_drawing_a_triangle.htm
 * https://webglfundamentals.org/webgl/lessons/webgl-points-lines-triangles.html
 */

export const drawTriangles = (canvas: HTMLCanvasElement, vertices: Float32Array) => {
  let gl = canvas.getContext("webgl");
  /*======== Defining and storing the geometry ===========*/

  //let vertices = new Float32Array([0, 0, 0.0, 0.5, 0.5, 0.0]);

  // Create an empty buffer object to store vertex buffer
  let vertexBuffer = gl.createBuffer();

  // Bind appropriate array buffer to it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Pass the vertex data to the buffer
  gl.bufferData(gl.ARRAY_BUFFER, vertices as ArrayBuffer, gl.STREAM_DRAW);

  // Unbind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  /*================ Shaders ====================*/

  // Vertex shader source code
  let vertCode = `
    attribute vec2 coordinates;
    uniform mat2 uscale;
    uniform vec2 uoffset;
  
    void main(void) {
      gl_Position = vec4(uscale*coordinates + uoffset, 0.0, 1.0);
    }`;

  // Create a vertex shader object
  let vertShader = gl.createShader(gl.VERTEX_SHADER);

  // Attach vertex shader source code
  gl.shaderSource(vertShader, vertCode);

  // Compile the vertex shader
  gl.compileShader(vertShader);

  //fragment shader source code
  let fragCode = `
      void main(void) {
          gl_FragColor = vec4(0.9, 0.9, 0.9, 0.1);
      }`;

  // Create fragment shader object
  let fragShader = gl.createShader(gl.FRAGMENT_SHADER);

  // Attach fragment shader source code
  gl.shaderSource(fragShader, fragCode);

  // Compile the fragmentt shader
  gl.compileShader(fragShader);

  // Create a shader program object to store
  // the combined shader program
  let shaderProgram = gl.createProgram();

  // Attach a vertex shader
  gl.attachShader(shaderProgram, vertShader);

  // Attach a fragment shader
  gl.attachShader(shaderProgram, fragShader);

  // Link both the programs
  gl.linkProgram(shaderProgram);

  // Use the combined shader program object
  gl.useProgram(shaderProgram);

  /*======= Associating shaders to buffer objects =======*/

  // Bind vertex buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  // Bind index buffer object
  //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // Get the attribute location
  let coord = gl.getAttribLocation(shaderProgram, "coordinates");

  // Point an attribute to the currently bound VBO
  gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

  // Enable the attribute
  gl.enableVertexAttribArray(coord);

  /****
   * slsls
   *
   */
  const scale = [1, 1];
  const uscale = gl.getUniformLocation(shaderProgram, "uscale");
  gl.uniformMatrix2fv(uscale, false, new Float32Array([scale[0], 0, 0, scale[1]]));

  const offset = [0, 0];
  const uoffset = gl.getUniformLocation(shaderProgram, "uoffset");
  gl.uniform2fv(uoffset, new Float32Array([offset[0], offset[1]]));
  /*=========Drawing the triangle===========*/

  // Clear the canvas
  gl.clearColor(0.1, 0.1, 0.1, 1.0);

  // Enable the depth test
  gl.enable(gl.DEPTH_TEST);

  // Clear the color buffer bit
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set the view port
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Draw the triangle
  //gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 2);
};
