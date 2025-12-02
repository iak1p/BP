import { useState, useEffect } from "react";
import "./App.css";
import CanvasSettings from "./components/CanvasSettings";
import KochSettings from "./components/KochSettings";
import AnkletSettings from "./components/AnkletSettings";
import { PatternDTO } from "../../src/generators/generator.base";
import Koch from "../../src/generators/Koch";
import Usecases from "./components/Usecases";

function App() {
  const [canvasSize, setCanvasSize] = useState({ x: 800, y: 600 });
  const [fractalType, setFractalType] = useState("Koch");
  const [html, setHtml] = useState("");

  const [depth, setDepth] = useState(2);
  const [size, setSize] = useState(400);
  const [sides, setSides] = useState(3);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(sides, size);

    const pattern = new PatternDTO(fractalType.toLowerCase(), depth);

    const koch = new Koch({
      center: { x: 400, y: 300 },
      size: size,
      sides: sides,
    });

    let geometry = koch.generate(pattern);

    fetch("http://localhost:4000/api/canvas/render", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        geometry: geometry,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    console.log(canvasSize.x);
  };

  useEffect(() => {
    if (fractalType === "Koch") {
      setHtml(
        <KochSettings
          setDepth={setDepth}
          setSize={setSize}
          setSides={setSides}
        />
      );
    } else if (fractalType === "Anklet") {
      setHtml(<AnkletSettings />);
    }
  }, [fractalType]);

  return (
    <>
      <form
        action=""
        className="form"
        preventDefault={true}
        onSubmit={onSubmit}
      >
        <h3 className="title">Select fractal type</h3>
        <div className="">
          <select
            id="type"
            name=""
            class=""
            value={fractalType}
            onChange={(e) => setFractalType(e.target.value)}
          >
            <option>Koch</option>
            <option>Anklet</option>
            <option>Sierpinsky</option>
          </select>
        </div>
        <CanvasSettings canvasSize={canvasSize} setCanvasSize={setCanvasSize} />
        <h3 className="title">Fractal settings</h3>
        <div className="">{html}</div>
        <Usecases />
        <button id="btn" type="submit">
          Generate
        </button>
      </form>
    </>
  );
}

export default App;
