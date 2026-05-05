import { useState, useEffect } from "react";
import "./App.css";
import CanvasSettings from "./components/CanvasSettings";
import KochSettings from "./components/FractalsSettings/KochSettings";
import AnkletSettings from "./components/FractalsSettings/AnkletSettings";
import Usecases from "./components/Usecases";
import Console from "./components/Console";
import IslamicGridSettings from "./components/FractalsSettings/IslamicGridSettings";
import HexaGridSettings from "./components/FractalsSettings/HexaGridSettings";
import IslamicSquareSettings from "./components/FractalsSettings/IslamicSquareSettings";
import SierpinskySettings from "./components/FractalsSettings/SierpinskySettings";

function App() {
  const [canvasSize, setCanvasSize] = useState({ x: 800, y: 600 });
  const [canvasColor, setCanvasColor] = useState("#000000");
  const [loading, setLoading] = useState(false);

  const [depth, setDepth] = useState(4);
  const [imageUrl, setImageUrl] = useState("");

  const [useCaseColor, setUseCaseColor] = useState(null);
  const [useCaseColorByDepth, setUseCaseColorByDepth] = useState(null);
  const [useCaseScale, setUseCaseScale] = useState(null);
  const [useCaseRotation, setUseCaseRotation] = useState(null);
  const [useCaseThick, setUseCaseThick] = useState(null);

  const [generators, setGenerators] = useState([]);

  const [fractals, setFractals] = useState([]);

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
          patterns: fractals.map((f) => ({
            ...f,
            params: {
              ...f.params,
              center: {
                x: canvasSize.x / 2,
                y: canvasSize.y / 2,
              },
            },
          })),
        },
        canvasParams: {
          width: canvasSize.x,
          height: canvasSize.y,
          bgColor: canvasColor,
        },
        usecases: [
          useCaseColor,
          useCaseColorByDepth,
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
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const settingsComponents = {
    koch: KochSettings,
    anklet: AnkletSettings,
    sierpinsky: SierpinskySettings,
    islamicgrid: IslamicGridSettings,
    hexagrid: HexaGridSettings,
    islamicsquare: IslamicSquareSettings,
  };

  useEffect(() => {
    fetch("http://localhost:4002/api/generator")
      .then((res) => res.json())
      .then((data) => {
        setGenerators(data);

        setFractals([
          {
            type: data[0].name,
            params: data[0].defaults,
          },
        ]);
      });
  }, []);

  const updateFractalParam = (index, key, value) => {
    setFractals((prev) =>
      prev.map((f, i) => {
        if (index !== i) return f;
        return {
          ...f,
          params: {
            ...f.params,
            [key]: value,
          },
        };
      }),
    );
  };

  const addFractal = () => {
    if (fractals.length >= 3) return;

    const generator = generators[0];

    setFractals((prev) => [
      ...prev,
      {
        type: generator.name,
        params: generator.defaults,
      },
    ]);
  };

  const getDefaults = (type) => {
    const generator = generators.find((el) => el.name === type);
    return generator?.defaults || {};
  };

  const changeFractalType = (type, index) => {
    const defaultParams = getDefaults(type);

    setFractals((prev) =>
      prev.map((item, i) => {
        if (index !== i) return item;

        return {
          type: type,
          params: defaultParams,
        };
      }),
    );
  };

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
            <button type="button" onClick={() => addFractal()}>
              Add fractal
            </button>
          </h3>
          {fractals.map((type, index) => {
            const SettingsComponent = settingsComponents[type.type];

            return (
              <div className="">
                <select
                  key={index}
                  value={type.type}
                  onChange={(e) => changeFractalType(e.target.value, index)}
                >
                  {generators.map((g) => {
                    if (g.name === "composite") return;
                    return (
                      <option key={g.id} value={g.name}>
                        {g.name}
                      </option>
                    );
                  })}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setFractals((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  Remove
                </button>

                {SettingsComponent && (
                  <SettingsComponent
                    defaultParams={type.params}
                    updateFractalParam={updateFractalParam}
                    index={index}
                  />
                )}
              </div>
            );
          })}

          <CanvasSettings
            canvasSize={canvasSize}
            setCanvasSize={setCanvasSize}
            setCanvasColor={setCanvasColor}
          />
          <Usecases
            setUseCaseColor={setUseCaseColor}
            setUseCaseColorByDepth={setUseCaseColorByDepth}
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
