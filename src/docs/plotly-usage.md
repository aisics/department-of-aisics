# Using Plotly.js for Interactive Mathematical Visualizations

This guide explains how to use Plotly.js to create interactive mathematical visualizations in your MDX articles.

## Setup

Plotly.js is already installed and configured in this project. The following components are available for use:

1. **PlotlyFunction.astro** - Full-featured component for 2D and 3D plots
2. **MathPlotSimple.astro** - Simplified component for single 2D function plots

## Basic Usage

### Simple 2D Plot

For a single function, use the `MathPlotSimple` component:

```mdx
import MathPlotSimple from '../../../../components/MathPlotSimple.astro';

<MathPlotSimple
  expression="x * x"
  name="f(x) = x²"
  title="Quadratic Function"
  xRange={[-5, 5]}
  yRange={[-1, 25]}
  color="#3498DB"
/>
```

### Multiple Functions on Same Plot

Use `PlotlyFunction` for multiple functions:

```mdx
import PlotlyFunction from '../../../../components/PlotlyFunction.astro';

<PlotlyFunction
  type="2d"
  title="Comparing Functions"
  xRange={[-5, 5]}
  yRange={[-10, 10]}
  functions={JSON.stringify([
    {
      name: "f(x) = x²",
      expression: "x * x",
      color: "#FF6B6B"
    },
    {
      name: "g(x) = 2x + 1",
      expression: "2 * x + 1",
      color: "#4ECDC4"
    }
  ])}
/>
```

### 3D Surface Plots

```mdx
<PlotlyFunction
  type="3d"
  title="3D Surface"
  xRange={[-5, 5]}
  yRange={[-5, 5]}
  functions={JSON.stringify([
    {
      name: "f(x,y) = x² + y²",
      expression: "x*x + y*y",
      colorscale: "Viridis"
    }
  ])}
/>
```

## Mathematical Expression Syntax

Expressions are written in JavaScript syntax:

- Basic operations: `+`, `-`, `*`, `/`
- Power: `Math.pow(x, 2)` or `x * x` for x²
- Square root: `Math.sqrt(x)`
- Exponential: `Math.exp(x)` for e^x
- Logarithm: `Math.log(x)` for ln(x)
- Trigonometric: `Math.sin(x)`, `Math.cos(x)`, `Math.tan(x)`
- Hyperbolic: `Math.sinh(x)`, `Math.cosh(x)`, `Math.tanh(x)`
- Absolute value: `Math.abs(x)`
- Maximum/Minimum: `Math.max(a, b)`, `Math.min(a, b)`

## Common Examples

### Linear Function
```javascript
expression: "2 * x + 1"  // f(x) = 2x + 1
```

### Quadratic Function
```javascript
expression: "x * x - 4 * x + 3"  // f(x) = x² - 4x + 3
```

### Sigmoid Function
```javascript
expression: "1 / (1 + Math.exp(-x))"  // σ(x) = 1/(1 + e^(-x))
```

### ReLU Function
```javascript
expression: "Math.max(0, x)"  // ReLU(x) = max(0, x)
```

### Gaussian Distribution
```javascript
expression: "(1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x)"
```

### 3D Paraboloid
```javascript
expression: "x * x + y * y"  // f(x,y) = x² + y²
```

### 3D Saddle Point
```javascript
expression: "x * x - y * y"  // f(x,y) = x² - y²
```

### 3D Ripple Effect
```javascript
expression: "Math.sin(Math.sqrt(x * x + y * y))"
```

## Color Options

### 2D Plots
Specify colors using hex codes or CSS color names:
- `"#FF6B6B"` - Red
- `"#4ECDC4"` - Teal
- `"#45B7D1"` - Blue
- `"#F7DC6F"` - Yellow
- `"#9B59B6"` - Purple
- `"#E74C3C"` - Dark Red
- `"#3498DB"` - Light Blue

### 3D Plots
Use Plotly colorscales:
- `"Viridis"`
- `"Portland"`
- `"RdBu"`
- `"Earth"`
- `"Electric"`
- `"Hot"`
- `"Jet"`
- `"Rainbow"`

## Interactive Features

All plots include these interactive features:
- **Zoom**: Scroll wheel or pinch
- **Pan**: Click and drag
- **Rotate** (3D): Click and drag to rotate
- **Hover**: See exact values
- **Box/Lasso select**: Select regions
- **Reset**: Double-click to reset view
- **Download**: Save as PNG

## Best Practices

1. **Choose appropriate ranges**: Make sure your x and y ranges show the interesting parts of your function
2. **Use meaningful titles**: Help readers understand what they're looking at
3. **Label axes**: Always include axis labels
4. **Use contrasting colors**: Ensure functions are easily distinguishable
5. **Keep it simple**: Don't plot too many functions on one graph (3-4 maximum)

## Troubleshooting

### Function not displaying
- Check your expression syntax (use JavaScript Math functions)
- Ensure JSON is properly formatted in the functions prop
- Check browser console for errors

### Performance issues
- Reduce the resolution for 3D plots if needed
- Limit the number of functions plotted simultaneously

### Expression examples that might cause issues:
- `1/x` near x=0 (division by zero)
- `Math.log(x)` for x≤0 (undefined)
- `Math.sqrt(x)` for x<0 (returns NaN)

Handle these cases with conditional expressions:
```javascript
expression: "x > 0 ? Math.log(x) : null"
```