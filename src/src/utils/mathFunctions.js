// Common mathematical functions for use in Plotly visualizations

export const commonFunctions = {
  // Linear functions
  linear: (a = 1, b = 0) => ({
    expression: `${a} * x + ${b}`,
    name: `f(x) = ${a}x + ${b}`
  }),

  // Polynomial functions
  quadratic: (a = 1, b = 0, c = 0) => ({
    expression: `${a} * x * x + ${b} * x + ${c}`,
    name: `f(x) = ${a}x² + ${b}x + ${c}`
  }),

  cubic: (a = 1, b = 0, c = 0, d = 0) => ({
    expression: `${a} * x * x * x + ${b} * x * x + ${c} * x + ${d}`,
    name: `f(x) = ${a}x³ + ${b}x² + ${c}x + ${d}`
  }),

  // Activation functions
  sigmoid: () => ({
    expression: '1 / (1 + Math.exp(-x))',
    name: 'σ(x) = 1/(1 + e^(-x))'
  }),

  relu: () => ({
    expression: 'Math.max(0, x)',
    name: 'ReLU(x) = max(0, x)'
  }),

  leakyRelu: (alpha = 0.01) => ({
    expression: `x > 0 ? x : ${alpha} * x`,
    name: `LeakyReLU(x, α=${alpha})`
  }),

  tanh: () => ({
    expression: 'Math.tanh(x)',
    name: 'tanh(x)'
  }),

  // Trigonometric functions
  sin: () => ({
    expression: 'Math.sin(x)',
    name: 'sin(x)'
  }),

  cos: () => ({
    expression: 'Math.cos(x)',
    name: 'cos(x)'
  }),

  // Exponential and logarithmic
  exp: () => ({
    expression: 'Math.exp(x)',
    name: 'e^x'
  }),

  log: () => ({
    expression: 'Math.log(x)',
    name: 'ln(x)'
  }),

  // Special functions
  gaussian: (mu = 0, sigma = 1) => ({
    expression: `(1 / (${sigma} * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - ${mu}) / ${sigma}, 2))`,
    name: `N(${mu}, ${sigma}²)`
  }),

  // 3D functions
  paraboloid: () => ({
    expression: 'x * x + y * y',
    name: 'f(x,y) = x² + y²'
  }),

  saddle: () => ({
    expression: 'x * x - y * y',
    name: 'f(x,y) = x² - y²'
  }),

  ripple: () => ({
    expression: 'Math.sin(Math.sqrt(x * x + y * y))',
    name: 'f(x,y) = sin(√(x² + y²))'
  }),

  gaussian2D: (sigma = 1) => ({
    expression: `Math.exp(-(x * x + y * y) / (2 * ${sigma} * ${sigma}))`,
    name: `Gaussian(σ=${sigma})`
  })
};

// Helper to create gradient descent visualization data
export function createGradientDescentPath(fn, derivative, startX, learningRate, iterations) {
  const path = [];
  let x = startX;
  
  for (let i = 0; i < iterations; i++) {
    const y = fn(x);
    const grad = derivative(x);
    path.push({ x, y, grad, iteration: i });
    x = x - learningRate * grad;
  }
  
  return path;
}

// Helper to create contour plot data for 2D functions
export function createContourData(fn, xRange, yRange, resolution = 50) {
  const x = [];
  const y = [];
  const z = [];
  
  const xStep = (xRange[1] - xRange[0]) / resolution;
  const yStep = (yRange[1] - yRange[0]) / resolution;
  
  for (let i = 0; i <= resolution; i++) {
    x.push(xRange[0] + i * xStep);
    y.push(yRange[0] + i * yStep);
  }
  
  for (let i = 0; i <= resolution; i++) {
    z[i] = [];
    for (let j = 0; j <= resolution; j++) {
      z[i][j] = fn(x[j], y[i]);
    }
  }
  
  return { x, y, z };
}