import { useState } from "react";

export default function ScaleUseCase({ setUseCaseScale }) {
  const [scaleUsecase, setScaleUsecase] = useState(false);
  return (
    <>
      <div className="usecase-div">
        <div className="usecase-div__item">
          <label htmlFor="depth">Set scale</label>
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
    </>
  );
}
