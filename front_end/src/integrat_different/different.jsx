import React from 'react'
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { derivative, evaluate } from 'mathjs';

class Different extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            equation:"",
            x: 2,
            h: 0.25,
            order: "1",
            error: "O(h)",
            direction: "Forward",
            result:null,
            resultreal:null,
            resulterror:null
        };
    }
    calculate = () =>{
        try {
            const {equation , x , h ,order , error , direction } = this.state;
            if(!equation || !x || !h){
                alert("กรอกสมการ ให้ครบ");
                return;
            }
            if(!order || !error || !direction){
                alert("เลือก order erroe direction ก่อน");
                return;
            }

            const variableMatch = equation.match(/[a-zA-Z]+/g);
            const variable = variableMatch ? variableMatch[variableMatch.length - 1] : "x" ;
            const X = parseFloat(x);
            const H = parseFloat(h);
            const fdiff = derivative(equation,variable).toString();
            const fdiff2 = derivative(fdiff,variable).toString();
            const fdiff3 = derivative(fdiff2,variable).toString();
            const fdiff4 = derivative(fdiff3,variable).toString();
            let fcal = 0 , fdiffcal = 0 , errcal = 0;
            if (order == "1") {
                fdiffcal = evaluate(fdiff, {[variable]: X});
                if (direction == "Forward") {
                    if (error == "O(h)") {
                        fcal = (evaluate(equation, {[variable]: X + H}) - evaluate(equation, {[variable]: X})) / H;
                    } else if (error == "O(h^2)") {
                        fcal = (-evaluate(equation, {[variable]: X + 2 * H}) + 4 * evaluate(equation, {[variable]: X + H}) - 3 * evaluate(equation, {[variable]: X})) / (2 * H);
                    }
                } else if (direction == "Backward") {
                    if (error == "O(h)") {
                        fcal = (evaluate(equation, {[variable]: X}) - evaluate(equation, {[variable]: X - H})) / H;
                    } else if (error == "O(h^2)") {
                        fcal = (3 * evaluate(equation, {[variable]: X}) - 4 * evaluate(equation, {[variable]: X - H}) + evaluate(equation, {[variable]: X - 2 * H})) / (2 * H);
                    }
                } else if (direction == "Central") {
                    if (error == "O(h^2)") {
                        fcal = (evaluate(equation, {[variable]: X + H}) - evaluate(equation, {[variable]: X - H})) / (2 * H);
                    } else if (error == "O(h^4)") {
                        fcal = (-evaluate(equation, {[variable]: X + 2 * H}) + 8 * evaluate(equation, {[variable]: X + H}) - 8 * evaluate(equation, {[variable]: X - H}) + evaluate(equation, {[variable]: X - 2 * H})) / (12 * H);
                    }
                }
            } else if (order == "2") {
                fdiffcal = evaluate(fdiff2, {[variable]: X});
                if (direction == "Forward") {
                    if (error == "O(h)") {
                        fcal = (evaluate(equation, {[variable]: X + 2 * H}) - 2 * evaluate(equation, {[variable]: X + H}) + evaluate(equation, {[variable]: X})) / (H * H);
                    } else if (error == "O(h^2)") {
                        fcal = (-evaluate(equation, {[variable]: X + 3 * H}) + 4 * evaluate(equation, {[variable]: X + 2 * H}) - 5 * evaluate(equation, {[variable]: X + H}) + 2 * evaluate(equation, {[variable]: X})) / (H * H);
                    }
                } else if (direction == "Backward") {
                    if (error == "O(h)") {
                        fcal = (evaluate(equation, {[variable]: X}) - 2 * evaluate(equation, {[variable]: X - H}) + evaluate(equation, {[variable]: X - 2 * H})) / (H * H);
                    } else if (error == "O(h^2)") {
                        fcal = (2 * evaluate(equation, {[variable]: X}) - 5 * evaluate(equation, {[variable]: X - H}) + 4 * evaluate(equation, {[variable]: X - 2 * H}) - evaluate(equation, {[variable]: X - 3 * H})) / (H * H);
                    }
                } else if (direction == "Central") {
                    if (error == "O(h^2)") {
                        fcal = (evaluate(equation, {[variable]: X + H}) - 2 * evaluate(equation, {[variable]: X}) + evaluate(equation, {[variable]: X - H})) / (H * H);
                    } else if (error == "O(h^4)") {
                        fcal = (-evaluate(equation, {[variable]: X + 2 * H}) + 16 * evaluate(equation, {[variable]: X + H}) - 30 * evaluate(equation, {[variable]: X}) + 16 * evaluate(equation, {[variable]: X - H}) - evaluate(equation, {[variable]: X - 2 * H})) / (12 * H * H);
                    }
                }
            } else if (order == "3") {
                fdiffcal = evaluate(fdiff3, {[variable]: X});
                if (direction == "Forward") {
                    if (error == "O(h)") {
                        fcal = (evaluate(equation, {[variable]: X + 3 * H}) - 3 * evaluate(equation, {[variable]: X + 2 * H}) + 3 * evaluate(equation, {[variable]: X + H}) - evaluate(equation, {[variable]: X})) / (H * H * H);
                    } else if (error == "O(h^2)") {
                        fcal = (-3 * evaluate(equation, {[variable]: X + 4 * H}) + 14 * evaluate(equation, {[variable]: X + 3 * H}) - 24 * evaluate(equation, {[variable]: X + 2 * H}) + 18 * evaluate(equation, {[variable]: X + H}) - 5 * evaluate(equation, {[variable]: X})) / (2 * H * H * H);
                    }
                } else if (direction == "Backward") {
                    if (error == "O(h)") {
                        fcal = (evaluate(equation, {[variable]: X}) - 3 * evaluate(equation, {[variable]: X - H}) + 3 * evaluate(equation, {[variable]: X - 2 * H}) - evaluate(equation, {[variable]: X - 3 * H})) / (H * H * H);
                    } else if (error == "O(h^2)") {
                        fcal = (5 * evaluate(equation, {[variable]: X}) - 18 * evaluate(equation, {[variable]: X - H}) + 24 * evaluate(equation, {[variable]: X - 2 * H}) - 14 * evaluate(equation, {[variable]: X - 3 * H}) + 3 * evaluate(equation, {[variable]: X - 4 * H})) / (2 * H * H * H);
                    }
                } else if (direction == "Central") {
                    if (error == "O(h^2)") {
                        fcal = (evaluate(equation, {[variable]: X + 2 * H}) - 2 * evaluate(equation, {[variable]: X + H}) + 2 * evaluate(equation, {[variable]: X - H}) - evaluate(equation, {[variable]: X - 2 * H})) / (2 * H * H * H);
                    } else if (error == "O(h^4)") {
                        fcal = (-evaluate(equation, {[variable]: X + 3 * H}) + 8 * evaluate(equation, {[variable]: X + 2 * H}) - 13 * evaluate(equation, {[variable]: X + H}) + 13 * evaluate(equation, {[variable]: X - H}) - 8 * evaluate(equation, {[variable]: X - 2 * H}) + evaluate(equation, {[variable]: X - 3 * H})) / (8 * H * H * H);
                    }
                }
            } else if (order == "4") {
                fdiffcal = evaluate(fdiff4, {[variable]: X});
                if (direction == "Forward") {
                    if (error == "O(h)") {
                        fcal = (evaluate(equation, {[variable]: X + 4 * H}) - 4 * evaluate(equation, {[variable]: X + 3 * H}) + 6 * evaluate(equation, {[variable]: X + 2 * H}) - 4 * evaluate(equation, {[variable]: X + H}) + evaluate(equation, {[variable]: X})) / (H * H * H * H);
                    } else if (error == "O(h^2)") {
                        fcal = (3 * evaluate(equation, {[variable]: X + 5 * H}) - 14 * evaluate(equation, {[variable]: X + 4 * H}) + 26 * evaluate(equation, {[variable]: X + 3 * H}) - 24 * evaluate(equation, {[variable]: X + 2 * H}) + 11 * evaluate(equation, {[variable]: X + H}) - 2 * evaluate(equation, {[variable]: X})) / (H * H * H * H);
                    }
                } else if (direction == "Backward") {
                    if (error == "O(h)") {
                        fcal = (evaluate(equation, {[variable]: X}) - 4 * evaluate(equation, {[variable]: X - H}) + 6 * evaluate(equation, {[variable]: X - 2 * H}) - 4 * evaluate(equation, {[variable]: X - 3 * H}) + evaluate(equation, {[variable]: X - 4 * H})) / (H * H * H * H);
                    } else if (error == "O(h^2)") {
                        fcal = (2 * evaluate(equation, {[variable]: X}) - 11 * evaluate(equation, {[variable]: X - H}) + 24 * evaluate(equation, {[variable]: X - 2 * H}) - 26 * evaluate(equation, {[variable]: X - 3 * H}) + 14 * evaluate(equation, {[variable]: X - 4 * H}) - 3 * evaluate(equation, {[variable]: X - 5 * H})) / (H * H * H * H);
                    }
                } else if (direction == "Central") {
                    if (error == "O(h^2)") {
                        fcal = (evaluate(equation, {[variable]: X + 2 * H}) - 4 * evaluate(equation, {[variable]: X + H}) + 6 * evaluate(equation, {[variable]: X}) - 4 * evaluate(equation, {[variable]: X - H}) + evaluate(equation, {[variable]: X - 2 * H})) / (H * H * H * H);
                    } else if (error == "O(h^4)") {
                        fcal = (-evaluate(equation, {[variable]: X + 3 * H}) + 12 * evaluate(equation, {[variable]: X + 2 * H}) - 39 * evaluate(equation, {[variable]: X + H}) + 56 * evaluate(equation, {[variable]: X}) - 39 * evaluate(equation, {[variable]: X - H}) + 12 * evaluate(equation, {[variable]: X - 2 * H}) - evaluate(equation, {[variable]: X - 3 * H})) / (6 * H * H * H * H);
                    }
                }
            }
            errcal = ((fdiffcal - fcal)/fdiffcal)*100;
            // const fprime = evaluate(fdiff,{[variable]:xx});
            // //FFDD
            // let fxh = evaluate(equation,{[variable]:xx});
            // let fxhh = evaluate(equation,{[variable]:xx+hc})
            // let fpx = (fxhh - fxh) / hc;
            // let err = ((fprime - fpx)/fprime)*100;
            this.setState({result:fcal,resultreal:fdiffcal,resulterror:errcal});
            // const fx = evaluate(equation,{[variable]})
        } catch (error) {
            
        }
    };
 
    render() {
        const {equation , x , h , result , resultreal ,order , error, direction ,resulterror } = this.state;
      return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-4xl mx-auto ">
                    
                    <div className="text-center mb-20 ">    
                        <h1 className="text-5xl font-bold text-blue-800 mb-3">
                            Numerical Differentation
                        </h1>
                    </div>
                <div className='mt-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
                    <div>
                        <label >Order</label>
                        <select 
                            value={order}
                            onChange={(e) => this.setState({order:e.target.value})}
                            className='w-full border-2 border-gray-200 rounded-xl p-3 transition-all outline-none'

                        >
                            <option value="">-</option>
                            <option value="1">Frist</option>
                            <option value="2">Second</option>
                            <option value="3">Third</option>
                            <option value="4">Fourth</option>
                        </select>
                    </div>
                    <div>
                        <label >Error</label>
                        <select
                            value={error}
                            onChange={(e) => this.setState({error:e.target.value})}
                            className='w-full border-2 border-gray-200 rounded-xl p-3 transition-all outline-none'
                        >
                            <option value="">-</option>
                            <option value="O(h)">O(h)</option>
                            <option value="O(h^2)">O(h^2)</option>
                            <option value="O(h^4)">O(h^4)</option>
                        </select>
                    </div>
                    <div>
                        <label >Direction</label>
                        <select
                            value={direction}
                            onChange={(e) => this.setState({direction:e.target.value})}
                            className='w-full border-2 border-gray-200 rounded-xl p-3 transition-all outline-none'
                        >
                            <option value="">-</option>
                            <option value="Forward">Forward</option>
                            <option value="Backward">Backward</option>
                            <option value="Central">Central</option>
                        </select>
                    </div><div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">    
                    <div >
                        <p>f(x)</p>
                        <input 
                            type="text" 
                            value={equation}
                            placeholder='F(x)'
                            className='w-full border-2 border-gray-200 rounded-xl p-3 transition-all outline-none'
                            onChange={(e) => this.setState({equation:e.target.value})}
                        />
                    </div>
                    <div>
                        <p>x</p>
                        <input 
                            type="number"
                            value={x}
                            placeholder='X'
                            onChange={(e) => this.setState({x:e.target.value})} 
                            className='w-full border-2 border-gray-200 rounded-xl p-3 transition-all outline-none'
                        />
                    </div>
                    <div>
                        <p>h</p>
                        <input 
                            type="number" 
                            value={h}
                            placeholder='H'
                            onChange={(e) => this.setState({h:e.target.value})}
                            className='w-full border-2 border-gray-200 rounded-xl p-3 transition-all outline-none'
                        />
                    </div> 
                    <button
                        
                        className="w-full border-2 mt-5 bg-blue-600 text-white border-gray-200 rounded-xl p-3 outline-none"
                        onClick={this.calculate}
                    >
                        <h1> calculate </h1>
                    </button>
                </div>
            </div>

                </div>
                {/* <MathJaxContext>
                    <div className="w-full max-w-4xl py-4 ">
                        <div  className="mt-5 p-4 pt-10 bg-white rounded-2xl shadow-inner text-center ">
                            <MathJax className="text-3xl">{"\\[f(x)="+(fx || "\\;...\\;")+"\\]"}</MathJax>
                        </div>
                    </div>
                </MathJaxContext> */}
            
                
               
            
            {result !== null && (
                <div className="mt-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <p className="text-3xl font-bold text-green-700">F(x)call = {result}</p>
                    <p className="text-3xl font-bold text-green-700">F(x)real = {resultreal}</p>
                    <p className="text-3xl font-bold text-green-700">Error = {resulterror}</p>
                </div>
            )}
          </div>

        </div>
        
      )
    }
}
export default Different
