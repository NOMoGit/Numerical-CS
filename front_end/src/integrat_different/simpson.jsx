import React from "react";
// import nerdamer from "nerdamer";
import nerdamer from 'nerdamer/all';
import Plot from "react-plotly.js";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { evaluate } from "mathjs";

class Simpson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            equation: "",
            a: "-1",
            b: "2",
            n: "1",
            Ireal: null,
            Ical: null,
            error: null,
            xcurve: [],
            ycurve: [],
            iterationX: [],
            iterationY: [],
            graphsimpson: [],
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

    
    simpsoncal = (a, b, n, variable) => {
      const {equation} = this.state;
        if (n < 1) {
            alert("n ต้องมากกว่า 0");
            return;
        }
        if (b < a) {
            alert("B ต้องมากกว่า A");
            return;
        }
        const h = (b - a) / (2 * n);
        let sumpos = 0;
        let sumne = 0;

        
        for (let i = 1; i < 2 * n; i++) {
            if (i % 2 === 0) {
                sumpos += this.Fcal(a + i * h, variable);
            } else {
                sumne += this.Fcal(a + i * h, variable);
            }
        }
        
        const I = (h / 3) * (this.Fcal(a, variable) + this.Fcal(b, variable) + 4 * sumne + 2 * sumpos);
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

            const Fx_inte = nerdamer(`integrate(${equation}, ${ variable})`). toString(); 

            console.log('Fx_inte:', Fx_inte); 


            const Fb = nerdamer(Fx_inte, { [variable]: bnum }).evaluate();
            const Fa = nerdamer(Fx_inte, { [variable]: anum }).evaluate();
            const I_real = Fb - Fa;
            this.setState({ Ireal: I_real });


            const I_cal = this.simpsoncal(anum, bnum, nnum, variable);
            this.setState({ Ical: I_cal });


            const error = Math.abs(((I_real - I_cal) / I_real) * 100);
            this.setState({ error });

            const xcuv = [];
            const ycuv = [];
            for (let i = anum; i <= bnum; i += 0.01) {
                xcuv.push(i);
                ycuv.push(this.Fcal(i, variable));
            }
            this.setState({ xcurve: xcuv, ycurve: ycuv });


            const h = (bnum - anum) / (2 * nnum);
            const xi = [];
            const yi = [];
            for (let i = 0; i <= 2 * nnum; i++) {
                const xcal = anum + i * h;
                xi.push(xcal);
                yi.push(this.Fcal(xcal, variable));
            }
            this.setState({ iterationX: xi, iterationY: yi });

            const simpson = xi.map((x, i) => {
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

            this.setState({ graphsimpson: simpson });
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการคำนวณ:", error);
            alert("สมการหรือขอบเขตไม่ถูกต้อง: " + error.message);
        }
    };
    render() {
        const { equation, a, b, n, Ireal, Ical, error, xcurve, ycurve, iterationX, iterationY, graphsimpson } = this.state;
        const latex = `\\[\\int_{${a || "a"}}^{${b || "b"}} (${equation || "\\;f(x)\\;"}) \\,dx\\]`;

        return (
            <MathJaxContext>
                <div className="min-h-screen bg-gray-50 py-20 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-20">
                            <h1 className="text-5xl font-bold text-blue-800 mb-3">
                                Simpson's Rule
                            </h1>
                        </div>
                            <div className="w-full max-w-4xl py-4 ">
                               <div className="mt-5 p-4 pt-10 bg-white rounded-2xl shadow-inner text-center ">
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

                                {/* <div>
                                    <label className="block mb-1 font-semibold text-gray-700">Pairs of intervals (n)</label>
                                    <input
                                        type="number"
                                        value={n}
                                        onChange={(e) => this.setState({ n: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-xl p-3 font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    />
                                </div> */}

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
                                        { x: xcurve, y: ycurve, type: "scatter", mode: "lines", name: "f(x)", line: { color: "black", width: 3 } },
                                        ...graphsimpson,
                                        { x: iterationX, y: iterationY, type: "scatter", mode: "markers", name: "Data Points", marker: { color: "red", size: 8 } },
                                    ]}
                                    layout={{
                                        autosize: true,
                                        title: { text: "Simpson's Rule Approximation" },
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

export default Simpson;
