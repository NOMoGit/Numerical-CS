import React from "react";
import Table from "../components/Table";
import Chart from '../components/Chart';
import { evaluate } from "mathjs";
import axios from 'axios';


class Bisection extends React.Component{
    constructor(props){
        super(props);
        this.state={
            equation:"",
            xl: 1.5,
            xr: 2,
            tolerance: 0.000001,
            result: null,
            iteration: [],
            equationDB: []
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
    calculate = async () => {
        try {
            const {equation , xl , xr , tolerance , equationDB } = this.state;
            const variableMatch = equation.match(/[a-zA-Z]+/g);
            const variable = variableMatch ? variableMatch[variableMatch.length - 1] : "x";
            let xlcal = parseFloat(xl); 
            let xrcal = parseFloat(xr);
            let tol = parseFloat(tolerance);
            let fxl = evaluate(equation,{[variable]:xlcal});
            let fxr = evaluate(equation,{[variable]:xrcal});
            let xm = (xlcal+xrcal)/2;
            let fxm = evaluate(equation,{[variable]:xm});
            let xmold = null ;
            let history = [];
            let iter = 0;
            let err  = Infinity;
            do {
                xm = (xlcal+xrcal)/2;
                fxm = evaluate(equation,{[variable]:xm});
                
                if( xm !== 0){
                    err = Math.abs((xm - xmold) / xm);
                }
                history.push({
                    iteration:iter,
                    xm,
                    fxm,
                    error:err
                });
                if(fxl * fxm > 0){
                    xlcal = xm;
                    fxl = fxm;
                }else{
                    xrcal = xm;
                }
                xmold = xm;
                fxl = evaluate(equation,{[variable]:xlcal});
                fxr = evaluate(equation,{[variable]:xrcal});
                iter++;
                
            } while (err > tol);
            this.setState({result:xm , iteration:history});
            if (!this.equationExists(equationDB,equation)) {
                const savedData = await this.saveEquation(equation);
                console.log("บันทึกสมการสำเร็จ:", savedData);
                this.setState((prevState) => ({
                    equationDB: [...prevState.equationDB, {
                        ID: savedData.id, 
                        Equeation: equation 
                    }]
                }));
            } else {
                console.log("สมการนี้มีอยู่ใน database แล้ว");
            }
        } catch (error) {
            alert("สมการผิด");
        }
    };
    render(){
        const {equation , xl , xr , tolerance , result , equationDB } = this.state;
        return(
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
                
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold bg-gradient-to-r text-blue-800 bg-clip-text mb-3">
                            Bisection Method Calculator
                        </h1>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Panel - Database */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                <div className="flex items-center gap-2 mb-4">
                                <h2 className="text-xl font-bold text-gray-800">ตัวอย่างสมการ</h2>
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
                                {/* Equation Selection */}
                                <div className="mb-6">
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
                                {/* Manual Equation Input */}
                                <div className="mb-6">
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
                                {/* Input Parameters Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Initial Guess (x₀)
                                        </label>
                                        <input 
                                        type="number"
                                        value={xl}
                                        onChange={(e) => this.setState({ xl: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Initial Guess (x₀)
                                        </label>
                                        <input 
                                        type="number"
                                        value={xr}
                                        onChange={(e) => this.setState({ xr: e.target.value })}
                                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
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
                                        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                        step="0.000001"
                                        />
                                    </div>
                                </div>
                                {/* Calculate Button */}
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
                                        <p className="text-3xl font-bold text-green-700">{this.state.variable} = {result.toFixed(8)}</p>
                                        <p className="text-sm text-gray-600 mt-2">
                                        Converged after {this.state.iteration.length} iterations
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
                            data={this.state.iteration.map((s) => ({
                            iteration: s.iteration,
                            x: s.error
                            }))}
                        />
                        </div>
                    )}
                    {result !== null && (
                        <div className="mt-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Iteration</h2>
                        <Table 
                            steps={this.state.iteration.map((s) => ({
                                iteration:s.iteration,
                                x:s.xm,
                                y:s.fxm,
                                error:s.error
                        }))}/>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}
export default Bisection;
// Class สำหรับจัดการสมการคณิตศาสตร์
// class MathEquation {
//     constructor(equationString) {
//         this.equationString = equationString;
//         this.func = null;
//     }

//     parse() {
//         try {
//             const processedEq = this.equationString.replace(/\^/g, '**');
//             this.func = new Function("x", `with(Math){ return ${processedEq}; }`);
//             return true;
//         } catch (e) {
//             throw new Error("สมการไม่ถูกต้อง");
//         }
//     }

//     evaluate(x) {
//         if (!this.func) {
//             throw new Error("กรุณา parse สมการก่อน");
//         }
//         return this.func(x);
//     }

//     getString() {
//         return this.equationString;
//     }
// }
// // Class สำหรับจัดการข้อมูลแต่ละรอบการคำนวณ
// class IterationStep {
//     constructor(iteration, a, b, mid, fmid, error) {
//         this.iteration = iteration;
//         this.a = a;
//         this.b = b;
//         this.mid = mid;
//         this.fmid = fmid;
//         this.error = error;
//     }

//     toTableFormat() {
//         return {
//             iteration: this.iteration,
//             x: this.mid,
//             y: this.fmid,
//             error: this.error
//         };
//     }

//     toChartFormat() {
//         return {
//             iteration: this.iteration,
//             x: this.error
//         };
//     }
// }
// // Class สำหรับการคำนวณด้วย Bisection Method
// class BisectionCalculator {
//     constructor(equation, a, b, tolerance) {
//         this.equation = new MathEquation(equation);
//         this.a = parseFloat(a);
//         this.b = parseFloat(b);
//         this.tolerance = parseFloat(tolerance);
//         this.steps = [];
//         this.result = null;
//         this.iterations = 0;
//     }

//     validate() {
//         if (isNaN(this.a) || isNaN(this.b) || isNaN(this.tolerance)) {
//             throw new Error("กรุณากรอกค่าตัวเลขที่ถูกต้อง");
//         }

//         this.equation.parse();

//         const fa = this.equation.evaluate(this.a);
//         const fb = this.equation.evaluate(this.b);

//         if (fa * fb > 0) {
//             throw new Error('ไม่มีคำตอบในช่วงนี้');
//         }
//     }

//     calculate() {
//         this.validate();

//         let left = this.a;
//         let right = this.b;
//         let mid = (left + right) / 2;
//         let err = 1;
//         let iter = 0;

//         do {
//             iter++;

//             const Fa = this.equation.evaluate(left);
//             const Fb = this.equation.evaluate(right);
//             const fmid = this.equation.evaluate(mid);

//             if (Fa * fmid > 0) {
//                 left = mid;
//             } else {
//                 right = mid;
//             }

//             const mido = mid;
//             mid = (left + right) / 2;

//             const step = new IterationStep(iter, left, right, mido, fmid, err);
//             this.steps.push(step);

//             err = Math.abs((mid - mido) / mid);
//         } while (err >= this.tolerance);

//         this.result = mid;
//         this.iterations = iter;

//         return {
//             result: this.result,
//             iterations: this.iterations,
//             steps: this.steps
//         };
//     }

//     getStepsForTable() {
//         return this.steps.map(step => step.toTableFormat());
//     }

//     getStepsForChart() {
//         return this.steps.map(step => step.toChartFormat());
//     }
// }

// // Class สำหรับจัดการ API
// class EquationAPI {
//     constructor(baseURL = "http://localhost:5000") {
//         this.baseURL = baseURL;
//     }

//     async fetchEquations() {
//         try {
//             const response = await axios.get(`${this.baseURL}/root`);
//             return response.data.results || [];
//         } catch (error) {
//             console.error("Axios error:", error);
//             throw error;
//         }
//     }

//     async saveEquation(equation) {
//         try {
//             const response = await axios.post(`${this.baseURL}/root`, { 
//                 equation: equation 
//             });
//             return response.data;
//         } catch (error) {
//             console.error("Error saving equation:", error);
//             throw error;
//         }
//     }

//     equationExists(equations, targetEquation) {
//         return equations.some(eq => eq.Equeation === targetEquation);
//     }
// }

// // React Component

//     const [equation, setEquation] = useState("");
//     const [a, setA] = useState("1");
//     const [b, setB] = useState("10");
//     const [tolerance, setTolerance] = useState("0.000001");
//     const [error, setError] = useState("");
//     const [result, setResult] = useState(null);
//     const [iterations, setIterations] = useState(0);
//     const [steps, setSteps] = useState([]);
//     const [equations, setEquations] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const api = new EquationAPI();

//     useEffect(() => {
//         api.fetchEquations()
//             .then((data) => {
//                 setEquations(data);
//                 setLoading(false);
//             })
//             .catch(() => {
//                 setLoading(false);
//             });
//     }, []);

//     if (loading) return <p>Loading...</p>;

//     const handleCalculate = async () => {
//         setSteps([]);
        
//         if (!equation.trim()) {
//             setError("กรุณากรอกสมการ");
//             return;
//         }
        
//         setError("");

//         try {
//             const calculator = new BisectionCalculator(equation, a, b, tolerance);
//             const calculationResult = calculator.calculate();

//             setSteps(calculator.steps);
//             setResult(calculationResult.result);
//             setIterations(calculationResult.iterations);

//             // บันทึกสมการใหม่ลง Database
//             if (!api.equationExists(equations, equation)) {
//                 const savedData = await api.saveEquation(equation);
//                 console.log("บันทึกสมการสำเร็จ:", savedData);
                
//                 setEquations([...equations, { 
//                     ID: savedData.id, 
//                     Equeation: equation 
//                 }]);
//             } else {
//                 console.log("สมการนี้มีอยู่ใน database แล้ว");
//             }
//         } catch (e) {
//             setError(e.message || "เกิดข้อผิดพลาดในการคำนวณ");
//         }
//     };

//     return (
//         <div className="max-w-8xl mx-auto mt-8 p-8 rounded-lg bg-white">
//             <h1 className="text-center font-bold text-4xl mb-8 text-blue-800">
//                 Bisection Method Calculator
//             </h1>

//             <div className="grid md:grid-cols-2 gap-4">
//                 {/* Input */}
//                 <div className="space-y-4">
//                     {/* Dropdown สำหรับเลือกสมการจาก Database */}
//                     <div>
//                         <label className="block mb-2 font-medium text-gray-700">
//                             เลือกสมการจาก Database
//                         </label>
//                         <select 
//                             onChange={(e) => setEquation(e.target.value)}
//                             className="w-full border rounded-lg p-3 mb-2"
//                         >
//                             <option value="">-- เลือกสมการ --</option>
//                             {equations.map((eq) => (
//                                 <option key={eq.ID} value={eq.Equeation}>
//                                     {/* {eq.ID}: {eq.Equeation} */}
//                                     {eq.Equeation}
//                                 </option>
//                             ))}
//                         </select>
//                         <label className="block mb-2 font-medium text-gray-700">
//                             แก้ไขสมการใน Database
//                         </label>
//                         <select 
//                             onChange={(e) => setEquation(e.target.value)}
//                             className="w-full border rounded-lg p-3 mb-2"
//                         >
//                             <option value="">-- เลือกสมการ --</option>
//                             {equations.map((eq) => (
//                                 <option key={eq.ID} value={eq.Equeation}>
//                                     {/* {eq.ID}: {eq.Equeation} */}
//                                     {eq.Equeation}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block mb-2 font-medium text-gray-700">
//                             สมการ f(x) = 0 
//                         </label>
//                         <input 
//                             type="text"
//                             value={equation}
//                             onChange={(e) => setEquation(e.target.value)}
//                             placeholder="เช่น x*x - 4, sin(x) - 0.5, exp(x) - 2" 
//                             className='w-full border rounded-lg p-3 font-mono'
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                             ใช้: sin, cos, tan, exp, log, sqrt, abs, pow(x,n) หรือ x**n
//                         </p>
//                     </div>
//                 </div>

//                 <div>
//                     <div className="grid md:grid-cols-3 gap-2">
//                         <div>
//                             <label className="block mb-2 pl-3 font-medium text-gray-700">
//                                 ค่า a (ซ้าย)
//                             </label>
//                             <input 
//                                 type="number"
//                                 placeholder="a"
//                                 step="any"
//                                 value={a}
//                                 onChange={(e) => setA(e.target.value)}
//                                 className='w-full border rounded-lg p-3 font-mono'
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-2 pl-3 font-medium text-gray-700">
//                                 ค่า b (ขวา)
//                             </label>
//                             <input 
//                                 type="number"
//                                 placeholder="b" 
//                                 step="any"
//                                 value={b}
//                                 onChange={(e) => setB(e.target.value)}
//                                 className='w-full border rounded-lg p-3 font-mono'
//                             />
//                         </div>
//                         <div>
//                             <label className="block mb-2 pl-3 font-medium text-gray-700">
//                                 Tolerance
//                             </label>
//                             <input 
//                                 type="number"
//                                 placeholder="0.000001"
//                                 step="any"
//                                 value={tolerance}
//                                 onChange={(e) => setTolerance(e.target.value)} 
//                                 className='w-full border rounded-lg p-3 font-mono'
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Error and Result Display */}
//                 <div className='space-y-4 font-mono'>
//                     {error && (
//                         <div>
//                             <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                                 <div className="text-red-600 font-medium">
//                                     ข้อผิดพลาด
//                                 </div>
//                                 <pre className="text-red-700 text-sm mt-1 whitespace-pre-wrap">
//                                     {error}
//                                 </pre>
//                             </div>
//                         </div>
//                     )}
//                     {result !== null && !error && (
//                         <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//                             <div className="text-green-800 font-bold text-xl text-center">
//                                 ค่าประมาณ
//                             </div>
//                             <div className="text-center text-2xl font-mono bg-white p-3 rounded mt-2 border">
//                                 x ≈ {result.toFixed(8)}
//                             </div>
//                             <div className="text-center text-sm text-green-700 mt-2">
//                                 จำนวนรอบ: {iterations} รอบ
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 {/* Calculate Button */}
//                 <div>
//                     <div className="flex items-end">
//                         <button 
//                             onClick={handleCalculate}
//                             className='w-full p-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200'
//                         >
//                             <h1 className='text-4xl pb-3'>calculate</h1>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Steps Table */}
//             {steps.length > 0 && (
//                 <Table steps={steps.map((s) => s.toTableFormat())}/>
//             )}
                
//             {/* Chart */}
//             {steps.length > 0 && (
//                 <Chart
//                     data={steps.map((s) => s.toChartFormat())}
//                 />
//             )}
//         </div>
//     );
// }

// export default Bisection;