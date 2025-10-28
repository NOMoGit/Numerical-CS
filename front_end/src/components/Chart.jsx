// import Plot from "react-plotly.js";

// export default function Chart({ data }) {
//   return (
//     <Plot
//       data={[
//         {
//           x: data.map((d) => d.iteration),
//           y: data.map((d) => d.x),
//           type: "scatter",
//           mode: "lines+markers",
//           marker: { color: "blue" },
//         },
//       ]}
//       layout={{
//         title: "Iterations",
//         xaxis: { title: { text: "Iteration" } },
//         yaxis: { title: { text: "Error" } },
//       }}
//       style={{ width: "100%", height: "100%", minHeight: "500px" }}
//     />
//   );
// }

import React from 'react';
import Plot from 'react-plotly.js';

class Chart extends React.Component {
  render() {

    const { data } = this.props; 

    return (
      <Plot
        data={[
          {
            x: data.map((d) => d.iteration),
            y: data.map((d) => d.x), 
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue' },
          },
        ]}
        layout={{
          title: 'Convergence Analysis (Error)',
          xaxis: { title: { text: 'Iteration' } },
          yaxis: { title: { text: 'Error' } },
        }}
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
      />
    );
  }
}

export default Chart;
