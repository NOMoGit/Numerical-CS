import Plot from "react-plotly.js";

export default function Chart({ data }) {
  return (
    <Plot
      data={[
        {
          x: data.map((d) => d.iteration),
          y: data.map((d) => d.x),
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "blue" },
        },
      ]}
      layout={{
        title: "Iterations",
        xaxis: { title: { text: "Iteration" } },
        yaxis: { title: { text: "Error" } },
      }}
      style={{ width: "100%", height: "100%", minHeight: "500px" }}
    />
  );
}




// import Plot from "react-plotly.js";

// export default function Chart({ data, title = "Convergence Plot", xAxisTitle = "Iteration", yAxisTitle = "Value" }) {
//   const plotData = [
//     {
//       x: data.map((d) => d.iteration),
//       y: data.map((d) => d.x),
//       type: "scatter",
//       mode: "lines+markers",
//       name: "Approximation Value", // เพิ่มชื่อเส้น
//       marker: {
//         color: '#6366F1', // ใช้สีม่วง-น้ำเงินที่ทันสมัย
//         size: 8,
//         line: {
//           color: '#4F46E5',
//           width: 1
//         }
//       },
//       line: {
//         color: '#818CF8', // สีเส้น
//         width: 3,
//         shape: 'spline' // ทำให้เส้นโค้งมน
//       },
//       hoverinfo: 'x+y+name', // แสดงข้อมูลเมื่อวางเมาส์
//     },
//     { // เพิ่มเส้นแสดงค่า Error (ถ้ามีใน data)
//       x: data.map((d) => d.iteration),
//       y: data.map((d) => d.error), // ใช้ d.error แทน d.x หากมี
//       type: "scatter",
//       mode: "lines+markers",
//       name: "Error",
//       marker: {
//         color: '#EF4444', // สีแดงสำหรับ Error
//         size: 8,
//         line: {
//           color: '#DC2626',
//           width: 1
//         }
//       },
//       line: {
//         color: '#F87171',
//         width: 3,
//         shape: 'spline'
//       },
//       hoverinfo: 'x+y+name',
//       yaxis: 'y2', // ให้ Error ใช้แกน Y ด้านขวา
//     },
//   ];

//   const plotLayout = {
//     title: {
//       text: `<b>${title}</b>`, // ทำให้ Title เป็นตัวหนา
//       font: {
//         family: 'Inter, sans-serif', // ใช้ฟอนต์ที่ทันสมัย
//         size: 24,
//         color: '#374151' // สีเทาเข้ม
//       },
//       x: 0.05, // จัดตำแหน่ง title ไปทางซ้ายเล็กน้อย
//     },
//     xaxis: {
//       title: {
//         text: xAxisTitle,
//         font: {
//           family: 'Inter, sans-serif',
//           size: 16,
//           color: '#4B5563'
//         }
//       },
//       tickfont: {
//         family: 'Inter, sans-serif',
//         size: 12,
//         color: '#6B7280'
//       },
//       gridcolor: '#E5E7EB', // สีเส้นกริดจางลง
//       linecolor: '#D1D5DB', // สีเส้นแกน
//       linewidth: 1,
//       zerolinecolor: '#D1D5DB',
//       rangemode: 'tozero', // เริ่มจากศูนย์
//     },
//     yaxis: {
//       title: {
//         text: yAxisTitle,
//         font: {
//           family: 'Inter, sans-serif',
//           size: 16,
//           color: '#4B5563'
//         }
//       },
//       tickfont: {
//         family: 'Inter, sans-serif',
//         size: 12,
//         color: '#6B7280'
//       },
//       gridcolor: '#E5E7EB',
//       linecolor: '#D1D5DB',
//       linewidth: 1,
//       zerolinecolor: '#D1D5DB',
//       rangemode: 'tozero',
//     },
//     yaxis2: { // แกน Y ตัวที่สองสำหรับ Error
//       title: {
//         text: "Error",
//         font: {
//           family: 'Inter, sans-serif',
//           size: 16,
//           color: '#4B5563'
//         }
//       },
//       overlaying: 'y',
//       side: 'right',
//       tickfont: {
//         family: 'Inter, sans-serif',
//         size: 12,
//         color: '#6B7280'
//       },
//       gridcolor: 'rgba(229, 231, 235, 0.5)', // ทำให้กริดจางลง
//       linecolor: '#D1D5DB',
//       linewidth: 1,
//       zerolinecolor: '#D1D5DB',
//       rangemode: 'tozero',
//     },
//     plot_bgcolor: '#F9FAFB', // สีพื้นหลังของกราฟ
//     paper_bgcolor: '#FFFFFF', // สีพื้นหลังโดยรวม
//     margin: {
//       l: 70, // margin ซ้าย
//       r: 70, // margin ขวา (เผื่อสำหรับ yaxis2)
//       b: 70, // margin ล่าง
//       t: 100, // margin บน (เผื่อสำหรับ title)
//       pad: 4
//     },
//     hovermode: 'closest', // โหมดการแสดงข้อมูลเมื่อวางเมาส์
//     showlegend: true, // แสดง Legend
//     legend: {
//       x: 0.01,
//       y: 0.99,
//       bgcolor: 'rgba(255, 255, 255, 0.7)',
//       bordercolor: '#D1D5DB',
//       borderwidth: 1,
//       font: {
//         family: 'Inter, sans-serif',
//         size: 12,
//         color: '#374151'
//       }
//     },
//     font: {
//       family: 'Inter, sans-serif', // กำหนดฟอนต์เริ่มต้นสำหรับทั้งกราฟ
//     },
//   };

//   return (
//     <Plot
//       data={plotData}
//       layout={plotLayout}
//       // เพิ่ม config เพื่อควบคุมการทำงานของกราฟ เช่น ปุ่มซูม
//       config={{
//         displayModeBar: true, // แสดงแถบเครื่องมือ
//         responsive: true, // ทำให้กราฟปรับขนาดตามหน้าจอ
//         displaylogo: false, // ซ่อนโลโก้ Plotly
//         modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d']
//       }}
//       style={{ width: "100%", height: "100%", minHeight: "500px" }} // กำหนดขนาดและปรับตาม container
//       useResizeHandler={true} // ใช้ Plotly's resize handler
//     />
//   );
// }






// import Plot from "react-plotly.js";

// export default function MyChart({ data }) {
//   return (
//     <Plot
//       data={[
//         {
//           x: data.map((d) => d.iter),
//           y: data.map((d) => d.x),
//           type: "scatter",
//           mode: "lines+markers",
//           marker: { color: "blue" },
//         },
//       ]}
//       layout={{
//         xaxis: { title: { text: "Iteration", font: { color: "black" } } },
//         yaxis: { title: { text: "f(x)", font: { color: "black" } } },
//       }}
//     />
//   );
// }