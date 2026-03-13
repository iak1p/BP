import { useState, useEffect } from "react";
import "./App.css";
import CanvasSettings from "./components/CanvasSettings";
import KochSettings from "./components/KochSettings";
import AnkletSettings from "./components/AnkletSettings";
import Usecases from "./components/Usecases";
import Console from "./components/Console";
import SierpinskySettings from "./components/SierpinskySettings";

function App() {
  const [canvasSize, setCanvasSize] = useState({ x: 800, y: 600 });
  const [canvasColor, setCanvasColor] = useState("#000000");
  const [fractalType, setFractalType] = useState("Koch");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const [depth, setDepth] = useState(4);
  const [size, setSize] = useState(400);
  const [sides, setSides] = useState(3);
  const [lineLength, setLineLength] = useState(10);
  const [squareSide, setSquareSide] = useState(10);

  const [imageUrl, setImageUrl] = useState("");

  const [useCaseColor, setUseCaseColor] = useState(null);
  const [useCaseScale, setUseCaseScale] = useState(null);
  const [useCaseRotation, setUseCaseRotation] = useState(null);
  const [useCaseThick, setUseCaseThick] = useState(null);

  const resetParams = () => {
    setDepth(4);
    setSize(400);
    setSides(3);
    setLineLength(10);
    setSquareSide(10);
  };

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
        params: {
          depth,
          size,
          sides,
          center: { x: canvasSize.x / 2, y: canvasSize.y / 2 },
          lineLength,
          squareSide,
        },
        canvasParams: {
          width: canvasSize.x,
          height: canvasSize.y,
          bgColor: canvasColor,
        },
        usecases: [
          useCaseColor,
          useCaseScale,
          useCaseRotation,
          useCaseThick,
        ].filter(Boolean),
      }),
    })
      .then(async (response) => {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        setImageUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        // response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
        resetParams();
      });
  };

  useEffect(() => {
    resetParams();

    if (fractalType === "Koch") {
      setHtml(
        <KochSettings
          setDepth={setDepth}
          setSize={setSize}
          setSides={setSides}
        />,
      );
    } else if (fractalType === "Anklet") {
      setHtml(
        <AnkletSettings
          setDepth={setDepth}
          setLineLength={setLineLength}
          setSquareSide={setSquareSide}
        />,
      );
    } else if (fractalType === "Sierpinsky") {
      setHtml(<SierpinskySettings setDepth={setDepth} setSize={setSize} />);
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
            setCanvasColor={setCanvasColor}
          />
          <h3 className="title">Fractal settings</h3>
          <div className="">{html}</div>
          <Usecases
            setUseCaseColor={setUseCaseColor}
            setUseCaseScale={setUseCaseScale}
            setUseCaseRotation={setUseCaseRotation}
            setUseCaseThick={setUseCaseThick}
          />
          <button id="btn" type="submit">
            Generate
          </button>
        </form>
        <div className="">
          <div>
            
            <Console />
          </div>
        </div>
      </div>
      {loading ? <p>Loading...</p> : null}
      <div className="">
        <h3 className="title">
          Generated image
          {imageUrl && (
            <a href={imageUrl} download="fractal.png">
              Download
            </a>
          )}
        </h3>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated fractal"
            width={canvasSize.x}
            height={canvasSize.y}
          />
        ) : null}
      </div>

      {/* <canvas width={canvasSize.x} height={canvasSize.y}></canvas> */}
    </>
  );
}

export default App;
