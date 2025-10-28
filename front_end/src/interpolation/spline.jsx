import React from 'react';

class Spline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numPoints: 4,
            points: [],
            xValue: '',
            result: null,
            type: "Cubic" 
        };
    }
    linearSplineInterpolate = (points, x) => {
        const sortedPoints = [...points].sort((a, b) => a.x - b.x);
        const n = sortedPoints.length;
        
        let i = 0;
        if (x < sortedPoints[0].x) {
            i = 0;
        } else if (x >= sortedPoints[n - 1].x) {
            i = n - 2;
        } else {
            while (i < n - 1 && x > sortedPoints[i + 1].x) {
                i++;
            }
        }
        
        const x0 = sortedPoints[i].x;
        const y0 = sortedPoints[i].y;
        const x1 = sortedPoints[i + 1].x;
        const y1 = sortedPoints[i + 1].y;
        
        return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    };
    quadraticSplineInterpolate = (points, x) => {
        const sortedPoints = [...points].sort((a, b) => a.x - b.x);
        const n = sortedPoints.length;
        const h = new Array(n - 1);
        for (let i = 0; i < n - 1; i++) {
            h[i] = sortedPoints[i + 1].x - sortedPoints[i].x;
            if (h[i] === 0) {
                throw new Error(`ค่า x ซ้ำกัน: ${sortedPoints[i].x} กรุณาใช้ค่า x ที่ไม่ซ้ำกัน`);
            }
        }
        const a = new Array(n - 1);
        const b = new Array(n - 1);
        a[0] = 0;
        b[0] = (sortedPoints[1].y - sortedPoints[0].y) / h[0];
        for (let i = 1; i < n - 1; i++) {
            b[i] = 2 * a[i - 1] * h[i - 1] + b[i - 1];
            a[i] = (sortedPoints[i + 1].y - sortedPoints[i].y - b[i] * h[i]) / (h[i] * h[i]);
        }
        let i = 0;
        if (x < sortedPoints[0].x) {
            i = 0;
        } else if (x >= sortedPoints[n - 1].x) {
            i = n - 2;
        } else {
            while (i < n - 1 && x > sortedPoints[i + 1].x) {
                i++;
            }
        }
        
        const dx = x - sortedPoints[i].x;
        return a[i] * dx * dx + b[i] * dx + sortedPoints[i].y;
    };
    
    solveTridiagonalSystem = (a, b, c, d) => {
        const n = d.length;
        const c_prime = new Array(n).fill(0);
        const d_prime = new Array(n).fill(0);
        const x = new Array(n).fill(0);

        c_prime[0] = c[0] / b[0];
        d_prime[0] = d[0] / b[0];
        for (let i = 1; i < n; i++) {
            const m = 1.0 / (b[i] - a[i] * c_prime[i - 1]);
            c_prime[i] = c[i] * m;
            d_prime[i] = (d[i] - a[i] * d_prime[i - 1]) * m;
        }

        x[n - 1] = d_prime[n - 1];
        for (let i = n - 2; i >= 0; i--) {
            x[i] = d_prime[i] - c_prime[i] * x[i + 1];
        }
        return x;
    }

    cubicSplineInterpolate = (points, x) => {
        const sortedPoints = [...points].sort((a, b) => a.x - b.x);
        const n = sortedPoints.length;
        const h = new Array(n - 1);
        for (let i = 0; i < n - 1; i++) {
            h[i] = sortedPoints[i + 1].x - sortedPoints[i].x;
            if (h[i] === 0) {
                throw new Error(`ค่า x ซ้ำกัน: ${sortedPoints[i].x} กรุณาใช้ค่า x ที่ไม่ซ้ำกัน`);
            }
        }

        const a_mat = new Array(n - 2);
        const b_mat = new Array(n - 2);
        const c_mat = new Array(n - 2);
        const d_mat = new Array(n - 2);

        for (let i = 0; i < n - 2; i++) {
            a_mat[i] = h[i];
            b_mat[i] = 2 * (h[i] + h[i + 1]);
            c_mat[i] = h[i + 1];
            d_mat[i] = 6 * (((sortedPoints[i + 2].y - sortedPoints[i + 1].y) / h[i + 1]) - ((sortedPoints[i + 1].y - sortedPoints[i].y) / h[i]));
        }

        const interiorM = this.solveTridiagonalSystem(a_mat, b_mat, c_mat, d_mat);
        const M = [0, ...interiorM, 0]; 

        let i = 0;
        if (x < sortedPoints[0].x) {
            i = 0;
        } else if (x >= sortedPoints[n - 1].x) {
            i = n - 2;
        } else {
            while (i < n - 1 && x > sortedPoints[i + 1].x) {
                i++;
            }
        }

        const x_i = sortedPoints[i].x;
        const y_i = sortedPoints[i].y;
        const x_i1 = sortedPoints[i + 1].x;
        const y_i1 = sortedPoints[i + 1].y;

        const term1 = (M[i] * Math.pow(x_i1 - x, 3)) / (6 * h[i]);
        const term2 = (M[i + 1] * Math.pow(x - x_i, 3)) / (6 * h[i]);
        const term3 = ((y_i / h[i]) - (M[i] * h[i] / 6)) * (x_i1 - x);
        const term4 = ((y_i1 / h[i]) - (M[i + 1] * h[i] / 6)) * (x - x_i);

        return term1 + term2 + term3 + term4;
    };
    generatePoints = () => {
        this.setState(prevState => {
            const newPoints = [];
            for (let i = 0; i < prevState.numPoints; i++) {
                if (prevState.points[i]) {
                    newPoints.push(prevState.points[i]);
                } else {
                    newPoints.push({ x: '', y: '', id: Date.now() + i });
                }
            }
            return { points: newPoints.slice(0, prevState.numPoints) };
        });
    }

    componentDidMount() {
        this.generatePoints();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.numPoints !== this.state.numPoints) {
            this.generatePoints();
        }
    }

    handleNumPointsInputChange = (e) => {
        const value = parseInt(e.target.value) || 2;
        this.setState({ numPoints: Math.max(2, Math.min(20, value)) });
    }
    
    handleTypeChange = (e) => {
        this.setState({ type: e.target.value, result: null });
    }

    handlePointChange = (index, field, value) => {
        this.setState(prevState => {
            const newPoints = [...prevState.points];
            newPoints[index][field] = value;
            return { points: newPoints };
        });
    };

    calculate = () => {
        this.setState({ result: null });

        const xToFind = parseFloat(this.state.xValue);
        if (isNaN(xToFind)) {
            this.setState({ result: { message: 'กรุณาใส่ "X value" เป็นตัวเลขที่ถูกต้อง', type: 'error' } });
            return;
        }

        const allPoints = this.state.points.map(p => ({
            x: parseFloat(p.x),
            y: parseFloat(p.y),
        }));
            
        const minPoints = {
            "Linear": 2,
            "Quadratic": 3,
            "Cubic": 3
        };
        
        if (allPoints.length < minPoints[this.state.type]) {
             this.setState({ result: { message: `${this.state.type} Spline ต้องการข้อมูลอย่างน้อย ${minPoints[this.state.type]} จุด`, type: 'error' } });
            return;
        }

        if (allPoints.some(p => isNaN(p.x) || isNaN(p.y))) {
            this.setState({ result: { message: 'กรุณากรอกข้อมูล x และ f(x) ให้เป็นตัวเลขครบทุกจุด', type: 'error' } });
            return;
        }

        try {
            let finalResult;
            switch (this.state.type) {
                case "Linear":
                    finalResult = this.linearSplineInterpolate(allPoints, xToFind);
                    break;
                case "Quadratic":
                    finalResult = this.quadraticSplineInterpolate(allPoints, xToFind);
                    break;
                case "Cubic":
                    finalResult = this.cubicSplineInterpolate(allPoints, xToFind);
                    break;
                default:
                    throw new Error("ไม่รู้จักประเภทของ Spline");
            }
            this.setState({ result: { message: `f(${xToFind}) ≈ ${finalResult.toFixed(6)}`, type: 'success' } });
        } catch (error) {
            this.setState({ result: { message: `เกิดข้อผิดพลาด: ${error.message}`, type: 'error' } });
        }
    };

    render() {
        const { numPoints, points, xValue, result, type } = this.state;

        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <header className="text-center mb-12">
                        <h1 className='text-4xl sm:text-5xl font-extrabold text-blue-800 mb-2'>
                            Spline Interpolation
                        </h1>
                    </header>

                    <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-6">

                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold text-gray-700 text-left">
                                    Type of Spline
                                </label>
                                <select 
                                    value={type}
                                    onChange={this.handleTypeChange}
                                    className='flex w-full text-center border rounded-xl border-gray-300 transition p-3 '
                                >
                                    <option value="Linear">Linear</option>
                                    <option value="Quadratic">Quadratic</option> 
                                    <option value="Cubic">Cubic</option>
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold text-gray-700 text-left">
                                    Number of points
                                </label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        className="w-full text-center border rounded-xl border-gray-300 transition p-3"
                                        value={numPoints}
                                        onChange={this.handleNumPointsInputChange}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold text-gray-700 text-left">
                                    X value
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg transition"
                                    placeholder="0.00"
                                    value={xValue}
                                    onChange={(e) => this.setState({ xValue: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            className="w-full py-3 mb-8 text-lg font-bold text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                            onClick={this.calculate}
                        >
                            Calculate!
                        </button>
                        
                        <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                            {points.map((point, index) => (
                                <div
                                    className="grid grid-cols-[auto_1fr_1fr] gap-3 sm:gap-4 items-center mb-4 last:mb-0"
                                    key={point.id}
                                >
                                    <label className="font-medium text-gray-600 select-none">
                                        {index + 1}.
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={`x${index}`}
                                        value={point.x}
                                        onChange={(e) => this.handlePointChange(index, 'x', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={`f(x${index})`}
                                        value={point.y}
                                        onChange={(e) => this.handlePointChange(index, 'y', e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                        
                        {result && (
                            <div
                                className={`mt-8 p-4 border rounded-lg text-center font-semibold text-lg
                                    ${result.type === 'success'
                                        ? 'bg-green-100 border-green-400 text-green-800'
                                        : 'bg-red-100 border-red-400 text-red-800'
                                    }`
                                }
                            >
                                {result.message}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        );
    }
}

export default Spline;