// import React from 'react';

// class Lagrange extends React.Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             numPoints: 5,
//             points: [],
//             xValue: '42235',
//             result: null,
//         };
//     }
//     lagrangeInterpolate = (points, x) => {
//         console.log(points);
//         let result = 0;
//         for (let j = 0; j < points.length; j++) {
//             let term = points[j].y;
//             for (let i = 0; i < points.length; i++) {
//                 if (i !== j) {
//                     if (points[j].x - points[i].x === 0) {
//                         throw new Error(`ค่า x ซ้ำกัน: ${points[j].x} กรุณาใช้ค่า x ที่ไม่ซ้ำกัน`);
//                     }
//                     term = term * (x - points[i].x) / (points[j].x - points[i].x);
//                 }
//             }
//             result += term;
//         }
//         return result;
//     };

//     generatePoints = () => {
//         this.setState(prevState => {
//             const newPoints = [];
//             for (let i = 0; i < prevState.numPoints; i++) {
                
//                 if (prevState.points[i]) {
//                     newPoints.push(prevState.points[i]);
//                 } else {
//                     newPoints.push({ x: '', y: '', checked: true, id: Date.now() + i });
//                 }
//             }
//             return { points: newPoints };
//         });
//     }


//     componentDidMount() {

//         this.generatePoints();
//     }

//     componentDidUpdate(prevProps, prevState) {
//         if (prevState.numPoints !== this.state.numPoints) {
//             this.generatePoints();
//         }
//     }

//     handleNumPointsChange = (amount) => {
//         this.setState(prevState => {
//             const newValue = prevState.numPoints + amount;
//             if (newValue >= 2 && newValue <= 20) {
//                 return { numPoints: newValue };
//             }
//             return null; 
//         });
//     };
    
//     handleNumPointsInputChange = (e) => {
//         const value = parseInt(e.target.value) || 2;
//         this.setState({ numPoints: Math.max(2, Math.min(20, value)) });
//     }

//     handlePointChange = (index, field, value) => {
//         this.setState(prevState => {
//             const newPoints = [...prevState.points];
//             newPoints[index][field] = value;
//             return { points: newPoints };
//         });
//     };

//     handleTickAll = () => {
//         this.setState(prevState => {
//             const allChecked = prevState.points.every(p => p.checked);
//             const newPoints = prevState.points.map(p => ({ ...p, checked: !allChecked }));
//             return { points: newPoints };
//         });
//     };

//     handleCalculate = () => {
//         const {result , xValue , points , numPoints}  = this.state;

//         const x = parseFloat(xValue);
//         if (isNaN(x)) {
//             this.setState({ result: { message: 'กรุณาใส่ "X value" เป็นตัวเลขที่ถูกต้อง', type: 'error' } });
//             return;
//         }

//         const selectedPoints = points
//             .filter(p => p.checked)
//             .map(p => ({
//                 x: parseFloat(p.x),
//                 y: parseFloat(p.y),
//             }));

//         if (selectedPoints.length < 2) {
//             this.setState({ result: { message: 'กรุณาเลือกจุดข้อมูลอย่างน้อย 2 จุด', type: 'error' } });
//             return;
//         }

//         if (selectedPoints.some(p => isNaN(p.x) || isNaN(p.y))) {
//             this.setState({ result: { message: 'กรุณากรอกข้อมูล x และ f(x) ให้เป็นตัวเลขครบทุกจุดที่เลือก', type: 'error' } });
//             return;
//         }

//         try {
//             const finalResult = lagrangeInterpolate(selectedPoints, x);
//             this.setState({ result: { message: `f(${x}) ≈ ${finalResult.toFixed(6)}`, type: 'success' } });
//         } catch (error) {
//             this.setState({ result: { message: `เกิดข้อผิดพลาด: ${error.message}`, type: 'error' } });
//         }
//     };

//     render() {
//         const { numPoints, points, xValue, result } = this.state;
//         const isAllTicked = points.length > 0 && points.every(p => p.checked);

//         return (
//             <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//                 <div className="max-w-3xl mx-auto">
//                     <header className="text-center mb-12">
//                         <h1 className='text-4xl sm:text-5xl font-extrabold text-blue-800 mb-2'>
//                             Lagrange Interpolation 
//                         </h1>
//                     </header>

//                     <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mb-6">
//                             <div className="flex flex-col">
//                                 <label className="mb-2 font-semibold text-gray-700 text-left">
//                                     Number of points
//                                 </label>
//                                 <div className="flex">
                                    
//                                     <input
//                                         type="number"
//                                         className="w-full text-center border rounded-xl border-gray-300  transition p-3"
//                                         value={numPoints}
//                                         onChange={this.handleNumPointsInputChange}
//                                     />
                                    
//                                 </div>
//                             </div>

//                             <div className="flex flex-col">
//                                 <label className="mb-2 font-semibold text-gray-700 text-left">
//                                     X value
//                                 </label>
//                                 <input
//                                     type="text"
//                                     className="w-full p-3 border border-gray-300 rounded-lg transition"
//                                     placeholder="0.00"
//                                     value={xValue}
//                                     onChange={(e) => this.setState({ xValue: e.target.value })}
//                                 />
//                             </div>
//                         </div>

//                         <button
//                             className="w-full py-3 mb-8 text-lg font-bold text-white bg-blue-600 rounded-lg transition-colors "
//                             onClick={this.handleCalculate}
//                         >
//                             Calculate!
//                         </button>
                        
//                         <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
//                             {points.map((point, index) => (
//                                 <div
//                                     className="grid grid-cols-[auto_auto_1fr_1fr] gap-3 sm:gap-4 items-center mb-4 last:mb-0"
//                                     key={point.id}
//                                 >
//                                     <input
//                                         type="checkbox"
//                                         className="h-5 w-5 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
//                                         id={`check-${index}`}
//                                         checked={point.checked}
//                                         onChange={(e) => this.handlePointChange(index, 'checked', e.target.checked)}
//                                     />
//                                     <label htmlFor={`check-${index}`} className="font-medium text-gray-600 select-none">
//                                         {index + 1}.
//                                     </label>
//                                     <input
//                                         type="text"
//                                         className="w-full p-2 border border-gray-300 rounded-md transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         placeholder={`x${index}`}
//                                         value={point.x}
//                                         onChange={(e) => this.handlePointChange(index, 'x', e.target.value)}
//                                     />
//                                     <input
//                                         type="text"
//                                         className="w-full p-2 border border-gray-300 rounded-md transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                         placeholder={`f(x${index})`}
//                                         value={point.y}
//                                         onChange={(e) => this.handlePointChange(index, 'y', e.target.value)}
//                                     />
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="flex justify-between items-center mt-6">
//                             <button
//                                 className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
//                                 onClick={this.handleTickAll}
//                             >
//                                 {isAllTicked ? 'Untick all' : 'Tick all'}
//                             </button>
//                         </div>

//                         {result && (
//                             <div
//                                 className={`mt-6 p-4 border rounded-lg text-center font-semibold text-lg
//                                     ${result.type === 'success'
//                                         ? 'bg-green-100 border-green-400 text-green-800'
//                                         : 'bg-red-100 border-red-400 text-red-800'
//                                     }`
//                                 }
//                             >
//                                 {result.message}
//                             </div>
//                         )}
//                     </main>
//                 </div>
//             </div>
//         );
//     }
// }

// export default Lagrange;






// import React, { useState, useEffect } from 'react';


// const lagrangeInterpolate = (points, x) => {
//     let result = 0;
//     for (let j = 0; j < points.length; j++) {
//         let term = points[j].y;
//         for (let i = 0; i < points.length; i++) {
//             if (i !== j) {
//                 if (points[j].x - points[i].x === 0) {
//                     throw new Error(`ค่า x ซ้ำกัน: ${points[j].x} กรุณาใช้ค่า x ที่ไม่ซ้ำกัน`);
//                 }
//                 term = term * (x - points[i].x) / (points[j].x - points[i].x);
//             }
//         }
//         result += term;
//     }
//     return result;
// };


// const Lagrange = () => {
//     const [numPoints, setNumPoints] = useState(5);
//     const [points, setPoints] = useState([]);
//     const [xValue, setXValue] = useState('');
//     const [result, setResult] = useState(null);
//     useEffect(() => {
//         setPoints(currentPoints => {
//             const newPoints = [];
//             for (let i = 0; i < numPoints; i++) {
//                 if (currentPoints[i]) {
//                     newPoints.push(currentPoints[i]);
//                 } else {
//                     newPoints.push({ x: '', y: '', checked: true, id: i });
//                 }
//             }
//             return newPoints;
//         });
//     }, [numPoints]);

//     const handleNumPointsChange = (amount) => {
//         setNumPoints(prev => {
//             const newValue = prev + amount;
//             if (newValue >= 2 && newValue <= 20) {
//                 return newValue;
//             }
//             return prev;
//         });
//     };

//     const handlePointChange = (index, field, value) => {
//         const newPoints = [...points];
//         newPoints[index][field] = value;
//         setPoints(newPoints);
//     };

//     const handleTickAll = () => {
//         const allChecked = points.every(p => p.checked);
//         const newPoints = points.map(p => ({ ...p, checked: !allChecked }));
//         setPoints(newPoints);
//     };
    
//     const isAllTicked = points.every(p => p.checked);

//     const handleCalculate = () => {
//         setResult(null); // เคลียร์ผลลัพธ์เก่า

//         const xToFind = parseFloat(xValue);
//         if (isNaN(xToFind)) {
//             setResult({ message: 'กรุณาใส่ "X value" เป็นตัวเลขที่ถูกต้อง', type: 'error' });
//             return;
//         }

//         const selectedPoints = points
//             .filter(p => p.checked)
//             .map(p => ({
//                 x: parseFloat(p.x),
//                 y: parseFloat(p.y),
//             }));

//         if (selectedPoints.length < 2) {
//             setResult({ message: 'กรุณาเลือกจุดข้อมูลอย่างน้อย 2 จุด', type: 'error' });
//             return;
//         }

//         if (selectedPoints.some(p => isNaN(p.x) || isNaN(p.y))) {
//             setResult({ message: 'กรุณากรอกข้อมูล x และ f(x) ให้เป็นตัวเลขครบทุกจุดที่เลือก', type: 'error' });
//             return;
//         }

//         try {
//             const finalResult = lagrangeInterpolate(selectedPoints, xToFind);
//             setResult({ message: `f(${xToFind}) ≈ ${finalResult.toFixed(6)}`, type: 'success' });
//         } catch (error) {
//             setResult({ message: `เกิดข้อผิดพลาด: ${error.message}`, type: 'error' });
//         }
//     };
//     return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-3xl mx-auto">
//             <header className="text-center mb-12">
//                 <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-800 mb-2'>
//                     Lagrange Interpolation
//                 </h1>
//             </header>

//             <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mb-6">
//                     <div className="flex flex-col">
//                         <label className="mb-2 font-semibold text-gray-700 text-left">
//                             Number of points
//                         </label>
//                         <div className="flex flex-col">
//                             <input
//                                 type="number"
//                                 id="num-points"
//                                 className="w-full text-center border p-3 rounded-lg border-gray-300  transition"
//                                 value={numPoints}
//                                 onChange={(e) => setNumPoints(Math.max(2, Math.min(20, parseInt(e.target.value) || 2)))}
//                             />
//                         </div>
//                     </div>

//                     {/* X value Input */}
//                     <div className="flex flex-col">
//                         <label className="mb-2 font-semibold text-gray-700 text-left">
//                             X value
//                         </label>
//                         <input
//                             type="text"
//                             id="x-value"
//                             className="w-full p-3 border border-gray-300 rounded-lg transition"
//                             placeholder="0.00"
//                             value={xValue}
//                             onChange={(e) => setXValue(e.target.value)}
//                         />
//                     </div>
//                 </div>

//                 <button
//                     className="w-full py-3 mb-8 text-lg font-bold text-white bg-blue-600 rounded-lg  transition-colors "
//                     onClick={handleCalculate}
//                 >
//                     Calculate!
//                 </button>
//                 <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
//                     {points.map((point, index) => (
//                         <div
//                             className="grid grid-cols-[auto_auto_1fr_1fr] gap-3 sm:gap-4 items-center mb-4 last:mb-0"
//                             key={point.id}
//                         >
//                             <input
//                                 type="checkbox"
//                                 className="h-5 w-5 text-blue-600 border-gray-300 rounded  cursor-pointer"
//                                 id={`check-${index}`}
//                                 checked={point.checked}
//                                 onChange={(e) => handlePointChange(index, 'checked', e.target.checked)}
//                             />
//                             <label htmlFor={`check-${index}`} className="font-medium text-gray-600 select-none">
//                                 {index + 1}.
//                             </label>
//                             <input
//                                 type="text"
//                                 className="w-full p-2 border border-gray-300 rounded-md  transition"
//                                 placeholder={`x${index}`}
//                                 value={point.x}
//                                 onChange={(e) => handlePointChange(index, 'x', e.target.value)}
//                             />
//                             <input
//                                 type="text"
//                                 className="w-full p-2 border border-gray-300 rounded-md  transition"
//                                 placeholder={`f(x${index})`}
//                                 value={point.y}
//                                 onChange={(e) => handlePointChange(index, 'y', e.target.value)}
//                             />
//                         </div>
//                     ))}
//                 </div>

//                 {/* Section 3: Footer Controls and Result */}
//                 <div className="flex justify-between items-center mt-6">
//                     <button
//                         className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
//                         onClick={handleTickAll}
//                     >
//                         {isAllTicked ? 'Untick all' : 'Tick all'}
//                     </button>
//                 </div>

//                 {result && (
//                     <div
//                         className={`mt-6 p-4 border rounded-lg text-center font-semibold text-lg
//                             ${result.type === 'success'
//                                 ? 'bg-green-100 border-green-400 text-green-800'
//                                 : 'bg-red-100 border-red-400 text-red-800'
//                             }`
//                         }
//                     >
//                         {result.message}
//                     </div>
//                 )}
//             </main>
//         </div>
//     </div>
// );
// };

// export default Lagrange;






import React from 'react';

class Lagrange extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numPoints: 5,
            points: [],
            xValue: '42235',
            result: null,
        };
    }

    // *** IMPROVEMENT: ลบ console.log ออกเมื่อไม่ต้องการดีบักแล้ว ***
    lagrangeInterpolate = (points, x) => {
        let result = 0;
        for (let j = 0; j < points.length; j++) {
            let term = points[j].y;
            for (let i = 0; i < points.length; i++) {
                if (i !== j) {
                    if (points[j].x - points[i].x === 0) {
                        throw new Error(`ค่า x ซ้ำกัน: ${points[j].x} กรุณาใช้ค่า x ที่ไม่ซ้ำกัน`);
                    }
                    term = term * (x - points[i].x) / (points[j].x - points[i].x);
                }
            }
            result += term;
        }
        return result;
    };

    // *** IMPROVEMENT: ปรับปรุง Logic การสร้าง points ให้ชัดเจนขึ้น ***
    generatePoints = () => {
        this.setState(prevState => {
            const newPoints = Array.from({ length: prevState.numPoints }, (_, i) => {
                // หากมีข้อมูลเก่าอยู่ ให้ใช้ข้อมูลเก่า
                if (prevState.points[i]) {
                    return prevState.points[i];
                }
                // ถ้าไม่มี ให้สร้างใหม่พร้อม ID ที่ไม่ซ้ำกันแน่นอนมากขึ้น
                return { x: '', y: '', checked: true, id: `point-${Date.now()}-${i}` };
            });
            // การใช้ Array.from และ slice ทำให้จัดการทั้งการเพิ่มและลดจำนวนจุดได้ในที่เดียว
            return { points: newPoints };
        });
    }


    componentDidMount() {
        this.generatePoints();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.numPoints !== this.state.numPoints) {
            this.generatePoints();
        }
    }

    handleNumPointsChange = (amount) => {
        this.setState(prevState => {
            const newValue = prevState.numPoints + amount;
            if (newValue >= 2 && newValue <= 20) {
                return { numPoints: newValue };
            }
            return null;
        });
    };
    
    handleNumPointsInputChange = (e) => {
        const value = parseInt(e.target.value, 10) || 2;
        this.setState({ numPoints: Math.max(2, Math.min(20, value)) });
    }

    // *** FIX: แก้ไขการอัปเดต state เพื่อหลีกเลี่ยงการกลายพันธุ์ (Mutation) ***
    handlePointChange = (index, field, value) => {
        this.setState(prevState => {
            const newPoints = [...prevState.points];
            // สร้าง object ใหม่สำหรับ point ที่จะอัปเดต แทนการแก้ไข object เดิมโดยตรง
            newPoints[index] = { ...newPoints[index], [field]: value };
            return { points: newPoints };
        });
    };

    handleTickAll = () => {
        this.setState(prevState => {
            const allChecked = prevState.points.length > 0 && prevState.points.every(p => p.checked);
            const newPoints = prevState.points.map(p => ({ ...p, checked: !allChecked }));
            return { points: newPoints };
        });
    };

    handleCalculate = () => {
        // IMPROVEMENT: destructure เฉพาะ state ที่ใช้งาน
        const { xValue, points } = this.state;

        const x = parseFloat(xValue);
        if (isNaN(x)) {
            this.setState({ result: { message: 'กรุณาใส่ "X value" เป็นตัวเลขที่ถูกต้อง', type: 'error' } });
            return;
        }

        const selectedPoints = points
            .filter(p => p.checked)
            .map(p => ({
                x: parseFloat(p.x),
                y: parseFloat(p.y),
            }));

        if (selectedPoints.length < 2) {
            this.setState({ result: { message: 'กรุณาเลือกจุดข้อมูลอย่างน้อย 2 จุด', type: 'error' } });
            return;
        }

        if (selectedPoints.some(p => isNaN(p.x) || isNaN(p.y))) {
            this.setState({ result: { message: 'กรุณากรอกข้อมูล x และ f(x) ให้เป็นตัวเลขครบทุกจุดที่เลือก', type: 'error' } });
            return;
        }

        try {
            // *** FIX: ต้องเรียกใช้เมธอดผ่าน 'this' ***
            const finalResult = this.lagrangeInterpolate(selectedPoints, x);
            this.setState({ result: { message: `f(${x}) ≈ ${finalResult.toFixed(6)}`, type: 'success' } });
        } catch (error) {
            this.setState({ result: { message: `เกิดข้อผิดพลาด: ${error.message}`, type: 'error' } });
        }
    };

    // --- ส่วน render ถูกต้องอยู่แล้ว ไม่มีการแก้ไข ---
    render() {
        const { numPoints, points, xValue, result } = this.state;
        const isAllTicked = points.length > 0 && points.every(p => p.checked);

        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <header className="text-center mb-12">
                        <h1 className='text-4xl sm:text-5xl font-extrabold text-blue-800 mb-2'>
                            Lagrange Interpolation
                        </h1>
                    </header>

                    <main className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mb-6">
                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold text-gray-700 text-left">
                                    Number of points
                                </label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        className="w-full text-center border rounded-xl border-gray-300 transition p-3"
                                        value={numPoints}
                                        onChange={this.handleNumPointsInputChange}
                                        min="2"
                                        max="20"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="mb-2 font-semibold text-gray-700 text-left">
                                    X value to interpolate
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg transition"
                                    placeholder="Enter value for X"
                                    value={xValue}
                                    onChange={(e) => this.setState({ xValue: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            className="w-full py-3 mb-8 text-lg font-bold text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={this.handleCalculate}
                        >
                            Calculate!
                        </button>
                        
                        <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                            {points.map((point, index) => (
                                <div
                                    className="grid grid-cols-[auto_auto_1fr_1fr] gap-3 sm:gap-4 items-center mb-4 last:mb-0"
                                    key={point.id}
                                >
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 text-blue-600 border-gray-300 rounded cursor-pointer focus:ring-blue-500"
                                        id={`check-${index}`}
                                        checked={point.checked}
                                        onChange={(e) => this.handlePointChange(index, 'checked', e.target.checked)}
                                    />
                                    <label htmlFor={`check-${index}`} className="font-medium text-gray-600 select-none">
                                        {index + 1}.
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={`x${index}`}
                                        value={point.x}
                                        onChange={(e) => this.handlePointChange(index, 'x', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={`f(x${index})`}
                                        value={point.y}
                                        onChange={(e) => this.handlePointChange(index, 'y', e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button
                                className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                                onClick={this.handleTickAll}
                            >
                                {isAllTicked ? 'Unselect All' : 'Select All'}
                            </button>
                        </div>

                        {result && (
                            <div
                                className={`mt-6 p-4 border rounded-lg text-center font-semibold text-lg
                                    ${result.type === 'success'
                                        ? 'bg-green-100 border-green-400 text-green-800'
                                        : 'bg-red-100 border-red-400 text-red-800'
                                    }`
                                }
                            >
                                {result.message}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        );
    }
}

export default Lagrange;