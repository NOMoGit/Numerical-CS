import React,{ useState }from 'react'
// import { FaBars } from 'react-icons/fa'
import { Link } from 'react-router-dom';

function Navbar() {
    const [toggle,settoggle] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const updateToggle = () =>{
        settoggle(!toggle);
    }
    const handleDropdown = (menuName) => {
    if (openDropdown === menuName) {
      setOpenDropdown(null); // close if already open
    } else {
      setOpenDropdown(menuName); // open clicked menu
    }
  }
  return (
    <nav className='bg-white shadow'>
      <div className="container mx-auto max-w-[1320px] relative h-auto p-10 flex flex-col md:flex-row md:justify-between md:h-[80px] md:items-center">
        <div>
            <Link to="/" className="text-3xl md:text-4xl font-bold text-blue-500">
                numerical
            </Link>
        </div>
        <ul className={`${!toggle ? 'hidden':'flex'} flex flex-col md:flex md:flex-row my-5`}>
            {/* Root of Equeation */}
            <li className="my-2 md:mx-5 relative group">
                <button 
                className="hover:text-blue-700 cursor-pointer flex justify-between w-full md:w-auto"
                onClick={() => handleDropdown("root")}
                >
                Root of Equation
                </button>
            
                <div className='absolute top-full left-0 right-0 h-10 bg-transparent group-hover:block hidden'></div>
                <ul className={`
                ${openDropdown === "root" ? "block" : "hidden"} 
                md:group-hover:block 
                bg-white shadow-lg rounded-lg mt-2 p-2 md:absolute
              `}>
                    <li>
                        <Link to="/Graphical"className="block px-4 py-2 hover:bg-gray-200">
                        Graphical Method
                        </Link>
                    </li>
                    <li >
                        <Link to="/Bisection"className="block px-4 py-2 hover:bg-gray-200">
                        Bisection
                        </Link>
                    </li>
                    <li>
                        <Link to='/False' className="block px-4 py-2 hover:bg-gray-200">
                        False Position
                        </Link>
                    </li>
                    <li>
                        <Link to="/Onepoint"className="block px-4 py-2 hover:bg-gray-200">
                        Onepoint Iteration
                        </Link>
                    </li>
                    {/* <li>
                        <Link to="/Taylor"className="block px-4 py-2 hover:bg-gray-200">
                        Taylor
                        </Link>
                    </li> */}
                    <li>
                        <Link to="/Newton"className="block px-4 py-2 hover:bg-gray-200">
                        Newton
                        </Link>
                    </li>
                    <li>
                        <Link to="/Secant"className="block px-4 py-2 hover:bg-gray-200">
                        Secant Method
                        </Link>
                    </li>
                </ul>
            </li>
            <li className="my-2 md:mx-5 relative group">
                <button 
                className="hover:text-blue-700 cursor-pointer flex justify-between w-full md:w-auto"
                onClick={() => handleDropdown("linear")}
                >
                Linear Algebraic<br />Equations
                </button>
                <div className='absolute top-full left-0 right-0 h-10 bg-transparent group-hover:block hidden'></div>
                <ul className={`
                    ${openDropdown === "linear" ? "block" : "hidden"} 
                    md:group-hover:block 
                    bg-white shadow-lg rounded-lg mt-2 p-2 md:absolute`}>
                    <li>
                        <Link to="/Carmer"className="block px-4 py-2 hover:bg-gray-200">
                        Cramer's Rule
                        </Link>
                    </li>
                    <li>
                        <Link to="/Eliminate"className="block px-4 py-2 hover:bg-gray-200">
                        Gauss Elimination
                        </Link>
                    </li>
                    <li>
                        <Link to="/Jordan"className="block px-4 py-2 hover:bg-gray-200">
                        Gauss Jordan
                        </Link>
                    </li>
                    <li>
                        <Link to="/Matrixinvers"className="block px-4 py-2 hover:bg-gray-200">
                        Matrix Inversion
                        </Link>
                    </li>
                    <li>
                        <Link to="/Ludecompos"className="block px-4 py-2 hover:bg-gray-200">
                        LU Decomposition Method
                        </Link>
                    </li>
                    <li>
                        <Link to="/Cholesky"className="block px-4 py-2 hover:bg-gray-200">
                        Cholesky
                        </Link>
                    </li>
                </ul>
            </li>
            <li className="my-2 md:mx-5 relative group">
                <button 
                className="hover:text-blue-700 cursor-pointer flex justify-between w-full md:w-auto"
                onClick={() => handleDropdown("Interpo")}
                >
                Interpolation &<br />Extrapolation
                </button>
                <div className='absolute top-full left-0 right-0 h-10 bg-transparent group-hover:block hidden'></div>
                <ul className={`
                    ${openDropdown === "Interpo" ? "block" : "hidden"} 
                    md:group-hover:block 
                    bg-white shadow-lg rounded-lg mt-2 p-2 md:absolute`}>
                    <li>
                        <a href="#"className="block px-4 py-2 hover:bg-gray-200">
                        Newton Divide Difference
                        </a>
                    </li>
                    <li>
                        <a href="#"className="block px-4 py-2 hover:bg-gray-200">
                        Lagrange
                        </a>
                    </li>
                    <li >
                        <a  href="#"className="block px-4 py-2 hover:bg-gray-200">
                        Spline
                        </a>
                    </li>
                </ul>
            </li>
            <li className="my-2 md:mx-5 relative group">
                <button 
                className="hover:text-blue-700 cursor-pointer flex justify-between w-full md:w-auto"
                onClick={() => handleDropdown("Least")}
                >
                Least Squares<br />Regression
                </button>
                <div className='absolute top-full left-0 right-0 h-10 bg-transparent group-hover:block hidden'></div>
                <ul className={`
                    ${openDropdown === "Least" ? "block" : "hidden"} 
                    md:group-hover:block 
                    bg-white shadow-lg rounded-lg mt-2 p-2 md:absolute`}>
                    <li>
                        {/* <a href=""className="block px-4 py-2 hover:bg-gray-200">
                        Linear
                        </a> */}
                        <Link to="/Linearregres"className="block px-4 py-2 hover:bg-gray-200">
                        Simple Linear
                        </Link>
                    </li>
                    {/* <li>
                        <a href="#"className="block px-4 py-2 hover:bg-gray-200">
                        Multiple Linear linearregres
                        </a>
                    </li> */}
                    <li>
                        <Link to="/Multipleregres"className="block px-4 py-2 hover:bg-gray-200">
                        Multiple Linear
                        </Link>
                    </li>
                </ul>
            </li>
            <li className="my-2 md:mx-5 relative group">
                <button 
                className="hover:text-blue-700 cursor-pointer flex justify-between w-full md:w-auto"
                onClick={() => handleDropdown("Integra")}
                >
                Integration &<br />Differentiation
                </button>
                <div className='absolute top-full left-0 right-0 h-10 bg-transparent group-hover:block hidden'></div>
                <ul className={`
                    ${openDropdown === "Integra" ? "block" : "hidden"} 
                    md:group-hover:block 
                    bg-white shadow-lg rounded-lg mt-2 p-2 md:absolute`}>
                    <li>
                        <Link to="/Trapezoidal"className="block px-4 py-2 hover:bg-gray-200">
                        Trapezoidal Rule
                        </Link>
                    </li>
                    <li>
                        <Link to="/Comtrapezoidal"className="block px-4 py-2 hover:bg-gray-200">
                        Composite Trapezoidal Rule
                        </Link>
                    </li>
                    <li>
                        <Link to="/Simpson"className="block px-4 py-2 hover:bg-gray-200">
                        Simpson's Rule
                        </Link>
                    </li>
                    <li>
                        <Link to="/Comsimpson"className="block px-4 py-2 hover:bg-gray-200">
                        Composite Simpson's Rule
                        </Link>
                    </li>
                </ul>
            </li>
            <li className="my-2 md:mx-5 relative group">
                <button 
                className="hover:text-blue-700 cursor-pointer flex justify-between w-full md:w-auto"
                onClick={() => handleDropdown("Diff")}
                >
                Differentiation
                </button>
                <div className='absolute top-full left-0 right-0 h-10 bg-transparent group-hover:block hidden'></div>
                <ul className={`
                    ${openDropdown === "Diff" ? "block" : "hidden"} 
                    md:group-hover:block 
                    bg-white shadow-lg rounded-lg mt-2 p-2 md:absolute`}>
                    
                    <li>
                        {/* <a href="#"className="block px-4 py-2 hover:bg-gray-200">
                        Differentiation
                        </a> */}
                        <Link to="/Different"className="block px-4 py-2 hover:bg-gray-200">
                        Differentiation
                        </Link>
                    </li>
                </ul>
            </li>
        </ul>
        {/* Hamberger  */}
        <button onClick={updateToggle} className='md:hidden text-3xl absolute right-10'>☰</button>
      </div>
    </nav>
  )
}

export default Navbar

