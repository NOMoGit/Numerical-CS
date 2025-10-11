import React from "react";
// import nerdamer from "nerdamer";
import nerdamer from 'nerdamer/all';
import Plot from "react-plotly.js";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { evaluate } from "mathjs";

class Trapezoidal extends React.Component{
  constructor(props) {
          super(props);
          this.state = {
              equation: "",
              a: "2",
              b: "8",
              n: "1",
              Ireal: null,
              Ical: null,
              error: null,
              xcurve: [],
              ycurve: [],
              iterationX: [],
              iterationY: [],
              graphtrapezoidal: [],
          };
      }
      Fcal = (x, variable) => {
        const {equation} = this.state;
          try {
              return evaluate(equation, { [variable]: x });
          } catch (error) {
              return 0;
          }
      };
      trapezoidal = (a, b, n, variable) => {
        const {equation} = this.state;
          if (n < 1) {
              alert("n ต้องมากกว่า 0");
              return;
          }
          if (b < a) {
              alert("B ต้องมากกว่า A");
              return;
          }
          const h = (b - a) / n;
          let sum = 0;

  
          
          for (let i = 1; i < n; i++) {
            sum += this.Fcal(a + i * h, variable);
          }
          console.log(this.Fcal(a, variable));
          console.log(this.Fcal(b, variable));
          console.log(sum);
          const I = (h / 2) * (this.Fcal(a, variable) + this.Fcal(b, variable) + 2 * sum);
          return I;
      };
  
      
      calculate = () => {
          try {
              const { equation, a, b, n } = this.state;
              if (!equation) {
                  alert("กรุณาใส่สมการ");
                  return;
              }
              const variableMatch = equation.match(/[a-zA-Z]+/g);
              const variable = variableMatch ? variableMatch[variableMatch.length - 1] : "x";
              const anum = parseFloat(a);
              const bnum = parseFloat(b);
              const nnum = parseInt(n);
              const xcuv = [];
              const ycuv = [];
              for (let i = anum; i <= bnum; i += 0.01) {
                xcuv.push(i);
                ycuv.push(this.Fcal(i, variable));
              }
              this.setState({ xcurve: xcuv, ycurve: ycuv });
              
              const h = (bnum - anum) / nnum;
              const xi = [];
              const yi = [];
              for (let i = 0; i <= nnum; i++) {
                const xcal = anum + i * h;
                xi.push(xcal);
                yi.push(this.Fcal(xcal, variable));
              }
              this.setState({ iterationX: xi, iterationY: yi });
              
              
              const I_cal = this.trapezoidal(anum, bnum, nnum, variable);
              this.setState({ Ical: I_cal });
              
              
              
              const trapezoid = xi.map((x, i) => {
                  if (i === 0) return null;
                  return {
                      x: [xi[i - 1], xi[i], xi[i], xi[i - 1]],
                      y: [0, 0, yi[i], yi[i - 1]],
                      type: "scatter",
                      mode: "lines",
                      fill: "toself",
                      fillcolor: "rgba(0,100,200,0.3)",
                      line: { color: "blue" },
                  };
              }).filter(Boolean);
  
              this.setState({ graphtrapezoidal: trapezoid });
              const Fx_inte = nerdamer(`integrate(${equation}, ${ variable})`). toString(); 
              console.log('Fx_inte:', Fx_inte); 
              const Fb = nerdamer(Fx_inte, { [variable]: bnum }).evaluate();
              const Fa = nerdamer(Fx_inte, { [variable]: anum }).evaluate();
              const I_real = Fb - Fa;
              this.setState({ Ireal: I_real });
              const error = ((I_real - I_cal) / I_real) * 100;
              this.setState({ error });
  
  
          } catch (error) {
              console.error("เกิดข้อผิดพลาดในการคำนวณ:", error);
              alert("สมการหรือขอบเขตไม่ถูกต้อง: " + error.message);
          }
      };

  render(){
    const { equation, a, b, n, Ireal, Ical, error, xcurve, ycurve, iterationX, iterationY, graphtrapezoidal } = this.state;
                const latex = `\\[\\int_{${a || "a"}}^{${b || "b"}} (${equation || "\\;f(x)\\;"}) \\,dx\\]`;
        
                return (
                    <div>
                        <div className="min-h-screen bg-gray-50 py-25 px-4">
                            <div className="max-w-4xl mx-auto">
                                <div className="text-center mb-25">
                                    <h1 className="text-5xl font-bold text-blue-800 mb-3">
                                        Trapezoidal's Rule
                                    </h1>
                                </div>
                                    <MathJaxContext className="w-full max-w-4xl py-4">
                                       <div className="mt-5 p-4 pt-10 bg-white rounded-2xl shadow-inner text-center ">
                                           <MathJax className="text-3xl" dynamic>{latex}</MathJax>
                                       </div>
                                    </MathJaxContext>
                                <div className="w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                        <div className="md:col-span-4">
                                            <label className="block mb-1 font-semibold text-gray-700">f(x)</label>
                                            <input
                                                type="text"
                                                value={equation}
                                                placeholder="e.g., 4*x^5 - 3*x^4 + x^3 - 6*x + 2"
                                                onChange={(e) => this.setState({ equation: e.target.value })}
                                                className="w-full border-2 border-gray-200 rounded-xl p-3 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                            />
                                        </div>
        
                                        <div>
                                            <label className="block mb-1 font-semibold text-gray-700">Lower Bound (a)</label>
                                            <input
                                                type="number"
                                                value={a}
                                                onChange={(e) => this.setState({ a: e.target.value })}
                                                className="w-full border-2 border-gray-200 rounded-xl p-3 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                            />
                                        </div>
        
                                        <div>
                                            <label className="block mb-1 font-semibold text-gray-700">Upper Bound (b)</label>
                                            <input
                                                type="number"
                                                value={b}
                                                onChange={(e) => this.setState({ b: e.target.value })}
                                                className="w-full border-2 border-gray-200 rounded-xl p-3 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-4">
                                            <button
                                                onClick={this.calculate}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                                            >
                                                <span className="text-xl">Calculate</span>
                                            </button>
                                        </div>
                                    </div>
        
                                    
        
                                    {(Ireal !== null || Ical !== null) && (
                                        <div className="mt-6 p-6 bg-gray-50 rounded-2xl shadow-inner">
                                            <h2 className="text-2xl mb-4 font-bold text-center text-gray-800">Solution</h2>
                                            {Ireal !== null && (
                                                <div className="text-lg mb-2 text-center">
                                                    Actual Integral real: <strong className="font-mono">{Ireal.toFixed(6)}</strong>
                                                </div>
                                            )}
                                            {Ical !== null && (
                                                <div className="text-lg mb-2 text-center">
                                                    Simpson's Rule cal: <strong className="font-mono">{Ical.toFixed(6)}</strong>
                                                </div>
                                            )}
                                            {error !== null && (
                                                <div className="text-lg mb-2 text-center">
                                                    Absolute Error (%): <strong className="font-mono">{error.toFixed(6)}%</strong>
                                                </div>
                                            )}
                                        </div>
                                    )}
        
                                    <div className="w-full mt-6 p-4 bg-white rounded-2xl shadow-md">
                                        <Plot
                                            data={[
                                                { x: xcurve, y: ycurve, type: "scatter", mode: "lines", name: "f(x)" },
                                                ...graphtrapezoidal,
                                                { x: iterationX, y: iterationY, type: "scatter", mode: "lines+markers", name: "Data Points", marker: { color: "red", size: 8 }, line: { color: "black", width: 3 } },
                                            ]}
                                            layout={{
                                                autosize: true,
                                                responsive: true,
                                                title: { text: "Graph Composite Trapezoidal" },
                                                xaxis: { title: { text: "X" } },
                                                yaxis: { title: { text: "f(X)" } },
                                                showlegend: true
                                            }}
                                            useResizeHandler={true}
                                            style={{ width: "100%", height: "500px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
  }
}
export default Trapezoidal

// import { Plus, Minus } from 'lucide-react';


// import React, { useState } from 'react';
// function Trapezoidal() {
//   const [interpolationType, setInterpolationType] = useState('quadratic');
//   const [numPoints, setNumPoints] = useState(5);
//   const [xStart, setXStart] = useState(2);
//   const [points, setPoints] = useState(
//     Array.from({ length: 5 }, (_, i) => ({
//       x: '',
//       y: ''
//     }))
//   );

//   const handleNumPointsChange = (delta) => {
//     const newNum = Math.max(2, numPoints + delta);
//     setNumPoints(newNum);
//     setPoints(prev => {
//       if (newNum > prev.length) {
//         return [...prev, ...Array.from({ length: newNum - prev.length }, () => ({ x: '', y: '' }))];
//       }
//       return prev.slice(0, newNum);
//     });
//   };

//   const handleXStartChange = (delta) => {
//     setXStart(prev => Math.max(0, prev + delta));
//   };

//   const handlePointChange = (index, field, value) => {
//     setPoints(prev => {
//       const newPoints = [...prev];
//       newPoints[index] = { ...newPoints[index], [field]: value };
//       return newPoints;
//     });
//   };

//   const calculateSpline = () => {
//     // ตรวจสอบว่ามีข้อมูลครบหรือไม่
//     const validPoints = points.filter(p => p.x !== '' && p.y !== '');
//     if (validPoints.length < 2) {
//       alert('กรุณากรอกข้อมูลอย่างน้อย 2 จุด');
//       return;
//     }

//     // แสดงผลการคำนวณ (ในที่นี้เป็นตัวอย่าง - คุณสามารถเพิ่ม algorithm ที่แท้จริงได้)
//     console.log('Interpolation Type:', interpolationType);
//     console.log('Points:', validPoints);
//     alert(`คำนวณ ${interpolationType} spline interpolation สำเร็จ!`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
//         {/* Header */}
//         <div className="text-center mb-12"> 
//           <h1 className="text-5xl font-bold bg-gradient-to-r text-blue-800 bg-clip-text mb-3">
//            Spline interpolation
//           </h1>
//         </div>
//         {/* <div className="flex items-center gap-3 mb-8">
//           <span className="text-4xl">🤓</span>
//           <h1 className="text-3xl font-bold text-gray-800">Spline interpolation</h1>
//         </div> */}

//         {/* Interpolation Type Buttons */}
//         <div className="flex gap-2 mb-8">
//           <button
//             onClick={() => setInterpolationType('linear')}
//             className={`px-6 py-2 rounded-lg font-medium transition-colors ${
//               interpolationType === 'linear'
//                 ? 'bg-green-500 text-white'
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-150'
//             }`}
//           >
//             Linear
//           </button>
//           <button
//             onClick={() => setInterpolationType('quadratic')}
//             className={`px-6 py-2 rounded-lg font-medium transition-colors ${
//               interpolationType === 'quadratic'
//                 ? 'bg-green-500 text-white'
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-150'
//             }`}
//           >
//             Quadratic
//           </button>
//           <button
//             onClick={() => setInterpolationType('cubic')}
//             className={`px-6 py-2 rounded-lg font-medium transition-colors ${
//               interpolationType === 'cubic'
//                 ? 'bg-green-500 text-white'
//                 : 'bg-gray-100 text-gray-600 hover:bg-gray-150'
//             }`}
//           >
//             Cubic
//           </button>
//         </div>

//         {/* Controls */}
//         <div className="flex gap-8 mb-8">
//           {/* Number of points */}
//           <div className="flex-1">
//             <label className="block text-gray-700 font-medium mb-2">
//               Number of points 👍
//             </label>
//             <div className="flex items-center gap-2">
//               {/* <button
//                 onClick={() => handleNumPointsChange(-1)}
//                 className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
//               >
//                 <Minus size={20} />
//               </button> */}
//               <input
//                 type="number"
//                 value={numPoints}
//                 onChange={(e) => {
//                   const val = parseInt(e.target.value) || 2;
//                   setNumPoints(val);
//                   setPoints(Array.from({ length: val }, (_, i) => points[i] || { x: '', y: '' }));
//                 }}
//                 className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//               />
//               {/* <button
//                 onClick={() => handleNumPointsChange(1)}
//                 className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
//               >
//                 <Plus size={20} />
//               </button> */}
//             </div>
//           </div>

//           {/* X value */}
//           <div className="flex-1">
//             <label className="block text-gray-700 font-medium mb-2">
//               X value
//             </label>
//             <div className="flex items-center gap-2">
//               {/* <button
//                 onClick={() => handleXStartChange(-1)}
//                 className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
//               >
//                 <Minus size={20} />
//               </button> */}
//               <input
//                 type="number"
//                 value={xStart}
//                 onChange={(e) => setXStart(parseInt(e.target.value) || 0)}
//                 className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//               />
//               {/* <button
//                 onClick={() => handleXStartChange(1)}
//                 className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
//               >
//                 <Plus size={20} />
//               </button> */}
//             </div>
//           </div>

//           {/* Calculate Button */}
//           <div className="flex items-end">
//             <button
//               onClick={calculateSpline}
//               className="px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
//             >
//               Calculate!
//             </button>
//           </div>
//         </div>

//         {/* Data Points Table */}
//         <div className="space-y-3">
//           {points.map((point, index) => (
//             <div key={index} className="flex items-center gap-4">
//               <span className="text-lg font-medium text-gray-700 w-8">
//                 {index + 1}.
//               </span>
//               <input
//                 type="text"
//                 placeholder={`x${index}`}
//                 value={point.x}
//                 onChange={(e) => handlePointChange(index, 'x', e.target.value)}
//                 className="flex-1 h-12 px-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//               />
//               <input
//                 type="text"
//                 placeholder={`f(x${index})`}
//                 value={point.y}
//                 onChange={(e) => handlePointChange(index, 'y', e.target.value)}
//                 className="flex-1 h-12 px-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
// export default Trapezoidal