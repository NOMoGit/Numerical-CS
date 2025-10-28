
import React from "react";
import axios from "axios";
import { evaluate } from "mathjs";
import Chart from "../components/Chart";
import Table from "../components/Table";

class Secant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equation: "",
      x0: 1,
      x1: 2,
      tolerance: 0.000001,
      result: null,
      iterations: [],
      equationDB: []
    };
  }

  componentDidMount() {
    axios.get("http://localhost:5000/root")
      .then((response) => {
        this.setState({ equationDB: response.data.results });
      })
      .catch(() => {
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
  handleUpdate = (id, oldEquation) => {
    const newEquation = prompt("ใส่สมการใหม่:", oldEquation);
    if (!newEquation) return;

    axios.put(`http://localhost:5000/root/${id}`, { equation: newEquation })
      .then((res) => {
        alert(res.data.message);
        // อัปเดต state ให้สมการเปลี่ยน
        this.setState((prevState) => ({
          equationDB: prevState.equationDB.map(eq =>
            eq.ID === id ? { ...eq, Equeation: newEquation } : eq
          )
        }));
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
  calculate = () => {
    try {
      const { equation, x0, x1, tolerance } = this.state;

      const variableMatch = equation.match(/[a-zA-Z]+/g);
      const variable = variableMatch ? variableMatch[variableMatch.length - 1] : "x";

      let x0c = parseFloat(x0);
      let x1c = parseFloat(x1);
      let tol = parseFloat(tolerance);
      let x2, err;
      let history = [];
      let iter = 0;

      do {
        let fx0 = evaluate(equation, { [variable]: x0c });
        let fx1 = evaluate(equation, { [variable]: x1c });

        if (fx1 - fx0 === 0) {
          alert("หารด้วยศูนย์ (fx1 - fx0 = 0)");
          return;
        }

        x2 = x1c - (fx1 * (x1c - x0c)) / (fx1 - fx0);
        
        err = Math.abs((x2 - x1c) / x2);

        history.push({
          iteration: iter,
          x0: x0c,
          x1: x1c,
          fx0,
          fx1,
          error: err
        });

        x0c = x1c;
        x1c = x2;
        iter++;
      } while (err >= tol);

      this.setState({ result: x2, iterations: history });
    } catch (error) {
      alert("สมการผิด");
    }
  };
  
  render() {
    const { equation, x0, x1, tolerance, result, equationDB } = this.state;

    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl text-blue-800 font-bold  mb-3">
              Secant Method
            </h1>
          </div>
          <div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
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
                      <div key={eq.ID} className="bg-gray-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200 hover:shadow-md transition-shadow">
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
                      className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all outline-none"
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
                      className="w-full border-2 border-gray-200 rounded-xl p-3 font-mono transition-all outline-none"
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
                      className="w-full border-2 border-gray-200 rounded-xl p-3 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Initial Guess (x₀)
                    </label>
                    <input 
                      type="number"
                      value={x1}
                      onChange={(e) => this.setState({ x1: e.target.value })}
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
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all"
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
                      Converged after {this.state.iterations.length} iterations
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Chart Section */}
          {result !== null && (
            <div className="mt-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Convergence Analysis</h2>
            <Chart 
                data={this.state.iterations.map((s) => ({
                iteration: s.iteration,
                x: s.error
              }))}
            />
          </div>
          )}
          {result !== null && (
            <div className="mt-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Convergence Analysis</h2>
              <Table 
                steps={this.state.iterations.map((s) => ({
                    iteration:s.iteration,
                    x:s.x0,
                    y:s.fx0,
                    error:s.error
              }))}/>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Secant;
