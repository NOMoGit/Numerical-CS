import React from 'react';

class Ludecompos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 3,
      matrixA: Array(3).fill().map(() => Array(3).fill("")),
      matrixB: Array(3).fill(""),
      result: [],
      // สามารถเพิ่ม L, U เพื่อแสดงผลได้ถ้าต้องการ
      // matrixL: [], 
      // matrixU: []
    };
  }

  changematrixA = (i, j, value) => {
    const newA = [...this.state.matrixA];
    newA[i][j] = value;
    this.setState({ matrixA: newA });
  }

  changematrixB = (i, value) => {
    const newB = [...this.state.matrixB];
    newB[i] = value;
    this.setState({ matrixB: newB });
  }

  changesize = (value) => {
    const size = parseInt(value, 10);
    if (size > 0 && size <= 10) {
      this.setState({
        n: size,
        matrixA: Array(size).fill().map(() => Array(size).fill("")),
        matrixB: Array(size).fill(""),
        result: []
      });
    }
  }

  // 1. ฟังก์ชันแยกตัวประกอบ LU (Doolittle's method)
  luDecomposition = (matrix) => {
    const n = matrix.length;
    let L = Array(n).fill(0).map(() => Array(n).fill(0));
    let U = Array(n).fill(0).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      // Upper Triangular
      for (let k = i; k < n; k++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += (L[i][j] * U[j][k]);
        }
        U[i][k] = matrix[i][k] - sum;
      }

      // Lower Triangular
      for (let k = i; k < n; k++) {
        if (i === k) {
          L[i][i] = 1; // Diagonal as 1
        } else {
          let sum = 0;
          for (let j = 0; j < i; j++) {
            sum += (L[k][j] * U[j][i]);
          }
          if (U[i][i] === 0) {
            // Matrix is singular, cannot be decomposed
            return null;
          }
          L[k][i] = (matrix[k][i] - sum) / U[i][i];
        }
      }
    }
    return { L, U };
  }

  // 2. ฟังก์ชัน Forward Substitution (แก้ Ly = B)
  forwardSubstitution = (L, B) => {
    const n = L.length;
    let y = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L[i][j] * y[j];
      }
      y[i] = B[i] - sum;
    }
    return y;
  }

  // 3. ฟังก์ชัน Backward Substitution (แก้ Ux = y)
  backwardSubstitution = (U, y) => {
    const n = U.length;
    let x = new Array(n).fill(0);

    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += U[i][j] * x[j];
      }
      if (U[i][i] === 0) {
        // No unique solution
        return null;
      }
      x[i] = (y[i] - sum) / U[i][i];
    }
    return x;
  }

  calculate = () => {
    try {
      const { matrixA, matrixB } = this.state;
      if (matrixA.some(row => row.some(val => val === "")) || matrixB.some(val => val === "")) {
        alert("กรุณากรอกค่าในเมทริกซ์ A และ B ให้ครบทุกช่อง");
        return;
      }

      const A = matrixA.map(row => row.map(val => parseFloat(val)));
      const B = matrixB.map(val => parseFloat(val));

      // Step 1: Decompose A into L and U
      const decomposition = this.luDecomposition(A);
      if (!decomposition) {
        alert("ไม่สามารถแยกตัวประกอบ LU ได้ เนื่องจากเมทริกซ์เป็น Singular (determinant = 0)");
        return;
      }
      const { L, U } = decomposition;

      // Step 2: Solve Ly = B for y
      const y = this.forwardSubstitution(L, B);

      // Step 3: Solve Ux = y for x
      const x = this.backwardSubstitution(U, y);
      
      if (!x) {
        alert("ระบบสมการไม่มีคำตอบเฉพาะ (No unique solution)");
        return;
      }

      this.setState({ result: x });

    } catch (error) {
      alert("เกิดข้อผิดพลาดในการคำนวณ กรุณาตรวจสอบค่าที่กรอก");
      console.error(error);
    }
  }

  render() {
    const { n, matrixA, matrixB, result } = this.state;
    return (
        <div className="min-h-screen bg-gray-to-br from-blue-50 via-indigo-50 to-gray-10 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-blue-800 mb-3">
                        LU Decomposition
                    </h1>
                </div>

                {/* Control Panel */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                        <label className="text-lg font-medium text-gray-700">Matrix Size (NxN):</label>
                        <input
                            type="number"
                            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 focus:border-blue-400 focus:outline-none p-3 w-24 text-center rounded-xl font-semibold text-lg transition-all"
                            min={2}
                            max={10}
                            value={n}
                            onChange={(e) => this.changesize(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={this.calculate}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        Calculate
                    </button>
                </div>

                {/* Matrix Input Section */}
                <div className=" flex flex-col lg:flex-row gap-6 items-center justify-center mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-8 p-6 rounded-2xl mx-auto">
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">[A]</h2>
                            <div className="flex flex-col gap-2">
                                {matrixA.map((row, i) => (
                                    <div key={i} className="flex gap-2">
                                        {row.map((value, j) => (
                                            <input
                                                key={j}
                                                type="text"
                                                placeholder={`a${i + 1}${j + 1}`}
                                                className="bg-gray-to-br from-blue-50 to-indigo-50 border-2 border-gray-200 p-4 w-16 h-16 text-center rounded-lg font-medium transition-all"
                                                value={value}
                                                onChange={(e) => this.changematrixA(i, j, e.target.value)}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">{"{X}"}</h2>
                            <div className="flex flex-col gap-2">
                                {Array.from({ length: n }, (_, i) => (
                                    <div key={i} className="bg-gray-to-br from-purple-100 to-pink-100 border-2 border-gray-200 p-4 w-16 h-16 text-center rounded-lg font-semibold text-gray-700 flex items-center justify-center">
                                        x{i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-4xl font-bold text-gray-400">=</div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-center mb-4 text-indigo-700">{"{B}"}</h2>
                            <div className="flex flex-col gap-2">
                                {matrixB.map((value, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        placeholder={`b${i + 1}`}
                                        className="bg-gray-to-br from-blue-50 to-purple-50 border-2 border-gray-200  p-4 w-16 h-16 text-center rounded-lg font-medium transition-all"
                                        value={value}
                                        onChange={(e) => this.changematrixB(i, e.target.value)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {result.length > 0 && (
                    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto border-t-4 border-blue-500">
                        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                            Solution
                        </h2>
                        <div className="space-y-3">
                            {result.map((r, i) => (
                                <div key={i} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl flex items-center justify-between border-l-4 border-blue-500">
                                    <span className="text-xl font-semibold text-blue-700">x{i + 1}</span>
                                    <span className="text-xl font-mono text-gray-800">{r.toFixed(6)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
  }
}

export default Ludecompos
