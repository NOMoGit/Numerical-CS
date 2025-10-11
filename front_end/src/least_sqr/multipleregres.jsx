import React from 'react';

class Multipleregres extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 7, 
      m: 3, 
      
      xfind: ['', ''], 
      
      x: [
        [1, 0 , 1], 
        [0, 1 , 3], 
        [2, 4 , 1], 
        [3, 2 , 2],
        [4, 1 , 5],
        [2, 3 , 3],
        [1, 6 , 4]
      ], 
      
      fx: [1, -5, -6, 0 , -1 , -7 , -20], 
      result: null,
      resultarrx: null 
    };
  }

  Gausselimination = (matcal, resultmat) => {
    const size = this.state.m + 1;
    for (let i = 0; i < size; i++) {

        let maxRow = i;
        for (let k = i + 1; k < size; k++) {
            if (Math.abs(matcal[k][i]) > Math.abs(matcal[maxRow][i])) {
                maxRow = k;
            }
        }
        [matcal[i], matcal[maxRow]] = [matcal[maxRow], matcal[i]];

        let term = matcal[i][i];
        if (term === 0) continue; 

        for (let j = i; j <= size; j++) {
            matcal[i][j] /= term;
        }
        for (let k = 0; k < size; k++) {
            if (k !== i) {
                let forward = matcal[k][i];
                for (let j = i; j <= size; j++) {
                    matcal[k][j] -= forward * matcal[i][j];
                }
            }
        }
    }
    for (let i = 0; i < size; i++) {
        resultmat[i] = matcal[i][size];
    }
  }

  calculate = () => {
    try {
      const { fx, x } = this.state;
      const n = parseInt(this.state.n, 10);
      const m = parseInt(this.state.m, 10);
      const xfind = this.state.xfind.map(val => parseFloat(val));
      
      if (x.some(row => row.length !== m) || x.length !== n || fx.length !== n) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้องตามจำนวนจุดและตัวแปร");
        return;
      }
      
      const N = n;      
      const A = m + 1;  
      
     
      const X_design = Array.from(Array(N), () => Array(A));
      const Y = fx;
      
      for (let i = 0; i < N; i++) {
        X_design[i][0] = 1; 
        for (let j = 1; j < A; j++) {

          X_design[i][j] = x[i][j - 1];
        }
      }
      

      let sumx = Array(A).fill(0);
      let sumy = 0;
      let sumxx = Array.from(Array(A), () => Array(A).fill(0));
      let sumxy = Array(A).fill(0);
      
      for (let i = 0; i < N; i++) {
        sumy += Y[i];
        for (let j = 0; j < A; j++) {
          sumx[j] += X_design[i][j];
          sumxy[j] += X_design[i][j] * Y[i];
          for (let k = 0; k < A; k++) {
            sumxx[j][k] += X_design[i][j] * X_design[i][k];
          }
        }
      }
      
      let arrcal = Array.from(Array(A), () => Array(A + 1).fill(0));
      for (let i = 0; i < A; i++) {
        for (let j = 0; j < A; j++) {
            arrcal[i][j] = sumxx[i][j];
        }
        arrcal[i][A] = sumxy[i];
      }
      
      let arrcal2 = arrcal.map(row => [...row]);
      const resultmat = Array(A);
      this.Gausselimination(arrcal2, resultmat);

      let fxcal = resultmat[0]; 
      for (let i = 1; i < A; i++) {
        fxcal += resultmat[i] * xfind[i - 1];
      }
      
      this.setState({ result: fxcal, resultarrx: resultmat });
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการคำนวณ: " + error.message);
    }
  }


  handleNChange = (newN) => {
    this.setState(prevState => {
      const { n, m, x, fx } = prevState;
      const validN = Math.max(2, newN);
      const diff = validN - n;

      let newX = [...x];
      let newFx = [...fx];

      if (diff > 0) { 
        for (let i = 0; i < diff; i++) {
          newX.push(Array(m).fill(''));
          newFx.push('');
        }
      } else { 
        newX = newX.slice(0, validN);
        newFx = newFx.slice(0, validN);
      }
      return { n: validN, x: newX, fx: newFx };
    });
  }

  handleMChange = (newM) => {
    this.setState(prevState => {
      const { m, x, xfind } = prevState;
      const validM = Math.max(1, newM);
      const diff = validM - m;

      const newX = x.map(row => {
        let newRow = [...row];
        if (diff > 0) {
          for (let i = 0; i < diff; i++) newRow.push('');
        } else {
          newRow = newRow.slice(0, validM);
        }
        return newRow;
      });

      let newXfind = [...xfind];
      if (diff > 0) {
        for (let i = 0; i < diff; i++) newXfind.push('');
      } else {
        newXfind = newXfind.slice(0, validM);
      }
      
      return { m: validM, x: newX, xfind: newXfind };
    });
  }

  handleXChange = (rowIndex, colIndex, value) => {
    const newX = this.state.x.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        return row.map((cell, cIdx) => (cIdx === colIndex ? value : cell));
      }
      return row;
    });
    this.setState({ x: newX });
  }

  handleFxChange = (index, value) => {
    const newFx = [...this.state.fx];
    newFx[index] = value;
    this.setState({ fx: newFx });
  }
  
  handleXFindChange = (index, value) => {
    const newXfind = [...this.state.xfind];
    newXfind[index] = value;
    this.setState({ xfind: newXfind });
  }

  render() {
    const { n, m, xfind, x, fx, result, resultarrx } = this.state;
    
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-to-r text-blue-800 bg-clip-text mt-12 mb-20 text-center">
            Multiple Linear Regression
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of points (n)
                </label>
                <input
                  type="number"
                  value={n}
                  onChange={(e) => this.handleNChange(parseInt(e.target.value, 10) || 2)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of variables (m)
                </label>
                <input
                  type="number"
                  value={m}
                  onChange={(e) => this.handleMChange(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Values to predict
                </label>
                <div className="flex gap-2 items-center">
                {Array.from({ length: m }, (_, i) => (
                    <input
                        key={i}
                        type="number"
                        placeholder={`x${i + 1}`}
                        value={xfind[i] || ''}
                        onChange={(e) => this.handleXFindChange(i, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    />
                ))}
                <button
                    onClick={this.calculate}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                >
                    Calculate!
                </button>
                </div>
            </div>

            
          </div>
          <div>
            <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
              <div style={{display: 'grid', gridTemplateColumns: `auto repeat(${m}, 1fr) 1fr`, gap: '1rem'}} className="mb-2 font-medium">
                <div className="text-center">#</div>
                {Array.from({ length: m }, (_, i) => (
                  <div key={i} className="text-center">X<sub>{i + 1}</sub></div>
                ))}
                <div className="text-center">f(X) or Y</div>
              </div>
              
              {Array.from({ length: n }, (_, i) => (
                <div key={i} style={{display: 'grid', gridTemplateColumns: `auto repeat(${m}, 1fr) 1fr`, gap: '1rem'}} className="mb-2 items-center">
                  <div className="text-center font-medium">{i + 1}.</div>
                  {Array.from({ length: m }, (_, j) => (
                     <input
                        key={j}
                        type="number"
                        value={(x[i] && x[i][j]) || ''}
                        onChange={(e) => this.handleXChange(i, j, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded text-center"
                      />
                  ))}
                  <input
                    type="number"
                    value={fx[i] || ''}
                    onChange={(e) => this.handleFxChange(i, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded text-center"
                  />
                </div>
              ))}
            </div>
          </div>


          
          {result !== null && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Results</h2>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Coefficients (a):</h3>
                {resultarrx && resultarrx.map((coef, i) => (
                  <div key={i} className="text-gray-700">
                    a<sub>{i}</sub> = {coef.toFixed(6)}
                  </div>
                ))}
              </div>
              <div className="p-4 bg-blue-50 rounded border border-blue-200">
                <div className="text-lg">
                  <span className="font-semibold">Predicted f({xfind.join(', ')}) = </span>
                  <span className="text-blue-600 font-bold text-xl">
                    {result.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Multipleregres
