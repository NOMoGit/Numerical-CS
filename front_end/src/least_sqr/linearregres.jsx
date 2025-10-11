// import React from 'react'
// import { MathJax,MathJaxContext } from "better-react-mathjax";
// import { row } from 'mathjs';

// class linearregres extends React.Component{
//     constructor(props){
//         super(props);
//         this.state = {
//             fx:[],
//             x: [],
//             arrayx: null,
//             xfind: "",
//             result: null,
//             Arrcal: null,
//             resultarrx: null,
//             A: 2
//         };
//     }
//     Gausselimination = (matcal,resultmat) =>{
//         const {n} = this.state;
//         const size = n ;
//         for(let i = 0 ; i < size ; i++){
//         let term = matcal[i][i];
//         for(let j = 0 ; j <= size ; j++){
//             matcal[i][j] /= term;
//         }
//         for(let k = i+1; k < size ; k++){
//             let forward = matcal[k][i];
//             for(let j = 0 ; j <= size ; j++){
//             matcal[k][j] -= forward*matcal[i][j];
//             }
//         }
//         }
//         for(let i = size-1; i>= 0; i--){
//         resultmat[i] = matcal[i][size];
//         for(let j = i+1 ; j < size ; j++){
//             resultmat[i] -= matcal[i][j]*resultmat[j];
//         }
//         }
//     }
//     calculate = () => {
//         try {
//             const {fx , x , xfind , arrayx , Arrcal} = this.state;
//             if(!x || !fx || !xfind){
//                 alert("กรุณากรอก Value, f(x) และ X value ให้ครบก่อนคำนวณ");
//                 return;
//             }
//             const N = x.length;
//             if(x.length !== fx.length){
//                 alert("กรอกค่า X และ f(X) ให้จำนวนเท่ากัน");
//                 return;
//             }
//             const arrx = Array.from(Array(N),(_i) => [x[i],fx[i]]);
//             this.setState({
//                 arrayx:arrx
//             });
//             const X = Array.from(Array(N),()=>Array(A));
//             const Y = Array(N);
//             for(let i = 0 ; i < N ; i++){
//                 X[i][0] = 1;
//                 X[i][1] = arrx[i][0];
//                 Y[i] = arrx[i][1];
//             }
//             let sumx = Array(A).fill(0);
//             let sumy = 0;
//             let sumxx = Array.from(Array(A),()=>Array(A).fill(0));
//             let sumxy = Array(A).fill(0);

//             for(let i = 0 ; i < N ; i++){
//                 sumy += Y[i];
//                 for(let j = 0 ; j < A ; j++){
//                     sumx[j] += X[i][j];
//                     sumxy[j] += X[i][j]*Y[i];
//                     for(let k = 0 ; k < A ; k++){
//                         sumxx[j][k] += X[i][j] * X[i][k];
//                     }
//                 }
//             }
//             let arrcal = Array.from(Array(A),()=>Array(A+1).fill(0));
//             for(let i = 0 ; i < A ; i++){
//                 for(let j = 0 ; j < A ; j++){
//                     if( i == 0 && j == 0){
//                         arrcal[i][j] = N ;
//                     }
//                     else if(i == 0 && j > 0){
//                         arrcal[i][j] = sumx[j];
//                     }else if(j >= i){
//                         arrcal[i][j] = sumxx[i][j];
//                     }
//                     else{
//                         arrcal[i][j] = arrcal[j][i];
//                     }
//                 }
//                 if(i == 0){
//                     arrcal[i][A] = sumy;
//                 }
//                 else{
//                     arrcal[i][A] = sumxy[i];
//                 }
//             }
//             this.state({Arrcal:arrcal});
//             let arrcal2 = arrcal.map(row => [...row]);
//             const resultmat = Array(A);
//             this.Gausselimination(arrcal2,resultmat);
//             this.state({resultarrx:resultmat});
//             const xcal = parseFloat(xfind);
//             const fxcal = resultmat[0] + resultmat[1]*xcal;
//             this.state({result:fxcal});
//         } catch (error) {
//             alert("กรอกค่าผิด");
//         }
//     }
//     render() {
//       return (
//         <div>
          
//         </div>
//       )
//     }
// }

// export default linearregres


import React from 'react';
import Plot from 'react-plotly.js';

class Linearregres extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 3,
      m: 1,
      xfind: "65",
      x: [],
      fx: [],
      result: null,
      resultarrx: null,
      plotData: []
    };
  }

  Gausselimination = (matcal, resultmat) => {
    const { m } = this.state;
    const size = m + 1;
    
    for (let i = 0; i < size; i++) {
      let term = matcal[i][i];
      for (let j = 0; j <= size; j++) {
        matcal[i][j] /= term;
      }
      for (let k = i + 1; k < size; k++) {
        let forward = matcal[k][i];
        for (let j = 0; j <= size; j++) {
          matcal[k][j] -= forward * matcal[i][j];
        }
      }
    }
    
    for (let i = size - 1; i >= 0; i--) {
      resultmat[i] = matcal[i][size];
      for (let j = i + 1; j < size; j++) {
        resultmat[i] -= matcal[i][j] * resultmat[j];
      }
    }
  }

  calculate = () => {
    try {
      const { fx, x, xfind , result , resultarrx } = this.state;
      const n = parseInt(this.state.n, 10);
      const m = parseInt(this.state.m, 10);
      if (!x || !fx || !xfind) {
        alert("กรุณากรอก Value, f(x) และ X value ให้ครบก่อนคำนวณ");
        return;
      }
      
      const N = n;
      const A = m + 1;
      
      if (x.length !== fx.length || x.length < N) {
        alert("กรอกค่า X และ f(X) ให้จำนวนเท่ากัน");
        return;
      }
      
      const X = Array.from(Array(N), () => Array(A));
      const Y = Array(N);
      
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < A; j++) {
          X[i][j] = Math.pow(x[i], j);
        }
        Y[i] = fx[i];
      }
      
      let sumx = Array(A).fill(0);
      let sumy = 0;
      let sumxx = Array.from(Array(A), () => Array(A).fill(0));
      let sumxy = Array(A).fill(0);
      
      for (let i = 0; i < N; i++) {
        sumy += Y[i];
        for (let j = 0; j < A; j++) {
          sumx[j] += X[i][j];
          sumxy[j] += X[i][j] * Y[i];
          for (let k = 0; k < A; k++) {
            sumxx[j][k] += X[i][j] * X[i][k];
          }
        }
      }
      
      let arrcal = Array.from(Array(A), () => Array(A + 1).fill(0));
      
      for (let i = 0; i < A; i++) {
        for (let j = 0; j < A; j++) {
          if (i === 0 && j === 0) {
            arrcal[i][j] = N;
          } else if (i === 0 && j > 0) {
            arrcal[i][j] = sumx[j];
          } else if (j >= i) {
            arrcal[i][j] = sumxx[i][j];
          } else {
            arrcal[i][j] = arrcal[j][i];
          }
        }
        if (i === 0) {
          arrcal[i][A] = sumy;
        } else {
          arrcal[i][A] = sumxy[i];
        }
      }
      
      let arrcal2 = arrcal.map(row => [...row]);
      const resultmat = Array(A);
      this.Gausselimination(arrcal2, resultmat);
      
      const xcal = parseFloat(xfind);
      let fxcal = 0;
      for (let i = 0; i < A; i++) {
        fxcal += resultmat[i] * Math.pow(xcal, i);
      }
      
      this.setState({ result: fxcal, resultarrx: resultmat }),() =>{
        this.generatePlotData();
      };
      
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการคำนวณ: " + error.message);
    }
  }
  generatePlotData = () => {
    const { x, fx, xfind, result, resultarrx } = this.state;
    if (!resultarrx || x.length === 0) return;

    const xNum = x.map(val => parseFloat(val));
    const fxNum = fx.map(val => parseFloat(val));

    // Trace 1: จุดข้อมูลดั้งเดิม (Scatter)
    const pointsTrace = {
      x: xNum,
      y: fxNum,
      mode: 'markers',
      type: 'scatter',
      name: 'Points',
      marker: { color: 'red', size: 8 }
    };

    // Trace 2: เส้น Regression Line
    const minX = Math.min(...xNum);
    const maxX = Math.max(...xNum);
    const lineX = [];
    const lineY = [];
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const currentX = minX + (maxX - minX) * (i / steps);
      let currentY = 0;
      for (let j = 0; j < resultarrx.length; j++) {
        currentY += resultarrx[j] * Math.pow(currentX, j);
      }
      lineX.push(currentX);
      lineY.push(currentY);
    }

    const lineTrace = {
      x: lineX,
      y: lineY,
      mode: 'lines',
      type: 'scatter',
      name: 'Regression Line',
      line: { color: 'orange', width: 3 }
    };

    // Trace 3: จุดผลลัพธ์
    const resultTrace = {
      x: [parseFloat(xfind)],
      y: [result],
      mode: 'markers',
      type: 'scatter',
      name: 'Result',
      marker: { color: 'blue', size: 12, symbol: 'star' }
    };

    this.setState({ plotData: [pointsTrace, lineTrace, resultTrace] });
  };
  handleNChange = (delta) => {
    this.setState(prevState => {
      const newN = Math.max(2, prevState.n + delta);
      const newX = [...prevState.x];
      const newFx = [...prevState.fx];
      
      if (delta > 0) {
        newX.push(0);
        newFx.push(0);
      } else if (newX.length > newN) {
        newX.pop();
        newFx.pop();
      }
      
      return { n: newN, x: newX, fx: newFx };
    });
  }

  handleMChange = (delta) => {
    this.setState(prevState => ({
      m: Math.max(1, prevState.m + delta)
    }));
  }

  handleXChange = (index, value) => {
    const newX = [...this.state.x];
    newX[index] = parseFloat(value) || 0;
    this.setState({ x: newX });
  }

  handleFxChange = (index, value) => {
    const newFx = [...this.state.fx];
    newFx[index] = parseFloat(value) || 0;
    this.setState({ fx: newFx });
  }

  render() {
    const { n, m, xfind, x, fx, result, resultarrx , plotData} = this.state;
    
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-to-r text-blue-800 bg-clip-text mb-3 text-center mt-12 mb-20">
                            Simple Linear Regression
                        </h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between  mb-6  ">
              <div >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of points 
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={n}
                    onChange={(e) => this.setState({ n: parseInt(e.target.value, 10) || 0 })}
                    className="w-20 px-3 py-2 border border-gray-300 rounded text-center"
                  />
                </div>
              </div>
              
              <div >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  m order
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={m}
                    onChange={(e) => this.setState({ m: parseInt(e.target.value, 10) || 0 })}
                    className="w-20 px-3 py-2 border border-gray-300 rounded text-center"
                  />
                </div>
              </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        X value
                    </label>
                    <div className="flex gap-2">
                        <input
                        type="number"
                        value={xfind}
                        onChange={(e) => this.setState({ xfind: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        placeholder="Enter X value"
                        />
                        <button
                        onClick={this.calculate}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                        >
                        Calculate!
                        </button>
                    </div>
                </div>
            </div>


          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            

            <div className=" rounded-lg p-4">
              <div className="grid grid-cols-3 gap-4 mb-2 font-medium">
                <div className="text-center">#</div>
                <div className="text-center">X</div>
                <div className="text-center">f(X)</div>
              </div>
              
              {Array.from({ length: n }, (_, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 mb-2 items-center">
                  <div className="text-center font-medium">{i + 1}.</div>
                  <input
                    type="number"
                    value={x[i] || ''}
                    onChange={(e) => this.handleXChange(i, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded text-center"
                  />
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
                <h3 className="font-semibold mb-2">Coefficients:</h3>
                {resultarrx && resultarrx.map((coef, i) => (
                  <div key={i} className="text-gray-700">
                    a{i} = {coef.toFixed(6)}
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-blue-50 rounded border border-blue-200">
                <div className="text-lg">
                  <span className="font-semibold">f({xfind}) = </span>
                  <span className="text-blue-600 font-bold text-xl">
                    {result.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>
          )}
          {plotData.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <Plot
                  data={this.state.plotData} // <== ส่งข้อมูลจาก state เข้าไป
                  layout={{
                    title: 'Graph',
                    xaxis: { title: 'X value' },
                    yaxis: { title: 'f(X) value' },
                    autosize: true,
                  }}
                  useResizeHandler={true}
                  style={{ width: '100%', height: '100%' }}
                  config={{ responsive: true }}
                />
              </div>
          )}
        </div>
      </div>
    );
  }
}

export default Linearregres;