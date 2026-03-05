import { useState, useEffect } from "react";
import "./App.css";
import CanvasSettings from "./components/CanvasSettings";
import KochSettings from "./components/KochSettings";
import AnkletSettings from "./components/AnkletSettings";
import Usecases from "./components/Usecases";
import Console from "./components/Console";

function App() {
  const [canvasSize, setCanvasSize] = useState({ x: 800, y: 600 });
  const [fractalType, setFractalType] = useState("Koch");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const [depth, setDepth] = useState(2);
  const [size, setSize] = useState(400);
  const [sides, setSides] = useState(3);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch("http://localhost:4001/api/pipeline/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: fractalType.toLowerCase(),
        params: { depth, size, sides },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (fractalType === "Koch") {
      setHtml(
        <KochSettings
          setDepth={setDepth}
          setSize={setSize}
          setSides={setSides}
        />,
      );
    } else if (fractalType === "Anklet") {
      setHtml(<AnkletSettings />);
    }
  }, [fractalType]);

  return (
    <>
      <div className="div">
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
          <CanvasSettings
            canvasSize={canvasSize}
            setCanvasSize={setCanvasSize}
          />
          <h3 className="title">Fractal settings</h3>
          <div className="">{html}</div>
          <Usecases />
          <button id="btn" type="submit">
            Generate
          </button>
        </form>
        <div>
          <Console />
        </div>
      </div>
      {loading ? <p>Loading...</p> : null}
      <canvas width={canvasSize.x} height={canvasSize.y}></canvas>
    </>
  );
}

export default App;
