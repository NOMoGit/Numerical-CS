import React from 'react'

class Matrixinvers extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      n:3,
      matrixA: Array(3).fill().map(() => Array(3).fill("")),
      matrixB: Array(3).fill(""),
      result: []
    };
  }
  changematrixA = (i,j,value) =>{
    const newA = [...this.state.matrixA];
    newA[i][j] = value;
    this.setState({matrixA:newA});
  }
  changematrixB = (i,value) => {
    const newB = [...this.state.matrixB];
    newB[i] = value;
    this.setState({matrixB:newB});
  }
  changesize = (value) =>{
    const size = parseFloat(value);
    this.setState({
      n: size,
      matrixA: Array(size).fill().map(() => Array(size).fill("")),
      matrixB: Array(size).fill(""),
      result: []
    });
  }
  matrixinvers = (matcal) =>{
    const {n} = this.state;
    const size = n;
    let trix = matcal.map((row, rowIndex) => [ 
        ...row.map(value => parseFloat(value)),
        ...Array.from({ length: size }, (_, colIndex) => (rowIndex === colIndex ? 1 : 0))
    ]);
    for(let i = 0 ; i < size ; i++){
      let term = trix[i][i];
      if(term === 0){
        for(let k = i+1 ; k < size ; k++){
          if(trix[k][i] != 0){
            [trix[i],trix[k]] = [trix[k],trix[i]];
            term = trix[i][i];
            break;
          }
        }
      }
      for(let j = 0 ; j < 2*size ; j++){
        trix[i][j] /= term;
      }
      for(let k = 0 ; k < size ; k++){
        if(k != i){
          let forward = trix[k][i];
          for(let j = i ; j < 2 * size ; j++){
            trix[k][j] -= forward * trix[i][j];
          }
        }
      }
    }
    const inverse = trix.map(row => row.slice(size,2*size));
    return inverse;   
  }
  calculate = () =>{
    try {
      const {matrixA , matrixB , n , result } = this.state;
      if(matrixA.every(row => row.every(value => value === ""))){
        alert("Matrix A ยังไม่ได้ใส่ค่า");
        return;
      }
      if(matrixB.every(value => value === "")){
        alert("Matrix B ยังไม่ได้ใส่ค่า");
        return;
      }
      const size = n;
      const A = matrixA.map(row => row.map(value => parseFloat(value)));
      const B = matrixB.map(value => parseFloat(value));
      const matrixAcal = this.matrixinvers(A);

      let resultmat = matrixAcal.map(row => row.reduce((sum,value,j) => sum+value*B[j],0))
      this.setState({result:resultmat});
    } catch (error) {
        alert("ใส่ค่าให้ครบ");
    }
  }
  render(){
  const { n, matrixA, matrixB, result } = this.state;
    return(
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-blue-800 mb-3">
              Matrix Inversion
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
              onClick={this.calculate}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Calculate
            </button>
          </div>

          {/* Matrix Input Section */}
          <div className=" flex flex-col lg:flex-row gap-6 items-center justify-center mb-8">
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-8  p-6 rounded-2xl  mx-auto"> 


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
                          className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 p-4 w-16 h-16 text-center rounded-lg font-medium transition-all"
                          value={value}
                          onChange={(e) => this.changematrixA(i, j, e.target.value)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-4 text-purple-700">{"{X}"}</h2>
                <div className="flex flex-col gap-2">
                  {Array.from({ length: n }, (_, i) => (
                    <div key={i} className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200 p-4 w-16 h-16 text-center rounded-lg font-semibold text-purple-700 flex items-center justify-center">
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
                      className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 p-4 w-16 h-16 text-center rounded-lg font-medium transition-all"
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
// function Matrixinvers() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
//           <div className="text-center mb-12"> 
//             <h1 className="text-5xl font-bold bg-gradient-to-r text-blue-800 bg-clip-text mb-3">
//               Matrix Inversion
//             </h1>
//           </div>
//       </div>
//   )
// }

export default Matrixinvers
