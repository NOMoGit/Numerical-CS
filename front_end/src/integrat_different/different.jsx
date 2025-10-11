import React from 'react'
import { derivative, evaluate } from 'mathjs';

class Different extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            equation:"",
            x: 2,
            h: 0.25,
            order: "",
            error: "",
            direction: "",
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
            if(order == "1"){
                if(direction == "Forward"){
                    if(error == "O(h)"){
                        fdiffcal = evaluate(fdiff,{[variable]:X});
                        fcal = (evaluate(equation,{[variable]:X+H})-evaluate(equation,{[variable]:X}))/H;
                        errcal = ((fdiffcal - fcal)/fdiffcal)*100;
                    }else if(error == "O(h^2)"){
                        fdiffcal = evaluate(fdiff,{[variable]:X});
                        fcal = (-evaluate(equation,{[variable]:X+2*H}) + 4 * evaluate(equation,{[variable]:X+H}) - 3 * evaluate(equation,{[variable]:X}))/(2*H);
                    }
                }else if(direction == "Backward"){
                    if(error == "O(h)"){
                        fdiffcal = evaluate(fdiff,{[variable]:X});
                        fcal = (-evaluate(equation,{[variable]:X-H})+evaluate(equation,{[variable]:X}))/H;
                        errcal = ((fdiffcal - fcal)/fdiffcal)*100;
                    }else if(error == "O(h^2)"){
                        fdiffcal = evaluate(fdiff,{[variable]:X});
                        fcal = (evaluate(equation,{[variable]:X-2*H}) - 4 * evaluate(equation,{[variable]:X-H}) + 3 * evaluate(equation,{[variable]:X}))/(2*H);
                    }
                }else if(direction == "Cental"){
                    if(error == "O(h^2)"){
                        fdiffcal = evaluate(fdiff,{[variable]:X});
                        fcal = (-evaluate(equation,{[variable]:X-H})+evaluate(equation,{[variable]:X+H}))/(2*H);
                        errcal = ((fdiffcal - fcal)/fdiffcal)*100;
                    }else if(error == "O(h^4)"){
                        fdiffcal = evaluate(fdiff,{[variable]:X});
                        fcal = (-evaluate(equation,{[variable]:X+2*H}) + 8 * evaluate(equation,{[variable]:X+H}) - 8 * evaluate(equation,{[variable]:X-H}) + evaluate(equation,{[variable]:X-2*H}))/(12*H);
                        errcal = ((fdiffcal - fcal)/fdiffcal)*100;
                    }
                }
            }else if(order == "2"){
                if(direction == "Forward"){
                    if(error == "O(h)"){
                        fdiffcal = evaluate(fdiff,{[variable]:X});
                        fcal = (evaluate(equation,{[variable]:X+H})-evaluate(equation,{[variable]:X}))/H;
                        errcal = ((fdiffcal - fcal)/fdiffcal)*100;
                    }else if(error == "O(h^2)"){
                        fdiffcal = evaluate(fdiff,{[variable]:X});
                        fcal = (-evaluate(equation,{[variable]:X+2*H}) + 4 * evaluate(equation,{[variable]:X+H}) - 3 * evaluate(equation,{[variable]:X}))/(2*H);
                    }
                }else if(direction == "Backward"){
                    if(error == "O(h)"){
                        fdiffcal = evaluate(fdiff,{[variable]:X});
                        fcal = (-evaluate(equation,{[variable]:X-H})+evaluate(equation,{[variable]:X}))/H;
                        errcal = ((fdiffcal - fcal)/fdiffcal)*100;
                    }else if(error == "O(h^2)"){
                        fdiffcal = evaluate(fdiff,{[variable]:X});
                        fcal = (evaluate(equation,{[variable]:X-2*H}) - 4 * evaluate(equation,{[variable]:X-H}) + 3 * evaluate(equation,{[variable]:X}))/(2*H);
                    }
                }else if(direction == "Cental"){
                    if(error == "O(h^2)"){
                        fdiffcal = evaluate(fdiff,{[variable]:X});
                        fcal = (-evaluate(equation,{[variable]:X-H})+evaluate(equation,{[variable]:X+H}))/(2*H);
                        errcal = ((fdiffcal - fcal)/fdiffcal)*100;
                    }else if(error == "O(h^4)"){
                        fdiffcal = evaluate(fdiff,{[variable]:X});
                        fcal = (-evaluate(equation,{[variable]:X+2*H}) + 8 * evaluate(equation,{[variable]:X+H}) - 8 * evaluate(equation,{[variable]:X-H}) + evaluate(equation,{[variable]:X-2*H}))/(12*H);
                        errcal = ((fdiffcal - fcal)/fdiffcal)*100;
                    }
                }
            }else 
            // const fprime = evaluate(fdiff,{[variable]:xx});
            // //FFDD
            // let fxh = evaluate(equation,{[variable]:xx});
            // let fxhh = evaluate(equation,{[variable]:xx+hc})
            // let fpx = (fxhh - fxh) / hc;
            // let err = ((fprime - fpx)/fprime)*100;
            this.setState({result:fpx,resultreal:fprime,error:err});
            // const fx = evaluate(equation,{[variable]})
        } catch (error) {
            
        }
    };
 
    render() {
        const {equation , x , h , result , resultreal , error} = this.state;
      return (
        <div className='m-10'>
            <h1>
                Diff
            </h1>
          <div>
            <p>f(x)</p>
            <input 
                type="text" 
                value={equation}
                placeholder='F(x)'
                className='border'
                onChange={(e) => this.setState({equation:e.target.value})}
            
            />
            <p>x</p>
            <input 
                type="number"
                value={x}
                placeholder='X'
                onChange={(e) => this.setState({x:e.target.value})} 
                className='border'

            />
            <p>h</p>
            <input 
                type="number" 
                value={h}
                placeholder='H'
                onChange={(e) => this.setState({h:e.target.value})}
                className='border'
            />
            <button
                
                className="border"
                onClick={this.calculate}
                
                

            >
                <h1> calculate </h1>
            </button>
            {result !== null && (
                <div>
                    <p>Fcall = {result}</p>
                    <p>Freal = {resultreal}</p>
                    <p>Error = {error}</p>
                </div>
            )}
          </div>
        </div>
      )
    }
}
export default Different
