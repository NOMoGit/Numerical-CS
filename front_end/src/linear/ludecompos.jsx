import React from 'react';
import Table from '../components/Table';
import Chart from '../components/Chart';
import axios from 'axios';
import { evaluate, abs } from 'mathjs';
// import { BlockMath } from 'react-katex';

class Ludecompos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      equation: "",
      x0: 0,
      tolerance: 0.000001,
      result: null,
      iteration: [],
      iterCnt: 0,
      equationDB: [],
      errMsg: ""
    };
  }

  componentDidMount() {
    axios.get("http://localhost:5000/root")
      .then((response) => {
        this.setState({ equationDB: response.data.results });
      })
      .catch(() => {
        console.log("Axios Error");
      });
  }

  // --- ฟังก์ชันหลัก: One-Point Iteration (ปรับตามเวอร์ชัน useState)
  onePointIteration = (xStart, errorFactor, func) => {
    const out = { result: 0, iter: 0, iterations: [], error: undefined };

    if (!func || func.trim().length === 0) {
      out.error = "Invalid function";
      return out;
    }

    try {
      evaluate(func, { x: xStart });
    } catch (e) {
      out.error = "Invalid function";
      return out;
    }

    const MAX_ITER = 100;
    let iter = 0;
    let x = xStart;
    let xold = x * 100; // ตามโค้ดเดิม
    let err = 0;

    while (iter < MAX_ITER) {
      iter += 1;
      if (iter === MAX_ITER) {
        out.error = "Max iteration reached";
        break;
      }

      const gx = evaluate(func, { x });
      out.iterations.push({ x, y: gx, err });

      x = gx;
      err = abs((x - xold) / xold);

      if (err < errorFactor) {
        out.result = x;
        out.iter = iter;
        break;
      }

      xold = x;
    }

    if (!out.result) {
      out.result = x;
      out.iter = iter;
    }
    return out;
  };

  calculate = () => {
    this.setState({ errMsg: "", result: null, iteration: [], iterCnt: 0 });

    const { equation, x0, tolerance } = this.state;
    const xStart = Number(x0);
    const tol = Number(tolerance);

    if (!Number.isFinite(xStart) || !Number.isFinite(tol)) {
      this.setState({ errMsg: "กรุณากรอกค่า X Initial และข้อผิดพลาดให้ถูกต้อง" });
      return;
    }
    if (!equation || typeof equation !== "string") {
      this.setState({ errMsg: "กรุณากรอกสมการ g(x)" });
      return;
    }

    const res = this.onePointIteration(xStart, tol, equation);
    if (res.error) this.setState({ errMsg: res.error });

    this.setState({
      result: res.result ?? null,
      iterCnt: res.iter ?? 0,
      iteration: res.iterations ?? []
    });
  };

  render() {
    const { equation, x0, tolerance, result, iteration, iterCnt, errMsg } = this.state;
    const fmt = (v, d = 6) => (Number.isFinite(Number(v)) ? Number(v).toFixed(d) : "—");

    return (
      <>
        <h1 className="text-2xl font-bold text-center mb-6 mt-2">
          One-point Iteration Methods
        </h1>

        <h2 className="text-2xl text-center">
          {/* <BlockMath math={`g(x) = ${equation || "\\;?"}`} /> */}
        </h2>

        <section>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="m-4 flex items-center justify-center flex-wrap gap-3">
              <label className="block text-gray-700 font-medium">สมการ g(x)</label>
              <input
                value={equation}
                onChange={(e) => this.setState({ equation: e.target.value })}
                placeholder="(7 + x)/4"
                type="text"
                className="border border-gray-400 p-2 rounded mr-2 w-64"
              />

              <label className="block text-gray-700 font-medium">X Initial</label>
              <input
                value={x0}
                onChange={(e) => this.setState({ x0: Number(e.target.value) })}
                placeholder="0"
                type="number"
                className="border border-gray-400 p-2 rounded mr-2 w-28"
              />

              <label className="block text-gray-700 font-medium">ข้อผิดพลาด (tol)</label>
              <input
                value={tolerance}
                onChange={(e) => this.setState({ tolerance: parseFloat(e.target.value) })}
                placeholder="0.000001"
                step="any"
                type="number"
                className="border border-gray-400 p-2 rounded mr-2 w-36"
              />

              <button
                className="text-bold bg-[#000080] text-white p-3 rounded-xl"
                type="button"
                onClick={this.calculate}
              >
                Calculate
              </button>
            </div>
          </form>
        </section>

        {errMsg && (
          <div className="max-w-3xl mx-auto mb-4 p-3 rounded border border-red-300 bg-red-50 text-red-700">
            {errMsg}
          </div>
        )}

        <h1 className="text-2xl text-center">
          result = {result !== null ? fmt(result, 8) : "-"}{" "}
          {iterCnt ? <span className="text-base">({iterCnt} iters)</span> : null}
        </h1>

        {iteration.length > 0 && (
          <div className="max-w-4xl mx-auto mt-6">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-2 py-1 text-left">iter</th>
                  <th className="border px-2 py-1 text-left">x (old)</th>
                  <th className="border px-2 py-1 text-left">g(x)</th>
                  <th className="border px-2 py-1 text-left">rel. error</th>
                </tr>
              </thead>
              <tbody>
                {iteration.map((r, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{i + 1}</td>
                    <td className="border px-2 py-1">{fmt(r.x)}</td>
                    <td className="border px-2 py-1">{fmt(r.y)}</td>
                    <td className="border px-2 py-1">{fmt(r.err, 8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }
}

export default Ludecompos
