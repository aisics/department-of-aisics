import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

const MathPlot = ({ 
  type = '2d', 
  functions = [], 
  title = '', 
  xLabel = 'x', 
  yLabel = 'y', 
  zLabel = 'z',
  xRange = [-10, 10],
  yRange = [-10, 10],
  zRange = null,
  height = 400,
  showGrid = true,
  darkMode = false 
}) => {
  const plotRef = useRef(null);

  useEffect(() => {
    if (!plotRef.current) return;

    const plotData = [];
    const layout = {
      title: {
        text: title,
        font: { size: 18 }
      },
      height: height,
      paper_bgcolor: darkMode ? '#1a1a1a' : '#ffffff',
      plot_bgcolor: darkMode ? '#2a2a2a' : '#f8f8f8',
      font: {
        color: darkMode ? '#ffffff' : '#000000'
      },
      showlegend: true,
      legend: {
        x: 0.02,
        y: 0.98,
        bgcolor: darkMode ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)'
      }
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToAdd: ['drawline', 'drawopenpath', 'eraseshape'],
      displaylogo: false
    };

    if (type === '2d') {
      // Generate data for 2D plots
      functions.forEach((func, index) => {
        const x = [];
        const y = [];
        const step = (xRange[1] - xRange[0]) / 200;
        
        for (let xi = xRange[0]; xi <= xRange[1]; xi += step) {
          x.push(xi);
          try {
            y.push(func.fn(xi));
          } catch (e) {
            y.push(null);
          }
        }

        plotData.push({
          x: x,
          y: y,
          type: 'scatter',
          mode: 'lines',
          name: func.name || `f(x)`,
          line: {
            color: func.color || ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F'][index % 4],
            width: 2
          }
        });
      });

      layout.xaxis = {
        title: xLabel,
        showgrid: showGrid,
        gridcolor: darkMode ? '#444' : '#ddd',
        zeroline: true,
        zerolinecolor: darkMode ? '#666' : '#999',
        range: xRange
      };
      layout.yaxis = {
        title: yLabel,
        showgrid: showGrid,
        gridcolor: darkMode ? '#444' : '#ddd',
        zeroline: true,
        zerolinecolor: darkMode ? '#666' : '#999',
        range: yRange
      };

    } else if (type === '3d') {
      // Generate data for 3D surface plots
      functions.forEach((func, index) => {
        const size = 50;
        const x = [];
        const y = [];
        const z = [];
        
        const xStep = (xRange[1] - xRange[0]) / size;
        const yStep = (yRange[1] - yRange[0]) / size;
        
        for (let i = 0; i <= size; i++) {
          x.push(xRange[0] + i * xStep);
          y.push(yRange[0] + i * yStep);
        }
        
        for (let i = 0; i <= size; i++) {
          z[i] = [];
          for (let j = 0; j <= size; j++) {
            try {
              z[i][j] = func.fn(x[j], y[i]);
            } catch (e) {
              z[i][j] = null;
            }
          }
        }

        plotData.push({
          x: x,
          y: y,
          z: z,
          type: 'surface',
          name: func.name || `f(x,y)`,
          colorscale: func.colorscale || 'Viridis',
          showscale: true
        });
      });

      layout.scene = {
        xaxis: { title: xLabel, range: xRange },
        yaxis: { title: yLabel, range: yRange },
        zaxis: { title: zLabel, range: zRange },
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.5 }
        }
      };
    }

    Plotly.newPlot(plotRef.current, plotData, layout, config);

    // Clean up
    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  }, [type, functions, title, xLabel, yLabel, zLabel, xRange, yRange, zRange, height, showGrid, darkMode]);

  return <div ref={plotRef} className="w-full" />;
};

export default MathPlot;