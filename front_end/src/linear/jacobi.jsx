import React from 'react'

class Jacobi extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      n: 4,
      matrixA:Array(4).fill().map(() => Array(4).fill("")),
      matrixB:Array(4).fill(""),
      matrixX:Array(4).fill(""),
      result:[],
      tolerance: 0.000001,
      error:null
    };
  }
  changematrixA = (i,j,value) => {
    const newA = [...this.state.matrixA];
    newA[i][j] =  value;
    this.setState({matrixA:newA});
  };
  changematrixB = (i,value) =>{
    const newB = [...this.state.matrixB];
    newB[i] = value;
    this.setState({matrixB:newB});
  }
  changematrixX = (i,value) =>{
    const newX = [...this.state.matrixX];
    newX[i] = value;
    this.setState({matrixX:newX});
  }
  changesize = (value) => {
    const size = parseFloat(value);
    this.setState({
      n:size,
      matrixA:Array(size).fill().map(() => Array(size).fill("")),
      matrixB:Array(size).fill(""),
      matrixX:Array(size).fill("")
    });
  }
  calculate = () =>{
    try {
      const {matrixA , matrixB , matrixX , n , result , tolerance} = this.state;
      let size = parseFloat(n);
      if(matrixA.every(row => row.every(value => value === ""))){
        alert("Matrix A ยังไม่ได้ใส่ค่า");
        return;
      }else if(matrixB.every(row => row === "")){
        alert("Matrix B ยังไม่ได้ใส่ค่า");
        return;
      }else if(matrixX.every(row => row == "")){
        alert("Matrix X ยังไม่ได้ใส่ค่า");
        return;
      }
      let tol = parseFloat(tolerance);
      let maxiter = 1000;
      let iter = 0;
      let iterationError = Infinity;
      let matA = Array.from(Array(size),()=>Array(size).fill(0));
      let matB = Array(size).fill(0);
      let matX = Array(size).fill(0);
      let matXOld = Array(size).fill(0);
      for(let i = 0 ; i < size ; i++){
        for(let j = 0 ; j < size ; j++){
          matA[i][j] = parseFloat(matrixA[i][j]);
        }
        matB[i] = parseFloat(matrixB[i]);
        matX[i] = parseFloat(matrixX[i]);
      }
      let resultmat = Array(size).fill(0);
      for(let i = 1 ; i < i <= maxiter ; i++){
        matXOld = [...matX];
        for(let j = 0 ; j < size ; j++){
          let sum = 0 ;
          for(let k = 0 ; k < size ; k++){
            if(j != k){
              sum += matA[j][k] * matXOld[k]
            }
            matX[j] = (matB[j] - sum) / matA[j][j];
          }
        }
        let maxErr = 0;
        for(let j = 0 ; j < size ; j++){
          let err = Math.abs(matX[j] - matXOld[j]);
          if(err > maxErr) maxErr = err;
        }
        iterationError = maxErr
        if(maxErr < tol)break;
      }
      this.setState({result:matX,error:iterationError.toFixed(8)});
    } catch (error) {
      alert("Error Calculate catch");
      return;
    }
  }
  render(){
    const {n , matrixA , matrixB ,matrixX ,result , tolerance , error} = this.state;
    return(
      <div className="min-h-screen bg-gray-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className='text-center mb-12'>
            <h1 className="text-5xl font-bold text-blue-800 mb-3">
              Jacobi Iteration Method
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <label className="text-lg font-medium text-gray-700">Matrix Size </label>
              <input 
                type="number"
                value={n} 
                className="bg-gray-to-br from-gray-50 to-indigo-50 border-2 border-gray-200  p-3 w-24 text-center rounded-xl font-semibold text-lg transition-all"
                min={2}
                max={10}
                onChange={(e) => this.changesize(e.target.value)}
              />
              <div className=''>
                <label lassName="text-lg font-medium text-gray-700"> tolerance </label>
                <input 
                  type="number" 
                  value={tolerance}
                  className='bg-gray-to-br from-gray-50 to-indigo-50 border-2 border-gray-200  p-3 w-30 text-center rounded-xl '
                  onChange={(e) => this.setState({tolerance:e.target.value})}
                />
              </div>
              <button 
                onClick={this.calculate}
                className='bg-gradient-to-r from-blue-500 to-blue-600  text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform '
                
              >
                Calculate
              </button>
            </div>
          </div>
          <div className="sm:flex-row items-center justify-center gap-10   pb-6  max-w-2xl mx-auto ">
            <div className="flex flex-col sm:flex-row items-center justify-center  max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center  text-gray-700">{"{X}  Start"}</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-2  pb-6  max-w-2xl mx-auto">
              {matrixX.map((value,i) => (
                <input 
                  key={i}
                  type="text" 
                  value={value}
                  placeholder={`x${i+1}`}
                  className='bg-gray-to-br from-blue-50 to-indigo-50 border-2 border-gray-200 p-4 w-16 h-16 text-center rounded-lg font-medium transition-all"'
                  onChange={(e)=>this.changematrixX(i,e.target.value)}
                />
              ))}
            </div>
          </div> 
          {/* Matrix */}
            <div className=" flex flex-col lg:flex-row gap-6 items-center justify-center mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-8  p-6  max-w-2xl mx-auto">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">[A]</h2>
                  <div className='flex flex-col gap-2'>
                    {matrixA.map((row,i) => (
                      <div 
                        key={i} 
                        className='flex gap-2'>
                          {row.map((value,j) => (
                            <input 
                              key={j}
                              type="text" 
                              placeholder={`a${i+1}${j+1}`}
                              className='bg-gray-to-br from-blue-50 to-indigo-50 border-2 border-gray-200 p-4 w-16 h-16 text-center rounded-lg font-medium transition-all"'
                              value={value}
                              onChange={(e) => this.changematrixA(i,j,e.target.value)}
                            />
                          ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">{"{X}"}</h2> 
                      <div className='flex flex-col gap-2'>
                                    {Array.from({length:n},(_,i) => (
                        <div key={i} className='bg-gray-to-br from-gray-100 to-gray-100 border-2 border-gray-200 p-4 w-16 h-16 text-center rounded-lg font-semibold text-gray-700 flex items-center justify-center'>
                                            x{i+1}
                      </div>
                      ))}
                  </div>   
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">{"{B}"}</h2>
                  <div className="flex flex-col gap-2">
                    {matrixB.map((value,i)=>(
                      <input 
                        key={i}
                        type="text"
                        placeholder={`b${i + 1}`}
                        className="bg-gray-to-br from-indigo-50 to-purple-50 border-2 border-gray-200 p-4 w-16 h-16 text-center rounded-lg font-medium transition-all"
                        value={value}
                        onChange={(e) => this.changematrixB(i,e.target.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
            {result.length > 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto ">
                <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-blue-to-r from-blue-600 to-blue-600 bg-clip-text">
                Solution
              </h2>
              <div className="space-y-3">
                {result.map((r,i) => (
                  <div key={i} className='bg-gray-to-r border from-gray-50 to-gray-50 p-4 rounded-xl flex items-center justify-between '>
                    <span className="text-xl font-semibold text-blue-700">x{i + 1}</span>
                    <span className="text-xl font-mono text-gray-800">{r.toFixed(6)}</span>
                  </div>
                ))}
                <h1 className="text-xl font-semibold text-blue-700">Error = {error}</h1>
              </div>
              </div>
            )}
            
        </div>
      </div>
    )
  }
}

export default Jacobi

