import { useState } from "react";

export default function Usecases({
  setUseCaseColor,
  setUseCaseScale,
  setUseCaseRotation,
  setUseCaseThick,
}) {
  const [colorUsecase, setColorUsecase] = useState(false);
  const [scaleUsecase, setScaleUsecase] = useState(false);
  const [rotationUsecase, setRotationUsecase] = useState(false);
  const [thicknessUsecase, setThicknessUsecase] = useState(false);

  return (
    <>
      <h3 className="title">Usecases</h3>
      <div className="canvas-settings">
        <div className="usecase-div">
          <div className="usecase-div__item">
            <label htmlFor="depth">Set fractal color</label>
            <input
              id="colorUsecase"
              type="checkbox"
              onChange={(e) => {
                setColorUsecase(!colorUsecase);
                colorUsecase && setUseCaseColor(null);
                !colorUsecase &&
                  setUseCaseColor({ name: "colorSolid", color: "#000000" });
              }}
            />
          </div>

          <input
            id="depth"
            type="color"
            disabled={!colorUsecase}
            onBlur={(e) => {
              if (colorUsecase)
                setUseCaseColor({ name: "colorSolid", color: e.target.value });
            }}
            style={{ height: "21px" }}
          />
        </div>

        <div className="usecase-div">
          <div className="usecase-div__item">
            <label htmlFor="depth">Set fractal scale</label>
            <input
              id="colorUsecase"
              type="checkbox"
              onChange={(e) => {
                setScaleUsecase(!scaleUsecase);
                scaleUsecase && setUseCaseScale(null);
                !scaleUsecase && setUseCaseScale({ name: "scale", scale: 1 });
              }}
            />
          </div>

          <input
            id="depth"
            type="number"
            step={0.1}
            disabled={!scaleUsecase}
            defaultValue={1}
            onBlur={(e) => {
              if (scaleUsecase)
                setUseCaseScale({ name: "scale", scale: e.target.value });
            }}
          />
        </div>

        <div className="usecase-div">
          <div className="usecase-div__item">
            <label htmlFor="rotationUsecase">Set fractal rotation</label>
            <input
              id="rotationUsecase"
              type="checkbox"
              onChange={(e) => {
                setRotationUsecase(!rotationUsecase);
                rotationUsecase && setUseCaseRotation(null);
                !rotationUsecase &&
                  setUseCaseRotation({ name: "rotate", angle: 0 });
              }}
            />
          </div>

          <input
            id="rotationUsecase"
            type="number"
            disabled={!rotationUsecase}
            defaultValue={0}
            onBlur={(e) => {
              if (rotationUsecase)
                setUseCaseRotation({ name: "rotate", angle: e.target.value });
            }}
          />
        </div>

        <div className="usecase-div">
          <div className="usecase-div__item">
            <label htmlFor="rotationUsecase">Set line thickness</label>
            <input
              id="rotationUsecase"
              type="checkbox"
              onChange={(e) => {
                setThicknessUsecase(!thicknessUsecase);
                thicknessUsecase && setUseCaseThick(null);
                !thicknessUsecase &&
                  setUseCaseThick({
                    name: "width",
                    width: 1,
                  });
              }}
            />
          </div>

          <input
            id="rotationUsecase"
            type="number"
            step={0.1}
            disabled={!thicknessUsecase}
            defaultValue={1}
            onBlur={(e) => {
              if (thicknessUsecase)
                setUseCaseThick({ name: "width", width: Number(e.target.value) });
            }}
          />
        </div>
      </div>
    </>
  );
}
