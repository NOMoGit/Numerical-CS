import React from "react";
// import nerdamer from "nerdamer";
import nerdamer from 'nerdamer/all';
import Plot from "react-plotly.js";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { evaluate } from "mathjs";

class Comtrapezoidal extends React.Component{
  constructor(props) {
          super(props);
          this.state = {
              equation: "",
              a: "2",
              b: "8",
              n: "2",
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
              const error = (((I_real - I_cal) / I_real) * 100);
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
                <MathJaxContext>
                    <div className="min-h-screen bg-gray-50 py-12 px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h1 className="text-5xl font-bold text-blue-800 mb-3">
                                    Composite Trapezoidal's Rule
                                </h1>
                            </div>
                                <div className="w-full max-w-4xl py-4">
                                   <div className="mt-5 p-4 bg-white rounded-2xl shadow-inner text-center ">
                                       <MathJax className="text-3xl" dynamic>{latex}</MathJax>
                                   </div>
                                </div>
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
    
                                    <div>
                                        <label className="block mb-1 font-semibold text-gray-700">Pairs of intervals (n)</label>
                                        <input
                                            type="number"
                                            value={n}
                                            onChange={(e) => this.setState({ n: e.target.value })}
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
                </MathJaxContext>
            );
  }
}

export default Comtrapezoidal