import React from "react";
import { det } from "mathjs";

class Cramer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 3,
      matrixA: Array(3).fill().map(() => Array(3).fill("")),
      matrixB: Array(3).fill(""),
      result: []
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
    const size = parseFloat(value) || 0;
    this.setState({
      n: size,
      matrixA: Array(size).fill().map(() => Array(size).fill("")),
      matrixB: Array(size).fill(""),
      result: []
    });
  }

  calculatecramer = () => {
    try {
      const { matrixA, matrixB, n } = this.state;

      if (matrixA.every(row => row.every(value => value === ""))) {
        alert("Matrix A ยังไม่ได้ใส่ค่า");
        return;
      }
      if (matrixB.every(value => value === "")) {
        alert("Matrix B ยังไม่ได้ใส่ค่า");
        return;
      }

      const A = matrixA.map(row => row.map(Number));
      const B = matrixB.map(Number);
      const detA = det(A);

      if (detA === 0) {
        alert("detA = 0 เปลี่ยนค่าใหม่");
        return;
      }

      const result = [];
      for (let i = 0; i < n; i++) {
        const Ai = A.map((row, r) =>
          row.map((value, c) => (c === i ? B[r] : value))
        );
        result.push(det(Ai) / detA);
      }
      this.setState({ result });
    } catch {
      alert("ใส่ค่าให้ครบ");
    }
  }

  render() {
    const { n, matrixA, matrixB, result } = this.state;

    return (
      <div className="min-h-screen bg-gray-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-blue-800 mb-3">
              Cramer's Rule
            </h1>
          </div>

          {/* Control Panel */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <label className="text-lg font-medium text-gray-700">Matrix Size (NxN):</label>
              <input
                type="number"
                className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 focus:border-blue-400 focus:outline-none p-3 w-24 text-center rounded-xl font-semibold text-lg transition-all"
                min={1}
                max={10}
                value={n}
                onChange={(e) => this.changesize(e.target.value)}
              />
            </div>
            <button
              onClick={this.calculatecramer}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Calculate
            </button>
          </div>

          {/* Matrix Input Section */}
          <div className=" flex flex-col lg:flex-row gap-6 items-center justify-center mb-8">
            {/* Matrix A */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-8 p-6  mx-auto"> 


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

              {/* Matrix X */}
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

              {/* Equal Sign */}
              <div className="text-4xl font-bold text-gray-400">=</div>

              {/* Matrix B */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4 text-indigo-700">{"{B}"}</h2>
                <div className="flex flex-col gap-2">
                  {matrixB.map((value, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`b${i + 1}`}
                      className="bg-gray-to-br from-indigo-50 to-purple-50 border-2 border-gray-200 p-4 w-16 h-16 text-center rounded-lg font-medium transition-all"
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
    );
  }
}

export default Cramer;




// // import React from 'react'

// // function Carmer() {
// //   return (
// //     <div>
// //       Cramer's Rule
// //     </div>
// //   )
// // }

// // export default Carmer
// // // import { RotateCcw } from 'lucide-react';
// import React, { useState } from 'react';


// function Carmer() {
//   const [n, setN] = useState(3);
//   const [epsilon, setEpsilon] = useState(0.000001);
//   const [matrixA, setMatrixA] = useState(Array(3).fill().map(() => Array(3).fill('')));
//   const [vectorB, setVectorB] = useState(Array(3).fill(''));
//   const [result, setResult] = useState(null);

//   const handleMatrixChange = (i, j, value) => {
//     const newMatrix = [...matrixA];
//     newMatrix[i][j] = value;
//     setMatrixA(newMatrix);
//   };

//   const handleVectorChange = (i, value) => {
//     const newVector = [...vectorB];
//     newVector[i] = value;
//     setVectorB(newVector);
//   };

//   const handleSizeChange = (newSize) => {
//     const size = parseInt(newSize) || 3;
//     setN(size);
//     setMatrixA(Array(size).fill().map(() => Array(size).fill('')));
//     setVectorB(Array(size).fill(''));
//     setResult(null);
//   };

//   const calculateDeterminant = (matrix) => {
//     const size = matrix.length;
//     if (size === 1) return matrix[0][0];
//     if (size === 2) {
//       return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
//     }
    
//     let det = 0;
//     for (let j = 0; j < size; j++) {
//       const minor = matrix.slice(1).map(row => 
//         row.filter((_, colIdx) => colIdx !== j)
//       );
//       det += Math.pow(-1, j) * matrix[0][j] * calculateDeterminant(minor);
//     }
//     return det;
//   };

//   const replaceColumn = (matrix, column, colIndex) => {
//     return matrix.map((row, i) => 
//       row.map((val, j) => j === colIndex ? column[i] : val)
//     );
//   };

//   const calculate = () => {
//     try {
//       const A = matrixA.map(row => row.map(val => parseFloat(val) || 0));
//       const B = vectorB.map(val => parseFloat(val) || 0);
//       const eps = parseFloat(epsilon);

//       const detA = calculateDeterminant(A);

//       if (Math.abs(detA) < eps) {
//         setResult({ error: 'Determinant is too close to zero. System may not have a unique solution.' });
//         return;
//       }

//       const solutions = [];
//       for (let i = 0; i < n; i++) {
//         const Ai = replaceColumn(A, B, i);
//         const detAi = calculateDeterminant(Ai);
//         solutions.push(detAi / detA);
//       }

//       setResult({ solutions, detA });
//     } catch (error) {
//       setResult({ error: 'Error calculating. Please check your inputs.' });
//     }
//   };

//   const reset = () => {
//     setMatrixA(Array(n).fill().map(() => Array(n).fill('')));
//     setVectorB(Array(n).fill(''));
//     setResult(null);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
//       <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
//         <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
//           🤩 Cramer's Rule
//         </h1>

//         <div className="mb-6">
//           <label className="block text-gray-700 font-semibold mb-2">
//             Matrix size (NxN)
//           </label>
//           <input
//             type="number"
//             min="2"
//             max="5"
//             value={n}
//             onChange={(e) => handleSizeChange(e.target.value)}
//             className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-gray-700 font-semibold mb-2">ε</label>
//           <input
//             type="number"
//             step="0.000001"
//             value={epsilon}
//             onChange={(e) => setEpsilon(e.target.value)}
//             className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//           />
//         </div>

//         <div className="flex gap-4 mb-6">
//           <button
//             onClick={reset}
//             className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
//           >
//             {/* <RotateCcw size={20} /> */}
//           </button>
//           <button
//             onClick={calculate}
//             className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold text-lg"
//           >
//             Calculate!
//           </button>
//         </div>

//         <div className="flex gap-8 items-center justify-center mb-8">
//           <div>
//             <div className="text-center mb-2 font-serif text-xl">[A]</div>
//             <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
//               {matrixA.map((row, i) =>
//                 row.map((val, j) => (
//                   <input
//                     key={`a${i}${j}`}
//                     type="text"
//                     value={val}
//                     onChange={(e) => handleMatrixChange(i, j, e.target.value)}
//                     placeholder={`a${i + 1}${j + 1}`}
//                     className="w-20 h-20 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//                   />
//                 ))
//               )}
//             </div>
//           </div>

//           <div>
//             <div className="text-center mb-2 font-serif text-xl">{'{x}'}</div>
//             <div className="grid gap-2">
//               {Array(n).fill().map((_, i) => (
//                 <div
//                   key={`x${i}`}
//                   className="w-20 h-20 flex items-center justify-center border-2 border-gray-300 rounded-lg bg-gray-50"
//                 >
//                   <span className="text-gray-600">x{i + 1}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="text-3xl font-bold text-gray-600">=</div>

//           <div>
//             <div className="text-center mb-2 font-serif text-xl">{'{B}'}</div>
//             <div className="grid gap-2">
//               {vectorB.map((val, i) => (
//                 <input
//                   key={`b${i}`}
//                   type="text"
//                   value={val}
//                   onChange={(e) => handleVectorChange(i, e.target.value)}
//                   placeholder={`b${i + 1}`}
//                   className="w-20 h-20 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {result && (
//           <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
//             {result.error ? (
//               <div className="text-red-600 font-semibold text-center">{result.error}</div>
//             ) : (
//               <div>
//                 <h2 className="text-2xl font-bold mb-4 text-gray-800">Solution:</h2>
//                 <div className="space-y-2">
//                   {result.solutions.map((sol, i) => (
//                     <div key={i} className="text-lg">
//                       <span className="font-semibold">x{i + 1} = </span>
//                       <span className="text-blue-600 font-mono">{sol.toFixed(6)}</span>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-4 pt-4 border-t border-gray-300">
//                   <span className="font-semibold">det(A) = </span>
//                   <span className="text-gray-700 font-mono">{result.detA.toFixed(6)}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// export default Carmer





// import React, { Component } from 'react';
// import { det } from 'mathjs';


// class Matrix {
//   constructor(data) {
//     this.data = data;
//     this.size = data.length;
//   }

//   static createEmpty(size) {
//     return new Matrix(Array(size).fill().map(() => Array(size).fill('')));
//   }

//   get(i, j) {
//     return this.data[i][j];
//   }

//   set(i, j, value) {
//     const newData = this.data.map(row => [...row]);
//     newData[i][j] = value;
//     return new Matrix(newData);
//   }

//   toNumeric() {
//     return new Matrix(this.data.map(row => row.map(val => parseFloat(val) || 0)));
//   }

//   replaceColumn(column, colIndex) {
//     const newData = this.data.map((row, i) => 
//       row.map((val, j) => j === colIndex ? column[i] : val)
//     );
//     return new Matrix(newData);
//   }

//   calculateDeterminant() {
//     if (this.size === 1) return this.data[0][0];
    
//     if (this.size === 2) {
//       return this.data[0][0] * this.data[1][1] - this.data[0][1] * this.data[1][0];
//     }
    
//     let det = 0;
//     for (let j = 0; j < this.size; j++) {
//       const minorData = this.data.slice(1).map(row => 
//         row.filter((_, colIdx) => colIdx !== j)
//       );
//       const minor = new Matrix(minorData);
//       det += Math.pow(-1, j) * this.data[0][j] * minor.calculateDeterminant();
//     }
//     return det;
//   }

//   getData() {
//     return this.data;
//   }
// }

// class Vector {
//   constructor(data) {
//     this.data = data;
//     this.size = data.length;
//   }

//   static createEmpty(size) {
//     return new Vector(Array(size).fill(''));
//   }

//   get(i) {
//     return this.data[i];
//   }

//   set(i, value) {
//     const newData = [...this.data];
//     newData[i] = value;
//     return new Vector(newData);
//   }

//   toNumeric() {
//     return this.data.map(val => parseFloat(val) || 0);
//   }

//   getData() {
//     return this.data;
//   }
// }

// class CramersRuleSolver {
//   constructor(matrixA, vectorB, epsilon) {
//     this.matrixA = matrixA;
//     this.vectorB = vectorB;
//     this.epsilon = epsilon;
//   }

//   solve() {
//     const A = this.matrixA.toNumeric();
//     const B = this.vectorB.toNumeric();
//     const detA = A.calculateDeterminant();

//     if (Math.abs(detA) < this.epsilon) {
//       throw new Error('Determinant is too close to zero. System may not have a unique solution.');
//     }

//     const solutions = [];
//     for (let i = 0; i < A.size; i++) {
//       const Ai = A.replaceColumn(B, i);
//       const detAi = Ai.calculateDeterminant();
//       solutions.push(detAi / detA);
//     }

//     return {
//       solutions,
//       detA
//     };
//   }
// }

// class Cramer extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       n: 3,
//       epsilon: 0.000001,
//       matrixA: Matrix.createEmpty(3),
//       vectorB: Vector.createEmpty(3),
//       result: null
//     };
//   }

//   handleMatrixChange = (i, j, value) => {
//     this.setState(prevState => ({
//       matrixA: prevState.matrixA.set(i, j, value)
//     }));
//   }

//   handleVectorChange = (i, value) => {
//     this.setState(prevState => ({
//       vectorB: prevState.vectorB.set(i, value)
//     }));
//   }

//   handleSizeChange = (newSize) => {
//     const size = parseInt(newSize) || 3;
//     this.setState({
//       n: size,
//       matrixA: Matrix.createEmpty(size),
//       vectorB: Vector.createEmpty(size),
//       result: null
//     });
//   }

//   calculate = () => {
//     try {
//       const solver = new CramersRuleSolver(
//         this.state.matrixA,
//         this.state.vectorB,
//         parseFloat(this.state.epsilon)
//       );
//       const result = solver.solve();
//       this.setState({ result });
//     } catch (error) {
//       this.setState({
//         result: { error: error.message }
//       });
//     }
//   }

//   reset = () => {
//     this.setState({
//       matrixA: Matrix.createEmpty(this.state.n),
//       vectorB: Vector.createEmpty(this.state.n),
//       result: null
//     });
//   }

//   renderMatrixInputs() {
//     const { matrixA, n } = this.state;
//     return (
//       <div>
//         <div className="text-center mb-2 font-serif text-xl">[A]</div>
//         <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
//           {matrixA.getData().map((row, i) =>
//             row.map((val, j) => (
//               <input
//                 key={`a${i}${j}`}
//                 type="text"
//                 value={val}
//                 onChange={(e) => this.handleMatrixChange(i, j, e.target.value)}
//                 placeholder={`a${i + 1}${j + 1}`}
//                 className="w-20 h-20 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//               />
//             ))
//           )}
//         </div>
//       </div>
//     );
//   }

//   renderVariableDisplay() {
//     const { n } = this.state;
//     return (
//       <div>
//         <div className="text-center mb-2 font-serif text-xl">{'{x}'}</div>
//         <div className="grid gap-2">
//           {Array(n).fill().map((_, i) => (
//             <div
//               key={`x${i}`}
//               className="w-20 h-20 flex items-center justify-center border-2 border-gray-300 rounded-lg bg-gray-50"
//             >
//               <span className="text-gray-600">x{i + 1}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   renderVectorInputs() {
//     const { vectorB } = this.state;
//     return (
//       <div>
//         <div className="text-center mb-2 font-serif text-xl">{'{B}'}</div>
//         <div className="grid gap-2">
//           {vectorB.getData().map((val, i) => (
//             <input
//               key={`b${i}`}
//               type="text"
//               value={val}
//               onChange={(e) => this.handleVectorChange(i, e.target.value)}
//               placeholder={`b${i + 1}`}
//               className="w-20 h-20 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   renderResult() {
//     const { result } = this.state;
//     if (!result) return null;

//     return (
//       <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
//         {result.error ? (
//           <div className="text-red-600 font-semibold text-center">{result.error}</div>
//         ) : (
//           <div>
//             <h2 className="text-2xl font-bold mb-4 text-gray-800">Solution:</h2>
//             <div className="space-y-2">
//               {result.solutions.map((sol, i) => (
//                 <div key={i} className="text-lg">
//                   <span className="font-semibold">x{i + 1} = </span>
//                   <span className="text-blue-600 font-mono">{sol.toFixed(6)}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 pt-4 border-t border-gray-300">
//               <span className="font-semibold">det(A) = </span>
//               <span className="text-gray-700 font-mono">{result.detA.toFixed(6)}</span>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   render() {
//     const { n, epsilon } = this.state;

//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
//         <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
//           <div className="text-center mb-12">
//             <h1 className="text-5xl font-bold bg-gradient-to-r text-blue-800 bg-clip-text mb-3">
//               Cramer's Rule
//             </h1>
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-700 font-semibold mb-2">
//               Matrix size (NxN)
//             </label>
//             <input
//               type="number"
//               min="2"
//               max="5"
//               value={n}
//               onChange={(e) => this.handleSizeChange(e.target.value)}
//               className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 font-semibold mb-2">ε</label>
//             <input
//               type="number"
//               step="0.000001"
//               value={epsilon}
//               onChange={(e) => this.setState({ epsilon: e.target.value })}
//               className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
//             />
//           </div>

//           <div className="flex gap-4 mb-6">
//             <button
//               onClick={this.reset}
//               className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
//             >
//               {/* <RotateCcw size={20} /> */}
//             </button>
//             <button
//               onClick={this.calculate}
//               className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold text-lg"
//             >
//               Calculate!
//             </button>
//           </div>

//           <div className="flex gap-8 items-center justify-center mb-8">
//             {this.renderMatrixInputs()}
//             {this.renderVariableDisplay()}
//             <div className="text-3xl font-bold text-gray-600">=</div>
//             {this.renderVectorInputs()}
//           </div>

//           {this.renderResult()}
//         </div>
//       </div>
//     );
//   }
// }

// export default Cramer;