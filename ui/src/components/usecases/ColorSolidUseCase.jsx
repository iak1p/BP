import { useState } from "react";

export default function ColorSolidUseCase({ setUseCaseColor }) {
  const [colorUsecase, setColorUsecase] = useState(false);
  return (
    <>
      <div className="usecase-div">
        <div className="usecase-div__item">
          <label htmlFor="depth">Set color</label>
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
    </>
  );
}
