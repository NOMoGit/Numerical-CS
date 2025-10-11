
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";import { Children } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import './index.css'
import Graphical from './root/graphical'
import Bisection from './root/bisection'
import False from "./root/false";
import Onepoint from "./root/onepoint";
import Taylor from "./root/taylor";
import Newton from "./root/newton";
import Secant from "./root/secant";
import Carmer from "./linear/carmer";
import Eliminate from "./linear/eliminate";
import Jordan from "./linear/jordan";
import Matrixinvers from "./linear/matrixinvers";
import Ludecompos from "./linear/ludecompos";
import Cholesky from "./linear/cholesky";
import Trapezoidal from "./integrat_different/trapezoidal";
import Simpson from "./integrat_different/simpson";
import Comtrapezoidal from "./integrat_different/comtrapezoidal";
import Comsimpson from "./integrat_different/comsimpson";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element = {
          <div >
            <h1 className='text-8xl text-center font-bold mt-40 text-blue-500'>Numerical Home</h1>
          </div>
        } />
        <Route path="/graphical" element={<Graphical />} />
        <Route path="/bisection" element={<Bisection />} />
        <Route path="/false" element={<False />} />
        <Route path="/onepoint" element={<Onepoint />} />
        {/* <Route path="/taylor" element={<Taylor />} /> */}
        <Route path="/newton" element={<Newton />} />
        <Route path="/secant" element={<Secant />} />
        <Route path="/carmer" element={<Carmer />}/>
        <Route path="/eliminate" element={<Eliminate />}/>
        <Route path="/jordan" element={<Jordan />}/>
        <Route path="/matrixinvers" element={<Matrixinvers/>}/>
        <Route path="/ludecompos" element={<Ludecompos/>}/>
        <Route path="/cholesky" element={<Cholesky/>}/>
        <Route path="/trapezoidal" element={<Trapezoidal/>}/>
        <Route path="/simpson" element={<Simpson/>}/>
        <Route path="/comtrapezoidal" element={<Comtrapezoidal/>}/>
        <Route path="/comsimpson" element={<Comsimpson/>}/>
      </Routes>
      
    </Router>
  )
}

export default App
