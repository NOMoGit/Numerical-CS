// import React from 'react'
// import Table from '../components/Table';
// import Chart from '../components/Chart';
// import axios from 'axios';
// import { evaluate, number } from 'mathjs';
// import Plot from "react-plotly.js";

// class Onepoint extends React.Component {
//   constructor(props){
//     super(props);
//     this.state = {
//       equation: "",
//       x0: 0.5,
//       tolerance: 0.000001,
//       result: null,
//       iteration: [],
//       iterCnt: 0,
//       equationDB: [],
//       errMsg: ""
//     };
//   }
//   componentDidMount(){
//     axios.get("http://localhost:5000/root")
//     .then((response) => {
//       this.setState({equationDB: response.data.results});
//     })
//     .catch(() =>{
//       console.log("Axios Error");
//     });
//   }
//   handleDelete = (id) => {
//     if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบสมการนี้?")) return;

//     axios.delete(`http://localhost:5000/root/${id}`)
//       .then((res) => {
//         alert(res.data.message);
//         this.setState((prevState) => ({
//           equationDB: prevState.equationDB.filter(eq => eq.ID !== id)
//         }));
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("ลบไม่สำเร็จ");
//       });
//   };
//   handleUpdate = (id,oldEquation) => {
//     const newEquation = prompt("ใส่สมการใหม่:",oldEquation);
//     if (!newEquation) return;
//     axios.put(`http://localhost:5000/root/${id}`, { equation: newEquation })
//     .then((res) => {
//       alert(res.data.message);
//       this.setState((prevState) =>({
//         equationDB: prevState.equationDB.map(eq =>
//             eq.ID === id ? { ...eq, Equeation: newEquation } : eq
//         )
//       }))
//     })
//     .catch((err) => {
//       console.error(err);
//       alert("แก้ไขไม่สำเร็จ");
//     });
//   };
//   equationExists = (equations, equation) => {
//     return equations.some(eq => eq.Equeation === equation);
//   };

//   saveEquation = async (equation) => {
//     try {
//       const response = await axios.post("http://localhost:5000/root", { 
//         equation: equation 
//       });
//       return response.data;
//     } catch (error) {
//       console.error("Error saving equation:", error);
//       throw error;
//     }
//   };
//   getDomain = (iterations, x0) => {
//     const xs = iterations.map(p => p.x);
//     const minX = Math.min(x0, ...xs);
//     const maxX = Math.max(x0, ...xs);
//     return [minX, maxX];
//   };

//   makeCobwebTraces = (iterations) => {
//     const traces = [];
//     for (let i = 0; i < iterations.length - 1; i++) {
//       const p1 = iterations[i];
//       const p2 = iterations[i + 1];
//       traces.push({
//         x: [p1.x, p1.x, p2.x],
//         y: [p1.y, p2.y, p2.y],
//         type: "scatter",
//         mode: "lines",
//         line: { color: "red" },
//         name: i === 0 ? "Cobweb" : undefined
//       });
//     }
//     return traces;
//   };
//   calculate = () => {
//     try {
//       const { equation, x0, tolerance } = this.state;
//       console.log(equation);
//       let x0c = number(x0);
//       let tol = number(tolerance);

//       if (!Number.isFinite(x0c) || !Number.isFinite(tol)) {
//         this.setState({ errMsg: "กรุณากรอกค่า X Initial และข้อผิดพลาดให้ถูกต้อง" });
//         return;
//       }
//       if (!equation || typeof equation !== "string") {
//         this.setState({ errMsg: "กรุณากรอกสมการ g(x)" });
//         return;
//       }
//       // one point const res = this.onePointIteration(x0c, tol, equation);
//       const out = { result: 0, iter: 0, iterations: [], error: undefined };
//       if (!equation || equation.trim().length === 0) {
//         out.error = "Invalid function";
//         return out;
//       }
//       try {
//           evaluate(equation, { x: x0c });
//         } catch (e) {
//           out.error = "Invalid function";
//           return out;
//       }
//       const maxIter = 100;
//       let iter = 0;
//       let x = x0c;
//       let xOld = x * 100; 
//       let err = 0;
//       while(iter < maxIter){
//         iter++;
//         if(iter === maxIter){
//           out.error = "Max iteration reached";
//           break;
//         }  
//         const variableMatch = equation.match(/[a-zA-Z]+/);
//         const variable = variableMatch ? variableMatch[0] : "x";
//         const gx = evaluate(equation, { x });
//         out.iterations.push({iter, x, y: gx, err });
//         x = gx;
//         err = Math.abs((x - xOld) / xOld);
//         if(err < tol){
//           out.result = x;
//           out.iter = iter;
//           break;

//         }
//         xOld = x;
//       }
//       if(!out.result){
//         out.result = x;
//         out.iter = iter;
//       }
//       if(out.error)this.setState({ errMsg: out.error });
//       this.setState({
//         result: out.result ?? null,
//         iterCnt: out.iter ?? 0,
//         iteration:out.iterations ?? [],
//       });
      
//       const getDomain = (rows, x0) => {
//       const xs = rows.length ? rows.flatMap(r => [r.x, r.y]) : [x0 - 1, x0 + 1];
//       const minX = Math.min(...xs) - 0.05;
//       const maxX = Math.max(...xs) + 0.05;
//       return [minX, maxX];
//       };

//       const makeCobwebTraces = (rows) =>{

//         rows.flatMap((r, i) => ([
//           {
//             x: [r.x, r.x],
//             y: [r.x, r.y],
//             type: "scatter", mode: "lines",
//             line: { color: "red" }, name: i === 0 ? "One-Point" : undefined,
//             showlegend: i === 0
//           },
//           {
//             x: [r.x, r.y],
//             y: [r.y, r.y],
//             type: "scatter", mode: "lines",
//             line: { color: "red" }, name: undefined, showlegend: false
//           }
//         ]));
//       }
        
        

//     } catch (err) {
        
//         let errorMessage = "เกิดข้อผิดพลาดในการคำนวณ";
//         if (err instanceof Error) {
//             errorMessage += ":\n" + err.message;
//         }
//         alert(errorMessage);
//     }
// };
  
//   render(){
//     const { equation, x0, tolerance, result, equationDB } = this.state;

//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <h1 className="text-5xl text-blue-800 font-bold  mb-3">
//               Onepoint Iteration
//             </h1>
//           </div>
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left Panel - Database */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
//                 <div className="flex items-center gap-2 mb-4">
//                   <h2 className="text-xl font-bold text-gray-800">สมการใน Database</h2>
//                 </div>
//                 <div className="space-y-2 max-h-96 overflow-y-auto">
//                   {equationDB.length === 0 ? (
//                     <p className="text-gray-400 text-center py-8">ไม่มีสมการในระบบ</p>
//                   ) : (
//                     equationDB.map(eq => (
//                       <div key={eq.ID} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200 hover:shadow-md transition-shadow">
//                         <div className="flex items-center justify-between">
//                           <code className="text-sm font-mono text-gray-800 font-semibold">{eq.Equeation}</code>
//                           <div className="flex gap-1">
//                             <button
//                               onClick={() => this.handleUpdate(eq.ID, eq.Equeation)}
//                               className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                              
//                             >
//                               แก้ไข
//                             </button>
//                             <button
//                               onClick={() => this.handleDelete(eq.ID)}
//                               className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                              
//                             >
//                               ลบ
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </div>
//             {/* Right Panel - Input Form */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Parameters</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       เลือกสมการจาก Database
//                     </label>
//                     <select 
//                       value={equation}
//                       onChange={(e) => this.setState({equation:e.target.value})}
//                       className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
//                     >
//                       <option value="">-- เลือกสมการ --</option>
//                       {equationDB.map((eq) =>(
//                         <option key={eq.ID} value={eq.Equeation}>
//                           {eq.Equeation}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       กรอกสมการเอง
//                     </label>
//                     <input
//                       type="text" 
//                       value={equation}
//                       placeholder="เช่น x*x - 4 หรือ x^3 - 2*x - 5"
//                       onChange={(e) => this.setState({equation:e.target.value})}
//                       className="w-full border-2 border-gray-200 rounded-xl p-3 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
//                     />
//                   </div>
//                 </div>
//                 {/* Manual Equation Input */}
//                 <div className="mb-6">
                  
//                 </div>
//                 {/* Input Parameters Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Initial Guess (x₀)
//                     </label>
//                     <input 
//                       type="number"
//                       value={x0}
//                       onChange={(e) => this.setState({ x0: e.target.value })}
//                       className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Tolerance (ε)
//                     </label>
//                     <input 
//                       type="number"
//                       value={tolerance}
//                       onChange={(e) => this.setState({tolerance:e.target.value})}
//                       className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
//                       step="0.000001"
//                     />
//                   </div>
//                 </div>
//                 <button
//                   onClick={this.calculate}
//                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
//                 >
//                   <span className="text-2xl">Calculate Root</span>
//                 </button>
//                 {/* Result Display */}
//                 {result !== null && (
//                   <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
//                     <div className="flex items-center gap-2 mb-2">
//                       <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <h3 className="text-lg font-bold text-gray-800">Root Found!</h3>
//                     </div>
//                     <p className="text-3xl font-bold text-green-700">x = {result.toFixed(8)}</p>
//                     <p className="text-sm text-gray-600 mt-2">
//                       Converged after {this.state.iteration.length} iterations
//                     </p>
//                   </div>
//                 )}

//               </div>
//             </div>
//           </div>

//           {/* Chart Section */}
//           {/* {this.state.chartData && (
//             <div className="mt-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">Graph</h2>
//               <Chart
//                 data={this.state.chartData}
//                 layout={{
//                   width: 800,
//                   height: 600,
//                   xaxis: { range: this.state.chartDomain, title: "x" },
//                   yaxis: { range: this.state.chartDomain, title: "y" },
//                   legend: { x: 1, y: 1 },
//                 }}
//               />
//             </div>
//           )} */}
//           <div className="rounded-2xl p-4 mt-6">
//               {(() => {
//                   const x0 = Number(this.state.x0);
//                   const [minX, maxX] = getDomain(iteration, x0);
//                   const N = 600;
//                   const xs = Array.from({ length: N }, (_, i) => minX + i*(maxX-minX)/(N-1));
//                   const gys = xs.map(x => { try { return math.evaluate(equation, ); } catch { return NaN; } });

//                   return (
//                   <div className="mx-auto w-full max-w-[1000px]"> 
//                       <Plot
//                       data={[
//                           { x: xs, y: xs, type: "scatter", mode: "lines", name: "x = x", line: { color: "rgb(99,102,241)" } },
//                           { x: xs, y: gys, type: "scatter", mode: "lines", name: "g(x)",  line: { color: "rgb(16,185,129)" } },
//                           ...makeCobwebTraces(table),
//                       ]}
//                       layout={{
//                           height: 460,
//                           autosize: true,
//                           margin: { t: 20, r: 20, b: 50, l: 60 },
//                           xaxis: { title: "x" },
//                           yaxis: { title: "y" },
//                           legend: { x: 1, y: 1 },
//                       }}
//                       config={{ responsive: true }}
//                       />
//                   </div>
//                   );
//               })()}
//           </div>
//           {result !== null && (
//             <div className="mt-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//               <h2 className="text-2xl font-bold text-gray-800 mb-6">Convergence Analysis</h2>
//               <Table 
//                 steps={this.state.iteration.map((s) => ({
//                     iteration:s.iter,
//                     x:s.x,
//                     y:s.y,
//                     error:s.err
//               }))}/>
//             </div>
//           )}
//         </div>
//       </div>
//     );
    
//   }
// }

// export default Onepoint





import React from 'react';
import Table from '../components/Table';
// import Chart from '../components/Chart'; // ไม่ได้ใช้งานแล้วในโค้ดนี้
import axios from 'axios';
import { evaluate, number } from 'mathjs';
import Plot from "react-plotly.js";

class Onepoint extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      equation: "",
      x0: 0.5,
      tolerance: 0.000001,
      result: null,
      iteration: [],
      iterCnt: 0,
      equationDB: [],
      errMsg: ""
    };
  }

  componentDidMount(){
    axios.get("http://localhost:5000/root")
    .then((response) => {
      this.setState({equationDB: response.data.results});
    })
    .catch(() =>{
      console.log("Axios Error");
    });
  }

  handleDelete = (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบสมการนี้?")) return;

    axios.delete(`http://localhost:5000/root/${id}`)
      .then((res) => {
        alert(res.data.message);
        this.setState((prevState) => ({
          equationDB: prevState.equationDB.filter(eq => eq.ID !== id)
        }));
      })
      .catch((err) => {
        console.error(err);
        alert("ลบไม่สำเร็จ");
      });
  };

  handleUpdate = (id,oldEquation) => {
    const newEquation = prompt("ใส่สมการใหม่:", oldEquation);
    if (!newEquation) return;
    axios.put(`http://localhost:5000/root/${id}`, { equation: newEquation })
    .then((res) => {
      alert(res.data.message);
      this.setState((prevState) =>({
        equationDB: prevState.equationDB.map(eq =>
            // แก้ไข Typo จาก Equeation เป็น Equation (หาก backend ใช้ Equation)
            eq.ID === id ? { ...eq, Equation: newEquation } : eq 
        )
      }))
    })
    .catch((err) => {
      console.error(err);
      alert("แก้ไขไม่สำเร็จ");
    });
  };
  getDomain = (iterations, initialX) => {
    const xs = iterations.flatMap(iter => [iter.x, iter.y]);
    xs.push(initialX);

    if (xs.length === 0) {
        return [-1, 1]; 
    }
    
    const minX = Math.min(...xs) - 0.5;
    const maxX = Math.max(...xs) + 0.5;
    
    return [minX, maxX];
  };

  makeCobwebTracesUpdated = (iterations) => {
    return iterations.flatMap((r, i) => ([
      {
        x: [r.x, r.x],
        y: [r.x, r.y],
        type: "scatter", mode: "lines",
        line: { color: "red", dash: 'dot' },
        name: i === 0 ? "Cobweb Path" : undefined,
        showlegend: i === 0,
        hoverinfo: 'none'
      },
      {
        x: [r.x, r.y],
        y: [r.y, r.y],
        type: "scatter", mode: "lines",
        line: { color: "red", dash: 'dot' },
        showlegend: false,
        hoverinfo: 'none'
      }
    ]));
  };

  calculate = () => {
    this.setState({ errMsg: "", result: null, iteration: [] }); // Reset state ก่อนคำนวณ
    try {
      const { equation, x0, tolerance } = this.state;
      let x0c = number(x0);
      let tol = number(tolerance);

      if (!Number.isFinite(x0c) || !Number.isFinite(tol)) {
        this.setState({ errMsg: "กรุณากรอกค่า X Initial และข้อผิดพลาดให้ถูกต้อง" });
        return;
      }
      if (!equation || typeof equation !== "string" || equation.trim() === "") {
        this.setState({ errMsg: "กรุณากรอกสมการ g(x)" });
        return;
      }
      
      try {
          evaluate(equation, { x: x0c });
      } catch (e) {
          this.setState({ errMsg: "สมการไม่ถูกต้อง: " + e.message });
          return;
      }
      
      const out = { result: null, iter: 0, iterations: [], error: undefined };
      const maxIter = 100;
      let iter = 0;
      let x_old = x0c;
      let err = 1; 

      while (iter < maxIter) {
        iter++;
        
        const x_new = evaluate(equation, { x: x_old });


        if (!Number.isFinite(x_new)) {
            out.error = "ผลการคำนวณไม่เป็นตัวเลข (Diverged)";
            break;
        }

        err = Math.abs((x_new - x_old) / x_new);

        out.iterations.push({ iter, x: x_old, y: x_new, err });

        if (err < tol) {
          out.result = x_new;
          out.iter = iter;
          break;
        }

        x_old = x_new;

        if (iter === maxIter) {
          out.error = "คำนวณครบ 100 รอบแต่ยังไม่ลู่เข้า";
          out.result = x_new; 
          out.iter = iter;
        }
      }

      if (out.error) {
        this.setState({ errMsg: out.error });
      }

      this.setState({
        result: out.result,
        iterCnt: out.iter,
        iteration: out.iterations,
      });

    } catch (err) {
      let errorMessage = "เกิดข้อผิดพลาดในการคำนวณ";
      if (err instanceof Error) {
          errorMessage += ":\n" + err.message;
      }
      this.setState({ errMsg: errorMessage });
    }
  };
  
  render(){
    const { equation, x0, tolerance, result, equationDB, iteration, errMsg } = this.state;

    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl text-blue-800 font-bold mb-3">
              Onepoint Iteration
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Database */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 h-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">สมการใน Database</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {equationDB.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">ไม่มีสมการในระบบ</p>
                  ) : (
                    equationDB.map(eq => (
                      <div key={eq.ID} className="bg-gray-to-r from-blue-50 to-gray-50 rounded-lg p-3 border border-blue-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          {/* แก้ไข Typo จาก Equeation เป็น Equation (หาก backend ใช้ Equation) */}
                          <code className="text-sm font-mono text-gray-800 font-semibold">{eq.Equation || eq.Equeation}</code>
                          <div className="flex gap-1">
                            <button
                              onClick={() => this.handleUpdate(eq.ID, eq.Equation || eq.Equeation)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                            >
                              แก้ไข
                            </button>
                            <button
                              onClick={() => this.handleDelete(eq.ID)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                            >
                              ลบ
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            {/* Right Panel - Input Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Parameters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      เลือกสมการจาก Database
                    </label>
                    <select 
                      value={equation}
                      onChange={(e) => this.setState({equation:e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all outline-none"
                    >
                      <option value="">-- เลือกสมการ --</option>
                      {equationDB.map((eq) =>(
                        <option key={eq.ID} value={eq.Equation || eq.Equeation}>
                          {eq.Equation || eq.Equeation}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      กรอกสมการเอง g(x)
                    </label>
                    <input
                      type="text" 
                      value={equation}
                      placeholder="เช่น (x+1)^(1/3)"
                      onChange={(e) => this.setState({equation:e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 font-mono transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Initial (X0)
                    </label>
                    <input 
                      type="number"
                      value={x0}
                      onChange={(e) => this.setState({ x0: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tolerance (ε)
                    </label>
                    <input 
                      type="number"
                      value={tolerance}
                      onChange={(e) => this.setState({tolerance:e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all outline-none"
                      step="0.000001"
                    />
                  </div>
                </div>
                <button
                  onClick={this.calculate}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg  transform  transition-all"
                >
                  <span className="text-xl">Calculate Root</span>
                </button>
                {/* Error Message Display */}
                {errMsg && (
                    <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                        <p className="font-bold">Error</p>
                        <p>{errMsg}</p>
                    </div>
                )}
                {/* Result Display */}
                {result !== null && !errMsg && (
                  <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="text-lg font-bold text-gray-800">Root Found!</h3>
                    <p className="text-3xl font-bold text-green-700">x = {result.toFixed(8)}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Converged after {iteration.length} iterations
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chart and Table Section */}
          
          {iteration.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              {/* เปลี่ยนชื่อหัวข้อตรงนี้ */}
              <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Graph</h2>
              {(() => {
                  const initialX = Number(this.state.x0);
                  const [minX, maxX] = this.getDomain(iteration, initialX);
                  
                  const N = 500;
                  const step = (maxX - minX) / (N - 1);
                  const xs = Array.from({ length: N }, (_, i) => minX + i * step);
                  
                  const g_ys = xs.map(x_val => { 
                      try { return evaluate(equation, { x: x_val }); } catch { return NaN; } 
                  });

                
                  return (
                      <div className="mx-auto w-full h-[700px]"> 
                          <Plot
                              data={[
                                  
                                  { x: xs, y: xs, type: "scatter", mode: "lines", name: "x = x", line: { color: "blue", width: 2 } },
                                  
                                  
                                  { x: xs, y: g_ys, type: "scatter", mode: "lines", name: "g(x)", line: { color: "green", width: 2 } },
                                  
                                  
                                  ...this.makeCobwebTracesUpdated(iteration),
                              ]}
                              layout={{
                                  autosize: true,
                                  margin: { t: 40, r: 40, b: 40, l: 50 },
                                  
                                  
                                  legend: {
                                      x: 1,           
                                      y: 1.05,        
                                      xanchor: 'right', 
                                      bgcolor: 'rgba(255, 255, 255, 0.5)', 
                                      bordercolor: '#c7c7c7',
                                      borderwidth: 1
                                  },
                                  
                                  
                                  xaxis: {
                                      
                                      range: [minX, maxX]
                                  },
                                  yaxis: {
                                      // title: "y", // ลบชื่อแกน y ออก
                                      scaleanchor: "x",  // <-- สำคัญมาก: ทำให้แกน Y มีสเกลเดียวกับ X
                                      scaleratio: 1,     // <-- สำคัญมาก: ทำให้ Aspect Ratio เป็น 1:1
                                      range: [minX, maxX]
                                  },
                                  // title: 'Cobweb Plot...' // ลบ Title ภายในกราฟออก
                              }}
                              config={{ responsive: true }}
                              useResizeHandler={true}
                              style={{ width: "100%", height: "100%" }}
                          />
                      </div>
                  );
                  // --- END: โค้ดที่แก้ไข ---
              })()}
          </div>
          )}
          {result !== null && iteration.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Iteration Table</h2>
              <Table 
                steps={iteration.map((s) => ({
                    iteration: s.iter,
                    x: s.x,
                    y: s.y,
                    error: s.err
                }))}/>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Onepoint;