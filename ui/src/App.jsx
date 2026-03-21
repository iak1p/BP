import { useState, useEffect } from "react";
import "./App.css";
import CanvasSettings from "./components/CanvasSettings";
import KochSettings from "./components/KochSettings";
import AnkletSettings from "./components/AnkletSettings";
import Usecases from "./components/Usecases";
import Console from "./components/Console";
import SierpinskySettings from "./components/SierpinskySettings";
import HexaGridSettings from "./components/HexaGridSettings";
import IslamicGridSettings from "./components/IslamicGridSettings";
import IslamicSquareSetting from "./components/IslamicSquareSetting";

function App() {
  const [canvasSize, setCanvasSize] = useState({ x: 800, y: 600 });
  const [canvasColor, setCanvasColor] = useState("#000000");
  const [fractalType, setFractalType] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const [depth, setDepth] = useState(4);
  const [size, setSize] = useState(400);
  const [sides, setSides] = useState(3);
  const [lineLength, setLineLength] = useState(10);
  const [squareSide, setSquareSide] = useState(10);
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [sideLength, setSideLength] = useState(40);

  const [imageUrl, setImageUrl] = useState("");

  const [useCaseColor, setUseCaseColor] = useState(null);
  const [useCaseScale, setUseCaseScale] = useState(null);
  const [useCaseRotation, setUseCaseRotation] = useState(null);
  const [useCaseThick, setUseCaseThick] = useState(null);

  const [generators, setGenerators] = useState([]);

  const [fractals, setFractals] = useState([generators[0]?.name || ""]);

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
        type: "composite",
        params: {
          depth,
          size,
          patterns: fractals,
          sides,
          center: { x: canvasSize.x / 2, y: canvasSize.y / 2 },
          lineLength,
          squareSide,
          rows,
          cols,
          sideLength,
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
        // resetParams();
      });
  };

  useEffect(() => {
    fetch("http://localhost:4002/api/generator")
      .then((res) => res.json())
      .then((data) => {
        setGenerators(data);
        setFractalType(data[0]?.name || "");
      });
  }, []);

  const setDefaults = (type) => {
    const generator = generators.find((el) => el.name === type);

    console.log(generator?.defaults);

    setDepth(4);
    setSize(generator?.defaults?.size);
    setSides(generator?.defaults?.sides);
    setLineLength(generator?.defaults?.lineLength);
    setSquareSide(generator?.defaults?.squareSide);
    setRows(generator?.defaults?.rows);
    setCols(generator?.defaults?.cols);

    return generator?.defaults;
  };

  const getDefaults = (type) => {
    const generator = generators.find((el) => el.name === type);
    return generator?.defaults || {};
  };

  useEffect(() => {
    resetParams();

    const generator = setDefaults();

    if (fractalType === "koch") {
      setHtml(
        <KochSettings
          setDepth={setDepth}
          setSize={setSize}
          setSides={setSides}
          usecase={generator}
        />,
      );
    } else if (fractalType === "anklet") {
      setHtml(
        <AnkletSettings
          setDepth={setDepth}
          setLineLength={setLineLength}
          setSquareSide={setSquareSide}
          usecase={generator}
        />,
      );
    } else if (fractalType === "sierpinsky") {
      setHtml(
        <SierpinskySettings
          setDepth={setDepth}
          setSize={setSize}
          usecase={generator}
        />,
      );
    } else if (fractalType === "islamicgrid") {
      setHtml(
        <IslamicGridSettings
          setSize={setSize}
          setRows={setRows}
          setCols={setCols}
          usecase={generator}
        />,
      );
    } else if (fractalType === "hexagrid") {
      setHtml(
        <HexaGridSettings
          setSideLength={setSideLength}
          setRows={setRows}
          setCols={setCols}
          usecase={generator}
        />,
      );
    } else if (fractalType === "islamicsquare") {
      setHtml(
        <IslamicSquareSetting
          setSize={setSize}
          setRows={setRows}
          setCols={setCols}
          usecase={generator}
        />,
      );
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
          <h3 className="title">
            Select fractal type
            <button
              type="button"
              onClick={() => {
                if (fractals.length < 3) {
                  setFractals((prev) => [...prev, generators[0]?.name]);
                }
              }}
            >
              add
            </button>
          </h3>
          {fractals.map((type, index) => (
            <div className="">
              <select
                key={index}
                value={type}
                onChange={(e) =>
                  setFractals((prev) =>
                    prev.map((item, i) =>
                      i === index ? e.target.value : item,
                    ),
                  )
                }
              >
                {generators.map((g) => (
                  <option key={g.id} value={g.name}>
                    {g.name}
                  </option>
                ))}
              </select>
              {}
              <h3 className="title">Fractal settings</h3>
              {type === "koch" && (
                <KochSettings
                  setDepth={setDepth}
                  setSize={setSize}
                  setSides={setSides}
                  usecase={getDefaults(type)}
                />
              )}
              {type === "anklet" && (
                <AnkletSettings
                  setDepth={setDepth}
                  setLineLength={setLineLength}
                  setSquareSide={setSquareSide}
                  usecase={getDefaults(type)}
                />
              )}
              {type === "sierpinsky" && <SierpinskySettings />}
              {type === "islamicgrid" && <IslamicGridSettings />}
              {type === "hexagrid" && <HexaGridSettings />}
              {type === "islamicsquare" && <IslamicSquareSetting />}
            </div>
          ))}

          {/* <div className="">
            <select
              id="type"
              name=""
              class=""
              value={fractalType}
              onChange={(e) => setFractalType(e.target.value)}
            >
              {generators.map((g) => (
                <option key={g.id} value={g.name}>
                  {g.name}
                </option>
              ))}
            </select>
          </div> */}

          <CanvasSettings
            canvasSize={canvasSize}
            setCanvasSize={setCanvasSize}
            setCanvasColor={setCanvasColor}
          />
          {/* <h3 className="title">Fractal settings</h3> */}
          {/* <div className="">{html}</div> */}
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
        {imageUrl ? <img src={imageUrl} alt="Generated fractal" /> : null}
      </div>
    </>
  );
}

export default App;
