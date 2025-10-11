import React from 'react'
import Table from '../components/Table';
import Chart from '../components/Chart';
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
    const newEquation = prompt("ใส่สมการใหม่:",oldEquation);
    if (!newEquation) return;
    axios.put(`http://localhost:5000/root/${id}`, { equation: newEquation })
    .then((res) => {
      alert(res.data.message);
      this.setState((prevState) =>({
        equationDB: prevState.equationDB.map(eq =>
            eq.ID === id ? { ...eq, Equeation: newEquation } : eq
        )
      }))
    })
    .catch((err) => {
      console.error(err);
      alert("แก้ไขไม่สำเร็จ");
    });
  };
  equationExists = (equations, equation) => {
    return equations.some(eq => eq.Equeation === equation);
  };

  saveEquation = async (equation) => {
    try {
      const response = await axios.post("http://localhost:5000/root", { 
        equation: equation 
      });
      return response.data;
    } catch (error) {
      console.error("Error saving equation:", error);
      throw error;
    }
  };
  getDomain = (iterations, x0) => {
    const xs = iterations.map(p => p.x);
    const minX = Math.min(x0, ...xs);
    const maxX = Math.max(x0, ...xs);
    return [minX, maxX];
  };

  makeCobwebTraces = (iterations) => {
    const traces = [];
    for (let i = 0; i < iterations.length - 1; i++) {
      const p1 = iterations[i];
      const p2 = iterations[i + 1];
      traces.push({
        x: [p1.x, p1.x, p2.x],
        y: [p1.y, p2.y, p2.y],
        type: "scatter",
        mode: "lines",
        line: { color: "red" },
        name: i === 0 ? "Cobweb" : undefined
      });
    }
    return traces;
  };
  calculate = () => {
    try {
      const { equation, x0, tolerance } = this.state;
      console.log(equation);
      let x0c = number(x0);
      let tol = number(tolerance);

      if (!Number.isFinite(x0c) || !Number.isFinite(tol)) {
        this.setState({ errMsg: "กรุณากรอกค่า X Initial และข้อผิดพลาดให้ถูกต้อง" });
        return;
      }
      if (!equation || typeof equation !== "string") {
        this.setState({ errMsg: "กรุณากรอกสมการ g(x)" });
        return;
      }
      // one point const res = this.onePointIteration(x0c, tol, equation);
      const out = { result: 0, iter: 0, iterations: [], error: undefined };
      if (!equation || equation.trim().length === 0) {
        out.error = "Invalid function";
        return out;
      }
      try {
          evaluate(equation, { x: x0c });
        } catch (e) {
          out.error = "Invalid function";
          return out;
      }
      const maxIter = 100;
      let iter = 0;
      let x = x0c;
      let xOld = x * 100; 
      let err = 0;
      while(iter < maxIter){
        iter++;
        if(iter === maxIter){
          out.error = "Max iteration reached";
          break;
        }  
        const variableMatch = equation.match(/[a-zA-Z]+/);
        const variable = variableMatch ? variableMatch[0] : "x";
        const gx = evaluate(equation, { x });
        out.iterations.push({iter, x, y: gx, err });
        x = gx;
        err = Math.abs((x - xOld) / xOld);
        if(err < tol){
          out.result = x;
          out.iter = iter;
          break;

        }
        xOld = x;
      }
      if(!out.result){
        out.result = x;
        out.iter = iter;
      }
      if(out.error)this.setState({ errMsg: out.error });
      this.setState({
        result: out.result ?? null,
        iterCnt: out.iter ?? 0,
        iteration:out.iterations ?? [],
      });
      // const [minX, maxX] = getDomain(out.iterations, x0c);
      // const cobweb = makeCobwebTraces(out.iterations);
      // const step = (maxX - minX) / 100;
      // const xs = Array.from({ length: 101 }, (_, i) => minX + i * step);
      // const gxVals = xs.map(v => evaluate(equation, { x: v }));
      // const lineYEqualsX = {
      //   x: xs,
      //   y: xs,
      //   type: "scatter",
      //   mode: "lines",
      //   line: { color: "blue" },
      //   name: "y = x"
      // };
      // const lineGX = {
      //   x: xs,
      //   y: gxVals,
      //   type: "scatter",
      //   mode: "lines",
      //   line: { color: "green" },
      //   name: "g(x)"
      // };
      // const plotData = [lineYEqualsX, lineGX, ...cobweb];
      // this.setState({
      //   result: out.result ?? null,
      //   iterCnt: out.iter ?? 0,
      //   iteration: out.iterations ?? [],
      //   chartData: plotData,
      //   chartDomain: [minX, maxX],
      // });
        
        

    } catch (err) {
        
        let errorMessage = "เกิดข้อผิดพลาดในการคำนวณ";
        if (err instanceof Error) {
            errorMessage += ":\n" + err.message;
        }
        alert(errorMessage);
    }
};
  
  render(){
    const { equation, x0, tolerance, result, equationDB } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl text-blue-800 font-bold  mb-3">
              Onepoint Iteration
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Database */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold text-gray-800">สมการใน Database</h2>
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {equationDB.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">ไม่มีสมการในระบบ</p>
                  ) : (
                    equationDB.map(eq => (
                      <div key={eq.ID} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <code className="text-sm font-mono text-gray-800 font-semibold">{eq.Equeation}</code>
                          <div className="flex gap-1">
                            <button
                              onClick={() => this.handleUpdate(eq.ID, eq.Equeation)}
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
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    >
                      <option value="">-- เลือกสมการ --</option>
                      {equationDB.map((eq) =>(
                        <option key={eq.ID} value={eq.Equeation}>
                          {eq.Equeation}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      กรอกสมการเอง
                    </label>
                    <input
                      type="text" 
                      value={equation}
                      placeholder="เช่น x*x - 4 หรือ x^3 - 2*x - 5"
                      onChange={(e) => this.setState({equation:e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div>
                </div>
                {/* Manual Equation Input */}
                <div className="mb-6">
                  
                </div>
                {/* Input Parameters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Initial Guess (x₀)
                    </label>
                    <input 
                      type="number"
                      value={x0}
                      onChange={(e) => this.setState({ x0: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div>
                  {/* <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Initial Guess (x₀)
                    </label>
                    <input 
                      type="number"
                      value={x1}
                      onChange={(e) => this.setState({ x1: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                  </div> */}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tolerance (ε)
                    </label>
                    <input 
                      type="number"
                      value={tolerance}
                      onChange={(e) => this.setState({tolerance:e.target.value})}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      step="0.000001"
                    />
                  </div>
                </div>
                <button
                  onClick={this.calculate}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                >
                  <span className="text-2xl">Calculate Root</span>
                </button>
                {/* Result Display */}
                {result !== null && (
                  <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-bold text-gray-800">Root Found!</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-700">x = {result.toFixed(8)}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Converged after {this.state.iteration.length} iterations
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Chart Section */}
          {this.state.chartData && (
            <div className="mt-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Graph</h2>
              <Chart
                data={this.state.chartData}
                layout={{
                  width: 800,
                  height: 600,
                  xaxis: { range: this.state.chartDomain, title: "x" },
                  yaxis: { range: this.state.chartDomain, title: "y" },
                  legend: { x: 1, y: 1 },
                }}
              />
            </div>
          )}
          {result !== null && (
            <div className="mt-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Convergence Analysis</h2>
              <Table 
                steps={this.state.iteration.map((s) => ({
                    iteration:s.iter,
                    x:s.x,
                    y:s.y,
                    error:s.err
              }))}/>
            </div>
          )}
        </div>
      </div>
    );
    // return(
    //   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
    //       <div className="text-center mb-12"> 
    //         <h1 className="text-5xl font-bold bg-gradient-to-r text-blue-800 bg-clip-text mb-3">
    //           Onepoint Iteration
    //         </h1>
    //       </div>
    //   </div>
    // )
  }
  // return (
  //   <div className="max-w-8xl mx-auto mt-8 p-8 rounded-lg bg-white">
  //     <h1 className="text-center font-bold text-4xl mb-8 text-blue-800">Onepoint Iteration</h1>
  //     <div>
  //       <label className='block'>สมการ f(x) = 0</label>
  //       <input 
  //         type="text" 
  //         value={equation}
  //         placeholder='f(x)'
  //         onChange={(e) => setEquation(e.target.value)}
  //         className='rounded-lg border'
  //       />
  //     </div>

  //   </div>
  // )
}

export default Onepoint
