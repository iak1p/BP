import { useState } from "react";

export default function Usecases() {
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
              }}
            />
          </div>

          <input
            id="depth"
            type="color"
            disabled={!colorUsecase}
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
              }}
            />
          </div>

          <input
            id="depth"
            type="number"
            step={0.1}
            disabled={!scaleUsecase}
            defaultValue={1}
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
              }}
            />
          </div>

          <input
            id="rotationUsecase"
            type="number"
            disabled={!rotationUsecase}
            defaultValue={0}
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
              }}
            />
          </div>

          <input
            id="rotationUsecase"
            type="number"
            step={0.1}
            disabled={!thicknessUsecase}
            defaultValue={1}
          />
        </div>
      </div>
    </>
  );
}
