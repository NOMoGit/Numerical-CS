import React from 'react';

class Cholesky extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 3,
      matrixA: Array(3).fill().map(() => Array(3).fill("")),
      matrixB: Array(3).fill(""),
      result: [],
      // สามารถเพิ่ม L, Lt เพื่อแสดงผลได้ถ้าต้องการ
      // matrixL: [],
      // matrixLt: []
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

  // 1. ฟังก์ชันแยกตัวประกอบ Cholesky (A = L * L^T)
  choleskyDecomposition = (matrix) => {
    const n = matrix.length;
    let L = Array(n).fill(0).map(() => Array(n).fill(0));

    // ตรวจสอบว่าเป็นเมทริกซ์สมมาตรหรือไม่
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (matrix[i][j] !== matrix[j][i]) {
          console.error("Matrix is not symmetric");
          return null; // ไม่ใช่เมทริกซ์สมมาตร
        }
      }
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0;
        for (let k = 0; k < j; k++) {
          sum += L[i][k] * L[j][k];
        }

        if (i === j) { // คำนวณแนวทแยงมุม L[i][i]
          const valueUnderSqrt = matrix[i][i] - sum;
          if (valueUnderSqrt <= 0) {
            console.error("Matrix is not positive-definite");
            return null; // ไม่ใช่ positive-definite
          }
          L[i][i] = Math.sqrt(valueUnderSqrt);
        } else { // คำนวณส่วนที่เหลือ L[i][j]
          L[i][j] = (matrix[i][j] - sum) / L[j][j];
        }
      }
    }
    return L;
  }

  // ฟังก์ชันสำหรับ Transpose matrix
  transposeMatrix = (matrix) => {
    const n = matrix.length;
    let T = Array(n).fill(0).map(() => Array(n).fill(0));
    for(let i = 0; i < n; i++) {
      for(let j = 0; j < n; j++) {
        T[i][j] = matrix[j][i];
      }
    }
    return T;
  }

  // 2. ฟังก์ชัน Forward Substitution (แก้ Ly = B) - (ใช้ฟังก์ชันเดิมได้)
  forwardSubstitution = (L, B) => {
    const n = L.length;
    let y = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L[i][j] * y[j];
      }
      y[i] = (B[i] - sum) / L[i][i]; // Cholesky L[i][i] ไม่ใช่ 1 จึงต้องหาร
    }
    return y;
  }

  // 3. ฟังก์ชัน Backward Substitution (แก้ L^T x = y) - (ใช้ฟังก์ชันเดิมได้)
  backwardSubstitution = (Lt, y) => {
    const n = Lt.length;
    let x = new Array(n).fill(0);

    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += Lt[i][j] * x[j];
      }
      if (Lt[i][i] === 0) {
        return null; // ไม่มีคำตอบเฉพาะ
      }
      x[i] = (y[i] - sum) / Lt[i][i];
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

      // Step 1: Decompose A into L and L^T
      const L = this.choleskyDecomposition(A);
      if (!L) {
        alert("ไม่สามารถแยกตัวประกอบ Cholesky ได้ เนื่องจากเมทริกซ์ A ไม่ใช่เมทริกซ์สมมาตรและบวกแน่นอน (Symmetric and Positive-definite)");
        return;
      }
      const Lt = this.transposeMatrix(L);

      // Step 2: Solve Ly = B for y using forward substitution
      const y = this.forwardSubstitution(L, B);

      // Step 3: Solve L^T x = y for x using backward substitution
      const x = this.backwardSubstitution(Lt, y);
      
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
                        Cholesky Decomposition
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
                {/* ... ส่วนของ UI ที่เหลือเหมือนเดิม ไม่มีการเปลี่ยนแปลง ... */}
                {/* (The rest of the JSX for the UI remains unchanged) */}
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
                            <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">{"{B}"}</h2>
                            <div className="flex flex-col gap-2">
                                {matrixB.map((value, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        placeholder={`b${i + 1}`}
                                        className="bg-gray-to-br from-blue-50 to-purple-50 border-2 border-gray-200 p-4 w-16 h-16 text-center rounded-lg font-medium transition-all"
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
                        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text">
                            Solution
                        </h2>
                        <div className="space-y-3">
                            {result.map((r, i) => (
                                <div key={i} className="bg-gradient-to-r from-blue-50 to-blue-50 p-4 rounded-xl flex items-center justify-between border-l-4 border-blue-500">
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

export default Cholesky
